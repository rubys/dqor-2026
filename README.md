# The Hidden 4GL

Opening keynote, day 2 of [Deccan Queen on Rails](https://deccanqueenonrails.com),
Pune · Friday 9 October 2026, 10:30 IST · Sam Ruby

Published at **https://rubys.github.io/dqor-2026/**. Speaker notes are
written for readers: press **S** for the notes view, or open
[`?script`](https://rubys.github.io/dqor-2026/?script) for the whole talk
as one document.

The deck is [reveal.js](https://revealjs.com) built with Vite and
published to GitHub Pages. The live blog it embeds is the
[roundhouse](https://github.com/rubys/roundhouse) browser build at
`rubys.github.io/roundhouse/blog/`, the same origin as the published deck.

```
npm install
npm run dev          # deck at http://localhost:5173, S for speaker notes
npm run sync-demos   # snapshot /roundhouse/blog/ from roundhouse CI
npm run build        # static site in dist/ (what Pages deploys)
```

`sync-demos` commits a byte-exact snapshot of the blog under
`demos/roundhouse/`; the dev server mounts it at `/roundhouse/`, so a
rehearsal is offline and pinned to that snapshot. In production the same
`/roundhouse/...` paths resolve to the live site.

`?rehearse` adds a corner clock: elapsed time against the current act's
⏱ target (red when over; click to restart).

## Related

- [Roundhouse](https://github.com/rubys/roundhouse) and its
  [bench pages](https://rubys.github.io/roundhouse/bench/campfire/)
- Vipul A M, [Running Campfire with Roundhouse and Spinel](https://blog.saeloun.com/2026/10/04/running-campfire-with-roundhouse-and-spinel/)
- [intertwingly.net](https://intertwingly.net)
