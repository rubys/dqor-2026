import Reveal from "reveal.js";
import Notes from "reveal.js/plugin/notes/notes.esm.js";
import "reveal.js/dist/reveal.css";
import "./deck.css";

// ?script — render the talk script (slide titles + speaker notes) as
// a plain printable document instead of the deck. Reveal has no
// notes-only output; this is ours. Hidden slides are skipped.
function renderScriptView() {
  document.documentElement.classList.add("script-view");
  const article = document.createElement("article");
  article.id = "talk-script";
  article.innerHTML = "<h1>The Hidden 4GL — talk script</h1>";
  let n = 0;
  document.querySelectorAll(".reveal .slides > section").forEach((s) => {
    if (s.dataset.visibility === "hidden") return;
    n += 1;
    const h = s.querySelector("h1, h2");
    const title = h
      ? h.textContent.trim()
      : s.querySelector("iframe")
        ? "[ live: the blog ]"
        : s.querySelector(".gen, blockquote, p")
          ? s.querySelector(".gen, blockquote, p").textContent.trim().replace(/\s+/g, " ").slice(0, 60)
          : s.querySelector("pre")
            ? s.querySelector("pre").textContent.trim().split("\n")[0]
            : "(untitled)";
    const notes = s.querySelector("aside.notes");
    const entry = document.createElement("section");
    const head = document.createElement("h2");
    const clock = s.dataset.clock;
    head.textContent = clock
      ? `${n} · ⏱ ${clock} · ${title}`
      : `${n} · ${title}`;
    entry.appendChild(head);
    const body = document.createElement("p");
    body.textContent = notes
      ? notes.textContent.replace(/\s+/g, " ").trim()
      : "—";
    entry.appendChild(body);
    article.appendChild(entry);
  });
  document.body.replaceChildren(article);
}

function startDeck() {
  const deck = new Reveal({
    plugins: [Notes],
    hash: true,
    slideNumber: "c/t",
    transition: "none",
    width: 1280,
    height: 720,
    margin: 0.04,
  });

  deck.initialize();

  // Console/rehearsal handle (deck.slide(n), deck.getIndices(), …).
  window.deck = deck;

  // ?rehearse — corner HUD: elapsed vs the current act's ⏱ target
  // (nearest data-clock at or before this slide). Click to restart
  // the clock. Red when over target. Absent in stage mode.
  if (new URLSearchParams(location.search).has("rehearse")) {
    const hud = document.createElement("div");
    hud.id = "rehearse-hud";
    hud.title = "click to restart clock";
    document.body.appendChild(hud);
    let t0 = Date.now();
    hud.addEventListener("click", () => (t0 = Date.now()));
    const currentTarget = () => {
      let s = deck.getCurrentSlide();
      while (s) {
        if (s.dataset && s.dataset.clock) return s.dataset.clock;
        s = s.previousElementSibling;
      }
      return null;
    };
    const update = () => {
      const sec = Math.floor((Date.now() - t0) / 1000);
      const elapsed = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
      const target = currentTarget();
      hud.textContent = target ? `${elapsed} · ⏱ ${target}` : elapsed;
      let over = false;
      if (target) {
        const [m, s2] = target.split(":").map(Number);
        over = sec > m * 60 + s2;
      }
      hud.classList.toggle("over", over);
    };
    setInterval(update, 1000);
    deck.on("slidechanged", update);
    update();
  }
}

if (new URLSearchParams(location.search).has("script")) {
  renderScriptView();
} else {
  startDeck();
}
