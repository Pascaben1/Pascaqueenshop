import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Pencil, Trash2, ImagePlus, X, PackageSearch, Tags } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = {
  id: null,
  name: '',
  description: '',
  price: '',
  category: '',
  image_url: '',
  ingredients: '',
  directions: '',
  warnings: '',
  variants: [],
};

function makeVariantId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function ProductManager() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
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

  // Live-refresh the list whenever products change (from this tab or elsewhere)
  useEffect(() => {
    const channel = supabase
      .channel('admin-products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setShowForm(false);
  };

  const startEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      category: product.category || '',
      image_url: product.image_url || '',
      ingredients: product.ingredients || '',
      directions: product.directions || '',
      warnings: product.warnings || '',
      variants: Array.isArray(product.variants) ? product.variants : [],
    });
    setImagePreview(product.image_url || '');
    setImageFile(null);
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const addVariant = () => {
    setForm((f) => ({
      ...f,
      variants: [...f.variants, { id: makeVariantId(), label: '', weight: '', price: '' }],
    }));
  };

  const updateVariant = (index, field, value) => {
    setForm((f) => {
      const variants = [...f.variants];
      variants[index] = { ...variants[index], [field]: value };
      return { ...f, variants };
    });
  };

  const removeVariant = (index) => {
    setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== index) }));
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.price === '') {
      toast.error('Product name and price are required.');
      return;
    }

    const cleanedVariants = form.variants
      .filter((v) => v.label.trim() !== '' || v.price !== '')
      .map((v) => {
        if (!v.label.trim() || v.price === '') return null;
        return {
          id: v.id || makeVariantId(),
          label: v.label.trim(),
          weight: (v.weight || '').trim(),
          price: parseFloat(v.price),
        };
      });

    if (cleanedVariants.some((v) => v === null)) {
      toast.error('Each size/sub-category needs both a label and a price.');
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        category: form.category.trim(),
        image_url: imageUrl,
        ingredients: form.ingredients.trim(),
        directions: form.directions.trim(),
        warnings: form.warnings.trim(),
        variants: cleanedVariants,
      };

      if (form.id) {
        const { error } = await supabase.from('products').update(payload).eq('id', form.id);
        if (error) throw error;
        toast.success('Product updated');
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
        toast.success('Product added');
      }

      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Something went wrong saving the product.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('products').delete().eq('id', product.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Product deleted');
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">Upload photos, set prices, and manage what's live on the site.</p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-emerald-700 hover:bg-emerald-800 rounded-xl gap-2"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-emerald-100 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{form.id ? 'Edit Product' : 'New Product'}</h3>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Bitter Kola Herbal Mix"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price (₦) *
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="5000"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Used when this product has no sizes below, and shown on the card.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="e.g. Herbal Tea"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Short description shown on the product card"
                  className="min-h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                <Textarea
                  value={form.ingredients}
                  onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))}
                  placeholder="e.g. Bitter kola, ginger root, honey"
                  className="min-h-16"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Directions for Use</label>
                <Textarea
                  value={form.directions}
                  onChange={(e) => setForm((f) => ({ ...f, directions: e.target.value }))}
                  placeholder="e.g. Take 1 tablespoon twice daily after meals"
                  className="min-h-16"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warnings / Precautions</label>
                <Textarea
                  value={form.warnings}
                  onChange={(e) => setForm((f) => ({ ...f, warnings: e.target.value }))}
                  placeholder="e.g. Not recommended during pregnancy. Consult a doctor if on medication."
                  className="min-h-16"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <label className="flex flex-col items-center justify-center h-56 rounded-xl border-2 border-dashed border-emerald-200 hover:border-emerald-400 cursor-pointer bg-emerald-50/40 overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-emerald-600">
                    <ImagePlus className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Click to upload photo</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Sizes / Sub-categories */}
          <div className="mt-6 border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tags className="w-4 h-4 text-emerald-600" />
                <label className="block text-sm font-medium text-gray-700">
                  Sizes / Sub-categories (optional)
                </label>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="text-sm text-emerald-700 font-medium hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Size
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              e.g. Small (250g) — ₦3,000, Large (1kg) — ₦10,000. Leave empty for a single-price product.
            </p>

            {form.variants.length > 0 && (
              <div className="space-y-2">
                {form.variants.map((variant, index) => (
                  <div key={variant.id || index} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-gray-50 rounded-xl p-3">
                    <Input
                      value={variant.label}
                      onChange={(e) => updateVariant(index, 'label', e.target.value)}
                      placeholder="Label (e.g. Small, Large, 500g Pack)"
                      className="flex-1"
                    />
                    <Input
                      value={variant.weight}
                      onChange={(e) => updateVariant(index, 'weight', e.target.value)}
                      placeholder="Weight/Size (e.g. 250g)"
                      className="sm:w-40"
                    />
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, 'price', e.target.value)}
                      placeholder="Price (₦)"
                      className="sm:w-36"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="w-9 h-9 flex-shrink-0 self-end sm:self-auto rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-emerald-700 hover:bg-emerald-800 rounded-xl gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {form.id ? 'Save Changes' : 'Add Product'}
            </Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <PackageSearch className="w-12 h-12 mb-3 text-emerald-200" />
          <p>No products yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="aspect-square bg-emerald-50">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-emerald-300">
                    <ImagePlus className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1 flex-1">{product.description}</p>
                {Array.isArray(product.variants) && product.variants.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full w-fit mt-2">
                    <Tags className="w-3 h-3" /> {product.variants.length} size{product.variants.length > 1 ? 's' : ''}
                  </span>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-emerald-700 font-bold">
                    {Array.isArray(product.variants) && product.variants.length > 0
                      ? `From ₦${Math.min(...product.variants.map((v) => v.price)).toLocaleString()}`
                      : `₦${Number(product.price).toLocaleString()}`}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(product)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
