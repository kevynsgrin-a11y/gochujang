import { Link } from 'react-router-dom'
import { PolicyPage, PolicySection } from '@/components/policy/PolicyPage'
import { PREVIEW_STATUS, PUBLIC_CONTACT } from '@/data/site'

export default function Terms() {
  return (
    <PolicyPage
      eyebrow="Governance"
      title="Preview"
      titleAccent="terms."
      intro="A status notice for using the current no-collection preview; final terms of use have not yet been published."
    >
      <PolicySection heading="Preview only">
        <p>
          {PREVIEW_STATUS.description} The preview is provided for evaluation and should not be
          treated as a finished consumer service or a record of cooking activity.
        </p>
      </PolicySection>

      <PolicySection heading="No recipe procedure is published">
        <p>
          Every dish is an editorial draft. Ingredient quantities and method steps are withheld
          until documented test-kitchen, food-safety, cultural, and editorial review is complete.
          A dish page is not a cooking procedure or food-safety instruction.
        </p>
        <p>
          Do not use this preview to begin, manage, or assess a ferment. See the{' '}
          <Link className="text-primary hover:underline" to="/editorial-policy">
            editorial policy
          </Link>{' '}
          for the evidence required before a procedure can be released.
        </p>
      </PolicySection>

      <PolicySection heading="No professional or safety advice">
        <p>
          Nothing here is medical, nutritional, or allergen advice. Ingredient lists may be
          incomplete and do not identify every allergen or cross-contamination risk. If you cook for
          someone with an allergy or a medical dietary requirement, verify every ingredient
          yourself.
        </p>
      </PolicySection>

      <PolicySection heading="Preview interactions">
        <p>
          Mise — batches, streaks, and the Flavor Passport — is a demonstration running on sample
          data. It is not an account, it does not persist your activity, and it should not be relied
          on as a record of anything.
        </p>
        <p>Newsletter signup is unavailable; no email address is requested by the application.</p>
      </PolicySection>

      <PolicySection heading="Content status">
        <p>
          Do not republish, market, or present any draft as kitchen-tested. Licensing, ownership,
          media rights, and commercial-use terms have not been published for this preview.
        </p>
      </PolicySection>

      <PolicySection heading="What must be published before launch">
        <p>
          Final terms require an approved legal operator, contact and mailing details, governing
          jurisdiction, effective date, rights and licence terms, and any applicable limits or
          dispute process. None of those facts is represented as established on this preview page.
        </p>
      </PolicySection>

      <PolicySection heading="Contact">
        <p>
          Questions about this preview status go to{' '}
          <a className="text-primary hover:underline" href={`mailto:${PUBLIC_CONTACT}`}>
            {PUBLIC_CONTACT}
          </a>
          . For the public contact route, visit{' '}
          <Link className="text-primary hover:underline" to="/contact">
            /contact
          </Link>
          .
        </p>
      </PolicySection>
    </PolicyPage>
  )
}
