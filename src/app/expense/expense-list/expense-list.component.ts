import { Component, inject } from '@angular/core';
import { addMonths, format, set, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
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
import { Expense, Category } from '../../shared/domain';
import ExpenseModalComponent from '../expense-modal/expense-modal.component';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonSearchbar
} from '@ionic/angular/standalone';

interface ExpenseGroup {
  date: string;
  expenses: Expense[];
}

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
  expenses: Expense[] = [];
  expenseGroups: ExpenseGroup[] = [];

  // Mock categories - in a real app, this would come from a service
  private categories: Category[] = [
    {
      id: '1',
      name: 'Test morenoo',
      createdAt: '2025-01-01T00:00:00Z',
      lastModifiedAt: '2025-01-01T00:00:00Z'
    }
  ];

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

    // Initialize with mock data
    this.expenses = [
      {
        id: '1',
        name: 'BNIOhn',
        amount: 33.0,
        date: '2025-11-24',
        category: { id: '1', name: 'Test morenoo', createdAt: '2025-01-01T00:00:00Z', lastModifiedAt: '2025-01-01T00:00:00Z' },
        createdAt: '2025-01-01T00:00:00Z',
        lastModifiedAt: '2025-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'Test morenoo',
        amount: 34523423.0,
        date: '2025-11-24',
        category: { id: '1', name: 'Test morenoo', createdAt: '2025-01-01T00:00:00Z', lastModifiedAt: '2025-01-01T00:00:00Z' },
        createdAt: '2025-01-01T00:00:00Z',
        lastModifiedAt: '2025-01-01T00:00:00Z'
      }
    ];
    this.updateExpenseGroups();
  }

  // Actions

  addMonths = (number: number): void => {
    this.date = addMonths(this.date, number);
    this.updateExpenseGroups();
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

  private getCategoryById(categoryId?: string): Category | undefined {
    if (!categoryId) {
      return undefined;
    }
    return this.categories.find(cat => cat.id === categoryId);
  }

  private updateExpenseGroups(): void {
    // Filter expenses for current month
    const monthStart = startOfMonth(this.date);
    const monthEnd = endOfMonth(this.date);
    
    const filteredExpenses = this.expenses.filter(expense => {
      // Parse date - handle both 'yyyy-MM-dd' and ISO format
      let expenseDate: Date;
      if (expense.date.includes('T')) {
        expenseDate = parseISO(expense.date);
      } else {
        // Handle 'yyyy-MM-dd' format
        expenseDate = new Date(expense.date + 'T00:00:00');
      }
      
      // Check if date is valid
      if (isNaN(expenseDate.getTime())) {
        return false;
      }
      
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });

    // Group expenses by date
    const groupsMap = new Map<string, Expense[]>();
    
    filteredExpenses.forEach(expense => {
      const dateKey = expense.date;
      if (!groupsMap.has(dateKey)) {
        groupsMap.set(dateKey, []);
      }
      groupsMap.get(dateKey)!.push(expense);
    });

    // Convert to array and sort by date (newest first)
    this.expenseGroups = Array.from(groupsMap.entries())
      .map(([date, expenses]) => ({
        date,
        expenses: expenses.sort((a, b) => {
          // Sort by date descending, then by name
          const dateCompare = b.date.localeCompare(a.date);
          if (dateCompare !== 0) return dateCompare;
          return a.name.localeCompare(b.name);
        })
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  async openExpenseModal(expense?: Expense): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ExpenseModalComponent,
      componentProps: expense ? { expense } : { categories: this.categories }
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss<any>();
    
    if (role === 'save' && data) {
      // Handle save
      // Check if a new category was created and add it to our list
      if (data.newCategory) {
        this.categories.push(data.newCategory);
      }
      
      const category = this.getCategoryById(data.categoryId);
      const expenseToSave: Expense = {
        id: data.id || `expense-${Date.now()}`,
        name: data.name,
        amount: data.amount,
        date: data.date,
        category: category || { id: '', name: '', createdAt: '', lastModifiedAt: '' },
        createdAt: expense?.createdAt || new Date().toISOString(),
        lastModifiedAt: new Date().toISOString()
      };

      if (data.id) {
        // Update existing expense
        const index = this.expenses.findIndex(e => e.id === data.id);
        if (index !== -1) {
          this.expenses[index] = expenseToSave;
        }
      } else {
        // Add new expense
        this.expenses.push(expenseToSave);
        
        // If the new expense is not in the current month, navigate to that month
        const expenseDate = new Date(data.date + 'T00:00:00');
        if (!isNaN(expenseDate.getTime())) {
          const expenseMonth = startOfMonth(expenseDate);
          const currentMonth = startOfMonth(this.date);
          
          if (expenseMonth.getTime() !== currentMonth.getTime()) {
            this.date = expenseMonth;
          }
        }
      }
      
      this.updateExpenseGroups();
    } else if (role === 'delete' && expense) {
      // Handle delete
      this.expenses = this.expenses.filter(e => e.id !== expense.id);
      this.updateExpenseGroups();
    }
  }
}
