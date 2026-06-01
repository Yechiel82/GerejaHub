export function LoadingSpinner({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizeClasses = {
    small: 'loading-spinner-small',
    medium: 'loading-spinner-medium',
    large: 'loading-spinner-large'
  }

  return (
    <div className={`loading-spinner ${sizeClasses[size]}`} role="status" aria-label="Loading">
      <div className="spinner"></div>
    </div>
  )
}

export function LoadingSkeleton() {
  return (
    <div className="loading-skeleton">
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
    </div>
  )
}

export function PageLoading() {
  return (
    <div className="page-loading">
      <LoadingSpinner size="large" />
      <p>Loading...</p>
    </div>
  )
}

// Made with Bob
