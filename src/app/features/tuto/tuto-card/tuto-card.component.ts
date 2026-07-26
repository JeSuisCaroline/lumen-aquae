import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { MarkdownEmphasisPipe } from '../../../shared/pipes/markdown-emphasis.pipe';
import type { IconName } from '../../../shared/icons/icon-registry';

export type TutoCardColor = 'blue' | 'violet' | 'gold' | 'danger';

@Component({
  selector: 'lumen-tuto-card',
  standalone: true,
  imports: [NgClass, IconComponent, MarkdownEmphasisPipe],
  templateUrl: './tuto-card.component.html',
  styleUrls: ['./tuto-card.component.scss'],
})
export class TutoCardComponent {
  @Input() icon: IconName = 'help';
  @Input() title = '';
  @Input() description = '';
  @Input() color: TutoCardColor = 'blue';
}
