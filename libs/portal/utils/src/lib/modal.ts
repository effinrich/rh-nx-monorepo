import { useSearchParams } from 'react-router-dom'

/**
 * Hook to control opening/closing a modal
 * Adds a queryParameter ?modal={modalId}
 * @param modalId
 * @returns
 */
export const useModal = (modalId: string) => {
  const modalKey = 'modal'
  const [searchParams, setSearchParams] = useSearchParams()
  const openModal = () => {
    setSearchParams(prevParams => {
      prevParams.set(modalKey, modalId)
      return prevParams
    })
  }
  const closeModal = () => {
    setSearchParams(prevParams => {
      prevParams.delete(modalKey)
      return prevParams
    })
  }
  const isOpen = () => {
    return searchParams.get(modalKey) === modalId
  }

  return {
    isOpen,
    openModal,
    closeModal
  }
}
