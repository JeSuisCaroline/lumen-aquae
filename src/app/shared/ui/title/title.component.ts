import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownEmphasisPipe } from '../../pipes/markdown-emphasis.pipe';

@Component({
  selector: 'lumen-title',
  standalone: true,
  imports: [CommonModule, MarkdownEmphasisPipe],
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent {
  @Input() text: string = '';
  @Input() level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h1';
  @Input() description?: string;
}

