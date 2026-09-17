import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Leaf, X, Check, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function BrokenImageFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-300">
      <Leaf className="w-10 h-10 mb-1" />
      <span className="text-[11px] font-medium text-emerald-400">Photo coming soon</span>
    </div>
  );
}

function ProductImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <BrokenImageFallback />;
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export default function ProductCard({ product, quantity, onQuantityChange, onAddToCart }) {
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const [showQuickView, setShowQuickView] = useState(false);
  const [localQty, setLocalQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(hasVariants ? product.variants[0] : null);

  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const lowestPrice = hasVariants ? Math.min(...product.variants.map((v) => v.price)) : product.price;

  const bumpLocalQty = (delta) => setLocalQty((q) => Math.max(1, q + delta));

  const doAdd = (qty = localQty) => {
    onQuantityChange(product.id, (quantity || 0) + qty);
    onAddToCart(product, qty, selectedVariant);
    setLocalQty(1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (hasVariants) {
      // Sizing decision matters — open the full picker instead of guessing.
      setShowQuickView(true);
      return;
    }
    doAdd();
  };

  const stop = (e) => e.stopPropagation();

  return (
    <>
      <div
        onClick={() => setShowQuickView(true)}
        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-emerald-50 flex flex-col h-full cursor-pointer"
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100">
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {hasVariants && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Layers className="w-3 h-3" /> {product.variants.length} sizes
            </div>
          )}

          {/* In-cart badge */}
          {quantity > 0 && (
            <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
              {quantity} in cart
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3.5 sm:p-5 flex flex-col flex-1">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="hidden sm:block text-sm text-gray-500 mb-4 line-clamp-2">
            {product.description}
          </p>

          {lowestPrice != null && (
            <p className="text-emerald-700 font-bold text-base sm:text-lg mb-3 sm:mb-4">
              {hasVariants && <span className="text-xs sm:text-sm font-medium text-emerald-500 mr-1">From</span>}
              ₦{Number(lowestPrice).toLocaleString()}
            </p>
          )}

          {/* Compact counter + sleek add-to-cart button */}
          <div className="mt-auto flex items-center gap-2" onClick={stop}>
            {!hasVariants && (
              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-full h-8 sm:h-9 flex-shrink-0">
                <button
                  onClick={() => bumpLocalQty(-1)}
                  className="w-7 sm:w-8 h-full flex items-center justify-center text-gray-500 hover:text-emerald-700 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 sm:w-6 text-center text-xs sm:text-sm font-semibold text-gray-800 tabular-nums">
                  {localQty}
                </span>
                <button
                  onClick={() => bumpLocalQty(1)}
                  className="w-7 sm:w-8 h-full flex items-center justify-center text-gray-500 hover:text-emerald-700 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}

            <button
              onClick={handleAddClick}
              disabled={justAdded}
              className={`flex-1 h-8 sm:h-9 flex items-center justify-center gap-1.5 rounded-full font-medium text-xs sm:text-sm transition-colors ${
                justAdded
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Added
                </>
              ) : hasVariants ? (
                'Choose Size'
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuickView(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg my-8"
              >
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative max-h-[calc(100vh-4rem)] overflow-y-auto">
                  <button
                    onClick={() => setShowQuickView(false)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center z-10"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>

                  <div className="aspect-square bg-gradient-to-br from-emerald-50 to-emerald-100">
                    <ProductImage
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">{product.name}</h2>
                    {product.category && (
                      <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full mb-3">
                        {product.category}
                      </span>
                    )}
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {product.description || 'No description available yet.'}
                    </p>

                    {product.ingredients && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">Ingredients</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{product.ingredients}</p>
                      </div>
                    )}

                    {product.directions && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">Directions for Use</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{product.directions}</p>
                      </div>
                    )}

                    {product.warnings && (
                      <div className="mb-4 bg-amber-50 border border-amber-100 rounded-xl p-3">
                        <h3 className="text-sm font-semibold text-amber-800 mb-1">Warnings & Precautions</h3>
                        <p className="text-sm text-amber-700 leading-relaxed">{product.warnings}</p>
                      </div>
                    )}

                    {hasVariants && (
                      <div className="mb-5">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Choose a size</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {product.variants.map((variant) => {
                            const isSelected = selectedVariant?.id === variant.id;
                            return (
                              <button
                                key={variant.id}
                                onClick={() => setSelectedVariant(variant)}
                                className={`text-left rounded-xl border px-3 py-2.5 transition-colors ${
                                  isSelected
                                    ? 'border-emerald-600 bg-emerald-50'
                                    : 'border-gray-200 hover:border-emerald-300'
                                }`}
                              >
                                <p className={`text-sm font-medium ${isSelected ? 'text-emerald-800' : 'text-gray-800'}`}>
                                  {variant.label}
                                </p>
                                {variant.weight && (
                                  <p className="text-xs text-gray-400">{variant.weight}</p>
                                )}
                                <p className={`text-sm font-semibold mt-0.5 ${isSelected ? 'text-emerald-700' : 'text-gray-600'}`}>
                                  ₦{Number(variant.price).toLocaleString()}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {activePrice != null && (
                      <p className="text-emerald-700 font-bold text-2xl mb-6">
                        ₦{Number(activePrice).toLocaleString()}
                      </p>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-gray-50 border border-gray-100 rounded-full h-11 flex-shrink-0">
                        <button
                          onClick={() => bumpLocalQty(-1)}
                          className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-emerald-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-gray-800 tabular-nums">
                          {localQty}
                        </span>
                        <button
                          onClick={() => bumpLocalQty(1)}
                          className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-emerald-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          doAdd();
                          setShowQuickView(false);
                        }}
                        className="flex-1 h-11 flex items-center justify-center gap-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-full font-medium transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
