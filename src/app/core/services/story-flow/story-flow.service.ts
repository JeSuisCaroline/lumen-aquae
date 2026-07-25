import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin, map, switchMap, tap } from 'rxjs';
import {
  type CanvasDocument,
  type RiddleFrontmatter,
  type RoutingFrontmatter,
  type Fragment,
} from '../../../shared/models/story-flow.model';
import { extractFragmentName, parseCanvas, parseFragmentMarkdown, toAssetUrl } from './story-flow.parser';

interface LoadedFragment {
  name: string;
  kind: Fragment['kind'];
  frontmatter: Fragment['frontmatter'];
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class StoryFlowService {
  private readonly http = inject(HttpClient);

  private readonly canvasUrl = toAssetUrl('data', 'Canvas from 12 07 26', "L'histoire.canvas");
  private readonly fragmentsFolder = ['data', 'FRAGMENTS'];

  private fragmentsByName = new Map<string, Fragment>();
  private startFragmentName: string | null = null;

  private readonly scoreSignal = signal(0);
  private readonly currentFragmentSignal = signal<Fragment | null>(null);
  private readonly canvasLoadedSignal = signal(false);

  readonly score = this.scoreSignal.asReadonly();
  readonly currentFragment = this.currentFragmentSignal.asReadonly();
  readonly canvasLoaded = this.canvasLoadedSignal.asReadonly();

  public loadAndInitializeCanvasGraph(): Observable<void> {
    return this.http.get(this.canvasUrl, { responseType: 'text' }).pipe(
      map((raw) => parseCanvas(raw)),
      switchMap((canvas) => this.loadFragmentsForCanvas(canvas)),
      tap(() => this.canvasLoadedSignal.set(true)),
    );
  }

  public goToFragment(fragmentName: string): void {
    const fragment = this.fragmentsByName.get(fragmentName);
    if (!fragment) {
      throw new Error(`Fragment introuvable : ${fragmentName}`);
    }

    if (fragment.kind === 'routing') {
      this.routeFromRoutingFragment(fragment);
      return;
    }

    this.currentFragmentSignal.set(fragment);
  }

  public restartStory(): void {
    if (!this.startFragmentName) {
      throw new Error("Aucun fragment de départ n'a été identifié dans le canvas.");
    }
    this.scoreSignal.set(0);
    this.goToFragment(this.startFragmentName);
  }

  public submitRiddleAnswer(answerText: string): void {
    const fragment = this.currentFragmentSignal();
    if (!fragment || fragment.kind !== 'riddle') {
      throw new Error("Aucune énigme active pour l'instant.");
    }

    const riddle = fragment.frontmatter as RiddleFrontmatter;
    const answer = riddle.answers.find((candidate) => candidate.text === answerText);
    if (!answer) {
      throw new Error(`Réponse inconnue pour ${fragment.name} : ${answerText}`);
    }

    this.scoreSignal.update((score) => score + (answer.increment ?? 0));
    this.goToFragment(answer.destination);
  }

  private loadFragmentsForCanvas(canvas: CanvasDocument): Observable<void> {
    const fragmentNamesByNodeId = new Map<string, string>();
    for (const node of canvas.nodes) {
      const name = extractFragmentName(node.text);
      if (name) {
        fragmentNamesByNodeId.set(node.id, name);
      }
    }

    const uniqueNames = [...new Set(fragmentNamesByNodeId.values())];
    const requests = uniqueNames.map((name) =>
      this.http.get(this.fragmentUrl(name), { responseType: 'text' }).pipe(
        map((raw): LoadedFragment => ({ name, ...parseFragmentMarkdown(raw) })),
      ),
    );

    return forkJoin(requests).pipe(
      map((loadedFragments) => this.buildGraph(canvas, fragmentNamesByNodeId, loadedFragments)),
    );
  }

  private buildGraph(
    canvas: CanvasDocument,
    fragmentNamesByNodeId: Map<string, string>,
    loadedFragments: LoadedFragment[],
  ): void {
    const outgoingByNodeId = new Map<string, string[]>();
    const incomingCountByNodeId = new Map<string, number>();

    for (const edge of canvas.edges) {
      const toName = fragmentNamesByNodeId.get(edge.toNode);
      if (!toName) {
        continue;
      }

      const outgoing = outgoingByNodeId.get(edge.fromNode) ?? [];
      outgoing.push(toName);
      outgoingByNodeId.set(edge.fromNode, outgoing);

      incomingCountByNodeId.set(edge.toNode, (incomingCountByNodeId.get(edge.toNode) ?? 0) + 1);
    }

    this.fragmentsByName = new Map(
      loadedFragments.map((loaded) => [loaded.name, { ...loaded, outgoingFragmentNames: [] }]),
    );

    let startFragmentName: string | null = null;
    for (const [nodeId, name] of fragmentNamesByNodeId.entries()) {
      const fragment = this.fragmentsByName.get(name);
      if (!fragment) {
        continue;
      }

      fragment.outgoingFragmentNames = outgoingByNodeId.get(nodeId) ?? [];

      if (!startFragmentName && !incomingCountByNodeId.has(nodeId)) {
        startFragmentName = name;
      }
    }

    this.startFragmentName = startFragmentName;
    if (startFragmentName) {
      this.goToFragment(startFragmentName);
    }
  }

  private routeFromRoutingFragment(fragment: Fragment): void {
    const routing = fragment.frontmatter as RoutingFrontmatter;
    const trackedValue = String(this.readTrackedVariable(routing.variable_to_test));
    console.log('%ctrackedValue', 'color: #4CAF50; font-weight: bold;', trackedValue);
    const branch = routing.branches.find((candidate) => candidate.condition === trackedValue);
    if (!branch) {
      throw new Error(`Aucune branche pour ${routing.variable_to_test}=${trackedValue} sur ${fragment.name}.`);
    }

    this.resetTrackedVariable(routing.variable_to_test);
    console.log('%cbranch', 'color: #4CAF50; font-weight: bold;', branch);
    this.goToFragment(branch.destination);
  }

  private readTrackedVariable(variableName: string): number | string {
    if (variableName === 'score') {
      return this.scoreSignal();
    }

    return '';
  }

  private resetTrackedVariable(variableName: string): void {
    if ('score' === variableName) {
      this.scoreSignal.set(0);
    }
  }

  private fragmentUrl(name: string): string {
    return toAssetUrl(...this.fragmentsFolder, `${name}.md`);
  }
}
