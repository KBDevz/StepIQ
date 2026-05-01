# Supabase Edge Functions

## generate-report

`generate-report` proxies StepIQ AI report generation through Supabase so the
Anthropic API key is never exposed in the browser bundle.

Before deploying, set the secret in Supabase:

```sh
supabase secrets set ANTHROPIC_API_KEY=your_anthropic_key
```

Then deploy the function:

```sh
supabase functions deploy generate-report
```
