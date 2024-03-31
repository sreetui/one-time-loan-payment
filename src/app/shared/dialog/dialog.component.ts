import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose],
})
export class DialogComponent implements OnInit {

  @Input() data!: any;
  title: string = '';
  content: string = '';
  readonly CLOSE_MESSAGE = `${this.title} Closed Successfully`;
  materialDialogRef = inject(MatDialogRef<DialogComponent>);
  modalDialogData = inject(MAT_DIALOG_DATA);

  close() {
    this.materialDialogRef.close(this.CLOSE_MESSAGE);
  }

  ngOnInit(): void {
    this.data = this.modalDialogData;
    if (this.data) {
      this.title = this.data.title;
      this.content = this.data.content;
    }
  }

}
