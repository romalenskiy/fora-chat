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
        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick)
        }
    }, [handleClick])

    return [node]
}