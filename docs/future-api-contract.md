# Future opt-in API contract

## Status

No application API, account system, newsletter endpoint, persistence layer, or telemetry collection is live in the controlled preview. Do not add a route that accepts personal data until the operator, final privacy notice, retention schedule, processor list, and rights-request process are approved and published.

This document is the implementation contract for the smallest future opt-in feature set. It addresses the data-layer design before the product creates a collection surface.

## Global requirements

- Serve every API only from `https://gochujang.net`; do not emit a wildcard CORS header.
- Require HTTPS, `Content-Type: application/json`, a same-origin `Origin` check, a CSRF token for authenticated writes, request-body limits, schema validation, and `Cache-Control: no-store`.
- Rate limits are enforced at the edge before a write. A limit response is `429 Too Many Requests` with an accurate `Retry-After` header and a generic body: `{ "error": "rate_limited" }`.
- Do not use request URLs, recipe history, or raw IP addresses as analytics identifiers. Security logs must be access-controlled, minimized, and retained only for the documented abuse window.
- Return stable machine-readable errors. Never reveal whether another account, email address, or token exists.

## `POST /api/newsletter`

This endpoint is not enabled in the preview. It may be enabled only for a separate, explicit newsletter purpose and double opt-in flow.

Request body:

```json
{
  "email": "reader@example.com",
  "consentVersion": "2026-08-24",
  "sourceRoute": "/",
  "csrfToken": "required-for-browser-submissions"
}
```

Validation and response contract:

- Accept only a normalized email, the current published consent version, and an allowed source route. Reject malformed or unexpected fields with `400 Bad Request` and `{ "error": "invalid_request" }`.
- Limit to 5 requests per source IP per rolling hour and 3 confirmation sends per normalized email per rolling 24 hours.
- On an accepted request, create or refresh a pending double-opt-in record and return `202 Accepted` with `{ "status": "confirmation_required" }`. The UI message is: "Check your inbox to confirm. You can unsubscribe at any time."
- A confirmation link must be single-use, signed, short-lived, and not expose the email address in the URL.
- Store only normalized email, consent timestamp/version, source route, confirmation state, provider message identifier, unsubscribed timestamp, and deletion timestamp. Do not store browsing history with newsletter data.
- A published retention schedule, unsubscribe endpoint, deletion workflow, vendor agreement, and privacy notice are release prerequisites.

## `POST /api/batches` and `POST /api/cooks`

These endpoints are for a future account-backed Kitchen only. The current preview must keep the Kitchen illustrative and local/no-op.

Authentication and abuse controls:

- Require an authenticated account session, same-origin CSRF protection, and per-account ownership checks for every read, update, and delete.
- Limit to 60 write attempts per IP per hour and 120 successful writes per account per day. Return `429` with `Retry-After` when either limit is reached.
- Cap JSON bodies at 16 KB, reject unknown fields, and use opaque record IDs. Do not make identifiers enumerable.
- Use idempotency keys for create requests so a retry cannot create a duplicate batch or cook record.

Minimum records:

```json
{
  "batch": {
    "id": "opaque-id",
    "dishId": "approved-dish-slug",
    "startedAt": "ISO-8601 timestamp",
    "note": "optional, length-limited personal note",
    "status": "planned|active|completed|discarded"
  },
  "cook": {
    "id": "opaque-id",
    "dishId": "approved-dish-slug",
    "cookedAt": "ISO-8601 timestamp",
    "rating": 1,
    "note": "optional, length-limited personal note"
  }
}
```

Before release, document data categories, retention, account export, account deletion, vendor processors, incident response, and support escalation. The product must work without an account wherever a local-only alternative is reasonable.

## Acceptance tests before activation

1. Valid, invalid, duplicate, expired-token, CSRF-failure, and rate-limit tests run in CI.
2. A `429` response includes the expected `Retry-After`; no write reaches storage after the limit.
3. Newsletter confirmations and unsubscribe requests work without an account.
4. A user can export and delete their Kitchen records; deletion is verified against primary and queued storage.
5. Browser, proxy, and CDN responses do not cache personal-data responses or expose them cross-origin.
