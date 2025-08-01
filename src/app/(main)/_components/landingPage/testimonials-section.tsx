import React from 'react'
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
export default function TestimonialsSection() {
  return (
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
              <p className='text-secondary-gray mb-6 italic'>&quot;{testimonial.content}&quot;</p>
              <div>
                <div className='text-third-gray font-semibold'>{testimonial.name}</div>
                <div className='text-secondary-gray text-sm'>{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
