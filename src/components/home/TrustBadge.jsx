import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Truck, Leaf, Shield } from 'lucide-react';

function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function TrustBadge() {
  const stats = [
    { icon: Users, label: 'Happy Customers', value: 8050, suffix: '+' },
    { icon: Truck, label: 'Orders Delivered', value: 10000, suffix: '+' },
    { icon: Leaf, label: 'Natural Products', value: 100, suffix: '%' },
    { icon: Shield, label: 'Hygienically Processed', value: 0, text: 'Quality Assured' },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-800 to-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Trusted by Thousands of Customers
          </h2>
          <p className="text-emerald-200/80">
            Premium herbal remedies delivered with love and care
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <stat.icon className="w-7 h-7 text-emerald-300" />
              </div>
              <p className="text-3xl font-bold text-white mb-2">
                {stat.text || <AnimatedCounter end={stat.value} suffix={stat.suffix} />}
              </p>
              <p className="text-sm text-emerald-200/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}