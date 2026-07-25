import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICON_REGISTRY, type IconName } from '../../icons/icon-registry';

@Component({
  selector: 'lumen-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  @Input() size = '1em';
  markup: SafeHtml = '';

  constructor(private readonly sanitizer: DomSanitizer) {}

  @Input() set name(value: IconName) {
    this.markup = this.sanitizer.bypassSecurityTrustHtml(ICON_REGISTRY[value] ?? '');
  }
}