import React from 'react';
import { Truck, Tag } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-brand-950 text-brand-cream border-b border-brand-800/40 select-none text-[11px] font-mono py-2 px-4 relative z-40 transition-all duration-300 animate-in fade-in slide-in-from-top-1">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        
        {/* Left: Fresh Daily Promise */}
        <div className="flex items-center gap-2 justify-center">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-amber opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-amber" />
          </span>
          <span className="font-bold tracking-wider text-brand-parchment">
            100% RAW COLD-PRESSED JUICES &bull; PRESSED FRESH DAILY IN MUMBAI
          </span>
        </div>

        {/* Right: Shipping & Discount Offer */}
        <div className="flex items-center gap-4 text-brand-cream/90">
          <div className="flex items-center gap-1.5 text-brand-sand">
            <Truck className="w-3.5 h-3.5 text-brand-amber" />
            <span>FREE CHILLED DELIVERY OVER &#8377;499</span>
          </div>

          <div className="flex items-center gap-1.5 bg-brand-900 border border-brand-800 px-2.5 py-0.5 rounded-full text-brand-gold font-bold">
            <Tag className="w-3 h-3 text-brand-amber" />
            <span>USE CODE: FRESH15 (15% OFF)</span>
          </div>
        </div>

      </div>
    </div>
  );
};
