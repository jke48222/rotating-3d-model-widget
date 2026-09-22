import { React } from "uebersicht";
// --- Inlined design system (self-contained; formerly theme.js) ---
// Shared design system for the widget set: color tokens, fonts, layout, the
// common card shell, drag/resize handles, a last-known-good cache, and the
// standard data-resolution helper. Imported by every widget so they stay
// visually and behaviorally consistent.
const T = {
  // Accent tints
  tintBlue: "#296BE0",
  tintPink: "#E86E87",
  tintGreen: "#59A875",
  tintOrange: "#D9946B",
  tintPurple: "#A861DE",

  // Cards
  cardLight: "rgba(255,255,255,0.74)",
  cardDark: "rgba(33,36,43,0.88)",

  // Ink (text on light)
  ink: "#1F2129",
  inkDim: "#616670",
  inkMute: "#8C919C",

  // Text on dark
  onDark: "#F7F7FA",
  onDarkDim: "#BDBFC7",
  onDarkMute: "#8F949E",

  // Walls (desktop stand-in backgrounds)
  wall1: "#F0F2F7",
  wall2: "#DBE3ED",
  wall3: "#BFC7DB",

  // GitHub ramp
  ghEmpty: "rgba(255,255,255,0.10)",
  ghGreen1: "#9CE8A8",
  ghGreen2: "#40C463",
  ghGreen3: "#30A14F",
  ghGreen4: "#216E38",

  // Scene colors
  nightSky: "#14141A",
  cosmicBase: "#0A051A",
  cosmicViolet: "#8C338C",
  cosmicMagenta: "#D9598C",
  cosmicIndigo: "#331A66",
  shaderPurple: "#402673",
  shaderTeal: "#268C8C",
  duskBase: "#4D408C",
  duskAmber: "#D9A666",
  duskPurple: "#8C4DA6",
  duskGlow: "#F28073",
  cardCream: "#F2F0E6",
  paperGrain: "#9E8052",

  archivePalette: [
    "#D98C4D", "#A64D33", "#733326", "#E0B359",
    "#8C6640", "#B88CCC", "#594D80", "#8C73BF",
    "#8CBF8C", "#4D8059", "#598CD9", "#334D8C",
  ],

  // Layout
  radius: "24px",
  captionTracking: "1.5px",
};

// Fonts. Install Instrument Serif, Geist, and Geist Mono for the intended look;
// each stack falls back to a system font if the family is missing.
const serif = "'Instrument Serif', Georgia, serif";
const sans = "'Geist', -apple-system, BlinkMacSystemFont, sans-serif";
const mono = "'Geist Mono', 'SF Mono', ui-monospace, monospace";

// Default desktop placement [x, y] per widget. Each widget calls
// card(variant, w, h, ...LAYOUT.<key>) so widgets lay out at distinct positions
// rather than stacking at the origin. These are overridden by any saved
// position from the drag handle.
const LAYOUT = {
  nowSpinning:  [380, 40],
  musicArchive: [40, 40],
  spatial:      [380, 200],
  mosaic:       [1120, 40],
  stack:        [1120, 486],
  drop:         [1120, 708],
  swap:         [380, 672],
  aiDailyPull:  [40, 368],
  apod:         [40, 576],
  atlas:        [1280, 224],
  tarot:        [1120, 224],
};

// Shared card shell. variant is "dark" or "light"; x/y set the on-desktop
// position. The common loading/empty/stale state styles are appended so every
// widget can render those states without repeating CSS.
const card = (variant, w, h, x = 0, y = 0) => `
  position: absolute;
  left: ${x}px; top: ${y}px;
  width: ${w}px;
  height: ${h}px;
  border-radius: ${T.radius};
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
  background: ${variant === "dark" ? T.cardDark : T.cardLight};
  backdrop-filter: blur(20px);
  color: ${variant === "dark" ? T.onDark : T.ink};
  font-family: ${sans};
  box-sizing: border-box;
  transform-origin: top left;

  /* Promote each card to its own GPU layer so a sibling widget's frequent
     refresh cannot trigger a backdrop-filter recomposite, which otherwise made
     the blur flicker on and off. */
  will-change: transform;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;

  .ws-stale { position:absolute; top:8px; right:10px; z-index:5;
              font-family:${mono}; font-size:8px; letter-spacing:1px;
              text-transform:uppercase; opacity:0.72;
              color:${variant === "dark" ? T.onDarkMute : T.inkMute}; }
  .ws-empty { position:absolute; inset:0; display:flex; align-items:center;
              justify-content:center; padding:24px; text-align:center;
              font-family:${serif}; font-style:italic; font-size:18px;
              opacity:0.6; color:${variant === "dark" ? T.onDarkDim : T.inkDim}; }
  .ws-skel  { position:absolute; inset:14px; border-radius:14px; opacity:0.18;
              animation: ws-pulse 1.6s ease-in-out infinite; }
  @keyframes ws-pulse { 0%,100% { opacity:0.10; } 50% { opacity:0.24; } }
  @media (prefers-reduced-motion: reduce) {
    .ws-skel { animation:none; opacity:0.16; }
  }

  .ws-drag  { position:absolute; top:6px; left:6px; z-index:30;
              width:18px; height:18px; border-radius:6px;
              display:flex; align-items:center; justify-content:center;
              font-size:11px; line-height:1; cursor:grab; opacity:0.42;
              transition:opacity .15s ease; user-select:none;
              -webkit-user-select:none;
              color:${variant === "dark" ? T.onDarkMute : T.inkMute};
              background:${variant === "dark"
                ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}; }
  .ws-drag:hover  { opacity:0.95; }
  .ws-drag:active { cursor:grabbing; }

  .ws-resize { position:absolute; bottom:5px; right:5px; z-index:30;
               width:16px; height:16px; border-radius:5px;
               display:flex; align-items:center; justify-content:center;
               font-size:11px; line-height:1; cursor:nwse-resize; opacity:0.42;
               transition:opacity .15s ease; user-select:none;
               -webkit-user-select:none;
               color:${variant === "dark" ? T.onDarkMute : T.inkMute};
               background:${variant === "dark"
                 ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}; }
  .ws-resize:hover { opacity:0.95; }
`;

// Small uppercase monospace caption used for metadata labels.
const caption = (color) => `
  font-family: ${mono};
  text-transform: uppercase;
  letter-spacing: ${T.captionTracking};
  color: ${color};
`;

// State helpers, returned as React elements (this is plain JS, not JSX).
const h = React.createElement;

// Loading: an accent-tinted skeleton block.
const Skel = ({ tint = T.tintBlue }) =>
  h("div", { className: "ws-skel", style: { background: tint } });

// Empty: a single quiet line of text.
const Empty = ({ text }) => h("div", { className: "ws-empty" }, text);

// Stale: a small marker showing the time of the last successful refresh.
const Stale = ({ ts }) =>
  h("div", { className: "ws-stale" }, `stale · ${clockStamp(ts)}`);

// Drag and resize support.
//
// Übersicht renders each widget into its own absolutely-positioned `.widget`
// node, all inside a shared `#uebersicht` container. The wrapper to move is the
// nearest `.widget` ancestor of a handle — not the topmost absolute element,
// which is the shared container.
//
// DragHandle updates the wrapper's left/top. ResizeHandle scales it uniformly
// via a top-left-anchored CSS transform, keeping these fixed-layout cards crisp
// instead of clipping. Both persist to localStorage, so position and size
// survive refreshes and reboots.
const posKey = (k) => `ws:pos:${k}`;
const scaleKey = (k) => `ws:scale:${k}`;
const MIN_SCALE = 0.4, MAX_SCALE = 3;

const findWrapper = (node) => node && node.closest(".widget");

// Apply any saved position and scale. Runs on every mount, since the wrapper
// may have been recreated on refresh.
const applySaved = (wrapper, key) => {
  try {
    const pos = JSON.parse(localStorage.getItem(posKey(key)) || "null");
    if (pos && typeof pos.x === "number") {
      wrapper.style.left = pos.x + "px";
      wrapper.style.top = pos.y + "px";
    }
  } catch (e) { /* storage unavailable */ }
  try {
    const scale = parseFloat(localStorage.getItem(scaleKey(key)));
    if (scale > 0) wrapper.style.transform = `scale(${scale})`;
  } catch (e) { /* storage unavailable */ }
};

const initDrag = (node, key) => {
  if (!node) return;
  const wrapper = findWrapper(node);
  if (!wrapper) return;
  applySaved(wrapper, key);

  if (node.__wsDragWired) return; // attach listeners once per node
  node.__wsDragWired = true;

  // Keep grip clicks from reaching the card's own onClick handler.
  node.addEventListener("click", (e) => e.stopPropagation());

  node.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX, startY = e.clientY;
    const cs = getComputedStyle(wrapper);
    const origX = parseFloat(wrapper.style.left || cs.left) || 0;
    const origY = parseFloat(wrapper.style.top || cs.top) || 0;
    const onMove = (ev) => {
      wrapper.style.left = origX + (ev.clientX - startX) + "px";
      wrapper.style.top = origY + (ev.clientY - startY) + "px";
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      try {
        localStorage.setItem(posKey(key), JSON.stringify({
          x: parseFloat(wrapper.style.left) || 0,
          y: parseFloat(wrapper.style.top) || 0,
        }));
      } catch (e) { /* storage unavailable */ }
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });

  // Double-click the grip to snap back to the card's default LAYOUT slot.
  node.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopPropagation();
    try { localStorage.removeItem(posKey(key)); } catch (e) { /* ignore */ }
    wrapper.style.left = "";
    wrapper.style.top = "";
  });
};

const initResize = (node, key) => {
  if (!node) return;
  const wrapper = findWrapper(node);
  if (!wrapper) return;
  applySaved(wrapper, key);

  if (node.__wsResizeWired) return;
  node.__wsResizeWired = true;

  node.addEventListener("click", (e) => e.stopPropagation());

  node.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX, startY = e.clientY;
    const cs = getComputedStyle(wrapper);
    // Layout width/height are unaffected by transform, so they stay constant.
    const baseW = parseFloat(cs.width) || 1;
    const baseH = parseFloat(cs.height) || 1;
    const m = /scale\(([^)]+)\)/.exec(wrapper.style.transform || "");
    const origScale = m ? parseFloat(m[1]) || 1 : 1;
    const onMove = (ev) => {
      const delta = (ev.clientX - startX + (ev.clientY - startY)) / (baseW + baseH);
      const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, origScale + delta));
      wrapper.style.transform = `scale(${next})`;
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      const m2 = /scale\(([^)]+)\)/.exec(wrapper.style.transform || "");
      try { localStorage.setItem(scaleKey(key), String(m2 ? m2[1] : 1)); }
      catch (e) { /* storage unavailable */ }
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });

  // Double-click the corner to restore the card's default size.
  node.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopPropagation();
    try { localStorage.removeItem(scaleKey(key)); } catch (e) { /* ignore */ }
    wrapper.style.transform = "";
  });
};

// Each handle takes the widget's LAYOUT key so position and scale are stored
// per widget. DragHandle renders top-left, ResizeHandle bottom-right.
const DragHandle = ({ k }) =>
  h("div", { className: "ws-drag", title: "Drag to move · double-click to reset",
             ref: (n) => initDrag(n, k) }, "☰");

const ResizeHandle = ({ k }) =>
  h("div", { className: "ws-resize", title: "Drag to resize · double-click to reset",
             ref: (n) => initResize(n, k) }, "⤡");

// Last-known-good cache, persisted in localStorage with a timestamp.
const remember = (key, data) => {
  try { localStorage.setItem(`ws:${key}`, JSON.stringify({ data, ts: Date.now() })); }
  catch (e) { /* storage unavailable; skip */ }
};

const recall = (key) => {
  try { return JSON.parse(localStorage.getItem(`ws:${key}`)); }
  catch (e) { return null; }
};

const clockStamp = (ms) =>
  new Date(ms).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

// True before the command has produced any output (the initial load tick).
const isLoading = ({ output, error }) =>
  output === undefined && !error;

// Standard data flow for command-backed widgets. parse(output) must return a
// falsy value when there is nothing usable.
//   loading -> { loading: true }            render <Skel/>
//   success -> { data }                     cached as last-known-good
//   failure -> { data, staleTs }            last-known-good + time, render <Stale/>
//   cold    -> { data, mock: true }         mock data, nothing cached yet
const resolve = (key, props, parse, mock) => {
  if (isLoading(props)) return { loading: true };
  let data = null;
  try { data = parse(props.output); } catch (e) { data = null; }
  if (data) { remember(key, data); return { data }; }
  const cached = recall(key);
  if (cached && cached.data) return { data: cached.data, staleTs: cached.ts };
  return { data: mock, mock: true };
};
// --- End inlined design system ---

// An auto-rotating 3D model on a transparent background.
//
// Cycles through a curated set of high-detail PBR models, rendered live with
// Google's <model-viewer>. The model is selected by day of year, and arrows
// let it be stepped manually. Requires a network connection: the viewer script
// and most models are loaded from CDNs (one model is bundled locally).

// Load the <model-viewer> custom element once. It is injected imperatively
// because <script> tags rendered through JSX do not execute.
if (typeof document !== "undefined" && !document.getElementById("ws-mv-loader")) {
  const s = document.createElement("script");
  s.type = "module";
  s.id = "ws-mv-loader";
  s.src = "https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js";
  document.head.appendChild(s);
}

export const command = false;       // curated, no data fetch
export const refreshFrequency = false; // load once and spin continuously

const BASE = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models";
// Curated for visual impact; the first entry is bundled (offline fallback), the
// rest stream from BASE. Slugs are verified against the glTF-Sample-Assets
// model-index and all expose a glTF-Binary (.glb) variant.
const MODELS = [
  { name: "Damaged Helmet", src: "rotating-3d-model.widget/DamagedHelmet.glb" },
  { name: "Antique Camera", slug: "AntiqueCamera" },
  { name: "Chess Set", slug: "ABeautifulGame" },
  { name: "Concept Car", slug: "CarConcept" },
  { name: "Chronograph Watch", slug: "ChronographWatch" },
  { name: "Jade Dragon", slug: "DragonAttenuation" },
  { name: "Scattering Skull", slug: "ScatteringSkull" },
  { name: "Iridescent Dish", slug: "IridescentDishWithOlives" },
  { name: "Toy Car", slug: "ToyCar" },
  { name: "Ornate Lantern", slug: "Lantern" },
  { name: "Boom Box", slug: "BoomBox" },
  { name: "Velvet Sofa", slug: "GlamVelvetSofa" },
  { name: "Sneaker", slug: "MaterialsVariantsShoe" },
  { name: "Silk Pouf", slug: "SpecularSilkPouf" },
  { name: "Water Bottle", slug: "WaterBottle" },
];
const url = (m) => m.src || `${BASE}/${m.slug}/glTF-Binary/${m.slug}.glb`;

// The first model is bundled locally, so it is the offline fallback.
const BUNDLED = MODELS[0];

// Warm the cache for the next model so stepping forward is instant.
const preload = (idx) => {
  const next = MODELS[(idx + 1) % MODELS.length];
  if (next.src) return; // already local
  try { fetch(url(next), { mode: "cors" }).catch(() => {}); } catch (e) {}
};

// Attach a one-time error handler: if a remote model fails to load (offline or
// CDN error), fall back to the bundled model so the widget never goes blank.
const wire = (el) => {
  if (!el || el.__wsWired) return;
  el.__wsWired = true;
  el.addEventListener("error", () => {
    const fb = url(BUNDLED);
    if (el.getAttribute("src") !== fb) {
      el.setAttribute("src", fb);
      el.setAttribute("alt", BUNDLED.name);
    }
  });
};
const FONTS = "rotating-3d-model.widget/fonts";
// A museum vitrine: a brass-framed glass case on a Carrara marble plinth,
// the object turning under a warm spot with a typed label card on the
// plinth. The brass buttons step through the collection.
export const className = card("dark", 220, 292, ...LAYOUT.spatial) + `
  @font-face { font-family: "Inter"; src: url("${FONTS}/Inter-500.woff2") format("woff2"); font-weight: 500; }
  @font-face { font-family: "Inter"; src: url("${FONTS}/Inter-600.woff2") format("woff2"); font-weight: 600; }
  --ui: "Inter", -apple-system, sans-serif; --brass: #C9A55A; --brass2: #7E5F22;
  background: transparent; box-shadow: none; backdrop-filter: none; padding: 0; overflow: visible; user-select:none; -webkit-user-select:none;
  .ws-drag { top: 12px; left: 26px; color: #E8CF8C; background: rgba(0,0,0,0.3); } .ws-resize { bottom: 6px; right: 8px; color: #6b5a3a; background: rgba(0,0,0,0.08); }
  .spot { position:absolute; left: 44px; top: 8px; width: 132px; height: 180px; pointer-events:none; background: radial-gradient(ellipse 50% 45% at 50% 0%, rgba(255,236,190,0.55), rgba(255,236,190,0) 70%); }
  model-viewer { position:absolute; left: 24px; top: 10px; width: 172px; height: 180px; --poster-color: transparent; }
  .floor { position:absolute; left: 24px; top: 168px; width: 172px; height: 22px; pointer-events:none; background: radial-gradient(ellipse 45% 50% at 50% 50%, rgba(0,0,0,0.35), rgba(0,0,0,0) 70%); }
  .backwall { position:absolute; left: 22px; top: 8px; width: 176px; height: 186px; pointer-events:none; background: linear-gradient(180deg, rgba(58,60,66,0.55) 0%, rgba(30,32,36,0.72) 100%); }
  .post { position:absolute; top: 0; width: 5px; height: 196px; z-index: 2; pointer-events:none; background: linear-gradient(90deg, #7E5F22, #E2C27C 45%, #7E5F22); box-shadow: 0 0 0 1px rgba(0,0,0,0.35); }
  .post.l { left: 18px; } .post.r { right: 18px; }
  .case { position:absolute; left: 20px; top: 0; width: 180px; height: 196px; border-radius: 2px; pointer-events:none;
          background: linear-gradient(160deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 60%, rgba(255,255,255,0.14) 100%);
          box-shadow: inset 0 0 0 2px var(--brass), inset 0 0 0 3px var(--brass2), inset 0 0 0 4px rgba(255,255,255,0.25), 0 0 0 1px rgba(0,0,0,0.35), inset 0 -30px 40px rgba(0,0,0,0.18); }
  .case::before { content:""; position:absolute; left: 10%; top: 0; width: 18%; height: 100%; background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0) 100%); }
  .case::after { content:""; position:absolute; left: 0; right: 0; top: 0; height: 8px; background: linear-gradient(180deg, var(--brass), var(--brass2)); box-shadow: 0 1px 0 rgba(0,0,0,0.4); }
  .topcap { position:absolute; left: 0; top: 194px; width: 220px; height: 4px; z-index: 2; background: linear-gradient(180deg, #E4E1DB, #B9B4AC); }
  .plinth { position:absolute; left: 0; top: 196px; width: 220px; height: 96px; border-radius: 3px; overflow:hidden;
            background: linear-gradient(180deg, #F4F2EE 0%, #E6E3DD 100%);
            box-shadow: 0 30px 50px rgba(0,0,0,0.5), inset 0 1px 0 #fff, inset 0 0 0 1px #B9B4AC, inset 0 -3px 0 rgba(0,0,0,0.12); }
  .plinth::before { content:""; position:absolute; inset: 0; opacity: 0.85; pointer-events:none;
       background: linear-gradient(115deg, rgba(0,0,0,0) 0 38%, rgba(120,116,110,0.35) 39%, rgba(0,0,0,0) 40.5%, rgba(0,0,0,0) 62%, rgba(120,116,110,0.25) 63%, rgba(0,0,0,0) 64%), linear-gradient(80deg, rgba(0,0,0,0) 0 20%, rgba(150,146,140,0.25) 21%, rgba(0,0,0,0) 22.5%), linear-gradient(140deg, rgba(0,0,0,0) 0 74%, rgba(120,116,110,0.2) 75%, rgba(0,0,0,0) 76.5%); }
  .plinth::after { content:""; position:absolute; inset:0; opacity: 0.35; mix-blend-mode: multiply; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E"); }
  .label { position:absolute; left: 50px; top: 222px; width: 120px; height: 42px; z-index: 3; box-sizing: border-box; padding: 7px 9px; background: #FCFBF8; border-radius: 1px; box-shadow: 0 2px 4px rgba(0,0,0,0.25), 0 0 0 0.5px rgba(0,0,0,0.15); }
  .plaque { font: 600 9.5px/1.2 var(--ui); color: #1F1D1A; letter-spacing: -0.1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .no { margin-top: 3px; font: 500 7.5px/1.3 var(--ui); color: #7A756D; letter-spacing: 0.2px; }
  .nav { position:absolute; top: 232px; width: 22px; height: 22px; border-radius: 50%; z-index: 4; cursor:pointer; display:flex; align-items:center; justify-content:center; padding-bottom: 2px; box-sizing: border-box;
         font: 500 14px/1 var(--ui); color: #3A2A0A; background: radial-gradient(circle at 40% 35%, #F0D89A, #9A7A40 70%); box-shadow: 0 2px 3px rgba(0,0,0,0.35), inset 0 0 0 1px #6E5222; }
  .nav.prev { left: 14px; } .nav.next { right: 14px; }
  .nav:hover { filter: brightness(1.08); } .nav:active { transform: translateY(1px); }
`;
const dayOfYear = () => {
  const now = new Date();
  return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
};

const KEY = "ws:spatial:idx";
const startIdx = () => {
  const v = localStorage.getItem(KEY);
  return v != null && !isNaN(+v) ? ((+v % MODELS.length) + MODELS.length) % MODELS.length
                                 : dayOfYear() % MODELS.length;
};

// Step through the models by swapping the live element's src. Clicks do not
// trigger a React re-render in Übersicht, so the DOM is mutated directly.
// delta +1 advances, -1 goes back.
const step = (delta) => (e) => {
  if (e && e.stopPropagation) e.stopPropagation();
  const len = MODELS.length;
  const next = ((startIdx() + delta) % len + len) % len;
  try { localStorage.setItem(KEY, String(next)); } catch (err) {}
  const mv = document.getElementById("ws-spatial-mv");
  if (mv) { mv.setAttribute("src", url(MODELS[next])); mv.setAttribute("alt", MODELS[next].name); }
  preload(next);
};

const stepAndLabel = (delta) => (e) => {
  step(delta)(e);
  const i = startIdx(); const p = document.getElementById("ws-spatial-name"); if (p) p.textContent = MODELS[i].name;
  const n = document.getElementById("ws-spatial-no"); if (n) n.textContent = `No. ${i + 1} of ${MODELS.length}`;
};
export const render = () => {
  const idx = startIdx(); const m = MODELS[idx]; preload(idx);
  return (
    <div aria-label={`3D asset: ${m.name}, slowly rotating`}>
      <div className="backwall" />
      <div className="spot" />
      <model-viewer id="ws-spatial-mv" ref={wire} src={url(m)} alt={m.name} auto-rotate="" auto-rotate-delay="0" rotation-per-second="22deg" interaction-prompt="none" disable-zoom="" environment-image="neutral" exposure="1.1" shadow-intensity="0.6" loading="eager" style={{ backgroundColor: "transparent" }}></model-viewer>
      <div className="floor" />
      <div className="case" />
      <span className="post l" /><span className="post r" />
      <div className="topcap" />
      <div className="plinth" />
      <div className="label"><div id="ws-spatial-name" className="plaque">{m.name}</div><div id="ws-spatial-no" className="no">No. {idx + 1} of {MODELS.length} · glTF sample</div></div>
      <div className="nav prev" title="Previous object" onClick={stepAndLabel(-1)}>&#x2039;</div>
      <div className="nav next" title="Next object" onClick={stepAndLabel(1)}>&#x203A;</div>
      <DragHandle k="spatial" />
      <ResizeHandle k="spatial" />
    </div>
  );
};
