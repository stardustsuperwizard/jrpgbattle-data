# Lore

One file per champion, `<hero id>.md`: the public-domain sources it draws from, and the story. jrpg-battle never loads it; the Mega Fighters site reads it as one layer of its lore (mega_fighters#27).

**The site's own lore wins.** The site layers presentation data as **site > this repository > jrpg-battle**: a god's file in the site's `lore/` replaces the one here, whole. These files are the base the site falls back on, so a god added here shows its lore before the site writes its own telling. Lore stays unlicensed and is the owner's, like the art.

**The format** (`manifest.json`'s `formatVersion`, `2026-11-04`), which the site's build reads:
- `# Name` on the first line;
- an optional `**Sources (public domain):** …` line;
- then paragraphs of story, separated by blank lines;
- HTML comments are notes for writers and are never shown.

A change to that shape gets a new date here and in the site's reader together.

**Draw from the ancient sources, not later adaptations.** The Greek myths are public domain; modern films, games and comics about them are not, and their particular designs, names for things and stories stay theirs.
