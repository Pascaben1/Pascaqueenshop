import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/lib/AuthContext';

import HeroSlider from '../components/home/HeroSlider';
import ProductGrid from '../components/home/ProductGrid';
import TrustBadge from '../components/home/TrustBadge';
import YouTubeSection from '../components/home/YouTubeSection';
import AboutSection from '../components/about/AboutSection';
import ContactSection from '../components/contact/ContactSection';
import CartDrawer from '../components/cart/CartDrawer';
import TestimonialsSection from '../components/home/TestimonialsSection';

// Business WhatsApp number for checkout (international format, no leading +/0)
export const WHATSAPP_NUMBER = '2347062823828';

export default function Home() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [quantities, setQuantities] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products from Supabase
  const { data: products, isLoading: productsLoading, isError: productsError, refetch: refetchProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  // Keep the storefront live: refresh instantly when the admin adds/edits/removes a product,
  // even from another tab or device. Wrapped defensively so a realtime hiccup never
  // breaks the rest of the page.
  useEffect(() => {
    let channel;
    try {
      channel = supabase
        .channel('storefront-products')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
        })
        .subscribe();
    } catch (err) {
      // Realtime not available (e.g. misconfigured backend) — the storefront
      // still works, it just won't auto-refresh on remote changes.
      console.error('Realtime subscription failed:', err);
    }
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Listen for search changes from Layout
  useEffect(() => {
    const handleSearchChange = (e) => {
      setSearchQuery(e.detail);
    };
    window.addEventListener('searchChange', handleSearchChange);
    setSearchQuery(window.searchQuery || '');

    return () => {
      window.removeEventListener('searchChange', handleSearchChange);
    };
  }, []);

  // Filter products based on search
  const filteredProducts = React.useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(product =>
      product.name?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleQuantityChange = (productId, quantity) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, quantity)
    }));
  };

  // Each cart line is keyed by product + variant, so different sizes of the
  // same product can sit in the cart as separate lines.
  const cartKeyFor = (productId, variant) => `${productId}::${variant?.id || 'base'}`;

  const handleAddToCart = (product, quantity, variant = null) => {
    if (!quantity || quantity === 0) return;

    const key = cartKeyFor(product.id, variant);

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.key === key);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { key, product, variant, quantity }];
    });

    setQuantities(prev => ({ ...prev, [product.id]: 0 }));
    toast.success(`${product.name}${variant ? ` (${variant.label})` : ''} added to cart!`);
  };

  const handleUpdateCartQuantity = (key, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(key);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.key === key
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveFromCart = (key) => {
    setCartItems(prev => prev.filter(item => item.key !== key));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    const lineTotal = (item) => (item.variant ? item.variant.price : item.product.price || 0) * item.quantity;

    const orderText = cartItems
      .map(item => `${item.product.name}${item.variant ? ` (${item.variant.label}${item.variant.weight ? `, ${item.variant.weight}` : ''})` : ''} x${item.quantity}`)
      .join('\n');

    const total = cartItems.reduce((sum, item) => sum + lineTotal(item), 0);

    const message = `Hello Pascaqueen! I would like to order:\n\n${orderText}\n\nPlease confirm my order. Thank you!`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Record the order for the admin's real-time analytics (non-blocking)
    supabase
      .from('orders')
      .insert({
        user_id: user?.id || null,
        items: cartItems.map(item => ({
          product_id: item.product.id,
          name: item.product.name,
          variant_id: item.variant?.id || null,
          variant_label: item.variant?.label || null,
          variant_weight: item.variant?.weight || null,
          quantity: item.quantity,
          price: item.variant ? item.variant.price : (item.product.price || 0),
        })),
        total,
      })
      .then(({ error }) => {
        if (error) {
          // Don't block checkout if logging fails
          console.error('Could not log order:', error.message);
        }
      });

    window.open(whatsappUrl, '_blank');
    setCartItems([]);
    setIsCartOpen(false);
    toast.success('Redirecting to WhatsApp...');
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Turn up to 5 real product photos into hero slides so the banner
  // always shows actual Pascaqueen products instead of empty space.
  const heroSlides = React.useMemo(() => {
    return products
      .filter((p) => p.image_url)
      .slice(0, 5)
      .map((p) => ({
        image_url: p.image_url,
        title: p.name,
        subtitle: p.category || 'Premium Herbal Products',
      }));
  }, [products]);

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider images={heroSlides} />

      {/* Floating Cart Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-30"
      >
        <Button
          onClick={() => setIsCartOpen(true)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-xl flex items-center justify-center relative p-0"
        >
          <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
          {totalCartItems > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
              {totalCartItems}
            </span>
          )}
        </Button>
      </motion.div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Products Section */}
      <section id="products" className="py-16 md:py-24 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full mb-4">
              <Leaf className="w-4 h-4" />
              {searchQuery ? 'Search Results' : 'Our Products'}
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-4">
              {searchQuery ? (
                <>Found <span className="text-emerald-700 font-semibold">{filteredProducts.length} Products</span></>
              ) : (
                <>Premium <span className="text-emerald-700 font-semibold">Herbal Products</span></>
              )}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {searchQuery
                ? `Showing results for "${searchQuery}"`
                : 'Discover our collection of natural herbal remedies, carefully crafted for your wellness journey.'
              }
            </p>
          </div>

          {productsError ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                <Leaf className="w-12 h-12 text-red-300" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Couldn't Load Products</h3>
              <p className="text-gray-500 mb-6">Something went wrong reaching our store. Please try again.</p>
              <Button
                onClick={() => refetchProducts()}
                className="bg-emerald-700 hover:bg-emerald-800 rounded-xl"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <ProductGrid
                products={filteredProducts}
                isLoading={productsLoading}
                quantities={quantities}
                onQuantityChange={handleQuantityChange}
                onAddToCart={handleAddToCart}
              />

              {searchQuery && filteredProducts.length === 0 && !productsLoading && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <Leaf className="w-12 h-12 text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                  <p className="text-gray-500">Try searching with different keywords</p>
                </div>
              )}

              {!searchQuery && products.length === 0 && !productsLoading && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Leaf className="w-12 h-12 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Products Coming Soon</h3>
                  <p className="text-gray-500">Our herbal products are being prepared. Check back soon!</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Trust Badge */}
      <TrustBadge />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* YouTube Section */}
      <YouTubeSection />

      {/* About Section */}
      <AboutSection />

      {/* Contact Section */}
      <ContactSection />
    </div>
  );
}
