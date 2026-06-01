'use client'

import { useState, useTransition } from 'react'
import { submitContactMessage } from '@/app/actions/contact'
import { LoadingSpinner } from './loading'

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setErrors({})

    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await submitContactMessage(formData)

      if (result.success) {
        setMessage({ type: 'success', text: result.data })
        event.currentTarget.reset()
      } else {
        setMessage({ type: 'error', text: result.error })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {message && (
        <div className={message.type === 'success' ? 'form-success' : 'form-error'} role="alert">
          {message.text}
        </div>
      )}

      <label htmlFor="contact-name">
        Name
        <input
          id="contact-name"
          name="name"
          placeholder="Your name"
          required
          disabled={isPending}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" className="field-error" role="alert">
            {errors.name}
          </span>
        )}
      </label>

      <label htmlFor="contact-email">
        Email
        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          disabled={isPending}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" className="field-error" role="alert">
            {errors.email}
          </span>
        )}
      </label>

      <label htmlFor="contact-message">
        Message
        <textarea
          id="contact-message"
          name="message"
          placeholder="How can we help?"
          rows={5}
          required
          disabled={isPending}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <span id="message-error" className="field-error" role="alert">
            {errors.message}
          </span>
        )}
      </label>

      <button className="button primary" type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <LoadingSpinner size="small" />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  )
}

// Made with Bob
