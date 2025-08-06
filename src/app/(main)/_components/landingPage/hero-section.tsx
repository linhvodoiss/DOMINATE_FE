import Link from 'next/link'
import React from 'react'

export default function HeroSection() {
  return (
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
            Create and run automation scripts effortlessly with DOMinate. Automate interactions on websites and desktop
            apps using simple, rule-based workflows.
          </p>
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Link
              href='/product'
              className='bg-primary-system hover:bg-primary-hover rounded-xl px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:shadow-xl'
            >
              Start Today
            </Link>
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
  )
}
