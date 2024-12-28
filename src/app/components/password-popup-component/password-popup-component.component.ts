import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-password-popup-component',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './password-popup-component.component.html',
  styleUrl: './password-popup-component.component.css'
})
export class PasswordDialogComponent {
  password: string = '';

  constructor(
    public dialogRef: MatDialogRef<PasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close(); // Închide dialog-ul fără a returna parola
  }

  submitPassword(): void {
    this.dialogRef.close(this.password); // Returnează parola introdusă
  }
}
