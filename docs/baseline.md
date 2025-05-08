# Performance Baseline

- **URL**: http://localhost:5173/
- **Lighthouse Version**: 12.4.0
- **Audit Time**: 2025-05-08T21:25:30.006Z :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}

## Core Metrics

| Metric                             | Value                                                                            |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| **Largest Contentful Paint (LCP)** | 4.6 s :contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3} |
| **Time to Interactive (TTI)**      | 4.6 s :contentReference[oaicite:4]{index=4}:contentReference[oaicite:5]{index=5} |
| **Total JS Bundle Size (prod)**    | _TBD_                                                                            |

> **Note:** To measure production JS bundle size, run:
>
> ```bash
> npm run build
> ls -lh dist/assets/
> ```
>
> and record the size of your generated `.js` files.
