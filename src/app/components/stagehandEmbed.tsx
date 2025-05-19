'use client'

import { useCallback, useState } from 'react'
import { runStagehand, startBBSSession } from '../stagehand/main'

export function StagehandEmbed() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [debugUrl, setDebugUrl] = useState<string | null>(null)

  const startSession = useCallback(async () => {
    const { sessionId, debugUrl } = await startBBSSession()
    setSessionId(sessionId)
    setDebugUrl(debugUrl)
    await runStagehand(sessionId)
  }, [])

  return (
    <div className="w-full h-full">
      {!sessionId && (
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={startSession}
        >
          Start Session
        </button>
      )}
      {sessionId && debugUrl && (
        <iframe src={debugUrl} className="w-full h-full" />
      )}
    </div>
  )
}
