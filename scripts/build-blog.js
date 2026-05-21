// Blog scaffold + posts. Run: node scripts/build-blog.js
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const today = new Date().toISOString().slice(0, 10);
const SITE = 'https://klima-al.com';

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const POSTS = [
  {
    slug: 'si-te-zgjedhesh-kondicioner',
    titleSq: 'Si të zgjedhësh kondicionerin e duhur për shtëpinë në Shqipëri (Udhëzues 2026)',
    titleEn: 'How to choose the right A/C for your home in Albania (2026 guide)',
    descSq: 'Udhëzues praktik 2026 për të zgjedhur kondicionerin e duhur sipas m², klimës dhe buxhetit në Shqipëri. Krahasim KIREIA, Multi-Split, Hyper Inverter.',
    descEn: 'Practical 2026 guide to choosing the right A/C by m², climate and budget in Albania. KIREIA, Multi-Split, Hyper Inverter compared.',
    excerptSq: 'Çfarë fuqie të zgjedh? Monosplit apo Multi-Split? Cila klasë energjetike? Kjo faqe përgjigjet sipas standardit shqiptar.',
    publishDate: '2026-04-22',
    bodySq: `
<h2>1. Llogarit fuqinë sipas m² të dhomës</h2>
<p>Rregulli i artë i industrisë HVAC në Shqipëri: <strong>100 W për m²</strong> për dhoma me tavan 2.6–2.8 m, izolim standard dhe orientim diellor mesatar. Pra:</p>
<ul>
  <li><strong>10–15 m²</strong> (dhomë gjumi e vogël, zyrë) → 2.0 kW (≈ 7 000 BTU) — <a href="../product/kireia-2kw.html">KIREIA 2.0 kW</a></li>
  <li><strong>15–22 m²</strong> (dhomë standarde) → 2.5 kW (≈ 9 000 BTU) — <a href="../product/kireia-2_5kw.html">KIREIA 2.5 kW</a></li>
  <li><strong>22–28 m²</strong> (dhomë ndenjeje e mesme) → 3.5 kW (≈ 12 000 BTU) — <a href="../product/kireia-3_5kw.html">KIREIA 3.5 kW</a></li>
  <li><strong>30–45 m²</strong> (sallon i hapur) → 5.0 kW (≈ 18 000 BTU) — <a href="../product/kireia-5kw.html">KIREIA 5.0 kW</a></li>
  <li><strong>50+ m²</strong> me 2–4 dhoma → Sistem Multi-Split SCM 60–100</li>
</ul>
<p>Shto një hap (p.sh. 2.5 → 3.5 kW) nëse: dhoma ka drita të mëdha jugore, kuzhinë me sobë të nxehtë, tavanet > 3 m, ose izolim i dobët. Llogarit koston e energjisë me <a href="../kalkulator-energjie.html">kalkulatorin tonë</a>.</p>

<h2>2. Monosplit apo Multi-Split?</h2>
<p><strong>Monosplit</strong> (1 njësi e brendshme + 1 e jashtme) është zgjedhja standarde për 1 dhomë. <strong>Multi-Split</strong> (SCM 60–100) lidh 2–5 njësi të brendshme me një kompresor të vetëm — ideale për apartamente ku duhet të mbulosh 3–4 dhoma me një kompresor në ballkon. Avantazhe Multi-Split:</p>
<ul>
  <li>Vetëm 1 njësi e jashtme (më pak zhurmë në ballkon, më pak gypa)</li>
  <li>Kontroll i pavarur i secilës dhomë</li>
  <li>Konsum i përbashkët më i ulët kur përdor disa dhoma njëkohësisht</li>
</ul>
<p>Mangësitë: kosto fillestare më e lartë, dhe nëse kompresori i jashtëm prishet, ndalon i gjithë sistemi.</p>

<h2>3. Klasa energjetike — A+++ vs A++ vs A</h2>
<p>Diferenca në faturën e energjisë është reale. Një kondicioner A+++ (SEER 8.7) konsumon afërsisht <strong>40% më pak energji</strong> se modeli A (SEER 4.1) i 5–7 vjetëve më parë, për të njëjtën fuqi ftohjeje. Për një familje shqiptare që përdor kondicionerin 6 orë/ditë në sezonin e verës (Qershor–Shtator), kursimi vjetor mund të arrijë <strong>15 000–25 000 L</strong>.</p>
<p>Të gjitha modelet që shesim janë <strong>A+++ në ftohje</strong> dhe A++ në ngrohje. Klikoni mbi <a href="../product/kireia-2_5kw.html">KIREIA 2.5 kW</a> për shembull konkret.</p>

<h2>4. Refrigerant: R32 detyrimisht</h2>
<p>Që nga 2025, BE-ja po heq gradualisht R410A. R32 ka <strong>GWP 675</strong> kundrejt 2 088 të R410A — 3× më miqësor me klimën. Shqipëria ndjek standardet evropiane. Kushdo që ju ofron një kondicioner me R410A ose R22 në 2026, po ju shet inventar të vjetër. <a href="r32-vs-r410a-shpjeguar.html">Lexo udhëzuesin tonë R32 vs R410A</a>.</p>

<h2>5. Klima e Shqipërisë — Hyper Heating është çelësi</h2>
<p>Verat janë të nxehta (35–40 °C në Tiranë, Durrës, Vlorë), por dimri në Tiranë veriore arrin -5 °C dhe Korça arrin -15 °C. Një kondicioner pa <strong>DC Inverter Hyper</strong> fiket ose ngadalësohet drastikisht nën 0 °C. Të gjitha serat Mitsubishi Heavy Industries KIREIA dhe Multi-Split SCM ruajnë funksionimin e plotë në ngrohje deri −15 °C — kjo e bën MHI lider për tregun shqiptar.</p>

<h2>6. Çfarë të mos lëshosh nga sytë</h2>
<ul>
  <li><strong>Wi-Fi i integruar</strong> — të gjithë modelet KIREIA dhe Plus e kanë standard. Përdor app-in <em>Smart M-Air</em> për kontroll në distancë.</li>
  <li><strong>Zhurma</strong> — &le; 21 dB(A) është më e qetë se pëshpëritja. KIREIA Plus arrin 19 dB(A).</li>
  <li><strong>Garanci</strong> — 3 vjet pjesë nga MHI + 1 vit punë nga Klima.Al. Verifiko numrin serial me ne në WhatsApp para se të blesh.</li>
  <li><strong>Filtër Allergen Clear</strong> — kap 99.9% të baktereve dhe polenit. Pastrim çdo 3 muaj.</li>
</ul>

<h2>Rekomandime sipas profilit</h2>
<p><strong>Apartament 2 dhoma në Tiranë:</strong> KIREIA 2.5 kW në dhomën e gjumit + KIREIA 3.5 kW në sallon. Ose Multi-Split SCM 60 me 2 njësi murale.</p>
<p><strong>Vilë 3-katëshe në Vlorë:</strong> Multi-Split SCM 80 me 4 njësi (3 KIREIA murale + 1 Hyper Inverter dyshemeje për katin përdhe).</p>
<p><strong>Hotel ose lokal:</strong> Disa Multi-Split SCM 100 sipas zonave; konsultim falas në vend nga ekipi ynë.</p>
`,
    bodyEn: `<p>(EN content available upon language switch.)</p>`
  },
  {
    slug: 'mirembajtja-vjetore-kondicioner',
    titleSq: 'Mirëmbajtja vjetore e kondicionerit — Hapat që duhet të bësh çdo vit',
    titleEn: 'Annual A/C maintenance — Steps you should do every year',
    descSq: 'Si të kujdesesh për kondicionerin Mitsubishi në Shqipëri: pastrim filtrash, kontroll gazi R32, diagnostikë elektronike. Hapat dhe çmimet 2026.',
    descEn: 'How to maintain your Mitsubishi A/C in Albania: filter cleaning, R32 gas check, electronic diagnostics. 2026 steps and prices.',
    excerptSq: 'Pastrim filtrash çdo 3 muaj, servis profesional 1 herë në vit. Pse mirëmbajtja vjetore e mban garancinë aktive.',
    publishDate: '2026-04-08',
    bodySq: `
<h2>Pse mirëmbajtja vjetore është e detyrueshme</h2>
<p>Mitsubishi Heavy Industries kërkon servis profesional <strong>1 herë në vit</strong> për të mbajtur aktive garancinë 3-vjeçare të prodhuesit. Mirëmbajtja parandalon prishjet, ul faturën e energjisë (deri 15% më shumë konsum nëse filtrat janë të pisët) dhe zgjat jetën e kompresorit. Një KIREIA i mirëmbajtur zgjat <strong>12–15 vjet</strong>; pa servis vjetor, jetëgjatësia bie nën 8 vjet.</p>

<h2>Çfarë bëjmë në servisin vjetor (90 min)</h2>
<ol>
  <li><strong>Pastrim filtrash brenda</strong> — heqja, pastrimi me ujë dhe sapun të butë, tharje, vendosja prapa. Aktivizon filtrin Allergen Clear.</li>
  <li><strong>Pastrim shkëmbyesi i ngrohjes</strong> — spërkatje me solucion antibakterial dhe pastrim me presion të ulët për të hequr pluhurin dhe mykun nga rrjeta e brendshme.</li>
  <li><strong>Kontroll gypash kullimi</strong> — pastrim gypit të ujit (vendi më i shpeshtë i bllokimeve që shkaktojnë pikim brenda).</li>
  <li><strong>Kontroll gazi R32</strong> — me manometra dyfish: presioni i ulët 100–120 PSI, presioni i lartë 350–400 PSI gjatë funksionimit normal. Nëse mungon &gt; 5%, mbushje me R32 origjinal.</li>
  <li><strong>Pastrim shkëmbyesi i jashtëm</strong> — heqja e gjetheve, pluhurit, fletëve të vegjelëve nga rrjeta e jashtme. Drejtimi i fletëzave të deformuara.</li>
  <li><strong>Diagnostikë elektronike</strong> — lidhja me lexuesin MHI; verifikimi i kodeve të gabimit, temperaturës së jashtme/brendshme, rrymës së kompresorit.</li>
  <li><strong>Test funksionimi</strong> — 15 min ftohje + 15 min ngrohje; matja e delta T (duhet ≥ 8 °C në ftohje).</li>
</ol>

<h2>Çfarë mund të bësh vetë çdo 3 muaj</h2>
<ul>
  <li><strong>Hiq dhe pastro filtrat</strong> e brendshëm me ujë të nxehtë. Trego rrjetën në dritë: nëse nuk shihni dritën të kalojë, është bllokuar.</li>
  <li><strong>Fshini fletët e jashtme</strong> me një furçë të butë (mos përdor presion të lartë drejtpërdrejt mbi to).</li>
  <li><strong>Verifiko fundin e njësisë së brendshme</strong> — nëse sheh pikë uji ose myk, telefono ekipin tonë.</li>
</ul>

<h2>Çmimet e mirëmbajtjes (2026)</h2>
<ul>
  <li><strong>Monosplit standard në Tiranë:</strong> 3 000 L</li>
  <li><strong>Multi-Split 2 njësi:</strong> 5 000 L</li>
  <li><strong>Multi-Split 3+ njësi:</strong> 6 500–8 000 L</li>
  <li><strong>Mbushje R32</strong> (nëse mungon): + 1 500 L për 100 g</li>
  <li><strong>Klientët me kontratë vjetore Klima.Al:</strong> servis vjetor falas + përparësi në thirrje urgjente</li>
</ul>

<h2>Sinjalet që do servis urgjent</h2>
<ul>
  <li><strong>Pikon ujë nga njësia e brendshme</strong> — gypi i kullimit bllokuar ose i shtypur</li>
  <li><strong>Ftohja është më e dobët</strong> — filtër i bllokuar ose gaz i pakët</li>
  <li><strong>Erë e keqe nga ajri</strong> — myk në shkëmbyesin e brendshëm</li>
  <li><strong>Drita "Timer" e gjelbër pulson</strong> — kod gabimi i ruajtur (na e dërgo numrin e ekranit)</li>
  <li><strong>Kompresori i jashtëm bën zhurmë të çuditshme</strong> — telefono menjëherë; mos e përdor</li>
</ul>

<p style="margin-top:24px"><strong>Rezervo servis në WhatsApp brenda 2 orësh:</strong> <a href="https://wa.me/355672549225">+355 67 254 9225</a></p>
`,
    bodyEn: `<p>(EN content available upon language switch.)</p>`
  },
  {
    slug: 'r32-vs-r410a-shpjeguar',
    titleSq: 'R32 vs R410A — Pse refrigeranti i ri është më i mirë (shpjegim teknik)',
    titleEn: 'R32 vs R410A — Why the new refrigerant is better (technical explanation)',
    descSq: 'Shpjegim teknik: refrigeranti R32 vs R410A — GWP, efikasitet, presion, ngarkesa, inflamabiliteti, status BE. Çfarë do të thotë për kondicionerin tuaj në Shqipëri.',
    descEn: 'Technical explanation: R32 vs R410A refrigerant — GWP, efficiency, pressure, charge, flammability, EU status. What it means for your A/C in Albania.',
    excerptSq: 'GWP 675 vs 2 088, 5-10% më efikas, 30% më pak ngarkesë gazi në sistem. R32 është standardi i ri.',
    publishDate: '2026-03-15',
    bodySq: `
<h2>Çfarë janë R32 dhe R410A</h2>
<p>R32 dhe R410A janë <strong>refrigerantë HFC</strong> — gazra që qarkullojnë brenda kondicionerit dhe transferojnë nxehtësinë midis dhomës dhe ajrit të jashtëm. R410A u prezantua në 1996 si zëvendësim i R22 (që dëmtonte shtresën e ozonit). R32, i pastër, u prezantua tregtarisht në 2012 nga Daikin dhe është bërë standardi i ri global.</p>

<h2>Diferenca kryesore — GWP (Global Warming Potential)</h2>
<p>GWP mat efektin e një gazi mbi nxehjen globale, krahasuar me CO₂ (=1).</p>
<ul>
  <li><strong>R32: GWP 675</strong></li>
  <li><strong>R410A: GWP 2 088</strong></li>
</ul>
<p>Pra nëse 1 kg R410A rrjedh në atmosferë, ka ndikimin e 2 088 kg CO₂. Me R32, vetëm 675 kg. <strong>R32 është 3× më miqësor me klimën.</strong></p>

<h2>Efikasiteti — R32 fiton me 5–10%</h2>
<p>R32 ka <strong>"latent heat" më të lartë</strong> — transferon më shumë energji termike për kilogram. Kjo do të thotë:</p>
<ul>
  <li><strong>5–10% më efikas</strong> në ftohje për të njëjtin konsum elektrik</li>
  <li><strong>30% më pak ngarkesë gazi</strong> në sistem — një kondicioner 2.5 kW përdor ~700 g R32 vs ~1 000 g R410A</li>
  <li>Më pak refrigerant = më pak rrjedhje potenciale = mbrojtje më e mirë e mjedisit</li>
</ul>

<h2>Presioni — R32 punon më lart</h2>
<p>R32 ka presion ~10% më të lartë se R410A në temperaturat e punës. Kjo kërkon:</p>
<ul>
  <li>Kompresorë të dizenjuar specifikisht për R32 (nuk mund të konvertosh një sistem R410A në R32)</li>
  <li>Gypa bakri me trashësi muri më të madhe (zakonisht 0.8 mm vs 0.6 mm)</li>
  <li>Valvula EXV (electronic expansion valves) për kontroll më të mirë presioni</li>
</ul>

<h2>Inflamabiliteti — R32 është A2L, jo i sigurt si R410A</h2>
<p>Sipas ASHRAE Standard 34:</p>
<ul>
  <li><strong>R410A: A1</strong> — jo-inflamabël, jo-toksik. Më i siguri.</li>
  <li><strong>R32: A2L</strong> — pak inflamabël (LFL 14% në ajër), jo-toksik. Më i sigurt se gazi i sobës.</li>
</ul>
<p>Në praktikë, "pak inflamabël" do të thotë që duhen 14% R32 në ajër + një burim flake për t'u ndezur. Në një dhomë normale, kjo kërkon një rrjedhje totale të sistemit pa ventilim — skenari shumë i pamundur. Standardet e instalimit BE për R32 kufizojnë sasinë maksimale të ngarkesës sipas vëllimit të dhomës; teknikët tanë e respektojnë rreptësisht këtë.</p>

<h2>Status rregullator në BE dhe Shqipëri</h2>
<p>Rregullorja F-Gas e BE-së (2024 reform) po heq gradualisht refrigerantët me GWP të lartë:</p>
<ul>
  <li><strong>2025:</strong> R410A ndalohet në sisteme të vogla monosplit të reja</li>
  <li><strong>2027:</strong> R410A ndalohet në Multi-Split të reja</li>
  <li><strong>2032:</strong> ndalim i plotë i shitjes të R410A</li>
</ul>
<p>Shqipëria ndjek standardet evropiane. <strong>Çdo kondicioner i ri që shitet sot duhet të jetë R32.</strong> Modelet e vjetra R410A që mund të gjeni në tregje informalë janë inventar i vjetër ose i importuar joligjërisht.</p>

<h2>A duhet ta zëvendësoj kondicionerin tim R410A?</h2>
<p>Jo. Nëse kondicioneri yt aktual R410A funksionon mirë, mund ta përdorësh deri në fund të jetës së tij (zakonisht 10–12 vjet total). Servisi dhe mbushja janë ende të mundshme tek instaluesit e licencuar. Por kur të blesh modelin e ardhshëm, ai do të jetë R32 detyrimisht.</p>

<h2>Përmbledhje</h2>
<p>R32 është <strong>standardi i ri global</strong> i refrigerantëve për kondicionerët familjarë: 3× më miqësor me klimën, 5–10% më efikas, dhe ligjor në BE për dekadat e ardhshme. Të gjithë modelet që shesim — KIREIA, KIREIA Plus, Multi-Split SCM, Hyper Inverter dyshemeje — përdorin R32.</p>
<p>Shiko modelet R32: <a href="../produkte/residential.html">Kondicionerë Mural</a> · <a href="../produkte/multisplit.html">Multi-Split</a> · <a href="../produkte/floor.html">Hyper Inverter Dysheme</a></p>
`,
    bodyEn: `<p>(EN content available upon language switch.)</p>`
  }
];

function postPage({ slug, titleSq, titleEn, descSq, descEn, publishDate, bodySq, bodyEn }, idx) {
  const canonical = `${SITE}/blog/${slug}.html`;
  const related = POSTS.filter((_, i) => i !== idx).slice(0, 2);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: titleSq,
    description: descSq,
    author: { '@type': 'Organization', name: 'Klima.Al', '@id': `${SITE}/#business` },
    publisher: { '@type': 'Organization', name: 'Klima.Al', '@id': `${SITE}/#business`, logo: { '@type': 'ImageObject', url: `${SITE}/favicon.svg` } },
    datePublished: publishDate,
    dateModified: today,
    mainEntityOfPage: canonical,
    inLanguage: 'sq-AL',
    image: `${SITE}/hero-mitsubishi.jpg`
  };

  return `<!DOCTYPE html>
<html lang="sq">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title data-sq-title="${esc(titleSq)}" data-en-title="${esc(titleEn)}">${esc(titleSq)}</title>
  <meta name="description" content="${esc(descSq)}" />
  <meta name="theme-color" content="#0e1c2f" />
  <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
  <link rel="apple-touch-icon" href="../apple-touch-icon.png" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Klima.Al" />
  <meta property="og:locale" content="sq_AL" />
  <meta property="og:locale:alternate" content="en_AL" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:title" content="${esc(titleSq)}" />
  <meta property="og:description" content="${esc(descSq)}" />
  <meta property="og:image" content="${SITE}/hero-mitsubishi.jpg" />
  <meta property="article:published_time" content="${publishDate}" />
  <meta property="article:modified_time" content="${today}" />
  <meta name="last-modified" content="${today}" />
  <link rel="alternate" hreflang="sq-AL" href="${esc(canonical)}" />
  <link rel="alternate" hreflang="x-default" href="${esc(canonical)}" />
  <link rel="manifest" href="../manifest.webmanifest" />
  <link rel="stylesheet" href="../style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" /></noscript>
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>

<header class="header" id="header">
  <div class="container header-inner">
    <a href="../index.html" class="logo"><span class="logo-k">KLIMA</span><span class="logo-dot">.</span><span class="logo-al">AL</span></a>
    <nav class="nav" id="nav">
      <ul class="nav-list">
        <li><a class="nav-link" href="../index.html">Kreu</a></li>
        <li><a class="nav-link" href="../index.html#cat">Produkte</a></li>
        <li><a class="nav-link" href="index.html" aria-current="page" data-sq="Blog" data-en="Blog">Blog</a></li>
        <li><a class="nav-link" href="../faq.html">Pyetje</a></li>
        <li><a class="nav-link" href="../index.html#contact">Kontakt</a></li>
      </ul>
    </nav>
    <div class="header-right">
      <a href="tel:+355672549225" class="header-phone">📞 +355 67 254 9225</a>
      <button class="cart-btn" id="cartBtn" aria-label="Shporta"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg><span class="cart-badge" id="cartBadge">0</span></button>
      <div class="lang-sw"><button class="lb lb-active" data-lang="sq">SQ</button><span>|</span><button class="lb" data-lang="en">EN</button></div>
    </div>
    <button class="burger" id="burger" aria-label="Menyja" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
  </div>
</header>

<div class="cart-backdrop" id="cartBackdrop"></div>
<aside class="cart-drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Shporta">
  <div class="cart-head"><h3>Shporta jote</h3><button class="cart-close" id="cartClose" aria-label="Mbyll">×</button></div>
  <div class="cart-body"><div class="cart-list" id="cartList"></div><p class="cart-empty" id="cartEmpty">Shporta është bosh.</p></div>
  <div class="cart-foot"><button class="btn btn-red cart-checkout" id="cartCheckout" disabled>Porosit me WhatsApp</button></div>
</aside>

<main class="blog-post">
  <div class="container container--narrow">
    <nav class="prod-crumbs" aria-label="Breadcrumb">
      <a href="../index.html">Kreu</a><span>›</span><a href="index.html">Blog</a><span>›</span>
      <span class="crumb-current">${esc(titleSq.slice(0, 50))}…</span>
    </nav>

    <article>
      <header class="blog-head">
        <time datetime="${publishDate}" class="blog-date">${publishDate}</time>
        <h1>${esc(titleSq)}</h1>
        <p class="blog-excerpt">${esc(descSq)}</p>
      </header>

      <div class="blog-body">
        ${bodySq}
      </div>

      <footer class="blog-foot">
        <p data-sq="Shkruar nga ekipi Klima.Al — distributori zyrtar i Mitsubishi Heavy Industries në Shqipëri."
           data-en="Written by the Klima.Al team — official Mitsubishi Heavy Industries distributor in Albania.">Shkruar nga ekipi Klima.Al — distributori zyrtar i Mitsubishi Heavy Industries në Shqipëri.</p>
        <a href="https://wa.me/355672549225" target="_blank" class="btn btn-red">Pyet në WhatsApp</a>
      </footer>
    </article>

    <section class="blog-related">
      <h2 data-sq="Lexime të lidhura" data-en="Related reading">Lexime të lidhura</h2>
      <div class="blog-related-grid">
        ${related.map(p => `<a href="${p.slug}.html" class="blog-card"><time datetime="${p.publishDate}">${p.publishDate}</time><h3>${esc(p.titleSq)}</h3><p>${esc(p.excerptSq)}</p></a>`).join('')}
      </div>
    </section>
  </div>
</main>

<footer class="footer">
  <div class="container footer-top"><div class="f-brand"><a href="../index.html" class="logo logo-white"><span class="logo-k">KLIMA</span><span class="logo-dot">.</span><span class="logo-al">AL</span></a></div></div>
  <div class="footer-bottom"><div class="container"><span>© 2026 Klima.Al · <a href="../privatesia.html" data-sq="Privatësia" data-en="Privacy">Privatësia</a> · <a href="../kushte-perdorimi.html" data-sq="Kushtet" data-en="Terms">Kushtet</a></span></div></div>
</footer>

<a href="https://wa.me/355672549225" target="_blank" class="whatsapp-float" aria-label="WhatsApp"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="26" height="26"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>

<script src="../search.js" defer></script>
<script src="../favorites.js" defer></script>
<script src="../cart.js" defer></script>
<script src="../app.js" defer></script>
<script defer src="/_vercel/speed-insights/script.js"></script>
</body>
</html>`;
}

function indexPage() {
  const canonical = `${SITE}/blog/`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog Klima.Al',
    url: canonical,
    inLanguage: 'sq-AL',
    publisher: { '@type': 'Organization', '@id': `${SITE}/#business` },
    blogPost: POSTS.map(p => ({
      '@type': 'BlogPosting',
      headline: p.titleSq,
      url: `${SITE}/blog/${p.slug}.html`,
      datePublished: p.publishDate
    }))
  };

  return `<!DOCTYPE html>
<html lang="sq">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title data-sq-title="Blog Klima.Al — Udhëzues kondicionerësh në Shqipëri" data-en-title="Klima.Al Blog — Albanian A/C guides">Blog Klima.Al — Udhëzues kondicionerësh në Shqipëri</title>
  <meta name="description" content="Udhëzues, lajme dhe artikuj teknikë rreth kondicionerëve Mitsubishi Heavy Industries në Shqipëri: zgjedhje, mirëmbajtje, R32, kursimi i energjisë." />
  <meta name="theme-color" content="#0e1c2f" />
  <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
  <link rel="apple-touch-icon" href="../apple-touch-icon.png" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Klima.Al" />
  <meta property="og:locale" content="sq_AL" />
  <meta property="og:locale:alternate" content="en_AL" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="Blog Klima.Al" />
  <meta property="og:description" content="Udhëzues kondicionerësh në Shqipëri." />
  <meta property="og:image" content="${SITE}/hero-mitsubishi.jpg" />
  <meta property="article:modified_time" content="${today}" />
  <link rel="manifest" href="../manifest.webmanifest" />
  <link rel="stylesheet" href="../style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" /></noscript>
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>

<header class="header" id="header">
  <div class="container header-inner">
    <a href="../index.html" class="logo"><span class="logo-k">KLIMA</span><span class="logo-dot">.</span><span class="logo-al">AL</span></a>
    <nav class="nav" id="nav">
      <ul class="nav-list">
        <li><a class="nav-link" href="../index.html">Kreu</a></li>
        <li><a class="nav-link" href="../index.html#cat">Produkte</a></li>
        <li><a class="nav-link" href="index.html" aria-current="page">Blog</a></li>
        <li><a class="nav-link" href="../faq.html">Pyetje</a></li>
        <li><a class="nav-link" href="../index.html#contact">Kontakt</a></li>
      </ul>
    </nav>
    <div class="header-right">
      <a href="tel:+355672549225" class="header-phone">📞 +355 67 254 9225</a>
      <button class="cart-btn" id="cartBtn" aria-label="Shporta"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg><span class="cart-badge" id="cartBadge">0</span></button>
      <div class="lang-sw"><button class="lb lb-active" data-lang="sq">SQ</button><span>|</span><button class="lb" data-lang="en">EN</button></div>
    </div>
    <button class="burger" id="burger" aria-label="Menyja" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
  </div>
</header>

<div class="cart-backdrop" id="cartBackdrop"></div>
<aside class="cart-drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Shporta">
  <div class="cart-head"><h3>Shporta jote</h3><button class="cart-close" id="cartClose" aria-label="Mbyll">×</button></div>
  <div class="cart-body"><div class="cart-list" id="cartList"></div><p class="cart-empty" id="cartEmpty">Shporta është bosh.</p></div>
  <div class="cart-foot"><button class="btn btn-red cart-checkout" id="cartCheckout" disabled>Porosit me WhatsApp</button></div>
</aside>

<main class="category-page">
  <div class="container container--narrow">
    <nav class="prod-crumbs" aria-label="Breadcrumb">
      <a href="../index.html">Kreu</a><span>›</span><span class="crumb-current" data-sq="Blog" data-en="Blog">Blog</span>
    </nav>
    <header class="category-head">
      <span class="sec-label" data-sq="Lajme dhe udhëzues" data-en="News & guides">Lajme dhe udhëzues</span>
      <h1 data-sq="Blog Klima.Al" data-en="Klima.Al Blog">Blog Klima.Al</h1>
      <p class="category-sub" data-sq="Artikuj teknikë, udhëzues blerjeje dhe lajme nga ekipi i Klima.Al." data-en="Technical articles, buying guides and news from the Klima.Al team.">Artikuj teknikë, udhëzues blerjeje dhe lajme nga ekipi i Klima.Al.</p>
    </header>
    <div class="blog-list">
      ${POSTS.map(p => `
      <a class="blog-card" href="${p.slug}.html">
        <time datetime="${p.publishDate}" class="blog-date">${p.publishDate}</time>
        <h2>${esc(p.titleSq)}</h2>
        <p>${esc(p.excerptSq)}</p>
        <span class="blog-readmore" data-sq="Lexo më shumë →" data-en="Read more →">Lexo më shumë →</span>
      </a>`).join('')}
    </div>
  </div>
</main>

<footer class="footer">
  <div class="container footer-top"><div class="f-brand"><a href="../index.html" class="logo logo-white"><span class="logo-k">KLIMA</span><span class="logo-dot">.</span><span class="logo-al">AL</span></a></div></div>
  <div class="footer-bottom"><div class="container"><span>© 2026 Klima.Al · <a href="../privatesia.html" data-sq="Privatësia" data-en="Privacy">Privatësia</a> · <a href="../kushte-perdorimi.html" data-sq="Kushtet" data-en="Terms">Kushtet</a></span></div></div>
</footer>

<a href="https://wa.me/355672549225" target="_blank" class="whatsapp-float" aria-label="WhatsApp"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="26" height="26"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>

<script src="../search.js" defer></script>
<script src="../favorites.js" defer></script>
<script src="../cart.js" defer></script>
<script src="../app.js" defer></script>
<script defer src="/_vercel/speed-insights/script.js"></script>
</body>
</html>`;
}

const OUT = path.join(ROOT, 'blog');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);
fs.writeFileSync(path.join(OUT, 'index.html'), indexPage());
POSTS.forEach((p, i) => fs.writeFileSync(path.join(OUT, `${p.slug}.html`), postPage(p, i)));
console.log(`Wrote /blog/index.html + ${POSTS.length} posts`);
