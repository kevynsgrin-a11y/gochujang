import { Link } from 'react-router-dom'
import { PolicyPage, PolicySection } from '@/components/policy/PolicyPage'
import { CONTACT } from '@/data/seo.js'

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
      titleAccent="policy."
      intro="How a recipe gets from draft to tested, who is accountable for it, and how we fix what we get wrong."
    >
      <PolicySection heading="Our standard">
        <p>
          Every recipe is reviewed for ingredient accuracy, food safety, cultural context, and
          reproducibility before it is marked tested. We identify the tester and test date, link to
          primary or authoritative sources where claims are made, and correct errors with a visible
          revision note.
        </p>
      </PolicySection>

      <PolicySection heading="Where we are right now">
        <p>
          We are not there yet, and we would rather say so than imply otherwise. Every recipe
          currently on this site is an editorial draft that has not been kitchen-tested. Each one
          carries that disclosure on its own page. No recipe here should be read as a proven
          method.
        </p>
        <p>
          Photography is placeholder imagery from a third-party service while original photography
          is commissioned, and{' '}
          <Link className="text-primary hover:underline" to="/kitchen">
            the Kitchen
          </Link>{' '}
          is a preview running on sample data.
        </p>
      </PolicySection>

      <PolicySection heading="What a tested recipe must carry">
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

      <PolicySection heading="Sourcing">
        <p>
          Where a recipe makes a factual, historical, or cultural claim, it cites a primary or
          authoritative source. Food-safety guidance is anchored to current public-health guidance
          rather than to our own judgement, and we date it so you can tell how fresh it is.
        </p>
      </PolicySection>

      <PolicySection heading="Corrections">
        <p>
          If something here is wrong — a quantity, a temperature, a technique, a cultural framing —
          write to{' '}
          <a className="text-primary hover:underline" href={`mailto:${CONTACT.corrections}`}>
            {CONTACT.corrections}
          </a>
          . Safety errors are acted on as soon as we can verify them. Corrections appear on the page
          itself as a dated revision note; we do not quietly edit and move on.
        </p>
      </PolicySection>

      <PolicySection heading="Independence">
        <p>
          There are currently no ads, affiliate links, sponsored placements, or paid rankings on
          this site. If that changes, any commercial relationship will be disclosed in plain
          language directly above the module it applies to, paid links will be marked as sponsored,
          and recommendations will remain editorial rather than purchased.
        </p>
      </PolicySection>

      <PolicySection heading="Who is accountable">
        <p>
          The Gochujang editorial desk owns this policy and every recipe published under it. It is
          reachable at{' '}
          <a className="text-primary hover:underline" href={`mailto:${CONTACT.general}`}>
            {CONTACT.general}
          </a>
          .
        </p>
      </PolicySection>
    </PolicyPage>
  )
}
