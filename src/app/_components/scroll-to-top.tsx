'use client'

import { CircleChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className='fixed right-4 bottom-8 z-50 flex size-12 cursor-pointer items-center justify-center transition-transform duration-300 hover:scale-110'
          aria-label='Scroll to top'
        >
          <CircleChevronUp size={36} strokeWidth={3} className='' />
        </button>
      )}
    </>
  )
}
