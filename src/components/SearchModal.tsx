import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { Search, X, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { openProductModal } = useCart();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const matches = query.trim()
    ? PRODUCTS.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(q)) ||
          p.benefits.some((b) => b.toLowerCase().includes(q))
        );
      })
    : PRODUCTS.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-earth-950/70 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-200">
      <div className="bg-cream-50 rounded-3xl max-w-2xl w-full shadow-3xl border border-white/60 overflow-hidden relative">
        
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-earth-900/10 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-earth-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search juices, single-origin produce (Lakadong, Nilgiri Kale), or benefits (Immunity)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-earth-950 placeholder-earth-400 focus:outline-none text-sm sm:text-base font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-earth-400 hover:text-earth-700 font-semibold"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-cream-200 text-earth-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-earth-500 uppercase tracking-wider px-1">
            <span>{query.trim() ? `Search Results (${matches.length})` : 'Popular Fresh Elixirs'}</span>
            <span>ESC to close</span>
          </div>

          {matches.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                openProductModal(product);
                onClose();
              }}
              className="p-3 rounded-2xl bg-white hover:bg-cream-100 border border-earth-900/10 flex items-center justify-between gap-4 cursor-pointer transition group shadow-xs hover:shadow-sm"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-16 object-cover rounded-xl bg-cream-200 shadow-xs"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-black uppercase text-sm text-earth-950 truncate group-hover:text-citrus-amber transition-colors">
                      {product.name}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cream-200 text-earth-700">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-xs text-earth-500 line-clamp-1 mt-0.5">
                    {product.ingredients.slice(0, 3).join(', ')}...
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-earth-600">
                    <span className="font-mono font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                    <span>•</span>
                    <span>{product.calories} kcal</span>
                    <span>•</span>
                    <span className="text-botanical-deep font-semibold">{product.benefits[0]}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-citrus-amber opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  View <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}

          {matches.length === 0 && (
            <div className="text-center py-12 text-earth-600 text-sm">
              No juices found matching &quot;{query}&quot;. Try &quot;Turmeric&quot;, &quot;Detox&quot;, or &quot;Protein&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
