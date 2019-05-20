import { useEffect } from 'react'

// Custom effect hook to focus on an element when rendered
function useAutofocus(ref, dependencies = [ref]) {
  return useEffect(() => {
    ref.current.focus()
  }, dependencies)
}

export default useAutofocus
