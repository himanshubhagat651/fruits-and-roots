import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Droplet, RefreshCw, Star, ShieldCheck, Heart, Scale } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, closeProductModal, addToCart } = useCart();
  const [isSubscription, setIsSubscription] = useState(false);
  const [cadence, setCadence] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('473 ml Standard');

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    addToCart(selectedProduct, {
      isSubscription,
      cadence,
      quantity,
      bottleSize: selectedSize,
    });
    closeProductModal();
  };

  const currentPrice = isSubscription ? selectedProduct.subscriptionPrice : selectedProduct.price;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-earth-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-cream-50 rounded-3xl max-w-4xl w-full shadow-3xl border border-white/50 overflow-hidden relative my-8">
        
        {/* Close Button */}
        <button
          onClick={closeProductModal}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-cream-200/80 hover:bg-cream-200 text-earth-900 flex items-center justify-center shadow-md transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Visual Showcase */}
          <div className="md:col-span-5 p-6 sm:p-8 bg-cream-100/70 flex flex-col justify-between border-b md:border-b-0 md:border-r border-earth-900/10">
            <div>
              {/* Product Badge */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: selectedProduct.accentColor }}
                >
                  {selectedProduct.badge || selectedProduct.category}
                </span>

                <div className="flex items-center gap-1 text-xs font-bold text-earth-900 bg-white px-2.5 py-0.5 rounded-full shadow-xs">
                  <Star className="w-3.5 h-3.5 text-citrus-yellow fill-citrus-yellow" />
                  <span>{selectedProduct.rating}</span>
                  <span className="text-earth-400">({selectedProduct.reviewsCount})</span>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-white my-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 opacity-15 mix-blend-multiply pointer-events-none"
                  style={{ backgroundColor: selectedProduct.colorHex }}
                />
              </div>

              {/* Taste Profile Bars */}
              <div className="bg-white rounded-2xl p-4 border border-earth-900/10 space-y-2.5 mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-earth-800 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-citrus-amber" /> Taste Sensor Profile
                </h4>
                
                <div className="space-y-1.5 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-earth-700">
                      <span>Sweetness</span>
                      <span>{selectedProduct.tasteProfile.sweetness} / 5</span>
                    </div>
                    <div className="w-full bg-cream-200 h-1.5 rounded-full overflow-hidden mt-0.5">
                      <div
                        className="bg-citrus-amber h-full rounded-full"
                        style={{ width: `${(selectedProduct.tasteProfile.sweetness / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-earth-700">
                      <span>Tartness &amp; Zest</span>
                      <span>{selectedProduct.tasteProfile.tartness} / 5</span>
                    </div>
                    <div className="w-full bg-cream-200 h-1.5 rounded-full overflow-hidden mt-0.5">
                      <div
                        className="bg-brand-gold h-full rounded-full"
                        style={{ width: `${(selectedProduct.tasteProfile.tartness / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-earth-700">
                      <span>Root Earthiness</span>
                      <span>{selectedProduct.tasteProfile.earthiness} / 5</span>
                    </div>
                    <div className="w-full bg-cream-200 h-1.5 rounded-full overflow-hidden mt-0.5">
                      <div
                        className="bg-botanical-deep h-full rounded-full"
                        style={{ width: `${(selectedProduct.tasteProfile.earthiness / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-earth-900/10 text-[11px] text-earth-500 space-y-1">
              <p className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-botanical-deep" /> FSSAI Certified Raw • 100% Unpasteurised
              </p>
              <p className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-berry-ruby" /> 100% Borosilicate Glass • ₹25 UPI Return Cashback
              </p>
            </div>
          </div>

          {/* Right Column: Nutrition Label, Ingredients & Purchase Controls */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-earth-500 uppercase tracking-widest">
                {selectedProduct.subname}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-earth-950 mt-1 uppercase tracking-tight leading-[0.9]">
                {selectedProduct.name}
              </h2>
              <p className="text-sm text-earth-700 mt-2 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Farm-to-Bottle Ingredients Origin */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-earth-950">
                Single-Origin Indian Produce Traceability ({selectedProduct.ingredients.length} Whole Ingredients)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {selectedProduct.ingredientHighlights.map((ing) => (
                  <div key={ing.name} className="p-2.5 rounded-xl bg-white border border-earth-900/10 text-xs">
                    <span className="font-bold text-earth-950 block">{ing.name}</span>
                    <span className="text-[10px] text-botanical-deep font-semibold block mt-0.5">{ing.benefit}</span>
                    <span className="text-[10px] text-earth-400 block mt-1 font-mono">{ing.origin}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Facts Label Box */}
            <div className="p-4 rounded-2xl bg-white border-2 border-earth-950 font-sans text-xs">
              <div className="border-b-8 border-earth-950 pb-1">
                <h5 className="font-black text-xl tracking-tight leading-none uppercase">Nutrition Transparency</h5>
                <div className="flex justify-between text-[11px] text-earth-600 mt-1">
                  <span>{selectedProduct.nutritionFacts.servingsPerContainer} serving per container</span>
                  <span className="font-bold">{selectedProduct.nutritionFacts.servingSize}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline py-2 border-b-4 border-earth-950 font-black">
                <span className="text-sm">Energy</span>
                <span className="text-2xl font-mono">{selectedProduct.nutritionFacts.calories} kcal</span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-earth-300 text-[11px] leading-relaxed">
                <div>
                  <span className="font-bold">Total Fat:</span> {selectedProduct.nutritionFacts.totalFat}
                </div>
                <div>
                  <span className="font-bold">Sodium:</span> {selectedProduct.nutritionFacts.sodium}
                </div>
                <div>
                  <span className="font-bold">Total Carbs:</span> {selectedProduct.nutritionFacts.totalCarb}
                </div>
                <div>
                  <span className="font-bold">Dietary Fibre:</span> {selectedProduct.nutritionFacts.dietaryFiber}
                </div>
                <div>
                  <span className="font-bold">Natural Sugars:</span> {selectedProduct.nutritionFacts.totalSugars} (0g Added)
                </div>
                <div>
                  <span className="font-bold">Plant Protein:</span> {selectedProduct.nutritionFacts.protein}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 text-[10px] text-earth-600 text-center font-semibold">
                <div className="bg-cream-100 p-1 rounded">Vit C {selectedProduct.nutritionFacts.vitaminC}</div>
                <div className="bg-cream-100 p-1 rounded">Vit A {selectedProduct.nutritionFacts.vitaminA}</div>
                <div className="bg-cream-100 p-1 rounded">Iron {selectedProduct.nutritionFacts.iron}</div>
                <div className="bg-cream-100 p-1 rounded">Potassium {selectedProduct.nutritionFacts.potassium}</div>
              </div>
            </div>

            {/* Bottle Size Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800 block mb-2">
                Choose Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['355 ml Elixir', '473 ml Standard', '1000 ml Growler'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      selectedSize === size
                        ? 'border-earth-950 bg-earth-950 text-cream-100 shadow-sm'
                        : 'border-earth-900/15 bg-white text-earth-700 hover:border-earth-900/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Purchase Type: One-Time vs Subscribe & Save */}
            <div className="p-4 rounded-2xl bg-cream-200/80 border border-earth-900/10 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubscription(false)}
                  className={`p-3 rounded-xl border text-left transition ${
                    !isSubscription
                      ? 'bg-white border-earth-950 shadow-sm'
                      : 'border-transparent text-earth-700 hover:bg-cream-100'
                  }`}
                >
                  <span className="text-xs font-bold block text-earth-950">One-Time Order</span>
                  <span className="text-base font-display font-black text-earth-950">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSubscription(true)}
                  className={`p-3 rounded-xl border text-left transition ${
                    isSubscription
                      ? 'bg-white border-citrus-amber shadow-sm ring-1 ring-citrus-amber'
                      : 'border-transparent text-earth-700 hover:bg-cream-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-botanical-deep">Subscribe &amp; Save</span>
                    <span className="text-[10px] font-extrabold uppercase bg-citrus-amber text-white px-1.5 py-0.2 rounded">15% OFF</span>
                  </div>
                  <span className="text-base font-display font-black text-earth-950">₹{selectedProduct.subscriptionPrice.toLocaleString('en-IN')}</span>
                </button>
              </div>

              {/* Cadence Dropdown (if subscription selected) */}
              {isSubscription && (
                <div className="pt-2 flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold text-earth-800">Delivery Cadence:</span>
                  <select
                    value={cadence}
                    onChange={(e) => setCadence(e.target.value as any)}
                    className="px-3 py-1.5 rounded-lg border border-earth-900/20 bg-white font-bold text-earth-900 focus:outline-none focus:ring-2 focus:ring-citrus-amber"
                  >
                    <option value="weekly">Deliver Every Week (Recommended)</option>
                    <option value="biweekly">Deliver Every 2 Weeks</option>
                    <option value="monthly">Deliver Every 4 Weeks</option>
                  </select>
                </div>
              )}
            </div>

            {/* Quantity Stepper & Final Add CTA */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-earth-900/20 bg-white rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-3 hover:bg-cream-200 text-earth-800 font-bold text-sm transition"
                >
                  -
                </button>
                <span className="px-3 py-3 text-sm font-bold font-mono text-earth-950">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-3 hover:bg-cream-200 text-earth-800 font-bold text-sm transition"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-xl bg-earth-950 hover:bg-earth-900 text-cream-100 font-bold text-sm transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <span>Add to Bag • ₹{(currentPrice * quantity).toLocaleString('en-IN')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
