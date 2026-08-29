import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../../shared/ui/icon/icon.component';

@Component({
  selector: 'lumen-fou-icon',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './fou-icon.component.html',
  styleUrls: ['./fou-icon.component.scss'],
})
export class FouIconComponent {
  @Input() totalCount = 0;
  @Input() hasNewRambling = false;
  @Input() message = 'Divagation du Fou disponible !';
  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    this.clicked.emit();
  }
}