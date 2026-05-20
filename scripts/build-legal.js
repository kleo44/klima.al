// Generate legal/compliance pages. Run: node scripts/build-legal.js
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const today = new Date().toISOString().slice(0, 10);
const SITE = 'https://klima-al.com';

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const PAGES = [
  {
    slug: 'privatesia',
    titleSq: 'Politika e Privatësisë | Klima.Al',
    titleEn: 'Privacy Policy | Klima.Al',
    descSq: 'Si i mbledhim, përdorim dhe mbrojmë të dhënat tuaja personale në Klima.Al. Politika e privatësisë në përputhje me Ligjin Nr. 9887 të Republikës së Shqipërisë.',
    descEn: 'How we collect, use and protect your personal data at Klima.Al. Privacy policy compliant with Albanian Law 9887.',
    crumbSq: 'Politika e Privatësisë',
    crumbEn: 'Privacy Policy',
    bodySq: `
<p class="legal-updated">E përditësuar më: ${today}</p>

<h2>1. Kush jemi</h2>
<p>"Klima.Al" është emër tregtar i distributorit zyrtar të Mitsubishi Heavy Industries në Shqipëri, me seli në Rr. Jordan Misja, Tiranë, Shqipëri. Telefon / WhatsApp: +355 67 254 9225. Email: klimapolaral@gmail.com. Kjo politikë e privatësisë shpjegon si i trajtojmë të dhënat tuaja personale në përputhje me <strong>Ligjin Nr. 9887 për Mbrojtjen e të Dhënave Personale</strong>.</p>

<h2>2. Çfarë të dhënash mbledhim</h2>
<h3>Të dhëna që na jepni vetë</h3>
<ul>
  <li><strong>Formulari i kontaktit:</strong> emër, telefon, email, mesazh.</li>
  <li><strong>Porosi me WhatsApp:</strong> numri juaj i telefonit, lista e produkteve, mesazhe që na dërgoni.</li>
  <li><strong>Vizita në vend:</strong> adresa, numri i telefonit, detaje për dhomën / hapësirën që do të instalohet.</li>
</ul>
<h3>Të dhëna teknike automatike</h3>
<ul>
  <li><strong>IP-ja juaj</strong> dhe agjenti i shfletuesit (përdoret nga serveri Vercel për sigurinë dhe statistikat anonime).</li>
  <li><strong>Localstorage</strong> në shfletuesin tuaj: shporta e blerjeve, lista e të preferuarave, gjuha e zgjedhur. <em>Këto NUK transmetohen te ne</em> — qëndrojnë vetëm në pajisjen tuaj.</li>
</ul>
<p><strong>NUK përdorim:</strong> Google Analytics, Meta Pixel, ose ndonjë mjet ndjekjeje të reklamuesve.</p>

<h2>3. Pse i mbledhim</h2>
<ul>
  <li>Për t'ju kontaktuar me një ofertë kur kërkoni vizitë në vend ose porositë me WhatsApp.</li>
  <li>Për të kryer kontratën e instalimit dhe garancinë (3 vjet pjesë + 1 vit punë).</li>
  <li>Për mirëmbajtjen vjetore dhe shërbimin pas-shitjes.</li>
  <li>Për të përmbushur detyrimet ligjore (faturim, garanci).</li>
</ul>

<h2>4. Bazat ligjore (GDPR/Ligji 9887)</h2>
<ul>
  <li><strong>Pëlqimi juaj</strong> kur dërgoni formularin e kontaktit ose mesazh në WhatsApp.</li>
  <li><strong>Kontrata</strong> kur blini dhe instaloni një kondicioner nga ne.</li>
  <li><strong>Detyrimi ligjor</strong> për mbajtjen e faturave dhe certifikatave të garancisë sipas legjislacionit tatimor.</li>
</ul>

<h2>5. Me kë i ndajmë</h2>
<ul>
  <li><strong>Mitsubishi Heavy Industries Thermal Systems</strong> — vetëm numrin serial të produktit, për regjistrimin e garancisë.</li>
  <li><strong>Vercel Inc.</strong> (host i faqes) — të dhënat teknike automatike (IP, log-e serveri). <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">Politika e privatësisë së Vercel</a>.</li>
  <li><strong>WhatsApp / Meta</strong> kur na shkruani aty. <a href="https://www.whatsapp.com/legal/privacy-policy-eea" target="_blank" rel="noopener">Politika e WhatsApp</a>.</li>
</ul>
<p>NUK i shesim, qiramja, ose i japim të dhënat tuaja palëve të treta për qëllime marketingu.</p>

<h2>6. Sa kohë i mbajmë</h2>
<ul>
  <li><strong>Klientë me kontratë instalimi:</strong> 5 vjet pas instalimit (për garancinë + obligimet ligjore tatimore).</li>
  <li><strong>Formularë kontakti pa porosi:</strong> 12 muaj, pastaj fshihen.</li>
  <li><strong>Localstorage në shfletuesin tuaj:</strong> ju mund ta fshini në çdo moment duke pastruar cache-in e shfletuesit ose duke vizituar <a href="clear-cache.html">/clear-cache.html</a>.</li>
</ul>

<h2>7. Të drejtat tuaja</h2>
<p>Sipas Ligjit Nr. 9887, ju keni të drejtën të:</p>
<ul>
  <li>Të kërkoni një kopje të të dhënave tuaja që mbajmë.</li>
  <li>Të kërkoni korrigjimin e të dhënave të pasakta.</li>
  <li>Të kërkoni fshirjen e të dhënave tuaja ("e drejta e harresës") kur nuk ka detyrim ligjor t'i mbajmë.</li>
  <li>Të tërhiqni pëlqimin për përpunimin në çdo kohë.</li>
  <li>Të paraqisni ankesë te <strong>Komisioneri për të Drejtën e Informimit dhe Mbrojtjen e të Dhënave Personale</strong> në <a href="https://www.idp.al" target="_blank" rel="noopener">www.idp.al</a>.</li>
</ul>
<p>Për të ushtruar këto të drejta, na shkruani në <a href="mailto:klimapolaral@gmail.com">klimapolaral@gmail.com</a> ose në +355 67 254 9225.</p>

<h2>8. Siguria</h2>
<p>Të dhënat tuaja transmetohen mbi HTTPS (TLS 1.3) dhe ruhen në serverë të certifikuar SOC 2 / ISO 27001 (Vercel). Faqja jonë nuk ruan kartat e kreditit — pagesat bëhen përmes WhatsApp ose në vend, jo në uebsajt.</p>

<h2>9. Cookies dhe localStorage</h2>
<p>Faqja jonë NUK përdor cookies tradicionale për ndjekje. Përdorim localStorage (memorja lokale e shfletuesit) për:</p>
<ul>
  <li><code>klima-cart</code> — produktet në shportën tuaj</li>
  <li><code>klima-favorites</code> — listat e të preferuarave</li>
  <li><code>klima-lang</code> — gjuha e zgjedhur (sq / en)</li>
</ul>
<p>Këto janë <strong>strictly necessary</strong> (rrjept të domosdoshme) për funksionin e faqes dhe nuk kërkojnë pëlqim sipas GDPR/Ligjit 9887.</p>

<h2>10. Ndryshime në këtë politikë</h2>
<p>Mund ta përditësojmë këtë dokument herë pas here. Versioni më i ri ka gjithmonë datën e përditësimit në krye.</p>

<p style="margin-top:32px"><a href="kushte-perdorimi.html">Kushtet e Përdorimit →</a></p>
`,
    bodyEn: `<p>(EN version available upon language switch.)</p>`
  },
  {
    slug: 'kushte-perdorimi',
    titleSq: 'Kushtet e Përdorimit | Klima.Al',
    titleEn: 'Terms of Use | Klima.Al',
    descSq: 'Kushtet e përdorimit të faqes klima-al.com dhe procesi i blerjes/instalimit të kondicionerëve Mitsubishi Heavy Industries.',
    descEn: 'Terms of use for klima-al.com and the Mitsubishi Heavy Industries air conditioner purchase / install process.',
    crumbSq: 'Kushtet e Përdorimit',
    crumbEn: 'Terms of Use',
    bodySq: `
<p class="legal-updated">E përditësuar më: ${today}</p>

<h2>1. Pranimi i kushteve</h2>
<p>Duke përdorur faqen <strong>klima-al.com</strong> ose duke porositur përmes WhatsApp / telefonit, ju pranoni kushtet e mëposhtme. Nëse nuk i pranoni, ju lutemi mos përdorni faqen.</p>

<h2>2. Përmbajtja e faqes</h2>
<p>Klima.Al është distributori zyrtar i Mitsubishi Heavy Industries (MHI) për Shqipërinë. Të gjitha imazhet, specifikimet teknike dhe markat tregtare MHI / KIREIA janë pronë e Mitsubishi Heavy Industries Thermal Systems Ltd. Klima.Al i përdor me autorizim si distributor zyrtar.</p>
<p>Përmbajtja jonë origjinale (tekstet, udhëzuesit në blog, krahasimet) është © 2026 Klima.Al. Nuk lejohet ri-përdorimi pa autorizim me shkrim.</p>

<h2>3. Çmime dhe disponueshmëri</h2>
<ul>
  <li>Çmimet janë në <strong>Lekë (ALL)</strong> dhe përfshijnë TVSH 20%.</li>
  <li>Çmimet që shfaqen NUK përfshijnë instalimin nëse nuk është specifikuar ndryshe.</li>
  <li>Çmimet mund të ndryshojnë pa njoftim paraprak; çmimi përfundimtar konfirmohet në WhatsApp ose në vizitën në vend.</li>
  <li>Disponueshmëria varet nga stoku ynë dhe ai i fabrikës MHI Italy.</li>
</ul>

<h2>4. Procesi i porosisë</h2>
<ol>
  <li>Zgjidhni produktin dhe shtoni në shportë.</li>
  <li>Klikoni "Porosit me WhatsApp" — shporta dërgohet automatikisht në WhatsApp tonë.</li>
  <li>Ne ju kontaktojmë brenda <strong>2 orësh në orarin e punës</strong> (Hën–Sht 10:00–18:00) me ofertë me çmime + datë instalimi.</li>
  <li>Pagesa: paradhënie 30% në porosi, 70% pas instalimit (cash, transfertë bankare, ose POS në vend).</li>
</ol>

<h2>5. Garancia</h2>
<ul>
  <li><strong>3 vjet</strong> garanci origjinale të prodhuesit MHI për pjesët (kompresor, motor, pllakë elektronike).</li>
  <li><strong>1 vit</strong> garanci për punën e instalimit nga ekipi ynë.</li>
  <li>Garancia kushtëzohet me <strong>mirëmbajtjen vjetore</strong> të kryer nga teknikë të certifikuar (ekipi ynë ose ekipe tjera të autorizuara MHI).</li>
  <li>Garancia <strong>nuk mbulon</strong>: dëme nga përdorim i gabuar, instalim nga palë të paautorizuara, fatkeqësi natyrore, ndërhyrje në njësi.</li>
</ul>

<h2>6. Anulim dhe kthim</h2>
<ul>
  <li>Mund të anuloni porosinë pa kosto <strong>para se të niset instalimi</strong> (paradhënia kthehet brenda 14 ditëve).</li>
  <li>Pas instalimit, kthimi nuk është i mundur — kondicioneri konsiderohet i përdorur. Mund të kërkoni servis ose riparim brenda garancisë.</li>
  <li>Për defekte në njësi të re (gjatë 14 ditëve të para), zëvendësojmë falas.</li>
</ul>

<h2>7. Përgjegjësia</h2>
<p>Klima.Al përgjigjet vetëm për punën e instalimit kryer nga ekipi ynë. Nuk përgjigjemi për:</p>
<ul>
  <li>Ndërprerje energjie elektrike ose tensione jashtë normës.</li>
  <li>Dëme nga përdorim i gabuar (p.sh. temperatura jashtë diapazonit operativ).</li>
  <li>Instalim ose modifikim nga palë të treta.</li>
  <li>Përmbajtje në faqe që mund të ndryshojë (specifikimet teknike pasqyrojnë informacionin më të fundit nga MHI por mund të kenë gabime — ofrojmë qartësim me kërkesë).</li>
</ul>

<h2>8. Pronësia intelektuale</h2>
<ul>
  <li><strong>Mitsubishi Heavy Industries</strong>, <strong>KIREIA</strong>, <strong>Smart M-Air</strong> janë marka tregtare të regjistruara të Mitsubishi Heavy Industries Thermal Systems, Ltd.</li>
  <li>Logo, dizajni dhe përmbajtja origjinale e faqes janë © 2026 Klima.Al.</li>
</ul>

<h2>9. Ligji aplikabël</h2>
<p>Këto kushte rregullohen nga ligji i Republikës së Shqipërisë. Mosmarrëveshjet zgjidhen në Gjykatën e Tiranës.</p>

<h2>10. Kontakt</h2>
<p>Pyetje për këto kushte? Na shkruani: <a href="mailto:klimapolaral@gmail.com">klimapolaral@gmail.com</a> ose <a href="https://wa.me/355672549225">+355 67 254 9225</a>.</p>

<p style="margin-top:32px"><a href="privatesia.html">Politika e Privatësisë →</a></p>
`,
    bodyEn: `<p>(EN version available upon language switch.)</p>`
  }
];

function legalPage({ slug, titleSq, titleEn, descSq, descEn, crumbSq, crumbEn, bodySq }) {
  const canonical = `${SITE}/${slug}.html`;
  return `<!DOCTYPE html>
<html lang="sq">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title data-sq-title="${esc(titleSq)}" data-en-title="${esc(titleEn)}">${esc(titleSq)}</title>
  <meta name="description" content="${esc(descSq)}" />
  <meta name="theme-color" content="#0e1c2f" />
  <link rel="icon" type="image/svg+xml" href="favicon.svg" />
  <link rel="apple-touch-icon" href="apple-touch-icon.png" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Klima.Al" />
  <meta property="og:locale" content="sq_AL" />
  <meta property="og:locale:alternate" content="en_AL" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="${esc(titleSq)}" />
  <meta property="og:description" content="${esc(descSq)}" />
  <meta property="og:image" content="${SITE}/hero-mitsubishi.jpg" />
  <meta property="article:modified_time" content="${today}" />
  <meta name="last-modified" content="${today}" />
  <link rel="alternate" hreflang="sq-AL" href="${canonical}" />
  <link rel="alternate" hreflang="x-default" href="${canonical}" />
  <link rel="manifest" href="manifest.webmanifest" />
  <link rel="stylesheet" href="style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" /></noscript>
</head>
<body>

<header class="header" id="header">
  <div class="container header-inner">
    <a href="index.html" class="logo"><span class="logo-k">KLIMA</span><span class="logo-dot">.</span><span class="logo-al">AL</span></a>
    <nav class="nav" id="nav">
      <ul class="nav-list">
        <li><a class="nav-link" href="index.html" data-sq="Kreu" data-en="Home">Kreu</a></li>
        <li><a class="nav-link" href="index.html#cat" data-sq="Produkte" data-en="Products">Produkte</a></li>
        <li><a class="nav-link" href="materiale.html" data-sq="Materiale" data-en="Materials">Materiale</a></li>
        <li><a class="nav-link" href="faq.html" data-sq="Pyetje" data-en="FAQ">Pyetje</a></li>
        <li><a class="nav-link" href="index.html#contact" data-sq="Kontakt" data-en="Contact">Kontakt</a></li>
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
  <div class="cart-head"><h3 data-sq="Shporta jote" data-en="Your Cart">Shporta jote</h3><button class="cart-close" id="cartClose" aria-label="Mbyll">×</button></div>
  <div class="cart-body"><div class="cart-list" id="cartList"></div><p class="cart-empty" id="cartEmpty" data-sq="Shporta është bosh." data-en="Your cart is empty.">Shporta është bosh.</p></div>
  <div class="cart-foot"><button class="btn btn-red cart-checkout" id="cartCheckout" disabled data-sq="Porosit me WhatsApp" data-en="Order via WhatsApp">Porosit me WhatsApp</button></div>
</aside>

<main class="category-page">
  <div class="container container--narrow">
    <nav class="prod-crumbs" aria-label="Breadcrumb">
      <a href="index.html" data-sq="Kreu" data-en="Home">Kreu</a><span>›</span>
      <span class="crumb-current" data-sq="${esc(crumbSq)}" data-en="${esc(crumbEn)}">${esc(crumbSq)}</span>
    </nav>
    <header class="category-head">
      <span class="sec-label" data-sq="Dokument ligjor" data-en="Legal">Dokument ligjor</span>
      <h1 data-sq="${esc(crumbSq)}" data-en="${esc(crumbEn)}">${esc(crumbSq)}</h1>
    </header>

    <article class="legal-body blog-body">
      ${bodySq}
    </article>
  </div>
</main>

<footer class="footer">
  <div class="container footer-top"><div class="f-brand"><a href="index.html" class="logo logo-white"><span class="logo-k">KLIMA</span><span class="logo-dot">.</span><span class="logo-al">AL</span></a></div></div>
  <div class="footer-bottom"><div class="container"><span>© 2026 Klima.Al · <a href="privatesia.html" data-sq="Privatësia" data-en="Privacy">Privatësia</a> · <a href="kushte-perdorimi.html" data-sq="Kushtet" data-en="Terms">Kushtet</a></span></div></div>
</footer>

<a href="https://wa.me/355672549225" target="_blank" class="whatsapp-float" aria-label="WhatsApp"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="26" height="26"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>

<script src="search.js" defer></script>
<script src="favorites.js" defer></script>
<script src="cart.js" defer></script>
<script src="app.js" defer></script>
<script defer src="/_vercel/insights/script.js"></script>
<script defer src="/_vercel/speed-insights/script.js"></script>
</body>
</html>`;
}

for (const p of PAGES) {
  fs.writeFileSync(path.join(ROOT, `${p.slug}.html`), legalPage(p));
}
console.log(`Wrote ${PAGES.length} legal pages: ${PAGES.map(p => p.slug).join(', ')}`);
