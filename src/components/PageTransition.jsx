import React, { useEffect, useRef, useState } from 'react'

const TRANSITION_DURATION = 250

export default function PageTransition({ children, routeKey }) {
  const [renderedChildren, setRenderedChildren] = useState(children)
  const [stage, setStage] = useState('enter') // 'enter' | 'exit'
  const animationFrameRef = useRef(null)
  const isFirstRenderRef = useRef(true)

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false
      setRenderedChildren(children)
      setStage('enter')
      return
    }

    // Begin exit animation
    setStage('exit')

    // After the exit completes, swap in the next page and play the enter animation
    const exitTimer = setTimeout(() => {
      setRenderedChildren(children)

      animationFrameRef.current = requestAnimationFrame(() => {
        setStage('enter')
      })
    }, TRANSITION_DURATION)

    return () => {
      clearTimeout(exitTimer)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [children, routeKey])

  return (
    <div
      className={`transition-all ease-in-out ${
        stage === 'enter'
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2'
      }`}
      style={{
        willChange: 'opacity, transform',
        transitionDuration: `${TRANSITION_DURATION}ms`,
      }}
    >
      {renderedChildren}
    </div>
  )
}

