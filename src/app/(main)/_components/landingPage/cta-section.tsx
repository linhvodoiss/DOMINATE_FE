import Link from 'next/link'
import React from 'react'

export default function CTASection() {
  return (
    <section className='from-primary-system bg-gradient-to-r to-[#2dd4bf] py-20'>
      <div className='mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
        <h2 className='mb-4 text-3xl font-bold text-white sm:text-4xl'>Ready to automate your workflow?</h2>
        <p className='mx-auto mb-8 max-w-2xl text-xl text-blue-100'>
          Join thousands of users who save hours every day with DOMinate&apos;s intelligent automation.
        </p>
        <Link
          href='/product'
          className='text-primary-system rounded-xl bg-white px-8 py-4 text-lg font-semibold shadow-lg transition-colors hover:bg-gray-100'
        >
          Buy now
        </Link>
        {/* <p className='mt-4 text-sm text-blue-100'>14-day free trial • No credit card required</p> */}
      </div>
    </section>
  )
}
