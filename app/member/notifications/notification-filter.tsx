'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NotificationFilterProps {
  currentType: string
  counts: {
    all: number
    event: number
    prayer: number
    ministry: number
    sermon: number
    announcement: number
  }
}

const filters = [
  { type: 'all', label: 'All', icon: '📬' },
  { type: 'event', label: 'Events', icon: '📅' },
  { type: 'prayer', label: 'Prayer', icon: '🙏' },
  { type: 'ministry', label: 'Ministry', icon: '⛪' },
  { type: 'sermon', label: 'Sermons', icon: '🎧' },
  { type: 'announcement', label: 'Announcements', icon: '📢' },
]

export function NotificationFilter({ currentType, counts }: NotificationFilterProps) {
  const pathname = usePathname()

  return (
    <div className="notification-filter">
      {filters.map((filter) => {
        const count = counts[filter.type as keyof typeof counts] || 0
        const isActive = currentType === filter.type

        return (
          <Link
            key={filter.type}
            href={`${pathname}?type=${filter.type}`}
            className={`filter-button ${isActive ? 'active' : ''}`}
          >
            <span className="filter-icon">{filter.icon}</span>
            <span className="filter-label">{filter.label}</span>
            {count > 0 && <span className="filter-count">{count}</span>}
          </Link>
        )
      })}

      <style jsx>{`
        .notification-filter {
          display: flex;
          gap: 0.5rem;
          margin: 1.5rem 0;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .filter-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          text-decoration: none;
          color: var(--text);
          font-size: 0.875rem;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .filter-button:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
        }

        .filter-button.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .filter-icon {
          font-size: 1.25rem;
        }

        .filter-count {
          display: inline-block;
          padding: 0.125rem 0.5rem;
          background: var(--bg);
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          min-width: 24px;
          text-align: center;
        }

        .filter-button.active .filter-count {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        @media (max-width: 768px) {
          .filter-label {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

// Made with Bob