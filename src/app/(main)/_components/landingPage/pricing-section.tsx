import { PackageResponse } from '#/package'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import calPriceDiscount from '~/utils/price-discount-calculate'

export default async function PricingSection() {
  const { data } = await http.get<PackageResponse[]>(`${LINKS.topPackage}`)
  return (
    <section id='pricing' className='bg-primary-foreground py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 text-center'>
          <h2 className='text-third-gray mb-4 text-3xl font-bold sm:text-4xl'>Simple, transparent pricing</h2>
          <p className='text-secondary-gray mx-auto max-w-2xl text-lg'>
            Choose the plan that fits your needs. All plans include 24/7 support and free updates.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          {data?.map((plan, index) => (
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
                <p className='text-secondary-gray mb-4 line-clamp-4' style={{ whiteSpace: 'pre-line' }}>
                  {plan.description}
                </p>
                <div className='flex items-end justify-center'>
                  <span className='text-third-gray text-4xl font-bold'>
                    {plan.price != null
                      ? calPriceDiscount(plan.price, plan.discount).toLocaleString('vi-VN') + ' đ'
                      : '--'}
                  </span>
                  <span className='text-secondary-gray ml-1'>/{plan.billingCycle}</span>
                </div>
              </div>

              <ul className='mb-8 space-y-4'>
                {plan.options?.map(option => (
                  <li key={option.id} className='flex items-center'>
                    <CheckCircle className='mr-3 h-5 w-5 flex-shrink-0 text-green-500' />
                    <span className='text-secondary-gray'>{option.name}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/product/${plan.id}`}
                className={`inline-block w-full rounded-xl px-6 py-3 text-center font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-primary-system hover:bg-primary-hover text-white'
                    : 'text-primary-system ring-primary-system hover:bg-muted ring-1 transition-colors'
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>

        <div className='mt-12 text-center'>
          <p className='text-secondary-gray mb-4'>Need a custom enterprise solution?</p>
          <Link href='/about' className='text-primary-system hover:text-primary-hover font-semibold transition-colors'>
            Contact our sales team <ArrowRight className='ml-1 inline h-4 w-4' />
          </Link>
        </div>
      </div>
    </section>
  )
}
