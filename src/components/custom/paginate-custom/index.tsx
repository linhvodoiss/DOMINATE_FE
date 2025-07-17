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
}

export default function CustomPagination({ currentPage, totalPages, containerClass }: CustomPaginationProps) {
  const router = useRouter()

  if (totalPages <= 1) return null

  // Navigate to selected page, keeping other query params
  const goToPage = (page: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set('page', String(page))
    router.push(`?${params.toString()}`)
  }

  // Generate pagination list: numbers + 'ellipsis' based on logic
  const createPagination = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = []

    // Show all pages if totalPages <= 5
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      return pages
    }

    // Always show the first page
    pages.push(1)

    // Show left ellipsis if currentPage is beyond page 3
    if (currentPage > 3) {
      pages.push('ellipsis')
    }

    // Show currentPage -1, currentPage, currentPage +1 (within range)
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i)
      }
    }

    // Show right ellipsis if currentPage is far from the end
    if (currentPage < totalPages - 2) {
      pages.push('ellipsis')
    }

    // Always show the last page
    pages.push(totalPages)

    return pages
  }

  const paginationPages = createPagination()

  return (
    <CustomPaginationStyled>
      <Pagination className={`mt-12 mb-8 items-center justify-center ${containerClass}`}>
        <PaginationContent className='gap-6'>
          {/* Previous button */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
              className={clsx(
                'hover:bg-toggle-secondary cursor-pointer',
                currentPage === 1 && 'cursor-not-allowed opacity-70 hover:bg-transparent'
              )}
            />
          </PaginationItem>

          {/* Dynamic page numbers and ellipsis */}
          {paginationPages.map((item, idx) => (
            <PaginationItem key={idx}>
              {item === 'ellipsis' ? (
                <span className='text-muted-foreground px-3 select-none'>...</span>
              ) : (
                <PaginationLink
                  isActive={item === currentPage}
                  onClick={() => goToPage(item)}
                  className={clsx(
                    'hover:bg-toggle-secondary cursor-pointer rounded-none font-bold',
                    item === currentPage ? '!bg-primary-system border-none !text-white' : ''
                  )}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next button */}
          <PaginationItem>
            <PaginationNext
              onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
              className={clsx(
                'hover:bg-toggle-secondary cursor-pointer',
                currentPage === totalPages && 'cursor-not-allowed opacity-70 hover:bg-transparent'
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </CustomPaginationStyled>
  )
}
