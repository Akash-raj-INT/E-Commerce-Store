import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems$: Observable<CartItem[]>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  trackByProductId(index: number, item: CartItem): number {
    return item.product.id;
  }

  changeQuantity(item: CartItem, quantity: number): void {
    this.cartService.updateQuantity(item.product.id, quantity);
  }

  decrementQuantity(item: CartItem): void {
    this.changeQuantity(item, item.quantity - 1);
  }

  incrementQuantity(item: CartItem): void {
    this.changeQuantity(item, item.quantity + 1);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.product.id);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  getTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }
}
