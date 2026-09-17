import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const lineTotal = (item) => (item.variant ? item.variant.price : item.product.price || 0) * item.quantity;
  const totalPrice = cartItems.reduce((sum, item) => sum + lineTotal(item), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Your Cart</h2>
                  <p className="text-sm text-gray-500">{totalItems} items</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingBag className="w-16 h-16 mb-4 text-emerald-200" />
                  <p className="text-lg">Your cart is empty</p>
                  <p className="text-sm mt-2">Add some herbal products!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.key}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-4 bg-emerald-50/50 rounded-xl"
                    >
                      <img
                        src={item.product.image_url || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=100'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        {item.variant && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.variant.label}
                            {item.variant.weight ? ` · ${item.variant.weight}` : ''}
                          </p>
                        )}
                        <p className="text-emerald-700 font-semibold mt-1">
                          ₦{lineTotal(item).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => onUpdateQuantity(item.key, item.quantity - 1)}
                            className="w-7 h-7 rounded-full bg-white border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-emerald-700" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.key, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-white border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-emerald-700" />
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.key)}
                            className="ml-auto w-7 h-7 rounded-full hover:bg-red-100 flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-emerald-100 bg-gray-50">
                {totalPrice > 0 && (
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Total</span>
                    <span className="text-2xl font-bold text-emerald-700">₦{totalPrice.toLocaleString()}</span>
                  </div>
                )}
                <Button
                  onClick={onCheckout}
                  className="w-full h-14 bg-green-600 hover:bg-green-700 text-white rounded-full text-lg font-medium flex items-center justify-center gap-3 transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5" />
                  Checkout via WhatsApp
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}