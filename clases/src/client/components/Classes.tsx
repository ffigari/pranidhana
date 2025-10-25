import { useState, useRef } from "react"

import { PaginatedClasses, Class } from "@shared/class"

export interface API {
  getClasses(cursor: string | null, includeTeachers: boolean): Promise<PaginatedClasses>
}

export const Classes = ({
  api,
  renderViewportSentinel: renderSentinel,
  renderClasses,
}: {
  api: API,
  renderViewportSentinel: (props: {
    onEnter: () => Promise<void>,
    onLeave: () => void,
  }) => React.ReactNode,
  renderClasses: (classes: Class[]) => React.ReactNode,
}) => {
  const [classes, setClasses] = useState<Class[]>([])
  const sentinelIsInViewport = useRef<boolean>(false)
  const hasToRetrieveMorePages = useRef<boolean>(true)
  const cursor = useRef<string | null>(null)

  const onEnter = async () => {
    sentinelIsInViewport.current = true

    while (sentinelIsInViewport.current && hasToRetrieveMorePages.current) {
      const { page, endCursor, hasNextPage } = await api.getClasses(cursor.current, true)
      setClasses(prev => [...prev, ...page])
      if (hasNextPage) {
        cursor.current = endCursor
      } else {
        hasToRetrieveMorePages.current = false
      }
    }
  }
  const onLeave = () => {
    sentinelIsInViewport.current = false
  }

  return (
    <div>
      {renderClasses(classes)}
      {renderSentinel({ onEnter, onLeave })}
    </div>
  )
}
