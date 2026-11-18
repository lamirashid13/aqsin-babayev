# Aqşin Babayev — 90

This is a static website. The homepage, styles, scripts, images, fonts and
audio files are included; no build tools or server-side code are required.

## Open or share

Open `index.html` in a browser to view the site. Keep the whole folder
together when copying it or compressing it into a ZIP. Some embedded browser
previews restrict local audio; use a regular browser or the hosted site.
The package is about 1 GB because it includes the complete audio archive.

## Publish

Upload the **contents** of this folder, including `assets` and `pages`, to
the hosting site's web root. Preserve the directory structure, filename
capitalization, and Azerbaijani characters in filenames. Upload audio as
binary files. The domain root should serve `index.html`.

- **cPanel:** upload and extract the contents into the domain's document root
  (often `public_html`).
- **Netlify:** deploy this folder as a static site; there is no build command.
- **Vercel:** import a Git repository containing these files, select its root
  as the Root Directory, choose the Other framework preset, and leave the
  build and output directory overrides disabled.

Check the provider's storage and deployment limits before uploading: the
audio files make the package large. In particular, Vercel's CLI source-upload
limit depends on the plan; see https://vercel.com/docs/limits.
Some additional pages retain the original placeholder email address and phone
number; replace those with real contact details before publishing those pages.

## Structure

- `index.html`, `style.css`, `app.js`: homepage, design and interactions.
- `audio.html`: redirects to the homepage audio archive.
- `assets/js`: site data; `assets/images`: photos and book covers;
  `assets/mp3`: audio recordings; `assets/fonts`: local fonts and licenses.
- `pages`: additional static pages.

The website's article links lead to external websites and need an internet
connection. The background image is from Unsplash; its license is at
https://unsplash.com/license. Fonts are distributed under the SIL Open Font
License; the license texts are included in `assets/fonts`.
