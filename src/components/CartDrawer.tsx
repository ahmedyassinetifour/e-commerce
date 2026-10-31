import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import type { CartLine } from '../types';
import { money } from '../lib/format';

export function CartDrawer({ cart, total, onClose, onUpdate }: { cart: CartLine[]; total: number; onClose: () => void; onUpdate: (id: number, amount: number) => void }) {
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState<'WELCOME10' | 'FANUNA15' | null>(() => localStorage.getItem('fanuna.coupon') as 'WELCOME10' | 'FANUNA15' | null);
  const [couponMessage, setCouponMessage] = useState('');
  const discount = coupon === 'FANUNA15' ? total * 0.15 : coupon === 'WELCOME10' ? total * 0.1 : 0;
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === 'WELCOME10' || code === 'FANUNA15') { setCoupon(code); localStorage.setItem('fanuna.coupon', code); setCouponMessage(`${code} applied`); }
    else setCouponMessage('That coupon is not valid. Try WELCOME10.');
  };
  return <div className="overlay" onClick={onClose}>
    <aside className="drawer" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Your shopping cart">
      <div className="drawer-heading"><h2 className="drawer-title"><ShoppingBag size={19} /> Your bag <span>({cart.reduce((count, item) => count + item.quantity, 0)} items)</span></h2><button onClick={onClose} aria-label="Close cart"><X /></button></div>
      {cart.length === 0 ? <div className="empty"><ShoppingBag size={60} /><h3>Your bag is empty</h3><p>Add something you love and it will appear here.</p><button onClick={onClose}>Continue shopping</button></div> : <>
        <div className="drawer-items">{cart.map((item) => <article className="cart-line" key={item.product.id}><img src={item.product.images[0]} alt={item.product.name} /><div className="cart-line-details"><div className="cart-line-top text-primary dark:text-primary-light"><h3>{item.product.name}</h3><strong className="text-primary dark:text-primary-light">{money(item.product.price * item.quantity)}</strong></div><p className="text-secondary dark:text-secondary-light">{money(item.product.price)} each</p><div className="cart-line-actions"><div className="quantity"><button className="text-primary dark:text-primary-light" aria-label="Decrease quantity" disabled={item.quantity <= 1} onClick={() => onUpdate(item.product.id, -1)}><Minus size={14} /></button><span className="text-primary dark:text-primary-light font-medium">{item.quantity}</span><button className="text-primary dark:text-primary-light" aria-label="Increase quantity" disabled={item.quantity >= item.product.stock} onClick={() => onUpdate(item.product.id, 1)}><Plus size={14} /></button></div><button className="remove" onClick={() => onUpdate(item.product.id, -item.quantity)}><Trash2 size={15} /> Remove</button></div></div></article>)}</div>
        <footer className="drawer-summary"><div className="coupon-box"><label htmlFor="coupon">Have a coupon?</label><div><input id="coupon" value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="WELCOME10" /><button type="button" onClick={applyCoupon}>Apply</button></div>{couponMessage && <p className={coupon ? 'coupon-success' : 'coupon-error'}>{couponMessage}</p>}{coupon && <button className="coupon-remove" onClick={() => { setCoupon(null); localStorage.removeItem('fanuna.coupon'); setCouponMessage('Coupon removed'); }}>Remove coupon</button>}</div><div className="summary-row text-primary dark:text-primary-light"><span>Subtotal</span><strong className="text-secondary dark:text-secondary-light">{money(total)}</strong></div>{discount > 0 && <div className="summary-row discount text-primary dark:text-primary-light"><span>Coupon discount</span><strong className="text-secondary dark:text-secondary-light">−{money(discount)}</strong></div>}<div className="drawer-total text-primary dark:text-primary-light"><span>Total</span><strong className="text-secondary dark:text-secondary-light">{money(total - discount)}</strong></div><p className="cart-note">Your bag is saved in this browser. Contact us to arrange your order.</p><button className="checkout-button" type="button">Continue to checkout</button></footer>
      </>}
    </aside>
  </div>;
}
