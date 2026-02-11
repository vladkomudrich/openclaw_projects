'use client';

import { useEffect, useState } from 'react';
import { Container } from '../ui/container';
import { Button } from '../ui/button';

const services = [
  {
    title: 'Personal Coaching',
    description:
      'One-on-one coaching to help you level up your development skills, productivity, and career. Learn from real experience.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    color: '#8b5cf6',
    number: '01',
  },
  {
    title: 'AI Integration',
    description:
      'Help your business leverage AI. From chatbots to automation workflows, I help you integrate AI into your products.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    color: '#06b6d4',
    number: '02',
  },
  {
    title: 'Build Your Idea',
    description:
      'Need a team to build your project? I connect you with trusted developers and help manage the project from start to finish.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    color: '#f97316',
    number: '03',
  },
];

export function Services() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="services" className="relative py-32 overflow-hidden">
      {/* Background diagonal */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/5 via-transparent to-transparent"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 30%, 0 60%)' }}
        />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-5">
            <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-wider text-amber-500 bg-amber-500/10 rounded mb-4">
                Services
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[0.95] tracking-tight">
                Let&apos;s work
                <br />
                <span 
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  together
                </span>
              </h2>
            </div>
          </div>
          <div className="lg:col-span-7 flex items-end lg:justify-end">
            <p className={`text-foreground-muted text-lg max-w-md transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Need help with your project? I offer consulting and development services to help you succeed.
            </p>
          </div>
        </div>

        {/* Services - Horizontal cards */}
        <div className="space-y-4 mb-16">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group relative bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:border-foreground/20 hover:shadow-2xl hover:shadow-black/10 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${300 + index * 150}ms` }}
            >
              {/* Hover glow */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ 
                  background: `radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${service.color}08, transparent 40%)`,
                }}
              />

              <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Number */}
                <div className="flex-shrink-0">
                  <span 
                    className="text-6xl sm:text-7xl font-black opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ color: service.color }}
                  >
                    {service.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 sm:border-l sm:border-card-border sm:pl-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: service.color + '15', color: service.color }}
                    >
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-foreground/90 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-foreground-muted text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 hidden sm:flex items-center">
                  <div className="w-10 h-10 rounded-full border border-card-border flex items-center justify-center group-hover:border-foreground/30 group-hover:bg-foreground/5 transition-all">
                    <svg 
                      className="w-5 h-5 text-foreground-muted group-hover:text-foreground transition-colors transform group-hover:translate-x-0.5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-foreground-muted">Ready to start?</span>
          <Button
            size="lg"
            onClick={() => (window.location.href = 'mailto:vladkomudrich@gmail.com')}
            className="group"
          >
            <span>Get in Touch</span>
            <svg 
              className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </Button>
        </div>
      </Container>
    </section>
  );
}
