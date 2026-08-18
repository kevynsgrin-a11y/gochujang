import { Link } from 'react-router-dom'
import { PolicyPage, PolicySection } from '@/components/policy/PolicyPage'
import { CONTACT } from '@/data/seo.js'

export default function Terms() {
  return (
    <PolicyPage
      eyebrow="Governance"
      title="Terms of"
      titleAccent="use."
      intro="The ground rules for using Gochujang — including what the recipes are, and what they are not."
    >
      <PolicySection heading="What this site is">
        <p>
          Gochujang is an editorial publication about Korean-forward, fire-forward cooking. Using
          the site means accepting these terms. If you do not accept them, please do not use the
          site.
        </p>
      </PolicySection>

      <PolicySection heading="Recipes are editorial drafts">
        <p>
          Every recipe currently published here is an editorial draft. It has not been
          kitchen-tested, and it is offered as a starting point rather than a proven method. Times,
          temperatures, quantities, and yields are estimates. You are responsible for the food you
          cook and serve.
        </p>
        <p>
          Cook to safe internal temperatures, handle raw meat, seafood, eggs, and dairy according to
          the food-safety guidance that applies where you live, and treat any fermentation project
          with particular care. See our{' '}
          <Link className="text-primary hover:underline" to="/editorial-policy">
            editorial policy
          </Link>{' '}
          for how recipes move from draft to tested.
        </p>
      </PolicySection>

      <PolicySection heading="No professional advice">
        <p>
          Nothing here is medical, nutritional, or allergen advice. Ingredient lists may be
          incomplete and do not identify every allergen or cross-contamination risk. If you cook for
          someone with an allergy or a medical dietary requirement, verify every ingredient
          yourself.
        </p>
      </PolicySection>

      <PolicySection heading="The Kitchen is a preview">
        <p>
          Mise — batches, streaks, and the Flavor Passport — is a demonstration running on sample
          data. It is not an account, it does not persist your activity, and it should not be relied
          on as a record of anything.
        </p>
      </PolicySection>

      <PolicySection heading="Content and acceptable use">
        <p>
          The text, design, brand marks, and code of this site belong to Gochujang. You are welcome
          to cook from the recipes, print them for your own kitchen, and quote short passages with a
          link. Republishing pages wholesale, or scraping the site to train or populate another
          product, is not permitted.
        </p>
        <p>
          Photography is presently supplied by a third-party placeholder image service and is not
          ours to license onward.
        </p>
      </PolicySection>

      <PolicySection heading="Availability and liability">
        <p>
          The site is provided as-is, without warranty, and may change or go offline without notice.
          To the fullest extent the law allows, Gochujang is not liable for loss arising from use of
          the site or the recipes on it.
        </p>
      </PolicySection>

      <PolicySection heading="Contact">
        <p>
          Questions about these terms go to{' '}
          <a className="text-primary hover:underline" href={`mailto:${CONTACT.general}`}>
            {CONTACT.general}
          </a>
          .
        </p>
      </PolicySection>
    </PolicyPage>
  )
}
