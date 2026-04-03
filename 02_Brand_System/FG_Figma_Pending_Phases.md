# FIGMA — Código pendiente de ejecución

**File key:** `1Gbya37K99sDRIPxi694yl`  
**Motivo:** Rate limit Starter (6 calls/mes) alcanzado 2026-03-31  
**Acción:** Ejecutar cada bloque como un `use_figma` call cuando el límite se renueve

---

## CALL 1: Brand Components (15 componentes)

```javascript
// Frequency Line × 4, Signal Node × 4, Pillar Pill × 4, Divider × 1, Brackets × 2
const pages = figma.root.children;
const systemPage = pages.find(p => p.name.includes("System"));
if (systemPage) figma.currentPage = systemPage;

const CYAN    = { r: 0, g: 0.898, b: 1 };
const MAGENTA = { r: 1, g: 0, b: 0.898 };
const GREEN   = { r: 0.722, g: 1, b: 0 };
const BLUE    = { r: 0.29, g: 0.42, b: 1 };

// -- Frequency Lines --
const colors = [
  { name: "cyan", c: CYAN }, { name: "magenta", c: MAGENTA },
  { name: "green", c: GREEN }, { name: "blue", c: BLUE }
];
let x = 100;
for (const col of colors) {
  const comp = figma.createComponent();
  comp.name = "Frequency Line / " + col.name;
  comp.resize(200, 3); comp.x = x; comp.y = 2100;
  const r = figma.createRectangle();
  r.resize(200, 3); r.fills = [{ type: "SOLID", color: col.c }]; r.cornerRadius = 1.5;
  comp.appendChild(r); r.x = 0; r.y = 0;
  r.constraints = { horizontal: "STRETCH", vertical: "CENTER" };
  x += 280;
}

// -- Signal Nodes --
x = 100;
for (const col of colors) {
  const comp = figma.createComponent();
  comp.name = "Signal Node / " + col.name;
  comp.resize(24, 24); comp.x = x; comp.y = 2200;
  const outer = figma.createEllipse();
  outer.resize(24, 24); outer.fills = [{ type: "SOLID", color: col.c, opacity: 0.15 }];
  comp.appendChild(outer); outer.x = 0; outer.y = 0;
  const inner = figma.createEllipse();
  inner.resize(10, 10); inner.fills = [{ type: "SOLID", color: col.c }];
  inner.x = 7; inner.y = 7;
  inner.effects = [{ type: "DROP_SHADOW", color: { ...col.c, a: 0.3 }, offset: { x: 0, y: 0 }, radius: 12, spread: 0, visible: true, blendMode: "NORMAL" }];
  comp.appendChild(inner);
  x += 100;
}

// -- Pillar Pills --
await figma.loadFontAsync({ family: "Space Grotesk", style: "Bold" });
const pills = [
  { name: "Geopolitik Drop", abbr: "GD", c: CYAN },
  { name: "Bass & Borders", abbr: "BB", c: MAGENTA },
  { name: "Frecuencia Global", abbr: "FG", c: GREEN },
  { name: "Behind the Policy", abbr: "BP", c: BLUE }
];
x = 100;
for (const p of pills) {
  const comp = figma.createComponent();
  comp.name = "Pillar Pill / " + p.abbr;
  comp.layoutMode = "HORIZONTAL";
  comp.primaryAxisAlignItems = "CENTER"; comp.counterAxisAlignItems = "CENTER";
  comp.paddingLeft = 12; comp.paddingRight = 12; comp.paddingTop = 6; comp.paddingBottom = 6;
  comp.cornerRadius = 4;
  comp.fills = [{ type: "SOLID", color: p.c, opacity: 0.12 }];
  comp.strokes = [{ type: "SOLID", color: p.c, opacity: 0.4 }]; comp.strokeWeight = 1;
  comp.x = x; comp.y = 2350;
  const label = figma.createText();
  label.fontName = { family: "Space Grotesk", style: "Bold" };
  label.characters = p.name.toUpperCase(); label.fontSize = 11;
  label.letterSpacing = { value: 1.5, unit: "PIXELS" };
  label.fills = [{ type: "SOLID", color: p.c }];
  comp.appendChild(label);
  x += 220;
}

// -- Divider --
const div = figma.createComponent();
div.name = "Divider / horizontal"; div.resize(320, 1); div.x = 100; div.y = 2500;
const dl = figma.createRectangle();
dl.resize(320, 1); dl.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.1 }];
div.appendChild(dl); dl.constraints = { horizontal: "STRETCH", vertical: "CENTER" };

// -- Brackets --
const bracketL = figma.createComponent();
bracketL.name = "Bracket / left"; bracketL.resize(12, 40); bracketL.fills = [];
bracketL.x = 100; bracketL.y = 2600;
for (const [w, h, bx, by] of [[12,2,0,0],[2,40,0,0],[12,2,0,38]]) {
  const r = figma.createRectangle(); r.resize(w, h);
  r.fills = [{ type: "SOLID", color: CYAN }]; r.x = bx; r.y = by;
  bracketL.appendChild(r);
}
const bracketR = figma.createComponent();
bracketR.name = "Bracket / right"; bracketR.resize(12, 40); bracketR.fills = [];
bracketR.x = 200; bracketR.y = 2600;
for (const [w, h, bx, by] of [[12,2,0,0],[2,40,10,0],[12,2,0,38]]) {
  const r = figma.createRectangle(); r.resize(w, h);
  r.fills = [{ type: "SOLID", color: CYAN }]; r.x = bx; r.y = by;
  bracketR.appendChild(r);
}

return { msg: "15 brand components created" };
```

---

## CALL 2: UI Block Components (header, title block, lower third, card)

```javascript
const pages = figma.root.children;
figma.currentPage = pages.find(p => p.name.includes("System"));

await figma.loadFontAsync({ family: "Bebas Neue", style: "Regular" });
await figma.loadFontAsync({ family: "Space Grotesk", style: "Bold" });
await figma.loadFontAsync({ family: "Space Grotesk", style: "Regular" });
await figma.loadFontAsync({ family: "JetBrains Mono", style: "Regular" });

const CYAN = { r: 0, g: 0.898, b: 1 };
const WHITE = { r: 1, g: 1, b: 1 };
const MUTED = { r: 0.627, g: 0.627, b: 0.722 };

// -- Header Block (pill + isotipo + metadata line) --
const header = figma.createComponent();
header.name = "UI Block / Header";
header.layoutMode = "HORIZONTAL";
header.primaryAxisAlignItems = "CENTER";
header.counterAxisAlignItems = "CENTER";
header.itemSpacing = 12;
header.paddingLeft = 16; header.paddingRight = 16;
header.paddingTop = 8; header.paddingBottom = 8;
header.fills = [{ type: "SOLID", color: { r: 0.039, g: 0.039, b: 0.059 }, opacity: 0.8 }];
header.cornerRadius = 4;
header.x = 100; header.y = 2800;

const hLabel = figma.createText();
hLabel.fontName = { family: "Space Grotesk", style: "Bold" };
hLabel.characters = "GEOPOLITIK DROP"; hLabel.fontSize = 11;
hLabel.letterSpacing = { value: 1.5, unit: "PIXELS" };
hLabel.fills = [{ type: "SOLID", color: CYAN }];
header.appendChild(hLabel);

const sep = figma.createRectangle();
sep.resize(1, 16); sep.fills = [{ type: "SOLID", color: WHITE, opacity: 0.2 }];
header.appendChild(sep);

const hDate = figma.createText();
hDate.fontName = { family: "JetBrains Mono", style: "Regular" };
hDate.characters = "2026.03.31"; hDate.fontSize = 11;
hDate.fills = [{ type: "SOLID", color: MUTED }];
header.appendChild(hDate);

// -- Title Block (title + frequency line + subtitle) --
const titleBlock = figma.createComponent();
titleBlock.name = "UI Block / Title";
titleBlock.layoutMode = "VERTICAL";
titleBlock.primaryAxisAlignItems = "MIN";
titleBlock.counterAxisAlignItems = "MIN";
titleBlock.itemSpacing = 8;
titleBlock.x = 100; titleBlock.y = 2900;
titleBlock.fills = [];

const title = figma.createText();
title.fontName = { family: "Bebas Neue", style: "Regular" };
title.characters = "TÍTULO DEL VIDEO"; title.fontSize = 48;
title.lineHeight = { value: 45.6, unit: "PIXELS" };
title.letterSpacing = { value: 1.44, unit: "PIXELS" };
title.fills = [{ type: "SOLID", color: WHITE }];
titleBlock.appendChild(title);

const fLine = figma.createRectangle();
fLine.resize(200, 3); fLine.fills = [{ type: "SOLID", color: CYAN }]; fLine.cornerRadius = 1.5;
titleBlock.appendChild(fLine);

const subtitle = figma.createText();
subtitle.fontName = { family: "Space Grotesk", style: "Regular" };
subtitle.characters = "Subtítulo o contexto adicional"; subtitle.fontSize = 16;
subtitle.fills = [{ type: "SOLID", color: MUTED }];
titleBlock.appendChild(subtitle);

// -- Lower Third --
const lower = figma.createComponent();
lower.name = "UI Block / Lower Third";
lower.layoutMode = "HORIZONTAL";
lower.primaryAxisAlignItems = "CENTER";
lower.counterAxisAlignItems = "CENTER";
lower.itemSpacing = 8;
lower.paddingLeft = 16; lower.paddingRight = 16;
lower.paddingTop = 10; lower.paddingBottom = 10;
lower.fills = [{ type: "SOLID", color: { r: 0.039, g: 0.039, b: 0.059 }, opacity: 0.85 }];
lower.x = 100; lower.y = 3100;

const lLine = figma.createRectangle();
lLine.resize(3, 24); lLine.fills = [{ type: "SOLID", color: CYAN }]; lLine.cornerRadius = 1.5;
lower.appendChild(lLine);

const lText = figma.createText();
lText.fontName = { family: "Space Grotesk", style: "Bold" };
lText.characters = "NOMBRE DEL ANALISTA"; lText.fontSize = 14;
lText.fills = [{ type: "SOLID", color: WHITE }];
lower.appendChild(lText);

return { msg: "3 UI block components created (Header, Title, Lower Third)" };
```

---

## CALL 3: Template Frames — YouTube Thumbnail + IG Carousel

```javascript
const pages = figma.root.children;
figma.currentPage = pages.find(p => p.name.includes("Templates"));

await figma.loadFontAsync({ family: "Bebas Neue", style: "Regular" });
await figma.loadFontAsync({ family: "Space Grotesk", style: "Bold" });
await figma.loadFontAsync({ family: "Space Grotesk", style: "Regular" });

const DARK = { r: 0.039, g: 0.039, b: 0.059 };
const CYAN = { r: 0, g: 0.898, b: 1 };
const WHITE = { r: 1, g: 1, b: 1 };
const MUTED = { r: 0.627, g: 0.627, b: 0.722 };

// -- YouTube Thumbnail 1280×720 --
const ytFrame = figma.createFrame();
ytFrame.name = "Template / YouTube Thumbnail / GD";
ytFrame.resize(1280, 720);
ytFrame.fills = [{ type: "SOLID", color: DARK }];
ytFrame.x = 0; ytFrame.y = 0;

// Safe area indicator
const safe = figma.createRectangle();
safe.name = "safe-area"; safe.resize(1200, 640);
safe.x = 40; safe.y = 40;
safe.fills = []; safe.strokes = [{ type: "SOLID", color: CYAN, opacity: 0.15 }];
safe.strokeWeight = 1; safe.dashPattern = [8, 4];
ytFrame.appendChild(safe);

// Title zone
const ytTitle = figma.createText();
ytTitle.fontName = { family: "Bebas Neue", style: "Regular" };
ytTitle.characters = "TÍTULO DEL EPISODIO";
ytTitle.fontSize = 64; ytTitle.fills = [{ type: "SOLID", color: WHITE }];
ytTitle.x = 80; ytTitle.y = 280;
ytFrame.appendChild(ytTitle);

// Frequency line accent
const ytLine = figma.createRectangle();
ytLine.resize(280, 3); ytLine.fills = [{ type: "SOLID", color: CYAN }];
ytLine.cornerRadius = 1.5; ytLine.x = 80; ytLine.y = 360;
ytFrame.appendChild(ytLine);

// Pillar badge zone
const badge = figma.createRectangle();
badge.name = "pillar-badge-zone"; badge.resize(180, 32);
badge.x = 80; badge.y = 620;
badge.fills = [{ type: "SOLID", color: CYAN, opacity: 0.12 }];
badge.cornerRadius = 4;
ytFrame.appendChild(badge);

// -- IG Carousel Cover 1080×1350 --
const igCover = figma.createFrame();
igCover.name = "Template / IG Carousel / Cover / GD";
igCover.resize(1080, 1350);
igCover.fills = [{ type: "SOLID", color: DARK }];
igCover.x = 1400; igCover.y = 0;

const igTitle = figma.createText();
igTitle.fontName = { family: "Bebas Neue", style: "Regular" };
igTitle.characters = "TÍTULO DEL\nCARRUSEL";
igTitle.fontSize = 72; igTitle.fills = [{ type: "SOLID", color: WHITE }];
igTitle.x = 80; igTitle.y = 480;
igCover.appendChild(igTitle);

const igLine = figma.createRectangle();
igLine.resize(200, 3); igLine.fills = [{ type: "SOLID", color: CYAN }];
igLine.cornerRadius = 1.5; igLine.x = 80; igLine.y = 660;
igCover.appendChild(igLine);

// -- IG Carousel Interior Slide --
const igSlide = figma.createFrame();
igSlide.name = "Template / IG Carousel / Slide / GD";
igSlide.resize(1080, 1350);
igSlide.fills = [{ type: "SOLID", color: DARK }];
igSlide.x = 2600; igSlide.y = 0;

const slideBody = figma.createText();
slideBody.fontName = { family: "Space Grotesk", style: "Regular" };
slideBody.characters = "Contenido del slide. Datos clave, análisis, contexto geopolítico.";
slideBody.fontSize = 24; slideBody.fills = [{ type: "SOLID", color: WHITE }];
slideBody.x = 80; slideBody.y = 200;
slideBody.resize(920, 900);
slideBody.textAutoResize = "HEIGHT";
igSlide.appendChild(slideBody);

return { msg: "3 template frames created (YT Thumbnail + IG Cover + IG Slide)" };
```

---

## CALL 4: Template Frames — TikTok/Reel + Post Cuadrado

```javascript
const pages = figma.root.children;
figma.currentPage = pages.find(p => p.name.includes("Templates"));

await figma.loadFontAsync({ family: "Bebas Neue", style: "Regular" });
await figma.loadFontAsync({ family: "Space Grotesk", style: "Bold" });

const DARK = { r: 0.039, g: 0.039, b: 0.059 };
const CYAN = { r: 0, g: 0.898, b: 1 };
const WHITE = { r: 1, g: 1, b: 1 };

// -- TikTok/Reel Overlay 1080×1920 --
const tikTok = figma.createFrame();
tikTok.name = "Template / Story-Reel / Overlay / GD";
tikTok.resize(1080, 1920);
tikTok.fills = [{ type: "SOLID", color: DARK }];
tikTok.x = 0; tikTok.y = 1500;

// Safe areas (TikTok UI zones)
const topSafe = figma.createRectangle();
topSafe.name = "top-safe-zone"; topSafe.resize(1080, 200);
topSafe.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 }, opacity: 0.08 }];
topSafe.x = 0; topSafe.y = 0;
tikTok.appendChild(topSafe);

const bottomSafe = figma.createRectangle();
bottomSafe.name = "bottom-safe-zone"; bottomSafe.resize(1080, 280);
bottomSafe.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 }, opacity: 0.08 }];
bottomSafe.x = 0; bottomSafe.y = 1640;
tikTok.appendChild(bottomSafe);

const rightSafe = figma.createRectangle();
rightSafe.name = "right-icons-zone"; rightSafe.resize(100, 500);
rightSafe.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 }, opacity: 0.08 }];
rightSafe.x = 980; rightSafe.y = 800;
tikTok.appendChild(rightSafe);

// Lower third zone
const lowerZone = figma.createRectangle();
lowerZone.name = "lower-third-zone"; lowerZone.resize(800, 120);
lowerZone.fills = [{ type: "SOLID", color: DARK, opacity: 0.85 }];
lowerZone.x = 60; lowerZone.y = 1480;
lowerZone.cornerRadius = 8;
tikTok.appendChild(lowerZone);

// -- Post Cuadrado 1080×1080 --
const post = figma.createFrame();
post.name = "Template / Post Cuadrado / GD";
post.resize(1080, 1080);
post.fills = [{ type: "SOLID", color: DARK }];
post.x = 1400; post.y = 1500;

const postTitle = figma.createText();
postTitle.fontName = { family: "Bebas Neue", style: "Regular" };
postTitle.characters = "DATO CLAVE";
postTitle.fontSize = 56; postTitle.fills = [{ type: "SOLID", color: WHITE }];
postTitle.x = 80; postTitle.y = 380;
post.appendChild(postTitle);

const postLine = figma.createRectangle();
postLine.resize(160, 3); postLine.fills = [{ type: "SOLID", color: CYAN }];
postLine.cornerRadius = 1.5; postLine.x = 80; postLine.y = 460;
post.appendChild(postLine);

return { msg: "2 template frames created (TikTok/Reel + Post Cuadrado)" };
```

---

## Orden de ejecución

1. **CALL 1** → Brand Components (estima 1 tool call)
2. **CALL 2** → UI Block Components (estima 1 tool call)
3. **CALL 3** → YouTube + IG Templates (estima 1 tool call)
4. **CALL 4** → TikTok + Post Templates (estima 1 tool call)

**Total estimado:** 4 tool calls para completar el sistema visual
