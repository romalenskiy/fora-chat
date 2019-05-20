import { useEffect } from 'react'

function useAutofocus(ref, dependencies = [ref]) {
  return useEffect(() => {
    ref.current.focus()
  }, dependencies)
}

export default useAutofocus
