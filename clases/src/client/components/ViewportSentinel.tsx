import { useEffect, useRef } from "react"

export const ViewportSentinel = ({ onEnter, onLeave}: {
  onEnter: () => void | Promise<void>,
  onLeave: () => void | Promise<void>,
}) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!sentinelRef.current) {
      return;
    }

    let isActive = true

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!isActive) {
          return
        }

        if (entry.isIntersecting) {
          await onEnter()
        } else {
          await onLeave()
        }
      },
      { rootMargin: "200px" } // trigger a bit before reaching bottom
    )
    observer.observe(sentinelRef.current)
    return () => {
      isActive = false;
      observer.disconnect();
    }
  }, [])

    return (
      <div ref={sentinelRef} />
    )
}
