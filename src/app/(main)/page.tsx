'use client'
import {
  Zap,
  Cpu,
  Shield,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Menu,
  X,
  Bot,
  Target,
  Gauge,
  Users,
  ChevronDown,
} from 'lucide-react'
import { useState } from 'react'

const features = [
  {
    icon: Bot,
    title: 'Intelligent Automation',
    description:
      'AI-powered automation helps you automate any desktop task intelligently and accurately with advanced machine learning.',
  },
  {
    icon: Target,
    title: 'Precise Recognition',
    description:
      'Advanced computer vision technology recognizes screen elements with high accuracy and reliability for seamless automation.',
  },
  {
    icon: Gauge,
    title: 'Superior Performance',
    description:
      'Execute tasks quickly, save time and significantly boost productivity with lightning-fast processing capabilities.',
  },
  {
    icon: Shield,
    title: 'Absolute Security',
    description:
      'End-to-end encryption and zero personal data storage ensures complete information security and privacy protection.',
  },
]

const pricingPlans = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for individuals and freelancers',
    features: [
      '100 automated tasks/month',
      '5 concurrent workflows',
      '24/7 email support',
      'Basic reporting',
      '30-day data retention',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: '$79',
    period: '/month',
    description: 'Optimized for small businesses',
    features: [
      '1,000 automated tasks/month',
      '25 concurrent workflows',
      '24/7 priority support',
      'Advanced reporting & analytics',
      '90-day data retention',
      'API integration',
      'Custom templates',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    description: 'Complete solution for large enterprises',
    features: [
      'Unlimited automated tasks',
      'Unlimited workflows',
      'Dedicated support manager',
      'Advanced analytics & BI',
      'Unlimited data retention',
      'Full API access',
      'Custom development',
      'On-premise deployment',
    ],
    popular: false,
  },
]

const testimonials = [
  {
    name: 'Michael Chen',
    role: 'CEO, TechFlow Solutions',
    content:
      'DOMinate has helped our company save 40% of data processing time. This tool is absolutely incredible for automation!',
    rating: 5,
  },
  {
    name: 'Sarah Johnson',
    role: 'Marketing Manager, GreenTech',
    content:
      'Automating repetitive marketing tasks has never been this easy. Highly recommended for any business workflow!',
    rating: 5,
  },
  {
    name: 'David Rodriguez',
    role: 'Data Analyst, FinanceHub',
    content:
      'Intuitive interface, quick setup. DOMinate has completely transformed how our entire team works and collaborates.',
    rating: 5,
  },
]

const faqs = [
  {
    question: 'Is DOMinate difficult to use?',
    answer:
      'Not at all! DOMinate is designed with an intuitive drag-and-drop interface. You can create automated workflows in just minutes without any programming knowledge required.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      "Yes, you can cancel your subscription at any time without any fees. We don't bind you to long-term contracts and offer complete flexibility.",
  },
  {
    question: 'Does DOMinate support multiple languages?',
    answer:
      'Yes, DOMinate supports multiple languages including English, Spanish, French, German, and many others with full localization support.',
  },
  {
    question: 'Is my data secure with DOMinate?',
    answer:
      "Absolutely secure! We use AES-256 encryption, don't store personal data, and comply with international security standards including GDPR and SOC 2.",
  },
]

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState(null)
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='bg-primary-foreground pt-24 pb-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl'>
              Intelligent Desktop
              <span className='from-primary-system bg-gradient-to-r to-indigo-500 bg-clip-text text-transparent'>
                {' '}
                Automation
              </span>
            </h1>
            <p className='text-secondary-gray mx-auto mb-8 max-w-3xl text-xl leading-relaxed'>
              DOMinate helps you automate any desktop task intelligently and efficiently. Save time, boost productivity
              with the most advanced AI technology available.
            </p>
            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <button className='bg-primary-system rounded-xl px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-xl'>
                Start 14-Day Free Trial
              </button>
              <button className='hover:bg-toggle-secondary rounded-xl border border-gray-300 px-8 py-4 text-lg font-semibold transition-colors'>
                Watch Demo
              </button>
            </div>
            <p className='mt-4 text-sm text-gray-500'>✨ No credit card required • 24/7 support • Cancel anytime</p>
          </div>

          {/* Stats */}
          <div className='mt-20 grid grid-cols-1 gap-8 md:grid-cols-3'>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-blue-600'>10,000+</div>
              <div className='text-secondary-gray'>Trusted users</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-blue-600'>2.5M+</div>
              <div className='text-secondary-gray'>Tasks automated/month</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-blue-600'>99.9%</div>
              <div className='text-secondary-gray'>Uptime reliability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-16 text-center'>
            <h2 className='text-third-gray mb-4 text-3xl font-bold sm:text-4xl'>Why choose DOMinate?</h2>
            <p className='text-secondary-gray mx-auto max-w-2xl text-lg'>
              Advanced AI technology combined with user-friendly interface, delivering the ultimate automation
              experience.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {features.map((feature, index) => (
              <div key={index} className='group text-center'>
                <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 transition-colors group-hover:bg-blue-100'>
                  <feature.icon className='h-8 w-8 text-blue-600' />
                </div>
                <h3 className='text-third-gray mb-3 text-xl font-semibold'>{feature.title}</h3>
                <p className='text-secondary-gray leading-relaxed'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id='pricing' className='bg-primary-foreground py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-16 text-center'>
            <h2 className='text-third-gray mb-4 text-3xl font-bold sm:text-4xl'>Simple, transparent pricing</h2>
            <p className='text-secondary-gray mx-auto max-w-2xl text-lg'>
              Choose the plan that fits your needs. All plans include 24/7 support and free updates.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-8 shadow-lg ${plan.popular ? 'scale-105 ring-2 ring-blue-600' : 'ring-1 ring-blue-600'}`}
              >
                {plan.popular && (
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2 transform'>
                    <div className='rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white'>
                      Most Popular
                    </div>
                  </div>
                )}

                <div className='mb-8 text-center'>
                  <h3 className='text-third-gray mb-2 text-2xl font-bold'>{plan.name}</h3>
                  <p className='text-secondary-gray mb-4'>{plan.description}</p>
                  <div className='flex items-end justify-center'>
                    <span className='text-third-gray text-4xl font-bold'>{plan.price}</span>
                    <span className='text-secondary-gray ml-1'>{plan.period}</span>
                  </div>
                </div>

                <ul className='mb-8 space-y-4'>
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className='flex items-center'>
                      <CheckCircle className='mr-3 h-5 w-5 flex-shrink-0 text-green-500' />
                      <span className='text-secondary-gray'>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full rounded-xl px-6 py-3 font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'text-blue-600 ring-1 ring-blue-700 transition-colors hover:text-blue-700'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>

          <div className='mt-12 text-center'>
            <p className='text-secondary-gray mb-4'>Need a custom enterprise solution?</p>
            <button className='font-semibold text-blue-600 transition-colors hover:text-blue-700'>
              Contact our sales team <ArrowRight className='ml-1 inline h-4 w-4' />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id='testimonials' className='py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-16 text-center'>
            <h2 className='text-third-gray mb-4 text-3xl font-bold sm:text-4xl'>What our customers say</h2>
            <p className='text-secondary-gray mx-auto max-w-2xl text-lg'>
              Thousands of customers trust and use DOMinate to automate their workflows and boost productivity.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            {testimonials.map((testimonial, index) => (
              <div key={index} className='bg-primary-foreground rounded-2xl p-8'>
                <div className='mb-4 flex'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className='h-5 w-5 fill-current text-yellow-400' />
                  ))}
                </div>
                <p className='text-secondary-gray mb-6 italic'>"{testimonial.content}"</p>
                <div>
                  <div className='text-third-gray font-semibold'>{testimonial.name}</div>
                  <div className='text-secondary-gray text-sm'>{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id='faq' className='bg-primary-foreground py-20'>
        <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-16 text-center'>
            <h2 className='text-third-gray mb-4 text-3xl font-bold sm:text-4xl'>Frequently asked questions</h2>
            <p className='text-secondary-gray text-lg'>Common questions about DOMinate</p>
          </div>

          <div className='space-y-4'>
            {faqs.map((faq, index) => (
              <div key={index} className='rounded-xl'>
                <button
                  className='flex w-full items-center justify-between rounded-xl p-6 text-left transition-colors'
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className='text-third-gray font-semibold'>{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className='px-6 pb-6'>
                    <p className='text-secondary-gray leading-relaxed'>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-gradient-to-r from-blue-600 to-indigo-600 py-20'>
        <div className='mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='mb-4 text-3xl font-bold text-white sm:text-4xl'>Ready to automate your workflow?</h2>
          <p className='mx-auto mb-8 max-w-2xl text-xl text-blue-100'>
            Join thousands of users who save hours every day with DOMinate's intelligent automation.
          </p>
          <button className='rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-colors hover:bg-gray-100'>
            Start Free Trial Today
          </button>
          <p className='mt-4 text-sm text-blue-100'>14-day free trial • No credit card required</p>
        </div>
      </section>
    </div>
  )
}
