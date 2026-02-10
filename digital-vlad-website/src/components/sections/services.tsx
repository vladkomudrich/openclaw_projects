import { Container } from '../ui/container';
import { Button } from '../ui/button';

const services = [
  {
    title: 'Personal Coaching',
    description:
      'One-on-one coaching to help you level up your development skills, productivity, and career. Learn from real experience.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    color: '#8b5cf6',
  },
  {
    title: 'AI Integration Consulting',
    description:
      'Help your business leverage AI. From chatbots to automation workflows, I help you integrate AI into your products.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    color: '#06b6d4',
  },
  {
    title: 'Find Developers & Build',
    description:
      'Need a team to build your project? I connect you with trusted developers and help manage the project from start to finish.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    color: '#f97316',
  },
];

export function Services() {
  return (
    <section id="services" className="py-24">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Services</h2>
          <p className="text-foreground-muted max-w-xl mx-auto">
            Need help with your project? I offer consulting and development services to help you
            succeed.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {services.map((service) => (
            <div
              key={service.title}
              className="relative bg-card-bg border border-card-border rounded-2xl p-6 hover:border-zinc-600 transition-colors group"
            >
              {/* Accent background */}
              <div
                className="absolute inset-0 rounded-2xl opacity-5 group-hover:opacity-10 transition-opacity"
                style={{ backgroundColor: service.color }}
              />

              <div className="relative">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: service.color + '20', color: service.color }}
                >
                  {service.icon}
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-foreground-muted text-sm">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-foreground-muted mb-4">Interested in working together?</p>
          <Button
            size="lg"
            onClick={() => (window.location.href = 'mailto:vladkomudrich@gmail.com')}
          >
            Get in Touch
          </Button>
        </div>
      </Container>
    </section>
  );
}
