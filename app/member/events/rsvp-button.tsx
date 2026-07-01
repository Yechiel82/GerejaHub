'use client'

import { useState, useTransition } from 'react'
import { updateEventRsvp } from './actions'
import { LoadingSpinner } from '@/app/components/loading'

type RsvpStatus = 'going' | 'maybe' | 'not_going' | null

interface EventRsvpButtonProps {
  eventId: string
  currentStatus: RsvpStatus
}

export function EventRsvpButton({ eventId, currentStatus }: EventRsvpButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<RsvpStatus>(currentStatus)
  const [message, setMessage] = useState<string | null>(null)

  function handleRsvp(newStatus: 'going' | 'maybe' | 'not_going') {
    startTransition(async () => {
      const result = await updateEventRsvp(eventId, newStatus)
      
      if (result.success) {
        setStatus(newStatus)
        setMessage('RSVP updated!')
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage(result.error)
        setTimeout(() => setMessage(null), 5000)
      }
    })
  }

  return (
    <div className="rsvp-buttons">
      {message && (
        <span className={message.includes('updated') ? 'rsvp-success' : 'rsvp-error'}>
          {message}
        </span>
      )}
      <div className="button-group">
        <button
          onClick={() => handleRsvp('going')}
          disabled={isPending}
          className={`button ${status === 'going' ? 'primary' : 'secondary'}`}
          aria-label="RSVP as going"
        >
          {isPending && status === 'going' ? <LoadingSpinner size="small" /> : '✓'} Going
        </button>
        <button
          onClick={() => handleRsvp('maybe')}
          disabled={isPending}
          className={`button ${status === 'maybe' ? 'primary' : 'secondary'}`}
          aria-label="RSVP as maybe"
        >
          {isPending && status === 'maybe' ? <LoadingSpinner size="small" /> : '?'} Maybe
        </button>
        <button
          onClick={() => handleRsvp('not_going')}
          disabled={isPending}
          className={`button ${status === 'not_going' ? 'danger' : 'secondary'}`}
          aria-label="RSVP as not going"
        >
          {isPending && status === 'not_going' ? <LoadingSpinner size="small" /> : '✗'} Can&apos;t Go
        </button>
      </div>
    </div>
  )
}

// Made with Bob
