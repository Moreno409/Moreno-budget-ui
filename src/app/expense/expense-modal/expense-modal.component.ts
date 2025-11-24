import { Component, inject, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { add, calendar, cash, close, pricetag, save, text, trash } from 'ionicons/icons';
import { format } from 'date-fns';
import { Expense } from '../../shared/domain';
import CategoryModalComponent from '../../category/category-modal/category-modal.component';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-expense-modal',
  templateUrl: './expense-modal.component.html',
  styleUrls: ['./expense-modal.component.scss'],
  standalone: true,
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
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonDatetimeButton,
    IonModal,
    IonDatetime
  ]
})
export default class ExpenseModalComponent {
  // DI
  private readonly modalCtrl = inject(ModalController);
  private readonly navParams = inject(NavParams);

  // State
  expense: Expense | undefined = this.navParams.get('expense');
  name = this.expense?.name || '';
  amount = this.expense?.amount || 0;
  date = this.expense?.date || format(new Date(), 'yyyy-MM-dd');

  // Lifecycle

  constructor() {
    // Add all used Ionic icons
    addIcons({ close, save, text, pricetag, add, cash, calendar, trash });
  }

  // Actions

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save(): void {
    this.modalCtrl.dismiss(null, 'save');
  }

  delete(): void {
    this.modalCtrl.dismiss(null, 'delete');
  }

  async showCategoryModal(): Promise<void> {
    const categoryModal = await this.modalCtrl.create({ component: CategoryModalComponent });
    categoryModal.present();
    const { role } = await categoryModal.onWillDismiss();
    console.log('role', role);
  }

  onNameChange(event: any): void {
    this.name = event.detail.value;
  }

  onAmountChange(event: any): void {
    this.amount = parseFloat(event.detail.value) || 0;
  }

  onDateChange(event: any): void {
    this.date = event.detail.value;
  }

  formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  formatDisplayDate(dateString: string): string {
    const date = new Date(dateString);
    return format(date, 'dd. MMM yyyy');
  }

  openDatePicker(): void {
    // The datetime button will handle opening the modal
  }
}
