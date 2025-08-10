import { Clock, Shield, Users } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function Footer() {
  return (
    <footer id='footer' className='bg-background-primary border-primary-system h-40 w-full border-t-2'>
      <div className='bg-background-primary px-8 py-16 text-white'>
        <div className='mx-auto max-w-7xl'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
            <div className='col-span-1 md:col-span-2'>
              <div className='mb-4 flex items-center'>
                <Image
                  src='/images/logo_transparent.png'
                  alt='logo'
                  width={1024}
                  height={1024}
                  className='w-24 object-contain'
                />
              </div>
              <p className='mb-6 max-w-md text-gray-300'>
                Simple desktop automation tool that helps you save time and boost productivity by creating smart scripts
                to automate repetitive web tasks.
              </p>
              <div className='flex space-x-4'>
                <a href='#' className='text-gray-400 transition-colors hover:text-white'>
                  <Users className='h-6 w-6' />
                </a>
                <a href='#' className='text-gray-400 transition-colors hover:text-white'>
                  <Clock className='h-6 w-6' />
                </a>
                <a href='#' className='text-gray-400 transition-colors hover:text-white'>
                  <Shield className='h-6 w-6' />
                </a>
              </div>
            </div>

            <div>
              <h3 className='mb-4 text-lg font-semibold'>Product</h3>
              <ul className='space-y-2 text-gray-300'>
                <li>
                  <a href='#' className='transition-colors hover:text-white'>
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='mb-4 text-lg font-semibold'>Support</h3>
              <ul className='space-y-2 text-gray-300'>
                <li>
                  <a href='#' className='transition-colors hover:text-white'>
                    Help Center
                  </a>
                </li>
                <li>
                  <a href='#' className='transition-colors hover:text-white'>
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className='mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row'>
            <p className='text-sm text-gray-400'>© 2025 DOMinate. All rights reserved.</p>
            <div className='mt-4 flex space-x-6 text-sm text-gray-400 md:mt-0'>
              <a href='#' className='transition-colors hover:text-white'>
                Privacy Policy
              </a>
              <a href='#' className='transition-colors hover:text-white'>
                Terms of Service
              </a>
              <a href='#' className='transition-colors hover:text-white'>
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
