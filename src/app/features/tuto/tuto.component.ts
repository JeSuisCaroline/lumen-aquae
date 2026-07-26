import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { TitleComponent } from '../../shared/ui/title/title.component';
import { TutoCardComponent, type TutoCardColor } from './tuto-card/tuto-card.component';
import type { IconName } from '../../shared/icons/icon-registry';

interface TutoCard {
  icon: IconName;
  color: TutoCardColor;
  title: string;
  description: string;
}

@Component({
  selector: 'lumen-tuto',
  standalone: true,
  imports: [ButtonComponent, TitleComponent, TutoCardComponent],
  templateUrl: './tuto.component.html',
  styleUrls: ['./tuto.component.scss'],
})
export class TutoComponent {
  private readonly router = inject(Router);

  readonly cards: TutoCard[] = [
    {
      icon: 'path-forward',
      color: 'blue',
      title: 'Le principe',
      description:
        "Tu incarnes Luce, une jeune magicienne qui a le chic pour se retrouver dans des situations qu'elle n'avait absolument pas anticipées. À certaines étapes - appelées \"fragments\" dans le jeu - l'histoire peut te proposer un ou plusieurs chemins : à toi de cliquer sur celui qui te semble le moins susceptible de te causer des ennuis.",
    },
    {
      icon: 'help',
      color: 'violet',
      title: 'Les énigmes',
      description:
        'Certains fragments te posent une question. Bonne réponse : la suite te sourit. Mauvaise réponse : la suite te sourit quand même, mais un peu jaune.',
    },
    {
      icon: 'coin',
      color: 'gold',
      title: 'Les Florins',
      description:
        "La monnaie locale. Tu peux en gagner, tu peux en perdre, et un jour — promis, juré — tu pourras t'en servir pour acheter des objets utiles. En attendant, contente-toi de les regarder briller.",
    },
    {
      icon: 'bolt',
      color: 'danger',
      title: 'Les Hophophops',
      description:
        "Alors là, on parle sérieux. Les Hophophops, c'est ta motivation, ton énergie, ta niaque à continuer de crapahuter dans les rues d'Aix plutôt que de rentrer te coucher — une sorte de points de vie, mais version _j'ai plus la force_. Tu démarres avec 10. S'ils tombent à 0... Luce s'effondre. Littéralement. Tout de suite. Game over. Ménage-les comme tu ménagerais ton dernier calisson du matin.",
    },
  ];

  backToWelcome(): void {
    this.router.navigateByUrl('/welcome');
  }
}
