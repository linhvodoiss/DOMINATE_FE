import React from 'react'

export default function AboutPage() {
  return (
    <div className='mx-auto max-w-3xl px-4 py-12'>
      <h1 className='mb-3 text-center text-4xl font-bold'>About DOMINATE</h1>
      <p className='mb-8 text-center text-xl text-gray-600 italic'>
        &quot;Automate the Web. Save Time. Dominate the Competition.&quot;
      </p>

      <p className='mb-4 text-lg leading-relaxed'>
        DOMINATE is a powerful desktop application designed to create and execute automation scenarios across websites.
        With DOMINATE, you can automate repetitive online tasks such as auto-liking posts, auto-publishing content, and
        managing interactions across multiple social media platforms — all from a single, intuitive interface.
      </p>

      <p className='mb-4 text-lg leading-relaxed'>
        Built for efficiency and flexibility, DOMINATE helps you save time, streamline workflows, and maximize your
        online presence. Whether you are managing personal accounts or running large-scale marketing campaigns, DOMINATE
        gives you complete control over your automation scripts and schedules.
      </p>

      <p className='mb-8 text-lg leading-relaxed'>
        Our mission is to empower users with tools that handle the tedious work, so you can focus on strategy,
        creativity, and results.
      </p>

      <div className='mt-10 text-center'>
        <h2 className='mb-3 text-2xl font-semibold'>Interested in DOMINATE?</h2>
        <p className='mb-6'>Contact us today and take the first step towards total automation.</p>
        <a
          href='mailto:sales@dominateapp.com'
          className='bg-primary-system inline-block rounded-lg px-6 py-3 font-semibold text-white transition-colors hover:opacity-90'
        >
          Contact Sales
        </a>
      </div>
    </div>
  )
}
