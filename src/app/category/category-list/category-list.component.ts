import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  add,
  alertCircleOutline,
  chevronDownOutline,
  chevronForwardOutline,
  search,
  swapVertical
} from 'ionicons/icons';
import { Category } from '../../shared/domain';
import CategoryModalComponent from '../category-modal/category-modal.component';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonSearchbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    IonContent,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonSearchbar
  ]
})
export default class CategoryListComponent {
  // DI
  private readonly modalCtrl = inject(ModalController);

  // State
  searchTerm = '';
  sortAscending = true;
  sortLabel = 'Name (A-Z)';

  // Mock data for categories
  categories: Category[] = [
    {
      id: '1',
      name: 'Test morenoo',
      createdAt: '2025-01-01T00:00:00Z',
      lastModifiedAt: '2025-01-01T00:00:00Z'
    }
  ];

  get filteredCategories(): Category[] {
    let filtered = [...this.categories];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter((cat) => cat.name.toLowerCase().includes(searchLower));
    }

    // Apply sort
    filtered.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return this.sortAscending ? comparison : -comparison;
    });

    return filtered;
  }

  // Lifecycle

  constructor() {
    // Add all used Ionic icons
    addIcons({
      swapVertical,
      search,
      alertCircleOutline,
      add,
      chevronDownOutline,
      chevronForwardOutline
    });
  }

  // Actions

  toggleSort(): void {
    this.sortAscending = !this.sortAscending;
    this.sortLabel = this.sortAscending ? 'Name (A-Z)' : 'Name (Z-A)';
  }

  onSearchChange(event: any): void {
    this.searchTerm = event.detail.value || '';
  }

  async openModal(): Promise<void> {
    const modal = await this.modalCtrl.create({ component: CategoryModalComponent });
    await modal.present();
    const { role } = await modal.onWillDismiss();
    console.log('role', role);
  }

  async openCategoryModal(category: Category): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CategoryModalComponent,
      componentProps: { category }
    });
    await modal.present();
    const { role } = await modal.onWillDismiss();
    console.log('role', role);
  }
}
