'use client'

import { useState, useTransition, useEffect } from 'react'
import { toggleMinistryMembership } from './actions'
import { LoadingSpinner } from '@/app/components/loading'
import type { Ministry } from '@/lib/supabase/types'

interface MinistryCardProps {
  ministry: Ministry
  isMember: boolean
  memberRole: 'member' | 'leader' | null
}

export function MinistryCard({ ministry, isMember: initialIsMember, memberRole }: MinistryCardProps) {
  const [isPending, startTransition] = useTransition()
  const [isMember, setIsMember] = useState(initialIsMember)
  const [message, setMessage] = useState<string | null>(null)

  // Sync local state with prop when it changes (e.g., after navigation)
  useEffect(() => {
    setIsMember(initialIsMember)
  }, [initialIsMember])

  function handleToggleMembership() {
    startTransition(async () => {
      const result = await toggleMinistryMembership(ministry.id, !isMember)
      
      if (result.success) {
        setIsMember(!isMember)
        setMessage(result.data)
        setTimeout(() => setMessage(null), 2000)
      } else {
        setMessage(result.error)
        setTimeout(() => setMessage(null), 5000)
      }
    })
  }

  return (
    <article className="ministry-card">
      <div className="ministry-card-header">
        <div>
          <h3>{ministry.name}</h3>
          {memberRole === 'leader' && (
            <span className="ministry-badge">Leader</span>
          )}
        </div>
        <button
          onClick={handleToggleMembership}
          disabled={isPending || memberRole === 'leader'}
          className={`button ${isMember ? 'secondary' : 'primary'}`}
          aria-label={isMember ? 'Leave ministry' : 'Join ministry'}
        >
          {isPending ? (
            <LoadingSpinner size="small" />
          ) : isMember ? (
            'Leave'
          ) : (
            'Join'
          )}
        </button>
      </div>
      
      {ministry.description && (
        <p>{ministry.description}</p>
      )}

      {(ministry.meeting_day || ministry.meeting_time || ministry.meeting_location) && (
        <div className="ministry-schedule">
          <strong>Meeting Schedule:</strong>
          <p>
            {ministry.meeting_day && <span>{ministry.meeting_day}</span>}
            {ministry.meeting_time && <span> at {ministry.meeting_time}</span>}
            {ministry.meeting_location && <span> • {ministry.meeting_location}</span>}
          </p>
        </div>
      )}

      {message && (
        <span className={message.includes('success') ? 'rsvp-success' : 'rsvp-error'}>
          {message}
        </span>
      )}
    </article>
  )
}

// Made with Bob
