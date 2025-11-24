import { Component, inject } from '@angular/core';
import { addMonths, format, set } from 'date-fns';
import { ModalController } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  add,
  alertCircleOutline,
  arrowBack,
  arrowForward,
  chevronForwardOutline,
  pricetag,
  search,
  swapVertical
} from 'ionicons/icons';
import { Expense } from '../../shared/domain';
import ExpenseModalComponent from '../expense-modal/expense-modal.component';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonSearchbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, IonContent, IonItem, IonLabel, IonIcon, IonButton, IonSearchbar]
})
export default class ExpenseListComponent {
  // DI
  private readonly modalCtrl = inject(ModalController);

  // State
  date = set(new Date(), { date: 1 });

  // Mock data for expenses
  expenseGroups = [
    {
      expenses: [
        {
          id: '1',
          name: 'BNIOhn',
          amount: 33.0,
          date: '2025-11-24',
          category: { id: '1', name: 'Category', createdAt: '', lastModifiedAt: '' },
          createdAt: '',
          lastModifiedAt: ''
        },
        {
          id: '2',
          name: 'Test morenoo',
          amount: 34523423.0,
          date: '2025-11-24',
          category: { id: '1', name: 'Category', createdAt: '', lastModifiedAt: '' },
          createdAt: '',
          lastModifiedAt: ''
        }
      ] as Expense[]
    }
  ];

  // Lifecycle

  constructor() {
    // Add all used Ionic icons
    addIcons({
      swapVertical,
      pricetag,
      search,
      alertCircleOutline,
      add,
      arrowBack,
      arrowForward,
      chevronForwardOutline
    });
  }

  // Actions

  addMonths = (number: number): void => {
    this.date = addMonths(this.date, number);
  };

  formatMonth(date: Date): string {
    const formatted = format(date, 'MMMM yyyy');
    // Capitalize first letter
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  formatExpenseDate(dateString: string): string {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy');
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('de-CH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  async openExpenseModal(expense?: Expense): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ExpenseModalComponent,
      componentProps: expense ? { expense } : {}
    });
    await modal.present();
    const { role } = await modal.onWillDismiss();
    console.log('role', role);
  }
}
