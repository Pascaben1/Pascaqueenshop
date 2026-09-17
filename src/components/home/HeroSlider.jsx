import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Leaf, ArrowRight } from 'lucide-react';

// Decorative leaf pattern used whenever there's no real photo to show yet,
// so the hero never looks like empty green space.
function LeafPattern() {
  return (
    <div className="absolute inset-0 opacity-[0.08]" aria-hidden="true">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="leafPattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <path
              d="M20 60 Q20 20 60 20 Q60 60 20 60 Z"
              fill="currentColor"
              className="text-emerald-300"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#leafPattern)" />
      </svg>
    </div>
  );
}

export default function HeroSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Prefer real product photos passed in from the storefront. Only fall
  // back to a designed (non-photographic) slide if there are none yet.
  const slides = images?.length > 0 ? images : [
    { image_url: null, title: 'Natural Healing', subtitle: 'Trusted Herbal Remedies' },
  ];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeSlide = slides[currentIndex];

  return (
    <div className="relative w-full h-[62vh] md:h-[75vh] overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {activeSlide?.image_url ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${activeSlide.image_url})` }}
            />
          ) : (
            <LeafPattern />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-950/40 to-emerald-950/70" />

          {/* Text + CTA */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs sm:text-sm font-medium mb-5 backdrop-blur-sm">
              <Leaf className="w-3.5 h-3.5" />
              {activeSlide?.subtitle || 'Premium Herbal Products'}
            </span>
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-wide mb-6"
            >
              {activeSlide?.title || 'Pascaqueen'}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-emerald-100/80 max-w-md mb-8"
            >
              Rooted in tradition, formulated for modern wellness.
            </motion.p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              onClick={scrollToProducts}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold px-8 py-3.5 rounded-full transition-colors shadow-lg shadow-emerald-900/40"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-emerald-400 w-8' : 'bg-white/40 hover:bg-white/60 w-2'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
