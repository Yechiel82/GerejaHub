'use client'

import { useState, useTransition } from 'react'
import { toggleGroupMembership } from './actions'
import { LoadingSpinner } from '@/app/components/loading'
import type { SmallGroup } from '@/lib/supabase/types'

interface GroupCardProps {
  group: SmallGroup
  isMember: boolean
  memberCount: number
  isFull: boolean
}

export function GroupCard({ group, isMember: initialIsMember, memberCount, isFull }: GroupCardProps) {
  const [isPending, startTransition] = useTransition()
  const [isMember, setIsMember] = useState(initialIsMember)
  const [message, setMessage] = useState<string | null>(null)

  function handleToggleMembership() {
    if (isFull && !isMember) {
      setMessage('This group is full')
      setTimeout(() => setMessage(null), 3000)
      return
    }

    startTransition(async () => {
      const result = await toggleGroupMembership(group.id, !isMember)
      
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
    <article className="group-card">
      <div className="group-card-header">
        <div>
          <h3>{group.name}</h3>
          <div className="group-meta">
            <span className="group-count">
              👥 {memberCount}/{group.max_members} members
            </span>
            {isFull && !isMember && (
              <span className="group-badge full">Full</span>
            )}
            {!group.is_open && (
              <span className="group-badge closed">Closed</span>
            )}
          </div>
        </div>
      </div>
      
      {group.description && (
        <p className="group-description">{group.description}</p>
      )}

      {(group.meeting_day || group.meeting_time || group.location) && (
        <div className="group-schedule">
          <strong>Meeting Schedule:</strong>
          <p>
            {group.meeting_day && <span>📅 {group.meeting_day}</span>}
            {group.meeting_time && <span> at {group.meeting_time}</span>}
          </p>
          {group.location && (
            <p>📍 {group.location}</p>
          )}
        </div>
      )}

      <div className="group-actions">
        <button
          onClick={handleToggleMembership}
          disabled={isPending || (!group.is_open && !isMember) || (isFull && !isMember)}
          className={`button ${isMember ? 'secondary' : 'primary'}`}
          aria-label={isMember ? 'Leave group' : 'Join group'}
        >
          {isPending ? (
            <LoadingSpinner size="small" />
          ) : isMember ? (
            'Leave Group'
          ) : isFull ? (
            'Group Full'
          ) : (
            'Join Group'
          )}
        </button>
      </div>

      {message && (
        <span className={message.includes('success') || message.includes('Successfully') ? 'message-success' : 'message-error'}>
          {message}
        </span>
      )}

      <style jsx>{`
        .group-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .group-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .group-card h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
        }

        .group-meta {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .group-count {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .group-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .group-badge.full {
          background: #fef3c7;
          color: #92400e;
        }

        .group-badge.closed {
          background: #fee2e2;
          color: #991b1b;
        }

        .group-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .group-schedule {
          padding: 1rem;
          background: var(--bg);
          border-radius: 6px;
          font-size: 0.875rem;
        }

        .group-schedule strong {
          display: block;
          margin-bottom: 0.5rem;
        }

        .group-schedule p {
          margin: 0.25rem 0;
          color: var(--text-secondary);
        }

        .group-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
        }

        .group-actions button {
          flex: 1;
        }

        .message-success {
          display: block;
          padding: 0.75rem;
          background: #d1fae5;
          color: #065f46;
          border-radius: 6px;
          font-size: 0.875rem;
          text-align: center;
        }

        .message-error {
          display: block;
          padding: 0.75rem;
          background: #fee2e2;
          color: #991b1b;
          border-radius: 6px;
          font-size: 0.875rem;
          text-align: center;
        }
      `}</style>
    </article>
  )
}

// Made with Bob