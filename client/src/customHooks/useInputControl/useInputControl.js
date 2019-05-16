import { useState, useEffect } from 'react'

function useInputControl(defaultValue = '', defaultValidation = false, validationCallback = value => /\S+/.test(value)) {
  const [input, setInput] = useState(defaultValue)
  const [isInputValid, setIsInputValid] = useState(defaultValidation)

  useEffect(() => {
    const validationResult = validationCallback(input)
    setIsInputValid(validationResult)
  }, [input])

  return [
    input,
    setInput,
    isInputValid,
    setIsInputValid,
  ]
}

export default useInputControl
