'use client'
import { Shield, CheckCircle, Star, ArrowRight, Bot, Target, Gauge, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const features = [
  {
    icon: Bot,
    title: 'Visual Scripting',
    description:
      'Create automation scripts using a simple, visual interface — no coding required. Define actions like click, input, scroll, wait, and more.',
  },
  {
    icon: Target,
    title: 'Smart Automation',
    description:
      'Automate tasks such as auto-liking, auto-posting, form filling, and browsing — saving hours of manual work.',
  },
  {
    icon: Gauge,
    title: 'Fast & Reliable',
    description: 'Run scripts smoothly with consistent performance and minimal errors, even on dynamic web pages.',
  },
  {
    icon: Shield,
    title: 'Secure & Local',
    description:
      'All tasks are executed directly on your device. Your data stays private and secure — no cloud needed.',
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
    role: 'Product Manager, DevTools Inc.',
    content:
      'DOMinate made it easy for our team to create scripts that automate tasks across different websites. No complex setup, just click and run.',
    rating: 5,
  },
  {
    name: 'Sarah Johnson',
    role: 'Digital Operations Lead, NexaCom',
    content:
      'We use DOMinate to auto-post content and manage routine interactions. It saves us hours each week and works reliably across browsers.',
    rating: 5,
  },
  {
    name: 'David Rodriguez',
    role: 'QA Engineer, SoftCore Labs',
    content:
      'This tool streamlined our UI testing process. Creating automation scripts visually is a huge plus — no need to code from scratch.',
    rating: 5,
  },
]
const faqs = [
  {
    question: 'Is DOMinate difficult to use?',
    answer:
      'Not at all! DOMinate uses a visual interface so you can build scripts with clicks instead of code. Most users create their first automation in just a few minutes.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes, DOMinate is commitment-free. You can cancel your subscription anytime without penalties or hidden fees.',
  },
  {
    question: 'Does DOMinate support different languages or keyboards?',
    answer:
      'Yes. DOMinate works with most international keyboard layouts and system languages, so you can automate tasks in your local environment without issues.',
  },
  {
    question: 'Is my data safe when using DOMinate?',
    answer:
      'Yes. All scripts and actions run locally on your device. DOMinate does not upload or store any personal data — everything stays private and offline.',
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
              Simple Web Browser
              <span className='from-primary-system bg-gradient-to-r to-[#2dd4bf] bg-clip-text text-transparent'>
                {' '}
                Automation
              </span>
            </h1>
            <p className='text-secondary-gray mx-auto mb-8 max-w-3xl text-xl leading-relaxed'>
              Create and run automation scripts effortlessly with DOMinate. Automate interactions on websites and
              desktop apps using simple, rule-based workflows.
            </p>
            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <button className='bg-primary-system hover:bg-primary-hover rounded-xl px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:shadow-xl'>
                Try now
              </button>
              <button className='hover:bg-toggle-secondary rounded-xl border border-gray-300 px-8 py-4 text-lg font-semibold transition-colors'>
                Watch Demo
              </button>
            </div>
            <p className='mt-4 text-sm text-gray-500'>✨ No payment required • 24/7 support • Cancel anytime</p>
          </div>

          {/* Stats */}
          <div className='mt-20 grid grid-cols-1 gap-8 md:grid-cols-3'>
            <div className='text-center'>
              <div className='text-primary-system mb-2 text-3xl font-bold'>10+</div>
              <div className='text-secondary-gray'>Test users</div>
            </div>
            <div className='text-center'>
              <div className='text-primary-system mb-2 text-3xl font-bold'>15+</div>
              <div className='text-secondary-gray'>Automated tasks</div>
            </div>
            <div className='text-center'>
              <div className='text-primary-system mb-2 text-3xl font-bold'>90%</div>
              <div className='text-secondary-gray'>User satisfaction (feedback)</div>
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
              Designed for speed, simplicity, and reliability — DOMinate helps you automate any website task with ease.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {features.map((feature, index) => (
              <div key={index} className='group text-center'>
                <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 transition-colors group-hover:bg-blue-100'>
                  <feature.icon className='text-primary-system h-8 w-8' />
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
                className={`relative rounded-2xl p-8 shadow-lg ${plan.popular ? 'ring-primary-system scale-105 ring-2' : 'ring-primary-system ring-1'}`}
              >
                {plan.popular && (
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2 transform'>
                    <div className='bg-primary-system rounded-full px-4 py-2 text-sm font-semibold text-white'>
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
                      ? 'bg-primary-system hover:bg-primary-hover text-white'
                      : 'text-primary-system ring-primary-system hover:bg-muted ring-1 transition-colors'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>

          <div className='mt-12 text-center'>
            <p className='text-secondary-gray mb-4'>Need a custom enterprise solution?</p>
            <button className='text-primary-system hover:text-primary-hover font-semibold transition-colors'>
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
                <div className='mb-4 flex'></div>
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
      <section className='from-primary-system bg-gradient-to-r to-[#2dd4bf] py-20'>
        <div className='mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='mb-4 text-3xl font-bold text-white sm:text-4xl'>Ready to automate your workflow?</h2>
          <p className='mx-auto mb-8 max-w-2xl text-xl text-blue-100'>
            Join thousands of users who save hours every day with DOMinate's intelligent automation.
          </p>
          <button className='text-primary-system rounded-xl bg-white px-8 py-4 text-lg font-semibold shadow-lg transition-colors hover:bg-gray-100'>
            Start Free Trial Today
          </button>
          <p className='mt-4 text-sm text-blue-100'>14-day free trial • No credit card required</p>
        </div>
      </section>
    </div>
  )
}
