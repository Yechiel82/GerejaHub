import { validateEmail, validateContactForm } from '../validation'

describe('validateEmail', () => {
  it('should validate correct email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true)
    expect(validateEmail('user.name@domain.co.uk')).toBe(true)
  })

  it('should reject invalid email addresses', () => {
    expect(validateEmail('invalid')).toBe(false)
    expect(validateEmail('test@')).toBe(false)
    expect(validateEmail('@example.com')).toBe(false)
    expect(validateEmail('')).toBe(false)
  })

  it('should reject emails that are too long', () => {
    const longEmail = 'a'.repeat(256) + '@example.com'
    expect(validateEmail(longEmail)).toBe(false)
  })
})

describe('validateContactForm', () => {
  it('should validate a correct form', () => {
    const formData = new FormData()
    formData.append('name', 'John Doe')
    formData.append('email', 'john@example.com')
    formData.append('message', 'This is a test message')

    const result = validateContactForm(formData)
    expect(result.isValid).toBe(true)
    expect(Object.keys(result.errors)).toHaveLength(0)
  })

  it('should reject empty name', () => {
    const formData = new FormData()
    formData.append('name', '')
    formData.append('email', 'john@example.com')
    formData.append('message', 'This is a test message')

    const result = validateContactForm(formData)
    expect(result.isValid).toBe(false)
    expect(result.errors.name).toBeDefined()
  })

  it('should reject invalid email', () => {
    const formData = new FormData()
    formData.append('name', 'John Doe')
    formData.append('email', 'invalid-email')
    formData.append('message', 'This is a test message')

    const result = validateContactForm(formData)
    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBeDefined()
  })

  it('should reject message that is too short', () => {
    const formData = new FormData()
    formData.append('name', 'John Doe')
    formData.append('email', 'john@example.com')
    formData.append('message', 'Short')

    const result = validateContactForm(formData)
    expect(result.isValid).toBe(false)
    expect(result.errors.message).toBeDefined()
  })
})

// Made with Bob
