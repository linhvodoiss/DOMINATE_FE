'use client'

import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'

import { CustomPaginationStyled } from './styled'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination'

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  containerClass?: string
  maxPagesToShow?: number
}

export default function CustomPagination({
  currentPage,
  totalPages,
  containerClass,
  maxPagesToShow = 5,
}: CustomPaginationProps) {
  const router = useRouter()

  if (totalPages <= 1) return null

  const startPage = Math.max(1, Math.min(currentPage - Math.floor(maxPagesToShow / 2), totalPages - maxPagesToShow + 1))
  const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages)

  const goToPage = (page: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set('page', String(page))
    router.push(`?${params.toString()}`)
  }

  return (
    <CustomPaginationStyled>
      <Pagination className={`mt-12 mb-8 items-center justify-center ${containerClass}`}>
        <PaginationContent className='gap-6'>
          {/* Previous */}
          <PaginationItem className=''>
            <PaginationPrevious
              onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
              className={clsx(
                'hover:bg-transparent',
                currentPage === 1 && 'pointer-events-none !cursor-not-allowed opacity-70'
              )}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {Array.from({ length: endPage - startPage + 1 }).map((_, idx) => {
            const page = startPage + idx
            const isCurrent = page === currentPage

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={isCurrent}
                  onClick={() => goToPage(page)}
                  className={clsx(
                    'hover:bg-toggle-secondary cursor-pointer rounded-none font-bold',
                    isCurrent ? '!bg-primary-system border-none !text-white' : ''
                  )}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
              className={clsx(
                'hover:bg-transparent',
                currentPage === totalPages && 'pointer-events-none !cursor-not-allowed opacity-70'
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </CustomPaginationStyled>
  )
}
