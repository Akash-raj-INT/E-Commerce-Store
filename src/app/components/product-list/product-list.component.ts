import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory = '';
  searchTerm = '';
  isLoading = true;
  error = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: products => {
        this.products = products;
        this.categories = Array.from(new Set(products.map(product => product.category))).sort();
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Unable to load products.';
        this.isLoading = false;
      }
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilter();
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilter();
  }

  clearCategory(): void {
    this.selectedCategory = '';
    this.applyFilter();
  }

  applyFilter(): void {
    const query = this.searchTerm.trim().toLowerCase();
    this.displayedProducts = this.products.filter(product => {
      const matchesText =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      const matchesCategory = this.selectedCategory
        ? product.category === this.selectedCategory
        : true;
      return matchesText && matchesCategory;
    });
  }

  addToCart(product: Product, quantity: number): void {
    this.cartService.addToCart(product, quantity);
  }
}
