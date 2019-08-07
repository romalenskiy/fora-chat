import {useEffect} from 'react'

export default function useComponentFocus(node, callback) {
    
    const handleClick = event => {
        if(node.current.contains(event.target)) {
            return;
        }
        callback();
    }

    useEffect(()=>{
        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick)
        }
    }, [])
}