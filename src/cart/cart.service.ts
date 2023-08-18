import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ItemDTO } from './dto/item.dto';
import { Cart, CartDocument } from './entities/cart.entity';


@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>) { }

  async createCart(userId: string, itemDTO: ItemDTO, subTotalPrice: number, totalPrice: number): Promise<Cart> {
    const newCart = await this.cartModel.create({
      userId,
      items: [{ ...itemDTO, subTotalPrice }],
      totalPrice
    });
    return newCart;
  }

  async getCart(userId: string): Promise<CartDocument> {
    const cart = await this.cartModel.findOne({ userId });
    return cart;
  }

  async deleteCart(userId: string): Promise<Cart> {
    const deletedCart = await this.cartModel.findOneAndRemove({ userId });
    return deletedCart;
  }

  // recalculating the cart total when an item is added or removed, or when an item’s quantity is changed
  private recalculateCart(cart: CartDocument) {
    cart.totalPrice = 0;
    cart.items.forEach(item => {
      cart.totalPrice += (item.quantity * item.price);
    })
  }

  async addItemToCart(userId: string, itemDTO: ItemDTO): Promise<Cart> {
    const { productId, quantity, price } = itemDTO;
    const subTotalPrice = quantity * price;

    const cart = await this.getCart(userId);

    
    // If the cart doesn’t exist, we need to create a new one.
    if (cart) {
      const itemIndex = cart.items.findIndex((item) => item.productId == productId);

      //The product exists, so we need to update its quantity and subtotal price
      // The product doesn’t exist, so we need to add it
      // Either way, we need to run the recalculateCart() method to update the cart appropriately

      if (itemIndex > -1) {
        let item = cart.items[itemIndex];
        item.quantity = Number(item.quantity) + Number(quantity);
        item.subTotalPrice = item.quantity * item.price;

        cart.items[itemIndex] = item;
        this.recalculateCart(cart);
        return cart.save();
      } else {
        cart.items.push({ ...itemDTO, subTotalPrice });
        this.recalculateCart(cart);
        return cart.save();
      }
    } else {
      const newCart = await this.createCart(userId, itemDTO, subTotalPrice, price);
      return newCart;
    }
  }

  async removeItemFromCart(userId: string, productId: string): Promise<any> {
    const cart = await this.getCart(userId);
  
    const itemIndex = cart.items.findIndex((item) => item.productId == productId);
  
    // we run recalculateCart() to update the cart correctly after an item is removed.
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      this.recalculateCart(cart);
      return cart.save();
    }
  }
}