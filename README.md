# Hotel Akshara

A portfolio built as a small night-time hotel. Plain HTML, CSS and JavaScript. There is no build step and nothing to install.

## Open it

Double-click `index.html`. It needs an internet connection only for the Google Fonts.

- **First visit:** a night street with a bell. Tap the bell (or press any key, or swipe up) and the door opens into the lobby.
- **The lobby:** Foxie greets you (the window shows your real time of day). Tap the bell on the desk for a guest key and a quick menu to any floor. Tap Foxie, or the sleeping baby fox, for something to say.
- **Moving around:** floor buttons on the right, arrow keys, `L` `R` `B` `1`-`5` as shortcuts, mouse wheel, or swipe on a phone. Go straight to a floor with `index.html#workshop`.
- **Replay the entrance:** open `index.html?intro`. **Skip it:** `index.html?skip`, or any floor link like `#workshop`.
- The entrance shows once per browser. To see it again without `?intro`, clear this site's data.

## Changes after review (cluster 13)

Entrance every visit; hover tips on elevator buttons (js/tips.js, `tip` per floor in content.js); Minibar door opens by tap or slide; scrolling inside a panel no longer changes floor (elevator.js); Trophy Room keys open a door with learned/skills/image per certificate and explain the Master key (opens the Roof); Gallery auto-scrolls at the edges plus arrows; Archive explains itself and has example note prompts; Basement is bigger. Sound default ON is only a suggestion so far (not built).

## Launching

Read **LAUNCH.md** (fill in your details, then publish free on GitHub Pages).

## Fill in the Staff entrance (do this whenever you are ready)

1. Open js/content.js. Put your GitHub, LinkedIn and email in `owner.links` at the top.
2. Scroll to the `staff` section. Replace each placeholder with your real text and delete the `placeholder: true` line.
3. Copy your files into assets/ (cv.pdf, photo.jpg, poster1.jpg to poster7.jpg) and set their paths (see assets/README.txt).
4. Open staff.html and cv.html to check. Empty links show a dashed "add link" tag, so nothing looks broken.

## Folder map

```
index.html            the hotel
staff.html            the Staff entrance: plain, HR-friendly page (built from js/content.js)
cv.html               your CV on its own page (PDF or image)
css/staff.css, js/staff.js   styles and builder for those two pages
assets/               put your cv.pdf, photo and poster images here (see assets/README.txt)
css/tokens.css        the Midnight Motel colors, fonts and sizes
css/style.css         layout, the elevator and the key ring
css/entrance.css      the night street, bell and door
css/lobby.css         Foxie, the lobby and the speech bubble
js/content.js         all words, links and floor details (edit this)
js/audio.js           sounds, generated in the browser (no audio files)
js/elevator.js        moving between floors
js/entrance.js        the first-visit entrance
js/app.js             builds the floors, starts everything, sound toggle
js/keys.js            the key ring (Hotel.keys.add)
js/floors/lobby.js    the lobby floor
js/floors/            one file per floor, added in later clusters
assets/               posters, certificates and images, added later
```

## Where to add your details

Open `js/content.js`:
- `owner.links`: GitHub, LinkedIn, email.
- `lobby`: everything Foxie says, the banner words and the book titles on the desk.
- `entrance`: the words on the entrance screen.

## Progress

- [x] Cluster 1: foundation and elevator
- [x] Cluster 2: entrance (street, bell, sound, door)
- [x] Cluster 3: lobby and Foxie
- [x] Cluster 4: staff entrance (placeholders: fill in js/content.js)
- [x] Cluster 5: workshop (machines come from staff.projects in js/content.js)
- [x] Cluster 6: trophy room (keys come from staff.certificates in js/content.js)
- [x] Cluster 7: poster gallery (posters come from staff.posters in js/content.js)
- [x] Cluster 8: minibar (bottles come from staff.skills in js/content.js)
- [x] Cluster 9: archive (notes in archive.notes, papers from staff.research)
- [x] Cluster 10: sound and elevator polish
- [x] Cluster 11: roof, basement and secrets
- [x] Cluster 12: final polish and launch (see LAUNCH.md)

## Handoff note (paste this at the start of the next sitting)

> Project: Hotel Akshara, a whimsical portfolio for Akshara Kabra (MCA integrated, DAVV Indore). Palette: Midnight Motel (ink navy #12162B, amber #F2B84B, red #B3263E, cream #F4E9D3, mint #7FD1B9). Fonts: Fraunces, DM Mono, Caveat. Mascot: Foxie, a fox clerk in white headphones, round glasses, a navy hoodie and a pink flower, with a coffee mug (look taken from a reference picture; Foxie likes Japan, DSA, coding, self care). Sound is optional, off by default (tapping a bell always rings it, since that is an explicit tap). Stack: plain HTML/CSS/JS, classic scripts (no modules, so it works from file://), no build step. Script order in index.html: content, audio, elevator, entrance, app (creates `window.Hotel`), keys, then js/floors/*.js. Content lives in js/content.js. Each floor is built by a file in js/floors/ that calls `Hotel.register(id, fn(section, floor, content))`; floors without a file show a placeholder door. Events: `hotel:depart` and `hotel:arrive` from the elevator, `hotel:sound` from the toggle, `hotel:enter` when the entrance finishes, `hotel:key` when a key is added. `Hotel.keys.add({id,label,color})` puts a key on the key ring (the Trophy Room should add one per certificate). `Hotel.elevator.goToId(id)` moves the elevator. Sounds are synthesised in js/audio.js (`HotelAudio.bell()`). The entrance (bell and door) shows on EVERY visit; `?skip` bypasses it. The lobby window follows the visitor's local time (classes t-morning/afternoon/evening/night). SVG art uses a 640x520 viewBox for the lobby; interactive SVG parts are `<g class="hit" data-act role="button" tabindex="0">`. ALL 12 CLUSTERS ARE DONE. See LAUNCH.md for filling in details and publishing. Cluster 12 added favicon.svg, 404.html, Open Graph tags and LAUNCH.md; the full flow, all floors and the staff pages were tested (no broken file references, no unnamed buttons or images, no console errors). Clusters 1 to 11 summary: Roof (js/floors/roof.js, css/roof.css): rattle the lock; the Master key (collect all certificate keys) opens a peek with stars and a letter (`roof` in content.js). Basement (js/floors/basement.js, css/basement.css): pull the bulb string, open boxes from `basement.boxes`. Secrets (js/secrets.js, css/secrets.css): type foxie / japan / coffee (no R, L, B or digits: those are elevator shortcuts), or click the sign 5 times; each adds a key. .floor and .stage use overflow: clip so focus can never scroll them. Sound: js/audio.js (synthesised: bell always plays; click, thunk, pop, flip, whirr, chime, jingle only when the toggle is ON; `HotelAudio.setEnabled`), wired by js/sound.js (script order: ... keys, sound, floors). Add a selector to ON_CLICK in sound.js to give a button a sound. Elevator polish: floor display flashes on arrival, whole floor rumbles while moving. The Archive (js/floors/archive.js, css/archive.css): shelves of book spines; notes from `archive.notes`, papers from `staff.research` (empty, so `archive.ghosts` show as dashed empty spines); a card shows the selected book; first read adds an Archive key. The Minibar (js/floors/minibar.js, css/minibar.css) is a fridge whose door swings open; each `staff.skills` group is a shelf (optional `mood` subtitle), each item a bottle to pop; first pour adds a Minibar key. Words under `minibar`. The Poster Gallery (js/floors/gallery.js, css/gallery.css) is a dark wall lit by a pointer-following flashlight (idle sweep; Lights on button; focus moves the beam); posters open in a native dialog with prev/next; first open adds a Gallery key. Posters come from `staff.posters`; words under `gallery`. The Trophy Room (js/floors/trophy.js, css/trophy.css) shows each `staff.certificates` entry as a key on a hook; picking one shows its tag and adds a key to the key ring; all keys give a Master key. Words under `trophy` in content.js. The Workshop (js/floors/workshop.js, css/workshop.css) shows each `staff.projects` entry as a switchable machine (optional fields: status shipped|half|sketch, progress 0-100, blurb); the lever powers all; the first switch-on adds a Workshop key. Words are under `workshop` in content.js. GitHub username is aksharakabra (not yet verified from the build sandbox; set owner.links.github to https://github.com/aksharakabra). staff.html and cv.html (calm cream page for HR) are built by js/staff.js from `HOTEL.staff` and `HOTEL.owner.links` in content.js; `placeholder: true` items show a Placeholder tag. Next is cluster [N]. My project folder is attached.
