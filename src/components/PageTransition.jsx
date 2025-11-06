import React, { useEffect, useState } from 'react'

export default function PageTransition({ children, routeKey }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Reset visibility when route changes
    setIsVisible(false)
    
    // Trigger fade-in after a brief delay for smooth transition
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 50)

    return () => {
      clearTimeout(timer)
    }
  }, [routeKey])

  return (
    <div
      className={`transition-all duration-500 ease-in-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-2'
      }`}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </div>
  )
}

