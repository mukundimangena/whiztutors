# Photos

Drop real photos here and run `npm run build`. Anything missing quietly falls back to the
coloured initials / illustrated hero, so the site never shows a broken image.

| File | Where it shows | Tips |
|---|---|---|
| `hero.jpg` | Home page hero (right side) | A real lesson: tutor + learner at a table or laptop, both smiling. Portrait-ish, ~900×1000px. |
| `tutors/thandi.jpg`, `tutors/james.jpg`, … | Home "Meet your tutors" + /tutors/ page | Square head-and-shoulders, ~400×400px, natural light. File name = tutor's first name in lowercase (see `photo:` in `src/data.js`). |
| `logos/uct.svg`, `logos/stellenbosch.svg`, `logos/wits.svg`, `logos/up.svg`, `logos/uj.svg` | Home page trust strip | SVG preferred (PNG/WebP also work). Transparent background. Shown in greyscale, full colour on hover. **Only with written permission from each university's brand/marketing office** — logos imply endorsement. |

Optional: add a `quote:'Why I love tutoring maths…'` field to a tutor in `src/data.js` and it
shows under their photo on the home page. Only use the tutor's own words, with permission.

Get written consent from every person pictured (and a parent for anyone under 18).

## Photos and illustrations currently in use

| File | Source | Licence |
|---|---|---|
| `hero.jpg` | Unsplash — "Two women studying together at a table with laptop" by Faustina Okeke (unsplash.com/photos/2FDdgn0-W_o) | Unsplash License (free, commercial use, no attribution required) |
| `scenes/studying.jpg` | Unsplash — "Woman working at a desk with a laptop and notebook" by Vitaly Gariev (unsplash.com/photos/Ad2TAPEhliE) | Unsplash License |
| `scenes/uni-students.jpg` | Unsplash — "Two smiling students taking a selfie in a lecture hall" (unsplash.com/photos/o3o9bewLJ_o) | Unsplash License |
| `tutors/*.svg` | Illustrated avatars generated with DiceBear, "Notionists" style by Zoish | CC0 1.0 (public domain) |

These are stand-ins. Replacing them with real photos of your own tutors and lessons (with consent) will feel more genuine:
a real `tutors/thandi.jpg` automatically takes over from `tutors/thandi.svg`.
