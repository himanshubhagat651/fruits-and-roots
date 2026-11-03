import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { X, Trash2, Plus, Minus, Sparkles, ShoppingBag, ArrowRight, ShieldCheck, Tag, RefreshCw } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    openCheckout,
    removeFromCart,
    updateQuantity,
    toggleSubscriptionItem,
    updateCadence,
    subtotal,
    itemCount,
    freeShippingProgress,
    freeShippingThreshold,
    isFreeShipping,
    discount,
    promoCode,
    applyPromoCode,
    removePromoCode,
    bottleDeposit,
    total,
    addToCart,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
      setPromoInput('');
    }
  };

  // Upsell candidates: products not currently in cart
  const cartProductIds = cart.map((i) => i.product.id);
  const upsellItems = PRODUCTS.filter((p) => !cartProductIds.includes(p.id)).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-earth-950/60 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream-50 shadow-2xl flex flex-col border-l border-earth-900/10">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-earth-900/10 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-citrus-amber" />
              <h3 className="font-display text-xl font-black text-earth-950 uppercase tracking-tight">
                Your Chilled Bag ({itemCount})
              </h3>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full hover:bg-cream-200 text-earth-600 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tiered Free Shipping Progress Meter */}
          <div className="px-5 sm:px-6 py-3.5 bg-cream-200/60 border-b border-earth-900/10">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              <span className="text-earth-800">
                {isFreeShipping ? (
                  <span className="text-botanical-deep flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Unlocked Free Chilled Courier Delivery!
                  </span>
                ) : (
                  <span>
                    Add ₹{(freeShippingThreshold - subtotal).toLocaleString('en-IN')} more for Free Chilled Delivery
                  </span>
                )}
              </span>
              <span className="text-earth-600 font-mono text-[11px]">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-cream-300 h-2 rounded-full overflow-hidden">
              <div
                className="bg-citrus-amber h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-cream-200 mx-auto flex items-center justify-center text-earth-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-black text-earth-950 uppercase tracking-tight">
                    Your bag is fresh &amp; empty
                  </h4>
                  <p className="text-xs text-earth-600 mt-1 max-w-xs mx-auto">
                    Explore our cold-pressed juices, superfood smoothies, or build a custom box for instant savings.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-full bg-earth-950 text-cream-100 text-xs font-bold shadow-md hover:bg-earth-900 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const unitPrice = item.isSubscription
                  ? item.product.subscriptionPrice
                  : item.product.price;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white border border-earth-900/10 shadow-xs flex gap-3.5 items-start relative group"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-20 object-cover rounded-xl bg-cream-100 shadow-xs"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-display text-sm font-black text-earth-950 truncate uppercase tracking-tight">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-earth-400 hover:text-berry-ruby p-1 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[11px] text-earth-500 font-mono block">
                        {item.bottleSize}
                      </span>

                      {/* Subscription toggle badge */}
                      <div className="mt-1 flex items-center gap-1.5">
                        <button
                          onClick={() => toggleSubscriptionItem(item.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition ${
                            item.isSubscription
                              ? 'bg-botanical-deep/15 text-botanical-deep border border-botanical-deep/30'
                              : 'bg-cream-200 text-earth-600 hover:text-earth-950'
                          }`}
                        >
                          <RefreshCw className="w-2.5 h-2.5" />
                          <span>{item.isSubscription ? '15% Off Subscribed' : 'Make It Subscription'}</span>
                        </button>

                        {item.isSubscription && (
                          <select
                            value={item.cadence}
                            onChange={(e) => updateCadence(item.id, e.target.value as any)}
                            className="text-[10px] bg-cream-100 border border-earth-900/20 rounded px-1 py-0.5 font-bold text-earth-800"
                          >
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Every 2 wks</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center border border-earth-900/15 rounded-lg bg-cream-100/60">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-earth-700 hover:bg-cream-200 font-bold text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-bold text-earth-950">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-earth-700 hover:bg-cream-200 font-bold text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-display font-black text-sm text-earth-950">
                            ₹{(unitPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Cross-Sell Recommendations */}
            {cart.length > 0 && upsellItems.length > 0 && (
              <div className="pt-4 border-t border-earth-900/10">
                <span className="text-xs font-extrabold uppercase tracking-wider text-earth-950 block mb-2">
                  Frequently Added Boosters:
                </span>
                <div className="space-y-2">
                  {upsellItems.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-2.5 rounded-xl bg-white border border-earth-900/10 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                        <div className="min-w-0">
                          <span className="font-display font-black text-earth-950 block truncate uppercase">
                            {prod.name}
                          </span>
                          <span className="text-[11px] text-earth-500 font-mono">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(prod, { quantity: 1 })}
                        className="px-3 py-1.5 rounded-lg bg-cream-200 hover:bg-citrus-amber hover:text-white text-earth-900 font-bold text-xs transition"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-earth-900/10 space-y-4 shadow-lg">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (try FRESH15)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-earth-900/20 text-xs uppercase font-mono focus:outline-none focus:ring-2 focus:ring-citrus-amber"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-cream-200 hover:bg-cream-300 text-earth-900 text-xs font-bold rounded-xl transition"
                >
                  Apply
                </button>
              </form>

              {promoCode && (
                <div className="flex items-center justify-between text-xs bg-botanical-mint/10 text-botanical-deep px-3 py-1.5 rounded-lg border border-botanical-mint/20 font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Promo &quot;{promoCode}&quot; Applied!
                  </span>
                  <button onClick={removePromoCode} className="text-berry-ruby hover:underline">
                    Remove
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-earth-700">
                <div className="flex justify-between">
                  <span>Produce Subtotal:</span>
                  <span className="font-mono font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-citrus-amber font-semibold">
                    <span>Discount Savings:</span>
                    <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Glass Bottle Deposit (Refundable via UPI):</span>
                  <span className="font-mono">₹{bottleDeposit.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                  <span>Cold Chilled Delivery:</span>
                  <span className="font-mono font-semibold">
                    {isFreeShipping ? 'FREE' : '₹50'}
                  </span>
                </div>

                <div className="pt-2 border-t border-earth-900/10 flex justify-between items-baseline text-base font-bold text-earth-950">
                  <span className="font-display uppercase tracking-wider text-sm">Estimated Total:</span>
                  <span className="font-display text-xl font-black">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={openCheckout}
                className="w-full py-4 rounded-full bg-earth-950 hover:bg-earth-900 text-cream-100 font-bold text-sm transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group active:scale-98"
              >
                <span>Proceed to Chilled Checkout</span>
                <ArrowRight className="w-4 h-4 text-citrus-glow group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-[11px] text-earth-500 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-botanical-deep" />
                <span>Cold-chain temperature guaranteed (under 3.3°C) upon doorstep arrival</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
