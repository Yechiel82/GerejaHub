'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { markAsRead, deleteNotification } from './actions'
import { LoadingSpinner } from '@/app/components/loading'
import { formatDisplayDate } from '@/lib/data/content'
import type { Notification } from '@/lib/supabase/types'

interface NotificationItemProps {
  notification: Notification
}

const typeIcons: Record<string, string> = {
  event: '📅',
  prayer: '🙏',
  ministry: '⛪',
  sermon: '🎧',
  announcement: '📢',
  birthday: '🎂',
}

const typeColors: Record<string, string> = {
  event: '#3b82f6',
  prayer: '#8b5cf6',
  ministry: '#10b981',
  sermon: '#f59e0b',
  announcement: '#ef4444',
  birthday: '#ec4899',
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const [isPending, startTransition] = useTransition()
  const [isRead, setIsRead] = useState(notification.read)
  const [isDeleted, setIsDeleted] = useState(false)

  function handleMarkAsRead() {
    if (isRead) return

    startTransition(async () => {
      const result = await markAsRead(notification.id)
      if (result.success) {
        setIsRead(true)
      }
    })
  }

  function handleDelete() {
    if (!confirm('Delete this notification?')) return

    startTransition(async () => {
      const result = await deleteNotification(notification.id)
      if (result.success) {
        setIsDeleted(true)
      }
    })
  }

  if (isDeleted) {
    return null
  }

  const icon = typeIcons[notification.type] || '📬'
  const color = typeColors[notification.type] || '#6b7280'

  const content = (
    <article 
      className={`notification-item ${isRead ? 'read' : 'unread'}`}
      onClick={handleMarkAsRead}
    >
      <div className="notification-icon" style={{ backgroundColor: `${color}20`, color }}>
        {icon}
      </div>
      
      <div className="notification-content">
        <div className="notification-header">
          <h4>{notification.title}</h4>
          {!isRead && <span className="unread-dot"></span>}
        </div>
        <p>{notification.message}</p>
        <span className="notification-time">
          {formatDisplayDate(notification.created_at)}
        </span>
      </div>

      <div className="notification-actions">
        {isPending ? (
          <LoadingSpinner size="small" />
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleDelete()
            }}
            className="delete-button"
            aria-label="Delete notification"
          >
            ×
          </button>
        )}
      </div>

      <style jsx>{`
        .notification-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          color: inherit;
        }

        .notification-item:hover {
          border-color: var(--primary);
          transform: translateX(4px);
        }

        .notification-item.unread {
          background: var(--bg);
          border-left: 3px solid var(--primary);
        }

        .notification-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .notification-header h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .unread-dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .notification-content p {
          margin: 0 0 0.5rem 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .notification-time {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .notification-actions {
          display: flex;
          align-items: flex-start;
        }

        .delete-button {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 1.5rem;
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .delete-button:hover {
          background: var(--error);
          color: white;
        }
      `}</style>
    </article>
  )

  if (notification.link) {
    return <Link href={notification.link}>{content}</Link>
  }

  return content
}

// Made with Bob