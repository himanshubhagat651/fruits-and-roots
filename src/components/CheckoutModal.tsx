import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { OrderDetails } from '../types';
import { X, Check, ShieldCheck, Lock, CreditCard, Truck, MapPin, Sparkles, CheckCircle2, Clock, Phone, Mail, ArrowLeft, RefreshCw, Smartphone, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { getPreciseDeliveryLocation } from '../utils/location';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    closeCheckout,
    cart,
    subtotal,
    discount,
    bottleDeposit,
    total,
    isFreeShipping,
    deliveryMode,
    zipCode,
    clearCart,
    lastOrder,
    setLastOrder,
  } = useCart();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('aarav@okaxis');

  // Form State
  const [formData, setFormData] = useState({
    name: 'Aarav Mehta',
    email: 'aarav.mehta@fruitsandroots.in',
    phone: '+91 98201 44829',
    address: 'Flat 402, Sea Breeze Apts, Perry Cross Rd, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: zipCode || '400050',
    timeWindow: '6:30 AM - 9:30 AM (Morning Chilled Drop)',
    deliveryNotes: 'Please ring bell and hand insulated bag to security if unavailable.',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '08/28',
    cardCvc: '849',
    optInBottleReturn: true,
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  const handlePreciseLocation = async () => {
    setIsLocating(true);
    setLocationStatus({ type: 'idle' });
    const result = await getPreciseDeliveryLocation();
    setIsLocating(false);

    if (result.success && result.pincode) {
      setFormData((prev) => ({
        ...prev,
        zip: result.pincode || prev.zip,
        city: result.city || prev.city,
        address: result.locality
          ? `${result.locality}, ${result.city}`
          : prev.address,
      }));
      setLocationStatus({
        type: 'success',
        message: `Verified via GPS: ${result.locality}, ${result.city} (${result.pincode})`,
      });
    } else {
      setLocationStatus({
        type: 'error',
        message: result.error || 'Could not retrieve GPS location.',
      });
    }
  };

  if (!isCheckoutOpen) return null;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFA826', '#C8741B', '#8F1E42', '#DDA74F', '#2E4733'],
    });

    const newOrder: OrderDetails = {
      orderId: `FNR-${Math.floor(100000 + Math.random() * 900000)}`,
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
      },
      fulfillment: deliveryMode,
      deliveryWindow: formData.timeWindow,
      items: [...cart],
      subtotal,
      shipping: isFreeShipping || deliveryMode === 'pickup' ? 0 : 50,
      discount,
      bottleDeposit,
      total,
      createdAt: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' IST',
      status: 'confirmed',
    };

    setLastOrder(newOrder);
    setStep(4); // Confirmation screen
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-earth-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-cream-50 rounded-3xl max-w-3xl w-full shadow-3xl border border-white/60 overflow-hidden relative my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-earth-900/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-earth-950 text-citrus-glow flex items-center justify-center font-display font-black text-sm">
              &amp;
            </div>
            <div>
              <h3 className="font-display text-xl font-black text-earth-950 uppercase tracking-tight">
                Fruits &amp; Roots Chilled Checkout
              </h3>
              <span className="text-[11px] text-earth-500 font-medium">
                {step === 4 ? 'Order Placed & Live Courier Tracking' : `Step ${step} of 3 • 256-Bit SSL Encrypted`}
              </span>
            </div>
          </div>

          <button
            onClick={closeCheckout}
            className="p-1.5 rounded-full hover:bg-cream-200 text-earth-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Indicator (unless confirmation) */}
        {step < 4 && (
          <div className="bg-cream-200/60 px-6 py-3 border-b border-earth-900/10 flex items-center justify-between text-xs font-bold">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 ${step >= 1 ? 'text-earth-950' : 'text-earth-400'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-citrus-amber text-white' : 'bg-earth-900 text-cream-100'}`}>
                1
              </span>
              <span>Delivery Details</span>
            </button>

            <span className="text-earth-300">───</span>

            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-1.5 ${step >= 2 ? 'text-earth-950' : 'text-earth-400'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-citrus-amber text-white' : 'bg-earth-900 text-cream-100'}`}>
                2
              </span>
              <span>Schedule &amp; Bottles</span>
            </button>

            <span className="text-earth-300">───</span>

            <button
              onClick={() => setStep(3)}
              className={`flex items-center gap-1.5 ${step >= 3 ? 'text-earth-950' : 'text-earth-400'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-citrus-amber text-white' : 'bg-earth-900 text-cream-100'}`}>
                3
              </span>
              <span>Payment (UPI/Cards)</span>
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: Contact & Delivery Address */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h4 className="font-display text-2xl font-black text-earth-950 uppercase tracking-tight">
                  Where should we drop off your juices?
                </h4>
                <button
                  type="button"
                  onClick={handlePreciseLocation}
                  disabled={isLocating}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-citrus-amber/10 hover:bg-citrus-amber/20 border border-citrus-amber text-earth-950 text-xs font-mono font-bold transition disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {isLocating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-citrus-amber" />
                      <span>Detecting GPS...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3.5 h-3.5 text-citrus-amber fill-citrus-amber" />
                      <span>Use Precise GPS Location</span>
                    </>
                  )}
                </button>
              </div>

              {locationStatus.type === 'success' && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{locationStatus.message}</span>
                </div>
              )}

              {locationStatus.type === 'error' && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-950 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{locationStatus.message}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-earth-800 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-earth-900/20 bg-white text-sm focus:ring-2 focus:ring-citrus-amber focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-earth-800 uppercase tracking-wider mb-1">
                    Email for Chilled Dispatch Tracking
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-earth-900/20 bg-white text-sm focus:ring-2 focus:ring-citrus-amber focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-earth-800 uppercase tracking-wider mb-1">
                    Mobile Phone (WhatsApp Delivery Alert)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-earth-900/20 bg-white text-sm focus:ring-2 focus:ring-citrus-amber focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-earth-800 uppercase tracking-wider mb-1">
                    Flat / Society / Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-earth-900/20 bg-white text-sm focus:ring-2 focus:ring-citrus-amber focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-earth-800 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-earth-900/20 bg-white text-sm focus:ring-2 focus:ring-citrus-amber focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-earth-800 uppercase tracking-wider mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-earth-900/20 bg-white text-sm focus:ring-2 focus:ring-citrus-amber focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Order Mini-Summary Banner */}
              <div className="p-4 rounded-2xl bg-cream-200/80 border border-earth-900/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-earth-950 block">Bag Items: {cart.length} item(s)</span>
                  <span className="text-earth-600">Subtotal: ₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <span className="text-sm font-display font-black text-earth-950 uppercase">
                  Total: ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-8 py-3.5 rounded-full bg-earth-950 hover:bg-earth-900 text-cream-100 font-bold text-sm shadow-md transition"
                >
                  Continue to Packaging &amp; Time
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Packaging, Time Window & Zero-Waste Program */}
          {step === 2 && (
            <div className="space-y-6">
              <h4 className="font-display text-2xl font-black text-earth-950 uppercase tracking-tight">
                Delivery Schedule &amp; Eco-Packaging
              </h4>

              {/* Time Slot Picker */}
              <div>
                <label className="block text-xs font-bold text-earth-800 uppercase tracking-wider mb-2">
                  Preferred Chilled Delivery Window (IST)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    '6:30 AM - 9:30 AM (Morning Chilled Drop)',
                    '1:00 PM - 4:00 PM (Afternoon Refresh)',
                    '5:30 PM - 8:30 PM (Evening Post-Work)',
                  ].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeWindow: time })}
                      className={`p-3.5 rounded-xl border text-left text-xs transition ${
                        formData.timeWindow === time
                          ? 'border-citrus-amber bg-citrus-amber/10 text-earth-950 font-bold shadow-xs'
                          : 'border-earth-900/10 bg-white text-earth-700 hover:border-earth-900/30'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-citrus-amber mb-1" />
                      <span>{time}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Glass Bottle Deposit Zero-Waste Program */}
              <div className="p-4 rounded-2xl bg-botanical-deep/10 border border-botanical-deep/20 space-y-2">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-botanical-deep shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-display font-black text-earth-950 text-sm uppercase tracking-tight">
                      Zero-Waste Glass Bottle Return Program
                    </h5>
                    <p className="text-xs text-earth-700 leading-relaxed mt-1">
                      Every bottle includes a refundable ₹25 circular deposit. Hand your rinsed empty glass bottles back to our delivery rider on arrival, and receive an instant ₹25/bottle cashback directly to your UPI ID.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-earth-900 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.optInBottleReturn}
                    onChange={(e) => setFormData({ ...formData, optInBottleReturn: e.target.checked })}
                    className="w-4 h-4 rounded text-citrus-amber focus:ring-citrus-amber"
                  />
                  <span>I have clean empty bottles for the delivery rider to collect</span>
                </label>
              </div>

              {/* Delivery Instructions */}
              <div>
                <label className="block text-xs font-bold text-earth-800 uppercase tracking-wider mb-1">
                  Special Drop-Off Notes (Gate codes, wing number)
                </label>
                <textarea
                  rows={2}
                  value={formData.deliveryNotes}
                  onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-earth-900/20 bg-white text-xs focus:ring-2 focus:ring-citrus-amber focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-full border border-earth-900/20 text-xs font-bold text-earth-800 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-8 py-3.5 rounded-full bg-earth-950 hover:bg-earth-900 text-cream-100 font-bold text-sm shadow-md transition"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method Simulator */}
          {step === 3 && (
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <h4 className="font-display text-2xl font-black text-earth-950 uppercase tracking-tight">
                Secure Chilled Checkout Payment
              </h4>

              {/* Payment Tabs: UPI / Cards / NetBanking / COD */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'upi', label: 'UPI / GPay' },
                  { id: 'card', label: 'RuPay/Card' },
                  { id: 'netbanking', label: 'NetBanking' },
                  { id: 'cod', label: 'COD' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPaymentMethod(tab.id as any)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-mono font-bold transition border ${
                      paymentMethod === tab.id
                        ? 'bg-earth-950 text-cream-100 border-earth-950 shadow-sm'
                        : 'bg-white text-earth-700 border-earth-900/15 hover:bg-cream-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* UPI Tab */}
              {paymentMethod === 'upi' && (
                <div className="space-y-3 p-4 rounded-2xl bg-cream-100/70 border border-earth-900/10">
                  <div className="flex items-center gap-2 text-xs font-bold text-earth-950">
                    <Smartphone className="w-4 h-4 text-citrus-amber" />
                    <span>Instant UPI Payment (Google Pay, PhonePe, Paytm, BHIM)</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-earth-700 uppercase tracking-wider mb-1">
                      Your UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi or name@okaxis"
                      className="w-full px-4 py-2.5 rounded-xl border border-earth-900/20 bg-white text-sm font-mono focus:ring-2 focus:ring-citrus-amber focus:outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-earth-500 block">
                    You will receive a UPI collect request on your mobile app after placing the order.
                  </span>
                </div>
              )}

              {/* Card Tab */}
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-earth-800 uppercase tracking-wider mb-1">
                      Card Number (RuPay, Visa, Mastercard)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-earth-900/20 bg-white text-sm font-mono focus:ring-2 focus:ring-citrus-amber focus:outline-none pl-10"
                      />
                      <CreditCard className="w-4 h-4 text-earth-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-earth-800 uppercase tracking-wider mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={formData.cardExp}
                        onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-earth-900/20 bg-white text-sm font-mono focus:ring-2 focus:ring-citrus-amber focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-earth-800 uppercase tracking-wider mb-1">
                        CVV / CVV2
                      </label>
                      <input
                        type="text"
                        value={formData.cardCvc}
                        onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-earth-900/20 bg-white text-sm font-mono focus:ring-2 focus:ring-citrus-amber focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NetBanking Tab */}
              {paymentMethod === 'netbanking' && (
                <div className="p-4 rounded-2xl bg-white border border-earth-900/10 space-y-2 text-xs">
                  <span className="font-bold text-earth-950 block">Select Your Bank:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        className="p-2 rounded-lg border border-earth-900/15 text-left hover:bg-cream-100 font-semibold"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* COD Tab */}
              {paymentMethod === 'cod' && (
                <div className="p-4 rounded-2xl bg-cream-100 border border-earth-900/10 text-xs space-y-1">
                  <span className="font-bold text-earth-950 block">Cash on Chilled Delivery:</span>
                  <p className="text-earth-600">
                    Pay our delivery rider upon doorstep verification with cash or QR scan on rider mobile.
                  </p>
                </div>
              )}

              {/* Order Final Summary Receipt */}
              <div className="p-4 rounded-2xl bg-white border border-earth-900/10 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} items):</span>
                  <span className="font-mono font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-citrus-amber font-bold">
                    <span>Discount applied:</span>
                    <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-earth-600">
                  <span>Glass Bottle Deposit (Refundable via UPI):</span>
                  <span className="font-mono">₹{bottleDeposit.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-earth-600">
                  <span>Refrigerated Courier Shipping:</span>
                  <span className="font-mono font-bold text-botanical-deep">
                    {isFreeShipping ? 'FREE' : '₹50'}
                  </span>
                </div>
                <div className="pt-2 border-t border-earth-900/10 flex justify-between items-baseline text-base font-bold text-earth-950">
                  <span className="font-display uppercase tracking-wider text-sm">Total to Pay:</span>
                  <span className="font-display text-2xl font-black text-earth-950">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-full border border-earth-900/20 text-xs font-bold text-earth-800 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                <button
                  type="submit"
                  className="px-10 py-4 rounded-full bg-citrus-amber hover:bg-citrus-glow text-earth-950 font-black text-sm shadow-xl hover:scale-102 transition flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-earth-950" />
                  <span>Authorize &amp; Place Order (₹{total.toLocaleString('en-IN')})</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Order Confirmation & Live Simulated Courier Tracker */}
          {step === 4 && lastOrder && (
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
              
              {/* Success Badge */}
              <div className="w-20 h-20 rounded-full bg-botanical-deep/15 text-botanical-deep mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-citrus-amber">
                  Order Confirmed #{lastOrder.orderId}
                </span>
                <h4 className="font-display text-3xl font-black text-earth-950 mt-1 uppercase tracking-tight leading-[0.9]">
                  Your raw cold-press is being prepared!
                </h4>
                <p className="text-xs text-earth-600 mt-2 max-w-md mx-auto">
                  A chilled delivery receipt has been dispatched to <strong className="text-earth-900">{lastOrder.customer.email}</strong>.
                </p>
              </div>

              {/* Simulated Live Courier Tracking Card */}
              <div className="p-6 rounded-3xl bg-earth-950 text-cream-100 text-left border border-earth-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-earth-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-brand-amber animate-pulse" />
                    <span className="font-display font-black text-sm text-cream-50 uppercase tracking-wider">
                      Live Cold Courier Status
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-brand-gold bg-earth-900 px-2 py-0.5 rounded">
                    Window: {lastOrder.deliveryWindow}
                  </span>
                </div>

                {/* Progress Steps */}
                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="space-y-1">
                    <div className="w-full bg-botanical-mint h-1.5 rounded-full" />
                    <span className="font-bold text-cream-100">Confirmed</span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-botanical-mint h-1.5 rounded-full" />
                    <span className="font-bold text-cream-100">Cold Bottling</span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-brand-amber h-1.5 rounded-full animate-pulse" />
                    <span className="font-bold text-brand-amber">Out for Delivery</span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-earth-800 h-1.5 rounded-full" />
                    <span className="text-earth-500">Delivered</span>
                  </div>
                </div>

                {/* Driver Bio */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-earth-900 border border-earth-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-botanical-deep flex items-center justify-center font-bold text-xs text-white">
                      AS
                    </div>
                    <div>
                      <span className="font-bold text-xs text-cream-50 block">Rider: Arjun Shinde</span>
                      <span className="text-[11px] text-cream-400 block">Refrigerated Electric Cargo Van (MH 02 BG 4089)</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-botanical-mint">
                    Est. Arrival ~ 7:45 AM IST
                  </span>
                </div>
              </div>

              {/* Order Line Breakdown */}
              <div className="p-4 rounded-2xl bg-white border border-earth-900/10 text-left space-y-3">
                <h5 className="font-bold text-xs text-earth-950 uppercase tracking-wider">
                  Summary of Delivered Sips ({lastOrder.items.length} items)
                </h5>
                <div className="space-y-2 text-xs">
                  {lastOrder.items.map((it) => (
                    <div key={it.id} className="flex justify-between items-center">
                      <span className="text-earth-800 font-medium">
                        {it.quantity}x {it.product.name} ({it.bottleSize})
                      </span>
                      <span className="font-mono font-bold text-earth-950">
                        ₹{(((it.isSubscription ? it.product.subscriptionPrice : it.product.price) * it.quantity)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-earth-900/10 flex justify-between font-bold text-sm text-earth-950">
                    <span>Total Paid:</span>
                    <span>₹{lastOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={closeCheckout}
                className="w-full py-4 rounded-full bg-earth-950 hover:bg-earth-900 text-cream-100 font-bold text-sm shadow-xl transition"
              >
                Done • Return to Fruits &amp; Roots
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
