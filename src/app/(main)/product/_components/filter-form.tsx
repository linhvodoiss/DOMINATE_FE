'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '~/components/ui/select'
import { Filter, RotateCcw } from 'lucide-react'

export default function FilterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [type, setType] = useState(searchParams.get('type') ?? 'ALL')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()

    if (search) params.set('search', search)
    if (type && type !== 'ALL') params.set('type', type)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)

    startTransition(() => {
      router.push(`/product?${params.toString()}`)
    })
  }

  const handleReset = () => {
    setSearch('')
    setType('ALL')
    setMinPrice('')
    setMaxPrice('')
    router.push('/product')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='mx-auto mb-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start 2xl:mx-8'
    >
      <div className='flex gap-2'>
        <Input
          type='text'
          placeholder='Search packages...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          classNameWrap='w-2/3 sm:w-full'
        />

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className='w-1/3 sm:w-[160px]'>
            <SelectValue placeholder='Filter type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ALL'>All</SelectItem>
            <SelectItem value='DEV'>Developer</SelectItem>
            <SelectItem value='RUNTIME'>Runtime</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='flex w-full gap-2 sm:w-auto'>
        <Input
          type='number'
          placeholder='Min price'
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          classNameWrap='w-full sm:w-[120px]'
        />
        <Input
          type='number'
          placeholder='Max price'
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          classNameWrap='w-full sm:w-[120px]'
        />
      </div>

      {/* Buttons row - icon only on mobile */}
      <div className='flex w-full justify-start gap-2 sm:w-auto sm:justify-center'>
        <Button
          type='submit'
          disabled={isPending}
          className='bg-primary-system hover:bg-primary-hover flex h-10 w-10 items-center justify-center gap-1 text-white sm:w-[110px]'
        >
          <Filter className='h-4 w-4' />
          <span className='hidden sm:inline'>{isPending ? 'Filtering...' : 'Filter'}</span>
        </Button>

        <Button
          type='button'
          variant='outline'
          onClick={handleReset}
          className='flex h-10 w-10 items-center justify-center gap-1 sm:w-[110px]'
        >
          <RotateCcw className='h-4 w-4' />
          <span className='hidden sm:inline'>Reset</span>
        </Button>
      </div>
    </form>
  )
}
