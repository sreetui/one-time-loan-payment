import { CommonModule, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  @Input('label') label: string = "Loading";
  @Input('style') style:{[key:string]: any} = {'width': '3rem', 'height': '3rem'};

}
