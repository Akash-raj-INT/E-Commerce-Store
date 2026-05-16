import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  quantity = 1;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return isNaN(id) ? of(undefined) : this.productService.getProductById(id);
      })
    ).subscribe({
      next: product => {
        this.product = product;
        this.loading = false;
        if (!product) {
          this.error = 'Product not found.';
        }
      },
      error: () => {
        this.error = 'Unable to load product details.';
        this.loading = false;
      }
    });
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  increaseQuantity(): void {
    this.quantity += 1;
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.quantity = 1;
    }
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }
}
