'use client'
import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'

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

export default function FAQSection() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  return (
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
                  className={`h-5 w-5 text-gray-500 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}
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
  )
}
