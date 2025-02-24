import { useEffect, useRef } from 'react'
import { KeyDisplay } from './Utils'

const KeyDisplayComponent = () => {
    const displayRef = useRef(null)

    useEffect(() => {
        // Create new instance on mount
        displayRef.current = new KeyDisplay()

        // Handle window resize
        const handleResize = () => {
            displayRef.current?.updatePosition()
        }

        // Handle key events
        const handleKeyDown = (e) => {
            displayRef.current?.down(e.key)
        }

        const handleKeyUp = (e) => {
            displayRef.current?.up(e.key)
        }

        // Add event listeners
        window.addEventListener('resize', handleResize)
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        // Cleanup on unmount
        return () => {
            if (displayRef.current) {
                displayRef.current.map.forEach((element) => {
                    element.remove()
                })
            }
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    return null
}

export default KeyDisplayComponent