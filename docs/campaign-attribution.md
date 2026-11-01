# Campaign measurement

Ziki: https://ziki.dev/ideas/1433. Requires the backend campaign migration and API
companion before release. The application continues to work if measurement fails.

Campaign preferences offer opt-in/decline and withdrawal. Nothing in this feature
is stored or sent until consent is granted. A first eligible marketing touch is
kept for 30 days across navigation/reloads; later campaigns do not overwrite it.
Only `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` are
accepted. `utm_source` is required; labels are bounded to 100 safe characters.
Do not put names/emails or other personal data in campaign labels. Unknown query
parameters, full URLs and referrers are never retained by this feature.

The same optional payload accompanies email signup, Google/Apple authentication
(on signup and login screens, since providers can create accounts there) and the
existing contact-sales form. The backend decides whether an account is new and
deduplicates conversions; a client button click is never a signup conversion.
Consent withdrawal and expiry are checked immediately before each request.
Blocked storage, invalid metadata and unavailable analytics are non-fatal.

This preference applies to the new campaign measurement, not the pre-existing
Google Analytics scripts. Coordinate the wider site consent changes with #72.
The existing protected backend reporting API provides authorized campaign
metrics; see the backend companion's documentation for cohort denominators,
privacy and retention. No new CRM, ad SDK or dependency is introduced here.

Run `node src/lib/campaign-attribution.test.mjs` for the attribution regression suite.
