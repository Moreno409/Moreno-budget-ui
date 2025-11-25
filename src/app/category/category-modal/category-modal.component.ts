import { Component, inject, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
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

  // State
  category: Category | undefined = this.navParams.get('category');
  name = this.category?.name || '';

  // Lifecycle

  constructor() {
    // Add all used Ionic icons
    addIcons({ close, save, text });
  }

  // Actions

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save(): void {
    this.modalCtrl.dismiss(null, 'save');
  }

  onNameChange(event: any): void {
    this.name = event.detail.value;
  }
}
