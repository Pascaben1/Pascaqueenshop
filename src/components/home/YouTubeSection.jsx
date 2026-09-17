import React from 'react';
import { Play, ExternalLink, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function YouTubeSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full mb-4">
              Learn With Us
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
              Discover Natural <br />
              <span className="text-emerald-700 font-semibold">Herbal Remedies</span>
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Watch our educational videos on YouTube to learn about traditional herbal medicine, 
              how to mix remedies, and the benefits of natural healing. Join thousands who have 
              transformed their health journey with Pascaqueen.
            </p>
            <Button
              asChild
              className="bg-red-600 hover:bg-red-700 text-white rounded-full h-14 px-8 text-lg font-medium inline-flex items-center gap-3"
            >
              <a 
                href="https://youtube.com/@pascaqueenfoods?si=mt1FlBzKpqu5SGFv" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Play className="w-5 h-5" />
                Watch on YouTube
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 flex items-center justify-center">
              {/* Decorative leaf pattern instead of an unrelated stock photo */}
              <svg className="absolute inset-0 w-full h-full opacity-10" aria-hidden="true">
                <defs>
                  <pattern id="ytLeafPattern" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
                    <path d="M15 45 Q15 15 45 15 Q45 45 15 45 Z" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ytLeafPattern)" />
              </svg>
              <div className="relative flex flex-col items-center text-center px-6">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Leaf className="w-5 h-5 text-emerald-200" />
                </div>
                <p className="text-emerald-100 font-medium text-lg mb-1">@pascaqueenfoods</p>
                <p className="text-emerald-200/60 text-sm">Herbal wellness tutorials & remedies</p>
              </div>
              <a
                href="https://youtube.com/@pascaqueenfoods?si=mt1FlBzKpqu5SGFv"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </a>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-200 rounded-full opacity-50 blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-emerald-300 rounded-full opacity-40 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}