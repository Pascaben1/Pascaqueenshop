import React from 'react';
import { Leaf, Heart, Award, Globe } from 'lucide-react';

export default function AboutSection() {
  const features = [
    {
      icon: Leaf,
      title: 'Natural Ingredients',
      description: 'All our products are made from 100% natural herbs sourced from trusted suppliers.'
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Every product is carefully crafted with passion and dedication to your wellness.'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'We maintain the highest standards of quality in all our herbal preparations.'
    },
    {
      icon: Globe,
      title: 'African Heritage',
      description: 'Drawing from centuries of African traditional medicine and wisdom.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6969c1601d12e386e36e0823/250c6b596_IMG_6359.jpg"
                alt="Pasca Queen Herbal Products"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent" />
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
              <p className="text-3xl font-bold text-emerald-700 mb-1">20+ Years</p>
              <p className="text-gray-600">Of trusted herbal excellence</p>
            </div>

            <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-200 rounded-full opacity-50 blur-2xl" />
            </div>

            {/* Content Side */}
            <div>
            <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full mb-4">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
              Your Trusted Partner in <br />
              <span className="text-emerald-700 font-semibold">Natural Wellness</span>
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Pascaqueen is dedicated to bringing you the finest herbal products rooted in African 
              traditional medicine. We believe in the power of nature to heal, nourish, and restore 
              balance to your body. Our mission is to make premium herbal remedies accessible to 
              everyone seeking a natural path to wellness.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                </div>
                ))}
                </div>
                </div>
        </div>
      </div>
    </section>
  );
}