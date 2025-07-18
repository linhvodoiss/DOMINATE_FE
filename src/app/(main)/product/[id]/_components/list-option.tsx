'use client'

import { OptionResponse } from '#/option'
import { CheckCircle } from 'lucide-react'
import React, { useState } from 'react'

interface Props {
  options: OptionResponse[]
}

export default function OptionList({ options }: Props) {
  const [showAllOptions, setShowAllOptions] = useState(false)

  const shouldToggle = options.length > 3
  const visibleOptions = showAllOptions || !shouldToggle ? options : options.slice(0, 3)

  return (
    <div className='py-2'>
      <span className='font-semibold'>Profit: </span>
      <ul className='max-h-48 list-inside list-disc overflow-y-auto text-base'>
        {visibleOptions.map(option => (
          <li key={option.id} className='mt-1 flex items-center gap-2'>
            <CheckCircle className='h-5 w-5 flex-shrink-0 text-[#198754]' /> {option.name}
          </li>
        ))}
      </ul>

      {shouldToggle && (
        <button
          onClick={() => setShowAllOptions(prev => !prev)}
          className='text-primary hover:text-primary-hover mt-2 underline'
        >
          {showAllOptions ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}
