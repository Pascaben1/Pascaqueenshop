import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, MessageSquareQuote } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

export default function TestimonialsSection() {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  // Nothing to show yet — don't render an empty section.
  if (!isLoading && testimonials.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full mb-4">
            <MessageSquareQuote className="w-4 h-4" />
            Customer Reviews
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-gray-900">
            What Our <span className="text-emerald-700 font-semibold">Customers Say</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">"{t.quote}"</p>
              <p className="text-sm font-semibold text-emerald-900">— {t.customer_name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
