import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  cartCount$: Observable<number> = this.cartItems$.pipe(
    map(items => items.reduce((count, item) => count + item.quantity, 0))
  );

  addToCart(product: Product, quantity = 1): void {
    const items = this.cartItemsSubject.getValue();
    const existing = items.find(item => item.product.id === product.id);

    if (existing) {
      existing.quantity += quantity;
      this.cartItemsSubject.next([...items]);
      return;
    }

    this.cartItemsSubject.next([...items, { product, quantity }]);
  }

  removeFromCart(productId: number): void {
    this.cartItemsSubject.next(
      this.cartItemsSubject.getValue().filter(item => item.product.id !== productId)
    );
  }

  updateQuantity(productId: number, quantity: number): void {
    const items = this.cartItemsSubject.getValue();
    const updated = items.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: Math.max(1, quantity) };
      }
      return item;
    });
    this.cartItemsSubject.next(updated);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }
}
