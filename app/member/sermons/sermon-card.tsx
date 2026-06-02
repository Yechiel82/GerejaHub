'use client'

import { useState, useTransition } from 'react'
import { toggleSermonBookmark } from './actions'
import { LoadingSpinner } from '@/app/components/loading'
import { formatDisplayDate } from '@/lib/data/content'
import type { Sermon } from '@/lib/supabase/types'

interface SermonCardProps {
  sermon: Sermon
  isBookmarked: boolean
}

export function SermonCard({ sermon, isBookmarked: initialBookmarked }: SermonCardProps) {
  const [isPending, startTransition] = useTransition()
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [message, setMessage] = useState<string | null>(null)

  function handleBookmark() {
    startTransition(async () => {
      const result = await toggleSermonBookmark(sermon.id, !isBookmarked)
      
      if (result.success) {
        setIsBookmarked(!isBookmarked)
        setMessage(result.data)
        setTimeout(() => setMessage(null), 2000)
      } else {
        setMessage(result.error)
        setTimeout(() => setMessage(null), 5000)
      }
    })
  }

  return (
    <article className="sermon-card">
      <div className="sermon-card-header">
        <div className="sermon-card-content">
          <span className="sermon-date">{formatDisplayDate(sermon.sermon_date)}</span>
          <h3>{sermon.title}</h3>
          <p className="sermon-speaker">{sermon.speaker}</p>
          {sermon.description && <p>{sermon.description}</p>}
          {sermon.scripture_reference && (
            <p className="sermon-scripture">📖 {sermon.scripture_reference}</p>
          )}
        </div>
      </div>
      
      <div className="sermon-actions">
        <button
          onClick={handleBookmark}
          disabled={isPending}
          className={`icon-button ${isBookmarked ? 'active' : ''}`}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark sermon'}
        >
          {isPending ? <LoadingSpinner size="small" /> : isBookmarked ? '★' : '☆'}
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
        
        <a href={`/member/sermons/${sermon.id}/notes`} className="icon-button">
          📝 Notes
        </a>
        
        {(sermon.video_url || sermon.audio_url) && (
          <a
            href={sermon.video_url || sermon.audio_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-button"
          >
            ▶ {sermon.video_url ? 'Watch' : 'Listen'}
          </a>
        )}
      </div>

      {message && (
        <span className={message.includes('success') ? 'rsvp-success' : 'rsvp-error'}>
          {message}
        </span>
      )}
    </article>
  )
}

// Made with Bob
