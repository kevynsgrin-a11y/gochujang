import { PolicyPage, PolicySection } from '@/components/policy/PolicyPage'
import { CONTACT } from '@/data/seo.js'

export default function Privacy() {
  return (
    <PolicyPage
      eyebrow="Governance"
      title="Privacy"
      titleAccent="notice."
      intro="What Gochujang collects, what it does not, and how to reach a human about it."
    >
      <PolicySection heading="The short version">
        <p>
          Gochujang collects only the information needed to operate an explicitly requested
          feature. Theme preference is stored locally in your browser. If analytics or newsletter
          services are enabled, this notice will identify the provider, purpose, data collected,
          retention period, international transfer basis, and how to opt out, access, correct, or
          delete your information.
        </p>
      </PolicySection>

      <PolicySection heading="Who operates this site">
        <p>
          Gochujang is an independently operated editorial site published at gochujang.net. It is
          the data controller for anything described on this page. Reach the operator at{' '}
          <a className="text-primary hover:underline" href={`mailto:${CONTACT.general}`}>
            {CONTACT.general}
          </a>
          . Security reports go to{' '}
          <a className="text-primary hover:underline" href={`mailto:${CONTACT.security}`}>
            {CONTACT.security}
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection heading="What is stored in your browser">
        <p>
          One key, <code className="font-accent text-ink">gochujang-theme</code>, records whether
          you chose the light or dark palette. It stays in your browser's local storage, is never
          transmitted to us, and can be cleared at any time through your browser settings. We set
          no cookies.
        </p>
      </PolicySection>

      <PolicySection heading="Measurement">
        <p>
          We use Cloudflare Web Analytics to measure page performance and traffic patterns. We do
          not use it for advertising profiles.
        </p>
        <p>
          Cloudflare Web Analytics is cookieless and does not fingerprint or track individual
          visitors across sites. It records aggregate page-level signals — such as page path,
          referrer, country, browser family, and loading performance — and is served from
          Cloudflare's global network, which processes data in the United States and other regions
          in which it operates. It is enabled at the network edge for gochujang.net, which means
          the measurement script is added to pages as they are served rather than by the site's own
          code.
        </p>
        <p>
          If you would rather not be measured at all, standard browser tracking protection, an ad
          or script blocker, or a request to{' '}
          <a className="text-primary hover:underline" href={`mailto:${CONTACT.general}`}>
            {CONTACT.general}
          </a>{' '}
          will do it.
        </p>
      </PolicySection>

      <PolicySection heading="Third parties in the page">
        <p>
          Dish photography is currently loaded from an external placeholder image service
          (loremflickr.com) while original photography is commissioned. Your browser contacts that
          service directly to fetch an image, which necessarily discloses your IP address and user
          agent to it. No identifier of ours travels with that request. Fonts are self-hosted; there
          is no third-party font, tag manager, ad network, or social pixel on this site.
        </p>
      </PolicySection>

      <PolicySection heading="The newsletter">
        <p>
          The newsletter field on this site is a design preview. It does not send your address
          anywhere, and nothing you type into it is stored or transmitted. Before it becomes a real
          signup we will publish the provider, the double opt-in flow, the retention schedule, and
          the unsubscribe path here.
        </p>
      </PolicySection>

      <PolicySection heading="The Kitchen">
        <p>
          Mise — the batch timers, streaks, and Flavor Passport — runs entirely on illustrative
          sample data. There are no accounts, no profiles, and no server-side record of anything you
          do on this site. If accounts are introduced, export and deletion will ship with them, and
          this notice will be updated before any real data is collected.
        </p>
      </PolicySection>

      <PolicySection heading="Your rights">
        <p>
          Because we hold no personal data about you, there is normally nothing to access, correct,
          export, or erase. If you believe we hold something about you, write to{' '}
          <a className="text-primary hover:underline" href={`mailto:${CONTACT.general}`}>
            {CONTACT.general}
          </a>{' '}
          and we will respond within 30 days. Depending on where you live, you may also have the
          right to complain to your local data-protection authority.
        </p>
      </PolicySection>

      <PolicySection heading="Changes">
        <p>
          This notice is versioned by date at the top of the page. Material changes — a new
          processor, a new category of data, a new purpose — will be reflected there before the
          change takes effect.
        </p>
      </PolicySection>
    </PolicyPage>
  )
}
