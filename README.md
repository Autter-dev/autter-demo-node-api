# autter-demo-node-api

A Fastify TypeScript API for a developer tool with users, organizations, API keys, projects, audit logs, webhooks, rate-limited endpoints, and admin routes.

This is an **Autter Sandbox** repository. It intentionally contains realistic bugs and risky implementation patterns so design partners can test AI-editor workflows and Autter review quality.

## How to use this with Autter

1. Pick a challenge
2. Paste the suggested prompt into your AI code editor
3. Make the fix
4. Open a PR
5. Let Autter review it
6. Fix what Autter catches

## Challenges

| Challenge | Difficulty | Category | Expected Autter review angle |
| --- | --- | --- | --- |
| [API key lookup allows inactive keys](./challenges/api-key-lookup-allows-inactive-keys.md) | Medium | Auth | auth bypass |
| [Missing rate limit on token creation endpoint](./challenges/missing-rate-limit-on-token-creation-endpoint.md) | Medium | Security | abuse prevention gap |
| [Webhook retry logic duplicates delivery](./challenges/webhook-retry-logic-duplicates-delivery.md) | High | Reliability | side-effect duplication |
| [Admin endpoint trusts client-provided role](./challenges/admin-endpoint-trusts-client-provided-role.md) | High | Authorization | privilege escalation |
| [Audit logs miss failed auth attempts](./challenges/audit-logs-miss-failed-auth-attempts.md) | Medium | Observability | security monitoring gap |
| [Zod validation strips fields incorrectly](./challenges/zod-validation-strips-fields-incorrectly.md) | Medium | Validation | data loss regression |
| [Pagination returns inconsistent results](./challenges/pagination-returns-inconsistent-results.md) | Medium | Data | unstable pagination |
| [Error handler returns internal details](./challenges/error-handler-returns-internal-details.md) | Low | Security | information leakage |

## Local development

Install dependencies, run the test suite, then pick a challenge. Some tests intentionally document broken behavior with expected-failure markers; they are part of the sandbox design.
