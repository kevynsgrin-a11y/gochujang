import { Link } from 'react-router-dom'
import { PolicyPage, PolicySection } from '@/components/policy/PolicyPage'
import { PREVIEW_STATUS, PUBLIC_CONTACT } from '@/data/site'

export default function Privacy() {
  return (
    <PolicyPage
      eyebrow="Governance"
      title="Privacy"
      titleAccent="preview."
      intro="A transparent status notice for the current preview, not a substitute for a final privacy policy."
    >
      <PolicySection heading="Current preview status">
        <p>
          {PREVIEW_STATUS.description} Newsletter signup is disabled. The Kitchen is an illustrative
          interface, not an account or record-keeping service.
        </p>
        <p>
          This preview is not a request for personal information. Please do not enter sensitive
          information into a preview feature or send it by email.
        </p>
      </PolicySection>

      <PolicySection heading="Browser settings">
        <p>
          If you choose a color theme, the application may store that preference in your browser
          under <code className="font-accent text-ink">gochujang-theme</code>. You can remove it
          through your browser’s site-data controls. This page does not make an unverified claim
          about platform-level cookies, headers, or browser features outside the application.
        </p>
      </PolicySection>

      <PolicySection heading="Measurement">
        <p>
          This preview uses Google Analytics 4 to measure aggregate traffic — pages viewed,
          approximate location, and device type. Google sets cookies (
          <code className="font-accent text-ink">_ga</code>,{' '}
          <code className="font-accent text-ink">_ga_*</code>) in your browser to do this.
          Google’s handling of this data is described in the{' '}
          <a className="text-primary hover:underline" href="https://policies.google.com/privacy">
            Google Privacy Policy
          </a>
          , and you can opt out with Google’s{' '}
          <a className="text-primary hover:underline" href="https://tools.google.com/dlpage/gaoptout">
            Google Analytics opt-out browser add-on
          </a>
          . The site also uses Cloudflare Web Analytics, which is cookieless and reports
          aggregate traffic only.
        </p>
      </PolicySection>

      <PolicySection heading="Hosting, measurement, and third parties">
        <p>
          A final register of hosting providers, edge services, analytics, third-party assets,
          cookies, retention periods, and international transfers has not been approved for
          publication. This preview should not be understood as consent to future measurement,
          advertising, newsletter, or account operations.
        </p>
        <p>
          Before any personal information is collected or optional measurement is enabled, the
          published privacy policy must identify the operator, purpose, lawful basis where
          applicable, recipients, retention, choices, and a rights-request process.
        </p>
      </PolicySection>

      <PolicySection heading="What is not published yet">
        <p>
          The legal operator or controller, postal address, governing jurisdiction, formal
          effective date, retention schedule, and privacy-rights workflow have not been supplied
          for publication. Those facts are required before this can become a final privacy policy.
        </p>
      </PolicySection>

      <PolicySection heading="Contact">
        <p>
          For preview feedback or a question about this status notice, email{' '}
          <a className="text-primary hover:underline" href={`mailto:${PUBLIC_CONTACT}`}>
            {PUBLIC_CONTACT}
          </a>
          . The route for this contact channel is available at{' '}
          <Link className="text-primary hover:underline" to="/contact">
            /contact
          </Link>
          .
        </p>
      </PolicySection>
    </PolicyPage>
  )
}
