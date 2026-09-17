import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchBar({ value, onChange, onClear, placeholder = "Search products..." }) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-12 pr-12 h-14 rounded-full border-2 border-emerald-600 focus:border-emerald-700 focus:ring-emerald-500 text-base text-gray-900 placeholder:text-gray-400"
      />
      <button
        onClick={onClear}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
      >
        <X className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}