import { Component, inject, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular/standalone';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { add, calendar, cash, close, pricetag, save, text, trash } from 'ionicons/icons';
import { format } from 'date-fns';
import { Expense, Category, CategoryUpsertDto } from '../../shared/domain';
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
  IonSpinner,
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
    IonDatetime,
    IonSpinner
  ]
})
export default class ExpenseModalComponent implements OnInit, AfterViewInit {
  // DI
  private readonly modalCtrl = inject(ModalController);
  private readonly navParams = inject(NavParams);
  private readonly fb = inject(FormBuilder);
  private readonly toastCtrl = inject(ToastController);

  // State
  expense: Expense | undefined = this.navParams.get('expense');
  categories: Category[] = [];
  expenseForm!: FormGroup;
  isLoading = false;
  private newCategory: Category | undefined;
  @ViewChild('nameInput', { static: false }) nameInput?: IonInput;

  // Mock categories - in a real app, this would come from a service
  private mockCategories: Category[] = [
    {
      id: '1',
      name: 'Test morenoo',
      createdAt: '2025-01-01T00:00:00Z',
      lastModifiedAt: '2025-01-01T00:00:00Z'
    }
  ];

  // Lifecycle

  constructor() {
    // Add all used Ionic icons
    addIcons({ close, save, text, pricetag, add, cash, calendar, trash });
  }

  ngOnInit(): void {
    // Get categories from navParams if provided, otherwise use mock data
    const providedCategories = this.navParams.get('categories');
    if (providedCategories && Array.isArray(providedCategories)) {
      this.categories = [...providedCategories];
    } else {
      this.loadCategories();
    }
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    // Auto-focus on name input when modal opens
    setTimeout(() => {
      if (this.nameInput) {
        this.nameInput.setFocus();
      }
    }, 400);
  }

  private loadCategories(): void {
    // In a real app, this would fetch from a service
    this.categories = [...this.mockCategories];
  }

  private initializeForm(): void {
    this.expenseForm = this.fb.group({
      name: [this.expense?.name || '', [Validators.required, Validators.minLength(1)]],
      categoryId: [this.expense?.category?.id || ''],
      amount: [this.expense?.amount || 0, [Validators.required, Validators.min(0.01)]],
      date: [this.expense?.date || format(new Date(), 'yyyy-MM-dd'), [Validators.required]]
    });
  }

  // Actions

  cancel(): void {
    if (this.isLoading) {
      return;
    }
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async save(): Promise<void> {
    // Mark all fields as touched to show validation errors
    this.expenseForm.markAllAsTouched();
    
    if (!this.expenseForm.valid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    // Disable form controls during save
    this.expenseForm.disable();

    try {
      const formValue = this.expenseForm.value;
      const expenseData = {
        id: this.expense?.id,
        name: formValue.name,
        amount: formValue.amount,
        date: formValue.date,
        categoryId: formValue.categoryId || undefined,
        newCategory: this.newCategory || undefined
      };

      // Simulate API call - in a real app, this would be an HTTP request
      await this.saveExpense(expenseData);

      // Close modal first, then show success message
      this.modalCtrl.dismiss(expenseData, 'save');
      
      // Show success message after modal is dismissed
      setTimeout(async () => {
        const toast = await this.toastCtrl.create({
          message: 'Ausgabe erfolgreich gespeichert',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        await toast.present();
      }, 100);
    } catch (error) {
      this.isLoading = false;
      // Re-enable form controls on error
      this.expenseForm.enable();
      
      // Show error message
      const toast = await this.toastCtrl.create({
        message: 'Fehler beim Speichern der Ausgabe. Bitte versuchen Sie es erneut.',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    }
  }

  private async saveExpense(expenseData: any): Promise<void> {
    // Simulate API call with delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate error for testing (e.g., invalid data)
        // Uncomment the following lines to test error handling:
        // if (expenseData.amount < 0) {
        //   reject(new Error('Invalid amount'));
        //   return;
        // }
        
        // Simulate successful save
        resolve(expenseData);
      }, 1000); // Simulate network delay
    });
  }

  async delete(): Promise<void> {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    // Disable form controls during delete
    this.expenseForm.disable();

    try {
      // Simulate API call
      await this.deleteExpense();

      // Close modal first, then show success message
      this.modalCtrl.dismiss(null, 'delete');
      
      // Show success message after modal is dismissed
      setTimeout(async () => {
        const toast = await this.toastCtrl.create({
          message: 'Ausgabe erfolgreich gelöscht',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        await toast.present();
      }, 100);
    } catch (error) {
      this.isLoading = false;
      // Re-enable form controls on error
      this.expenseForm.enable();
      
      // Show error message
      const toast = await this.toastCtrl.create({
        message: 'Fehler beim Löschen der Ausgabe. Bitte versuchen Sie es erneut.',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    }
  }

  private async deleteExpense(): Promise<void> {
    // Simulate API call with delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate successful delete
        resolve(null);
      }, 1000); // Simulate network delay
    });
  }

  async showCategoryModal(): Promise<void> {
    if (this.isLoading) {
      return;
    }

    const categoryModal = await this.modalCtrl.create({ component: CategoryModalComponent });
    await categoryModal.present();
    const { data, role } = await categoryModal.onWillDismiss<Category>();
    
    if (role === 'save' && data) {
      // Add the new category to the list
      this.categories.push(data);
      // Select the newly created category
      this.expenseForm.patchValue({ categoryId: data.id });
      // Store the new category to return it with the expense data
      this.newCategory = data;
    }
  }

  onNameChange(event: any): void {
    this.expenseForm.patchValue({ name: event.detail.value });
    this.expenseForm.get('name')?.markAsTouched();
  }

  onAmountChange(event: any): void {
    const value = parseFloat(event.detail.value) || 0;
    this.expenseForm.patchValue({ amount: value });
    this.expenseForm.get('amount')?.markAsTouched();
  }

  onDateChange(event: any): void {
    this.expenseForm.patchValue({ date: event.detail.value });
    this.expenseForm.get('date')?.markAsTouched();
  }

  onCategoryChange(event: any): void {
    this.expenseForm.patchValue({ categoryId: event.detail.value });
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

  get isFormValid(): boolean {
    return this.expenseForm.valid && !this.isLoading;
  }
}
