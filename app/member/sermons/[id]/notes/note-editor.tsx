'use client'

import { useState, useEffect, useCallback } from 'react'
import { saveNote } from './actions'
import { LoadingSpinner } from '@/app/components/loading'

interface NoteEditorProps {
  sermonId: string
  initialContent: string
  noteId?: string
}

export function NoteEditor({ sermonId, initialContent, noteId }: NoteEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Auto-save function
  const autoSave = useCallback(async (text: string) => {
    if (text.trim().length === 0) return

    setIsSaving(true)
    const result = await saveNote(sermonId, text, noteId)
    
    if (result.success) {
      setLastSaved(new Date())
      setMessage(null)
    } else {
      setMessage(result.error)
    }
    
    setIsSaving(false)
  }, [sermonId, noteId])

  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== initialContent) {
        autoSave(content)
      }
    }, 2000) // Save 2 seconds after user stops typing

    return () => clearTimeout(timer)
  }, [content, initialContent, autoSave])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value)
  }

  function formatLastSaved() {
    if (!lastSaved) return ''
    const now = new Date()
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000)
    
    if (diff < 60) return 'Saved just now'
    if (diff < 3600) return `Saved ${Math.floor(diff / 60)} minutes ago`
    return `Saved at ${lastSaved.toLocaleTimeString()}`
  }

  return (
    <div className="note-editor">
      <div className="editor-header">
        <h3>My Notes</h3>
        <div className="editor-status">
          {isSaving ? (
            <>
              <LoadingSpinner size="small" />
              <span>Saving...</span>
            </>
          ) : lastSaved ? (
            <span className="saved-indicator">✓ {formatLastSaved()}</span>
          ) : null}
        </div>
      </div>

      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Start taking notes... Your notes will auto-save as you type.

Tips:
• Write down key points from the sermon
• Note scripture references
• Record questions or insights
• Add personal applications"
        className="note-textarea"
      />

      {message && (
        <div className="error-message">{message}</div>
      )}

      <div className="editor-footer">
        <p className="editor-hint">
          💡 Your notes are private and only visible to you
        </p>
        <p className="word-count">
          {content.trim().split(/\s+/).filter(Boolean).length} words
        </p>
      </div>

    </div>
  )
}

// Made with Bob