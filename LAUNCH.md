# Launching Hotel Akshara

## 1. Fill in your details (about 20 minutes)

Everything lives in `js/content.js`. Search the file for `placeholder: true` and replace each one
with your real text, then delete that line. Do these in order:

1. **Links**: `owner.links` at the top (GitHub is set; check LinkedIn; add your email).
2. **`staff`** section: headline, about, education, photo, CV.
3. **Projects** (`staff.projects`): real descriptions, and optionally `status` and `progress`.
4. **Certificates** (`staff.certificates`): the year and a `url` (LinkedIn link or a file in `assets/`).
5. **Posters** (`staff.posters`): title, event and `image` (files in `assets/`).
6. **Skills** (`staff.skills`): delete anything that is not true for you.
7. **Notes** (`archive.notes`), **Basement boxes** (`basement.boxes`), the **Roof letter** (`roof.letter`).
8. Put `cv.pdf`, your photo and the 7 poster images in `assets/` (see `assets/README.txt`).

When there are no `placeholder: true` lines left, no yellow "Placeholder" tags show anywhere.

## 2. Check it on your computer

Open `index.html` by double-clicking it. Try:
- The bell entrance shows every time; `index.html?skip` skips it (handy while testing).
- Every floor, then `staff.html` and `cv.html`.
- Your phone: once it is online (step 3), open the link on your phone.

## 3. Put it online (free, GitHub Pages, no command line needed)

1. On github.com, click **New repository**. Name it `aksharakabra.github.io` (this gives the short
   address `https://aksharakabra.github.io`). Make it **Public**.
2. Click **uploading an existing file**, drag in everything from inside the `hotel-akshara` folder
   (the files themselves, `index.html` must be at the top level, not inside another folder),
   and click **Commit changes**.
3. Go to **Settings > Pages**. Under **Build and deployment**, choose **Deploy from a branch**,
   branch **main**, folder **/ (root)**, then **Save**.
4. Wait a minute or two, then open `https://aksharakabra.github.io`.

To change something later: open the file on GitHub, click the pencil, edit, commit. It updates in a minute.

Other free hosts also work (Netlify Drop, Cloudflare Pages): drag the folder in, nothing to configure.

## 4. After launch

- Put the link in your LinkedIn, GitHub profile, resume and email signature.
  For HR, share `https://aksharakabra.github.io/staff.html` (the plain, clear page) as well.
- `404.html` is the "Room not found" page; GitHub Pages uses it automatically.
- Secrets to tell friends about: type `foxie`, `japan` or `coffee`, or click the hotel sign five times.

## Quick facts

- No build step, no dependencies. Fonts load from Google Fonts; if they are blocked, the site
  falls back to Georgia and a system monospace font and still works.
- Sound is off until a visitor switches it on (except the bell they tap on purpose).
- It respects "reduce motion" settings, works with keyboard only, and works without a mouse.
