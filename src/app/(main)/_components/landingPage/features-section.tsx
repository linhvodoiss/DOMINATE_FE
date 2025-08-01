import { Bot, Gauge, Shield, Target } from 'lucide-react'
import React from 'react'

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
export default function FeaturesSection() {
  return (
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
  )
}
