import { Injectable, computed, effect, inject, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { type Choice, type Step } from '../../../shared/models/game-step.model';
import { type RiddleFrontmatter, type Fragment } from '../../../shared/models/story-flow.model';
import { StoryFlowService } from '../story-flow/story-flow.service';
import { PlayerStateService } from '../player-state/player-state.service';
import { RamblingsService } from '../ramblings/ramblings.service';
import { GameSaveService } from '../game-save/game-save.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly storyFlow = inject(StoryFlowService);
  private readonly playerState = inject(PlayerStateService);
  private readonly ramblings = inject(RamblingsService);
  private readonly gameSave = inject(GameSaveService);
  private readonly router = inject(Router);

  readonly isReady = this.storyFlow.canvasLoaded;
  readonly florins = this.playerState.florins;
  readonly hopopops = this.playerState.hopopops;
  readonly fragmentNames = this.storyFlow.fragmentNames;
  readonly ramblingsCount = this.ramblings.totalCount;
  readonly hasUnreadRambling = this.ramblings.hasUnread;
  readonly ramblingsList = this.ramblings.ramblings;
  readonly currentStep = computed<Step>(() => this.mapFragmentToStep(this.storyFlow.currentFragment()));

  constructor() {
    this.storyFlow.loadAndInitializeCanvasGraph().subscribe(() => this.restoreSaveIfAny());

    effect(() => {
      if (this.playerState.hopopops() <= 0) {
        this.router.navigateByUrl('/game-over');
      }
    });

    // Sauvegarde la partie dès que le joueur atteint un fragment (y compris le tout premier) —
    // cf. GameSaveService pour le format, et WelcomeComponent pour la reprise à l'accueil.
    effect(() => {
      const fragment = this.storyFlow.currentFragment();
      if (!fragment) {
        return;
      }

      this.gameSave.save({
        fragmentName: fragment.name,
        florins: this.playerState.florins(),
        hopopops: this.playerState.hopopops(),
        score: this.playerState.score(),
        ramblingIds: this.ramblings.ramblings().map((rambling) => rambling.id),
      });
    });
  }

  private restoreSaveIfAny(): void {
    const save = this.gameSave.load();
    if (!save) {
      return;
    }

    this.playerState.reset();
    this.ramblings.reset();
    this.playerState.restore(save.florins, save.hopopops, save.score);
    this.ramblings.restore(save.ramblingIds);
    this.storyFlow.restoreFragment(save.fragmentName);
  }

  public restart(): void {
    this.storyFlow.restartStory();
  }

  // Appelé quand le joueur choisit "Nouvelle partie" sur /welcome après avoir déjà effacé la
  // sauvegarde (cf. WelcomeComponent.startNewGame). StoryFlowService/PlayerStateService/RamblingsService
  // sont des singletons providedIn:'root' : s'ils ont déjà démarré une partie plus tôt dans cet onglet
  // (l'utilisateur était déjà allé sur /game avant de revenir à l'accueil), leur état en mémoire ne
  // repart pas de zéro tout seul en revisitant /game — il faut forcer explicitement un restartStory().
  // Si le canvas n'est pas encore chargé (tout premier lancement de l'app dans cet onglet), l'amorçage
  // du constructeur ci-dessus suffit déjà (aucune sauvegarde à restaurer puisqu'elle vient d'être effacée).
  public forceNewGame(): void {
    if (this.storyFlow.canvasLoaded()) {
      this.storyFlow.restartStory();
    }
  }

  public markRamblingsRead(): void {
    this.ramblings.markAllRead();
  }

  public jumpToFragment(name: string): void {
    this.storyFlow.goToFragment(name);
  }

  public goToStep(stepId: string): void {
    const fragment = this.storyFlow.currentFragment();
    if (!fragment) {
      return;
    }

    if (fragment.kind === 'riddle') {
      this.storyFlow.submitRiddleAnswer(stepId);
      return;
    }

    this.storyFlow.goToFragment(stepId);
  }

  private mapFragmentToStep(fragment: Fragment | null): Step {
    if (!fragment) {
      return {
        id: '',
        title: '',
        description: '',
        choices: [],
      };
    }

    return {
      id: fragment.name,
      title: isDevMode() ? fragment.name : '',
      description: fragment.content,
      choices: this.mapFragmentChoices(fragment),
    };
  }

  private mapFragmentChoices(fragment: Fragment): Choice[] {
    if (fragment.kind === 'riddle') {
      const riddle = fragment.frontmatter as RiddleFrontmatter;
      return riddle.answers.map((answer) => ({
        id: answer.text,
        text: answer.text,
        nextStepId: answer.text,
      }));
    }

    if (fragment.kind === 'routing') {
      return [];
    }

    return fragment.outgoingChoices.map((choice) => ({
      id: choice.name,
      text: choice.label ?? 'Continuer',
      nextStepId: choice.name,
    }));
  }
}
