import React from 'react';
import { Leaf } from 'lucide-react';

export default function InfoPageLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full mb-4">
            <Leaf className="w-4 h-4" /> Pascaqueen
          </span>
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-3">{title}</h1>
          {subtitle && <p className="text-gray-500">{subtitle}</p>}
        </div>
        <div className="prose prose-emerald max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
}
