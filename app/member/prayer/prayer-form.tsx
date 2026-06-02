'use client'

import { useState } from 'react'
import { submitPrayerRequest } from '../actions'

interface PrayerFormProps {
  defaultName: string
  saved?: string
  error?: string
}

export function PrayerForm({ defaultName, saved, error }: PrayerFormProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <h2>Your Requests</h2>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="button secondary small"
          type="button"
        >
          {isOpen ? '− Close Form' : '+ New Request'}
        </button>
      </div>
      
      {isOpen && (
        <>
          {saved ? <p className="form-success">Prayer request submitted.</p> : null}
          {error ? <p className="form-error">{error}</p> : null}
          <form className="admin-form" action={submitPrayerRequest}>
            <label>
              Name
              <input name="name" defaultValue={defaultName} />
            </label>
            <label>
              Visibility
              <select name="visibility" defaultValue="private">
                <option value="private">Private to leaders</option>
                <option value="church">Share with church</option>
              </select>
            </label>
            <label>
              Request
              <textarea name="request" rows={5} required />
            </label>
            <button className="button primary" type="submit">
              Submit Prayer Request
            </button>
          </form>
        </>
      )}
    </section>
  )
}

// Made with Bob
