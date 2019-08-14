import {useEffect, useRef} from 'react'

export default function useComponentFocus(callback) {
    const node = useRef()
    
    const handleClick = event => {
        if(!node.current) return

        if(node.current.contains(event.target)) {
            return
        }
        callback()
    }

    useEffect(()=>{
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [handleClick])

    return [node]
}