import { cn } from '@/lib/utils';

import { SEARCH_PARAMS } from '@/config/searchParams';

import useSearchParams from '@/hooks/useSearchParams';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type PaginationBarProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
  className?: string;
};

const buildPageItems = (currentPage: number, totalPages: number) => {
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);
  const sortedPages = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const items: Array<number | 'ellipsis'> = [];

  for (let index = 0; index < sortedPages.length; index += 1) {
    const page = sortedPages[index];
    const previous = sortedPages[index - 1];

    if (index > 0 && previous !== undefined && page - previous > 1) {
      items.push('ellipsis');
    }

    items.push(page);
  }

  return items;
};

const PaginationBar = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: PaginationBarProps) => {
  const { setSearchParam, removeSearchParam } = useSearchParams();

  if (totalItems <= 0 || pageSize <= 0) {
    return null;
  }

  const totalPages = Math.ceil(totalItems / pageSize);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const pageItems = buildPageItems(safeCurrentPage, totalPages);
  const canGoPrev = safeCurrentPage > 1;
  const canGoNext = safeCurrentPage < totalPages;

  const handlePageChange = (page: number) => {
    if (page === safeCurrentPage || page < 1 || page > totalPages) {
      return;
    }

    if (page === 1) {
      removeSearchParam(SEARCH_PARAMS.PAGE);
    } else {
      setSearchParam(SEARCH_PARAMS.PAGE, page.toString());
    }

    onPageChange?.(page);
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={!canGoPrev}
            className={cn(!canGoPrev && 'pointer-events-none opacity-50')}
            onClick={(event) => {
              event.preventDefault();
              handlePageChange(safeCurrentPage - 1);
            }}
          />
        </PaginationItem>

        {pageItems.map((item, index) => {
          if (item === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={item}>
              <PaginationLink
                isActive={item === safeCurrentPage}
                onClick={(event) => {
                  event.preventDefault();
                  handlePageChange(item);
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            aria-disabled={!canGoNext}
            className={cn(!canGoNext && 'pointer-events-none opacity-50')}
            onClick={(event) => {
              event.preventDefault();
              handlePageChange(safeCurrentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationBar;
