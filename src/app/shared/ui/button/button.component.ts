import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import type { IconName } from '../../icons/icon-registry';

@Component({
  selector: 'lumen-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() id: string = '';
  @Input() text: string = '';
  @Input() title: string = '';
  @Input() disabled: boolean = false;
  @Input() icon: IconName = 'path-forward';
  @Input() compact: boolean = false;
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}

