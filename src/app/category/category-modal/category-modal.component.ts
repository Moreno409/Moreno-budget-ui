import { Component, inject, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular/standalone';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { close, save, text } from 'ionicons/icons';
import { Category } from '../../shared/domain';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonIcon,
    IonInput,
    IonLabel
  ]
})
export default class CategoryModalComponent {
  // DI
  private readonly modalCtrl = inject(ModalController);
  private readonly navParams = inject(NavParams);
  private readonly fb = inject(FormBuilder);

  // State
  category: Category | undefined = this.navParams.get('category');
  categoryForm: FormGroup;

  // Lifecycle

  constructor() {
    // Add all used Ionic icons
    addIcons({ close, save, text });
    
    // Initialize form
    this.categoryForm = this.fb.group({
      name: [this.category?.name || '', [Validators.required, Validators.minLength(1)]]
    });
  }

  // Actions

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save(): void {
    // Mark all fields as touched to show validation errors
    this.categoryForm.markAllAsTouched();
    
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;
      // Create a new category object with a temporary ID
      // In a real app, this would be created via an API call
      const newCategory: Category = {
        id: this.category?.id || `temp-${Date.now()}`,
        name: formValue.name,
        createdAt: this.category?.createdAt || new Date().toISOString(),
        lastModifiedAt: new Date().toISOString()
      };
      this.modalCtrl.dismiss(newCategory, 'save');
    }
  }

  onNameChange(event: any): void {
    this.categoryForm.patchValue({ name: event.detail.value });
    this.categoryForm.get('name')?.markAsTouched();
  }

  get isFormValid(): boolean {
    return this.categoryForm.valid;
  }
}
