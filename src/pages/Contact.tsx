import { Link } from 'react-router-dom'
import { PolicyPage, PolicySection } from '@/components/policy/PolicyPage'
import { PUBLIC_CONTACT } from '@/data/site'

export default function Contact() {
  return (
    <PolicyPage
      eyebrow="Say hello"
      title="Contact"
      titleAccent="the preview."
      intro="The single public route for preview feedback, corrections, and trust questions. There is no contact form."
      showVersion={false}
    >
      <PolicySection heading="Email">
        <p>
          <a className="font-accent text-ink hover:text-primary hover:underline" href={`mailto:${PUBLIC_CONTACT}`}>
            {PUBLIC_CONTACT}
          </a>
        </p>
        <p>
          Use this address for preview feedback, a potential factual or food-safety issue, or a
          privacy and trust question. The preview has no published response-time commitment or
          formal privacy-rights workflow.
        </p>
      </PolicySection>

      <PolicySection heading="Helpful context">
        <p>
          For a content concern, include the page address and the specific statement or step. For a
          technical issue, include the browser or device, what happened, and steps that reproduce
          it. Do not send passwords, payment details, government identifiers, health information,
          or other sensitive information by email.
        </p>
      </PolicySection>

      <PolicySection heading="Before public launch">
        <p>
          The operator identity, mailing address, jurisdiction, and formal privacy process are not
          yet published. Until they are, this contact route is a preview-feedback channel rather
          than a substitute for a final legal or privacy notice. See the{' '}
          <Link className="text-primary hover:underline" to="/privacy">
            privacy preview
          </Link>{' '}
          and{' '}
          <Link className="text-primary hover:underline" to="/editorial-policy">
            editorial policy
          </Link>
          .
        </p>
      </PolicySection>
    </PolicyPage>
  )
}
