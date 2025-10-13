import { useEffect, useState } from 'react'

export const usePagination = <T,>(data: T[], perPage = 10) => {
  const [page, setPage] = useState(0)

  const maxPage = Math.ceil(data.length / perPage) - 1
  const incrementPage = () => setPage(page + 1)
  const decrementPage = () => setPage(page - 1)
  const paginatedData = data.slice(perPage * page, perPage * page + perPage)

  useEffect(() => {
    setPage(0)
  }, [data])

  return { data: paginatedData, page, maxPage, incrementPage, decrementPage }
}
