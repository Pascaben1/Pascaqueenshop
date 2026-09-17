import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2, X, Star, MessageSquareQuote, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = { customer_name: '', quote: '', rating: 5 };

export default function TestimonialManager() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  useEffect(() => {
    const channel = supabase
      .channel('admin-testimonials-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
        queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [queryClient]);

  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name.trim() || !form.quote.trim()) {
      toast.error('Customer name and quote are required.');
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase.from('testimonials').insert({
        customer_name: form.customer_name.trim(),
        quote: form.quote.trim(),
        rating: Number(form.rating),
        is_published: true,
      });
      if (error) throw error;
      toast.success('Testimonial added');
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Something went wrong saving the testimonial.');
    } finally {
      setIsSaving(false);
    }
  };

  const togglePublished = async (testimonial) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_published: !testimonial.is_published })
      .eq('id', testimonial.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    queryClient.invalidateQueries({ queryKey: ['testimonials'] });
  };

  const handleDelete = async (testimonial) => {
    if (!window.confirm(`Delete this testimonial from ${testimonial.customer_name}?`)) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', testimonial.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Testimonial deleted');
    queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    queryClient.invalidateQueries({ queryKey: ['testimonials'] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Testimonials</h2>
          <p className="text-sm text-gray-500">Add genuine customer reviews to show on the storefront.</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-emerald-700 hover:bg-emerald-800 rounded-xl gap-2">
            <Plus className="w-4 h-4" /> Add Testimonial
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-emerald-100 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">New Testimonial</h3>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <Input
                value={form.customer_name}
                onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))}
                placeholder="e.g. Blessing O."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, rating: n }))}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${n <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quote *</label>
              <Textarea
                value={form.quote}
                onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                placeholder="What did the customer say about your product?"
                className="min-h-24"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-emerald-700 hover:bg-emerald-800 rounded-xl gap-2">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Add Testimonial
            </Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <MessageSquareQuote className="w-12 h-12 mb-3 text-emerald-200" />
          <p>No testimonials yet. Add your first genuine customer review above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePublished(t)}
                    title={t.is_published ? 'Published — click to hide' : 'Hidden — click to publish'}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    {t.is_published ? (
                      <Eye className="w-4 h-4 text-gray-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(t)}
                    className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-2">"{t.quote}"</p>
              <p className="text-sm font-medium text-gray-900">— {t.customer_name}</p>
              {!t.is_published && <p className="text-xs text-amber-600 mt-1">Hidden from storefront</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
