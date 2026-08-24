import { Link } from 'react-router-dom'
import { PolicyPage, PolicySection } from '@/components/policy/PolicyPage'
import { PUBLIC_CONTACT } from '@/data/site'

const TEST_CHECKLIST = [
  'Tested by, and the date tested',
  'Equipment used',
  'Internal temperature, where meat, seafood, eggs, or dairy are involved',
  'Fermentation temperature range and salt percentage, for any ferment',
  'Storage time and temperature',
  'Discard-if signs — the specific things that mean a batch is not safe',
  'Allergens present',
  'Substitutions that were actually tried',
]

export default function EditorialPolicy() {
  return (
    <PolicyPage
      eyebrow="Governance"
      title="Editorial"
      titleAccent="preview."
      intro="The release standard for recipes and editorial claims. It is not a claim that the current drafts have completed that work."
    >
      <PolicySection heading="Current status">
        <p>
          Every recipe currently on this site is an editorial draft that has not been
          kitchen-tested. It must not be read as a proven method, used as food-safety guidance, or
          represented as an approved recipe.
        </p>
        <p>
          The Kitchen is a sample-data preview, and{' '}
          <Link className="text-primary hover:underline" to="/kitchen">
            its output
          </Link>{' '}
          is not evidence that a visitor has prepared or tested a dish.
        </p>
      </PolicySection>

      <PolicySection heading="Release standard for a tested recipe">
        <p>Before a recipe loses its draft badge, it has to record all of the following:</p>
        <ul className="ml-5 list-disc space-y-2">
          {TEST_CHECKLIST.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          Fields are filled with what was actually observed in a kitchen. We do not fill them with
          generic text to make a page look complete.
        </p>
      </PolicySection>

      <PolicySection heading="Evidence and review">
        <p>
          A tested release must identify the author, test cook, editorial reviewer, and relevant
          food-safety and Korean-language or cultural reviewers. Factual, historical, and cultural
          claims require sources; food-safety guidance requires current authoritative references.
          None of these fields should be inferred from a polished page or generated to fill a gap.
        </p>
      </PolicySection>

      <PolicySection heading="Corrections and safety concerns">
        <p>
          If you spot a potentially unsafe step, inaccurate quantity, unsupported claim, or
          cultural mischaracterisation, email{' '}
          <a className="text-primary hover:underline" href={`mailto:${PUBLIC_CONTACT}`}>
            {PUBLIC_CONTACT}
          </a>
          . Include the page address and the specific concern. The preview has not published a
          correction-service-level commitment; no accuracy or response promise is implied.
        </p>
      </PolicySection>

      <PolicySection heading="Commercial and disclosure standard">
        <p>
          This preview must not represent paid placement, affiliate recommendations, sponsorship,
          or endorsements as editorial testing. Any future commercial relationship needs a clear,
          adjacent disclosure before publication.
        </p>
      </PolicySection>

      <PolicySection heading="Accountability before launch">
        <p>
          The named publisher, legal operator, editorial owner, reviewer profiles, and formal
          publication process have not yet been supplied for publication. Those details are
          required before a draft is promoted to a tested public recipe. Preview feedback can be
          sent to{' '}
          <a className="text-primary hover:underline" href={`mailto:${PUBLIC_CONTACT}`}>
            {PUBLIC_CONTACT}
          </a>
          .
        </p>
      </PolicySection>
    </PolicyPage>
  )
}
