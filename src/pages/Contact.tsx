import { PolicyPage, PolicySection } from '@/components/policy/PolicyPage'
import { CONTACT } from '@/data/seo.js'

const LINES = [
  {
    heading: 'General enquiries',
    address: CONTACT.general,
    body: 'Questions, feedback on a dish, or anything about the site itself.',
  },
  {
    heading: 'Corrections',
    address: CONTACT.corrections,
    body: 'Spotted a wrong quantity, an unsafe step, or a cultural mischaracterisation? Tell us and we will correct it with a visible revision note.',
  },
  {
    heading: 'Security',
    address: CONTACT.security,
    body: 'Report a vulnerability or anything that looks like a security problem. Please include steps to reproduce.',
  },
]

export default function Contact() {
  return (
    <PolicyPage
      eyebrow="Say hello"
      title="Contact"
      titleAccent="us."
      intro="Real inboxes, read by a human. No contact form, no tracking pixel."
      showVersion={false}
    >
      {LINES.map((l) => (
        <PolicySection key={l.address + l.heading} heading={l.heading}>
          <p>{l.body}</p>
          <p>
            <a
              className="font-accent text-ink hover:text-primary hover:underline"
              href={`mailto:${l.address}`}
            >
              {l.address}
            </a>
          </p>
        </PolicySection>
      ))}

      <PolicySection heading="Response times">
        <p>
          Gochujang is a small independent publication. We aim to answer within a few working days,
          and to act on food-safety corrections the same day we can verify them.
        </p>
      </PolicySection>
    </PolicyPage>
  )
}
