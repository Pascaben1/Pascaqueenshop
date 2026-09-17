import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Open WhatsApp with message
    const message = `Hello Pascaqueen! My name is ${formData.name}. Email: ${formData.email}. Message: ${formData.message}`;
    const whatsappUrl = `https://wa.me/2347062823828?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Redirecting to WhatsApp...');
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: '+234 706 282 3828',
      href: 'tel:+2347062823828'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: 'Chat with us',
      href: 'https://wa.me/2347062823828'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'support@pascaqueen.shop',
      href: 'mailto:support@pascaqueen.shop'
    },
    {
      icon: Clock,
      title: 'Hours',
      value: 'Mon - Sat: 9AM - 6PM',
      href: null
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full mb-4">
            Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Get in <span className="text-emerald-700 font-semibold">Touch</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about our products? We'd love to hear from you. 
            Reach out to us anytime!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((item, index) => (
                <div
                  key={item.title}
                  className="p-6 bg-white rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  {item.href ? (
                    <a 
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-gray-600">{item.value}</p>
                  )}
                </div>
                ))}
                </div>


            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-emerald-100">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="h-12 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="h-12 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="min-h-32 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-lg font-medium flex items-center justify-center gap-3"
              >
                <Send className="w-5 h-5" />
                Send via WhatsApp
              </Button>
            </form>
            </div>
        </div>
      </div>
    </section>
  );
}