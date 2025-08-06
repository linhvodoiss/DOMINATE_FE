import PricingSection from './_components/landingPage/pricing-section'
import FAQSection from './_components/landingPage/faq-section'
import CTASection from './_components/landingPage/cta-section'
import TestimonialsSection from './_components/landingPage/testimonials-section'
import FeaturesSection from './_components/landingPage/features-section'
import HeroSection from './_components/landingPage/hero-section'
import { cookies } from 'next/headers'
import { AUTH } from '~/constants'

export default async function Home() {
  const cookieStore = await cookies()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const token = cookieStore.get(AUTH.token)?.value
  return (
    <div className='min-h-screen'>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </div>
  )
}
