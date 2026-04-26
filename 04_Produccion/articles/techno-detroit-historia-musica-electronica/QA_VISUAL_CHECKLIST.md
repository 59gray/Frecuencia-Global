# Visual QA Checklist — Reutilizable por artículo

> Usar antes de hacer commit de cualquier asset nuevo.
> Copiar y rellenar para cada artículo.

---

## Artículo
- Slug: _______________
- Asset evaluado: _______________
- Fecha: _______________

---

## Derivación

- [ ] El asset deriva del contenido real del artículo (no es imagen genérica)
- [ ] Existe ARTICLE_VISUAL_BRIEF.md para este artículo
- [ ] El prompt usado está documentado en ASSET_PROMPTS.md
- [ ] El asset se generó con ComfyUI (o tiene autorización explícita alternativa)

## Contenido visual

- [ ] No contiene logos de marcas externas
- [ ] No contiene texto grande incrustado innecesario
- [ ] No contiene personas reales identificables sin autorización
- [ ] No es estética genérica sin relación con el artículo
- [ ] Funciona con overlay oscuro (zona superior/inferior legible)
- [ ] Funciona en card pequeña (400px de ancho mínimo)
- [ ] Mantiene identidad visual FG (paleta, contraste, no pastel)

## Técnico

- [ ] Formato correcto: PNG o WebP
- [ ] Ratio correcto: 16:9 para cards/thumbnail, 1200x630 para social
- [ ] Ruta correcta según convención:
      - `{slug}-featured-card.png`
      - `{slug}-thumbnail.png`
      - `{slug}-social-1200x630.png`
- [ ] Frontmatter del artículo actualizado para apuntar a la ruta correcta
- [ ] HTTP 200 verificado en preview local (`npm run dev`)
- [ ] No produce error 404 visible en el navegador
- [ ] No muestra alt text visible en el layout

## Registro

- [ ] Asset registrado en ASSETS_MANIFEST.md
- [ ] Seed de ComfyUI documentado (si aplica)
- [ ] Build pasa después del commit (`npm run build`)

---

## Resultado final

- Estado: APROBADO / RECHAZADO / PENDIENTE
- Notas: _______________
