import { useState } from "react";
import { FaArrowRight, FaCheck, FaEnvelope } from "react-icons/fa";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  function handleSubmit(event) { event.preventDefault(); if (email.trim()) setSubscribed(true); }

  return <section className="newsletter-section">
    <div className="section-inner">
      <div className="newsletter-card">
        <div className="newsletter-card__copy"><span className="newsletter-icon"><FaEnvelope /></span><p className="section-label">RunCrew updates</p><h2>Never miss your next start line.</h2><p>Get early access to new races, registration reminders, and official result announcements — only the updates that matter.</p></div>
        <div className="newsletter-card__form">
          {subscribed ? <div className="newsletter-success"><span><FaCheck /></span><div><h3>You’re on the list.</h3><p>We’ll send the next race update to {email}.</p></div></div> : <><h3>Stay in the loop</h3><p>One thoughtful email when there is something worth knowing.</p><form onSubmit={handleSubmit}><label className="sr-only" htmlFor="newsletter-email">Email address</label><div className="newsletter-input"><input id="newsletter-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /><button type="submit" aria-label="Subscribe"><FaArrowRight /></button></div><small>No spam. Unsubscribe whenever you like.</small></form></>}
        </div>
      </div>
    </div>
  </section>;
}
