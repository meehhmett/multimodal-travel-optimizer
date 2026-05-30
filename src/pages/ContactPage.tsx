import { useState } from 'react'

export function ContactPage() {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <main className="text-page">
      <h1>Contact and feedback</h1>
      <p>Send feedback about routes, data clarity, or usability. This form is local-only for now and does not store data.</p>
      <form
        className="contact-form"
        onSubmit={(event) => {
          event.preventDefault()
          if (!message.trim()) return
          setSent(true)
        }}
      >
        <label>
          Name optional
          <input name="name" />
        </label>
        <label>
          Email optional
          <input name="email" type="email" />
        </label>
        <label>
          Message
          <textarea required value={message} onChange={(event) => setMessage(event.target.value)} />
        </label>
        <button type="submit" className="primary-cta">Send feedback</button>
      </form>
      {sent && <p className="success-message">Thanks. Your feedback is ready to send when a backend is connected.</p>}
      <a className="mailto-link" href={`mailto:hello@example.com?subject=RouteWeave feedback&body=${encodeURIComponent(message)}`}>
        Open email instead
      </a>
    </main>
  )
}
