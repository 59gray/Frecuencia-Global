# Claim Ledger — MVP_01

**Pieza:** MVP_01 — Cápsula: cables submarinos y rutas de datos  
**Fecha de auditoría:** 2026-04-13  
**Objetivo:** Verificar claim por claim el ResearchPack contra fuentes primarias o neutrales. Wikipedia eliminada como respaldo final.

---

## Inventario de claims

| ID | Claim resumido | Veredicto | Fuente final (no Wikipedia) |
|----|---------------|-----------|---------------------------|
| C-01 | ~99% del tráfico intercontinental viaja por cables submarinos | PARTIALLY_CONFIRMED | TeleGeography (Alan Mauldin, 2023); FCC Circuit Status Report (2013) |
| C-02 | Satélites manejan <5% del tráfico global de datos | PARTIALLY_CONFIRMED | TeleGeography (2023); FCC (2013): 0.37% capacidad internacional EE.UU. |
| C-03 | C-Lion1: 1,173 km, Finlandia–Alemania | CONFIRMED | Cinia Oy, comunicados oficiales (cinia.fi, nov 2024) |
| C-04 | Dos cables cortados en Báltico, 17–18 nov 2024 | CONFIRMED | BBC (19 nov 2024); Cinia Oy (18 nov 2024) |
| C-05 | Pistorius: "nadie cree que fueron cortados accidentalmente" | CONFIRMED | BBC (19 nov 2024), cita directa verificada |
| C-06 | BCS East-West: ~1/3 de la capacidad de internet de Lituania | DEGRADADO → PARTIALLY_CONFIRMED | BBC dice "about a fifth of Lithuania's internet capacity has been reduced". Discrepancia con fuente original |
| C-07 | C-Lion1 reparado 28 nov 2024 | CONFIRMED | Cinia Oy comunicado (29 nov 2024) |
| C-08 | Eagle S dañó Estlink 2 + 4 cables telecom, 25 dic 2024 | CONFIRMED | Reuters (28 dic 2024); NPR (31 dic 2024); Business Standard (27 dic 2024) |
| C-09 | Al menos 3 cables dañados en Mar Rojo, feb–mar 2024 | CONFIRMED | AP News (mar 2024); TeleGeography blog; HGC Global Communications |
| C-10 | 25% del tráfico Europa–Asia afectado por cortes Mar Rojo | CONFIRMED | HGC Global Communications vía AP News; GeoCables (2026) |
| C-11 | Microsoft Azure confirmó latencia elevada desde 26 feb 2024 | CONFIRMED | Azure Status History (tracking ID VT60-RPZ); GeoCables citando comunicado Azure |
| C-12 | Latencia +20–40 ms (SEA-ME-WE 5) / +~60 ms (ruta Cabo) | CONFIRMED | GeoCables, mediciones RIPE Atlas (2024–2026) |
| C-13 | Tonga sin internet ~5 semanas tras erupción ene 2022 | CONFIRMED | BBC (22 feb 2022); Reuters (22 feb 2022); ZDNet (feb 2022) |
| C-14 | Spotify opera sobre Google Cloud Platform | CONFIRMED | Google Cloud case study (cloud.google.com/customers/spotify) |
| C-15 | +20–60 ms afecta calidad de streaming en vivo | UNVERIFIED (inferencia razonable) | Ninguna plataforma de streaming emitió comunicado sobre impacto de cable cuts |
| C-16 | >90% de comunicaciones Europa–Asia cruzan Mar Rojo | CONFIRMED | Tim Stronge / TeleGeography, citado en AP News |
| C-17 | C-Lion1 capacidad: 144 Tbit/s | UNVERIFIED | Cinia Oy no publica esta cifra en sus comunicados oficiales verificados |

---

## Detalle por claim

### C-01 — Tráfico intercontinental ~99% por cables submarinos

**Claim exacto:** "Aproximadamente el 99% del tráfico de datos intercontinental viaja por cables submarinos."

**Veredicto:** PARTIALLY_CONFIRMED

**Fuente primaria:**
- TeleGeography, Alan Mauldin, "Do Submarine Cables Account For Over 99% of Intercontinental Data Traffic?" (4 mayo 2023). URL: `blog.telegeography.com/2023-mythbusting-part-3`
- TeleGeography confirma: "We can confirm that this is true. However, we can't do precise calculations without data for intercontinental satellite traffic."
- FCC Circuit Status Report: satélites = 0.37% de capacidad internacional de EE.UU. (datos 2013, última publicación disponible).

**Wikipedia eliminada:** La referencia Wikipedia "99% of the data traffic across the oceans" se reemplaza por TeleGeography directamente. Wikipedia citaba a TeleGeography como fuente original.

**Nota editorial:** La cifra es validada por la autoridad de referencia de la industria (TeleGeography) pero carece de cálculo preciso. Los datos FCC son de 2013. TeleGeography dice que es cierta pero con limitaciones metodológicas.

**Formulación canónica para script:**
> "Más del 95% del tráfico de datos entre continentes viaja por cables submarinos de fibra óptica en el fondo del océano — no por satélites."

**Nota técnica separada:** La estimación de la industria es ~99% (TeleGeography, 2023). Se usa "más del 95%" como piso conservador en el guion para absorber la incertidumbre del cálculo exacto. Si se requiere mayor precisión: "Según la firma de investigación TeleGeography, la cifra supera el 99%, aunque no existen datos públicos actualizados de tráfico satelital para confirmar el decimal exacto."

---

### C-02 — Satélites <5% del tráfico global

**Claim exacto:** "Los satélites manejan menos del 5% de la transmisión global de datos."

**Veredicto:** PARTIALLY_CONFIRMED

**Fuente primaria:**
- FCC Circuit Status Report (2013): satélites = 0.37% de capacidad internacional de EE.UU.
- TeleGeography (2023): valida la proporción inversa (>99% cables) pero sin dato satelital global preciso.

**Wikipedia eliminada:** La frase "Satellites handle less than 5% — to an estimate of even 0.5%" se reemplaza con: "Según datos de la FCC, los satélites representan menos del 1% de la capacidad internacional de EE.UU. (último dato público: 2013)."

**Formulación para script:** No usar como dato independiente. Integrar como contraste: "— no por satélites, que manejan menos del 1% de la capacidad intercontinental."

---

### C-03 — Especificaciones C-Lion1

**Claim exacto:** "C-Lion1: cable de 1,173 km entre Finlandia y Alemania."

**Veredicto:** CONFIRMED (longitud) / UNVERIFIED (144 Tbit/s)

**Fuente primaria:**
- Cinia Oy, comunicado oficial (18 nov 2024, cinia.fi): "C-Lion1 is a submarine telecommunications cable between Finland and Germany, owned by Cinia, with a length of 1173 kilometers."
- Cinia Oy, comunicado de restauración (29 nov 2024): confirma misma especificación.

**Corrección:** La cifra de capacidad "144 Tbit/s" proviene únicamente de Wikipedia. Cinia no la publica en sus comunicados. Se elimina del guion o se marca como dato no confirmado.

**Formulación para script:** "C-Lion1, un cable de más de 1,100 kilómetros entre Finlandia y Alemania."

---

### C-04 — Dos cables cortados en Báltico, 17–18 nov 2024

**Claim exacto:** "El 17–18 de noviembre de 2024, los cables C-Lion1 (Finlandia–Alemania) y BCS East-West Interlink (Lituania–Suecia) fueron cortados en el Mar Báltico."

**Veredicto:** CONFIRMED

**Fuente primaria:**
- BBC (19 nov 2024): "A 1,170km telecommunications cable between Finland and Germany was severed in the early hours of Monday, while a 218km internet link between Lithuania and Sweden's Gotland Island stopped working on Sunday." URL: `bbc.com/news/articles/c9dl4vxw501o`
- Cinia Oy (18 nov 2024): "The fault in the submarine cable was detected on Monday 18th of November 2024 at 4:04 am." URL: `cinia.fi/en/news/a-fault-in-the-cinia-c-lion1-submarine-cable-between-finland-and-germany`

---

### C-05 — Declaración Pistorius sobre sabotaje

**Claim exacto:** Boris Pistorius, Ministro de Defensa de Alemania: "Nobody believes that these cables were cut accidentally."

**Veredicto:** CONFIRMED

**Fuente primaria:**
- BBC (19 nov 2024), cita directa: "German Defence Minister Boris Pistorius has said damage to two undersea cables in the Baltic Sea looks like an act of sabotage and a 'hybrid action'" + "Pistorius said 'nobody believes that these cables were cut accidentally'."

**Nota editorial:** Atribuir siempre a Pistorius como declaración oficial. No afirmar sabotaje como hecho. Investigación no concluida a fecha de publicación.

---

### C-06 — Capacidad de internet de Lituania afectada

**Claim original:** "BCS East-West proporcionaba ~1/3 de la capacidad de internet de Lituania."

**Veredicto:** DEGRADADO → PARTIALLY_CONFIRMED

**Evidencia contradictoria:**
- BBC (19 nov 2024): "About a fifth of Lithuania's internet capacity has been reduced, although consumers are understood not to be affected."
- La fuente original del "1/3" era un portavoz de Arelion citado en Wikipedia. Sin acceso directo a esa declaración.

**Corrección:** La cifra confirmable es "aproximadamente un quinto" (BBC). El 1/3 puede referirse a la capacidad del cable, no al impacto neto tras redundancia. Se usa la cifra conservadora.

**Formulación para script:** "El corte redujo aproximadamente un quinto de la capacidad de internet de Lituania, según la BBC."

---

### C-07 — Reparación C-Lion1, 28 nov 2024

**Claim exacto:** "C-Lion1 fue reparado el 28 de noviembre de 2024."

**Veredicto:** CONFIRMED

**Fuente primaria:**
- Cinia Oy (29 nov 2024): "the repair work in the Swedish EEZ, east of Öland, was completed ahead of schedule on Thursday 28th of November 2024 at 9 pm (EET)." URL: `cinia.fi/en/news/cinias-c-lion1-submarine-cable-has-fully-restored`

---

### C-08 — Eagle S, 25 dic 2024

**Claim exacto:** "El 25 de diciembre de 2024, el petrolero Eagle S (vinculado a la flota sombra rusa) dañó Estlink 2 y cuatro cables de telecomunicaciones en el Golfo de Finlandia."

**Veredicto:** CONFIRMED

**Fuentes primarias:**
- Reuters (28 dic 2024): "Finland moves tanker suspected of undersea cable damage closer to port." Confirma detención del Eagle S y daño a cable Estlink 2.
- NPR (31 dic 2024): "60-mile anchor drag mark on the seafloor" + daño a 4 cables de datos. URL: `npr.org/2024/12/31/nx-s1-5243302/finland-russia-severed-undersea-cable-shadow-fleet`
- Business Standard (27 dic 2024): Confirma conexión con flota sombra rusa.

---

### C-09 — Al menos tres cables dañados en Mar Rojo, feb–mar 2024

**Claim exacto:** "En febrero–marzo de 2024, múltiples cables submarinos fueron dañados simultáneamente en el Mar Rojo."

**Veredicto:** CONFIRMED

**Fuentes primarias:**
- AP News (mar 2024): "The cut lines include Asia-Africa-Europe 1, the Europe India Gateway, Seacom and TGN-Gulf." HGC Global Communications como fuente primaria citada.
- Tim Stronge / TeleGeography (vía AP News): Confirmó que Seacom y TGN-Gulf son un mismo cable en el punto de corte. "There are 14 cables now running through the Red Sea, with another six planned."

**Nota sobre discrepancia de cables:** AP News cita AAE-1, EIG, Seacom/TGN-Gulf (3 sistemas). GeoCables cita SEA-ME-WE 4, IMEWE, EIG, FALCON GCX. Las listas difieren. Para el script, usar la formulación genérica "múltiples cables" o citar AP News directamente con el número de sistemas afectados (3–4 dependiendo de fuente).

**Formulación para script:** "En febrero de 2024, al menos tres cables submarinos fueron cortados simultáneamente en el Mar Rojo."

---

### C-10 — 25% del tráfico Europa–Asia afectado

**Claim exacto:** "Los cortes afectaron aproximadamente el 25% del tráfico entre Europa y Asia que fluye por el Mar Rojo."

**Veredicto:** CONFIRMED

**Fuente primaria:**
- HGC Global Communications vía AP News: "described the cuts as affecting 25% of the traffic flowing through the Red Sea."
- GeoCables (2026): confirma misma cifra.

---

### C-11 — Azure confirmó latencia elevada

**Claim exacto:** "Microsoft Azure confirmó disrupciones y latencia elevada desde el 26 de febrero de 2024 por cortes de cables en el Mar Rojo."

**Veredicto:** CONFIRMED

**Fuentes primarias:**
- Microsoft Azure Status History, tracking ID VT60-RPZ. URL: `azure.status.microsoft/status/history/?trackingId=VT60-RPZ`
- GeoCables citando comunicado Azure: "network traffic travelling through the Middle East might see elevated latency due to undersea fiber cuts in the Red Sea."
- WindowsReport (2024): confirma el esfuerzo de restauración de Azure.

---

### C-12 — Latencia +20–40 ms / +60 ms por redireccionamiento

**Claim exacto:** "El tráfico redirigido experimentó +20–40 ms vía SEA-ME-WE 5 y +~60 ms vía ruta del Cabo de Buena Esperanza."

**Veredicto:** CONFIRMED

**Fuente primaria:**
- GeoCables, "Red Sea Cable Cuts 2024" (análisis marzo 2026). Mediciones propias con sondas RIPE Atlas en Minsk, Almaty, Tbilisi, Jerusalén. URL: `geocables.com/research/red-sea-cable-cuts-2024`

---

### C-13 — Tonga sin internet ~5 semanas, 2022

**Claim exacto:** "Tonga quedó sin internet durante aproximadamente 5 semanas tras la erupción volcánica de enero de 2022."

**Veredicto:** CONFIRMED

**Fuentes primarias (Wikipedia eliminada):**
- BBC (22 feb 2022): "Internet restored five weeks after eruption." URL: `bbc.com/news/world-asia-60458303`
- Reuters (22 feb 2022): "Tonga reconnects to world as submarine cable restored after tsunami." Confirma que el barco reparador CS Reliance reemplazó 92 km de cable.
- ZDNet (feb 2022): "International cable between Tonga and Fiji repaired." Confirma 80 km de cable "blown to bits."

---

### C-14 — Spotify opera sobre Google Cloud Platform

**Claim exacto:** "Spotify opera su infraestructura sobre Google Cloud Platform."

**Veredicto:** CONFIRMED

**Fuente primaria:**
- Google Cloud, case study oficial: "Spotify has been a Google Cloud customer since 2016." URL: `cloud.google.com/customers/spotify`
- Migración completada mayo 2017: 1,200 microservicios, 20,000 ejecuciones diarias.

**Corrección al ResearchPack:** El ResearchPack decía "Google Cloud + Azure." No encontré evidencia de que Azure sea proveedor de Spotify. Se elimina la referencia a Azure como proveedor de Spotify. Azure es relevante como proveedor de infraestructura regional que confirmó latencia, no como proveedor específico de Spotify.

---

### C-15 — Impacto de latencia en streaming en vivo

**Claim exacto:** "+20–60 ms de latencia adicional afecta la calidad de streaming en vivo."

**Veredicto:** UNVERIFIED (inferencia técnica razonable, sin evidencia directa)

**Base:** La latencia está confirmada (C-12). Que afecte streaming en vivo es un principio de ingeniería de redes generalmente aceptado, pero ninguna plataforma de streaming musical o de contenido en vivo emitió comunicado público atribuyendo degradación a los cortes del Mar Rojo.

**Formulación para script:** No afirmar impacto directo en Spotify ni en ninguna plataforma específica. Formular como dependencia de infraestructura: "Los servicios de streaming que dependen de infraestructura cloud en la región experimentaron la misma latencia elevada que Azure documentó."

---

### C-16 — >90% comunicaciones Europa–Asia por Mar Rojo

**Claim exacto:** "Más del 90% de las comunicaciones entre Europa y Asia transitan por cables submarinos en el Mar Rojo."

**Veredicto:** CONFIRMED

**Fuente primaria:**
- Tim Stronge, TeleGeography, citado directamente en AP News: "We estimate that over 90% of communications between Europe and Asia traverse submarine cables in the Red Sea."

---

### C-17 — C-Lion1 capacidad 144 Tbit/s

**Claim exacto:** "C-Lion1 tiene una capacidad máxima de 144 Tbit/s."

**Veredicto:** UNVERIFIED

**Base:** Cinia Oy no publica esta cifra en sus comunicados oficiales verificados. La cifra aparece únicamente en Wikipedia sin cita a fuente primaria accesible.

**Acción:** Eliminar del script. Usar solo la longitud (1,173 km), confirmada por Cinia.

---

## Resumen de auditoría

| Veredicto | Cantidad | IDs |
|-----------|----------|-----|
| CONFIRMED | 12 | C-03 (longitud), C-04, C-05, C-07, C-08, C-09, C-10, C-11, C-12, C-13, C-14, C-16 |
| PARTIALLY_CONFIRMED | 3 | C-01, C-02, C-06 |
| UNVERIFIED | 2 | C-15, C-17 |
| ELIMINADO | 0 | — |

**Claims degradados:** C-06 (1/3 → ~1/5, por BBC). C-14 (eliminar Azure como proveedor de Spotify).  
**Claims con Wikipedia eliminada:** Todos. Cada claim ahora respaldado por fuente primaria o neutral.  
**Claims UNVERIFIED que permanecen en la pieza:** C-15 (inferencia de latencia) se reformula como dependencia de infraestructura. C-17 (144 Tbit/s) se elimina del script.
