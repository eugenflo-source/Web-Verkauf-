/* ==========================================================================
   DIEK ABRISS – script.js v3
   Module: Theme · Smooth Scroll (Lenis) · Navigation · Reveals (IO) · Counter
           GSAP/ScrollTrigger (Parallax, Ablauf, Wörter) · Leistungen · Vergleich
           Tilt · Rechner · Karte · FAQ · Formular (Supabase) · Consent/Tracking
   Alle Module sind unabhängig und brechen nicht, wenn Elemente fehlen.
   ========================================================================== */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const cfg = window.DIEK_CONFIG || {};
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* privater Modus */ } },
  };

  /* ── Theme (Hell/Dunkel) ─────────────────────────────────────────────── */
  const root = document.documentElement;
  $("[data-theme-toggle]")?.addEventListener("click", () => {
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current = root.dataset.theme === "auto" || !root.dataset.theme ? (sysDark ? "dark" : "light") : root.dataset.theme;
    const next = current === "dark" ? "light" : "dark";
    const apply = () => { root.dataset.theme = next; store.set("diek-theme", next); };
    if (document.startViewTransition && !reduceMotion) document.startViewTransition(apply); else apply();
  });

  /* ── Smooth Scroll (Lenis) ───────────────────────────────────────────── */
  let lenis = null;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  if (!reduceMotion && typeof window.Lenis === "function") {
    lenis = new window.Lenis({ duration: 1.1, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    if (hasGsap) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add(time => lenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  const navH = () => $("#nav")?.offsetHeight || 72;
  function scrollToTarget(target) {
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: target.id === "top" ? 0 : -navH() + 1, duration: 1.3 });
    else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const target = document.getElementById(id.slice(1));
    if (!target) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(target);
    history.replaceState(null, "", id === "#top" ? location.pathname : id);
    // Fokus für Tastatur/Screenreader an Ziel übergeben
    if (id !== "#top") { target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); }
  }));

  /* ── Navigation: Zustand, Auto-Hide, Fortschritt, aktiver Link ───────── */
  const nav = $("#nav");
  const progress = $("[data-progress]");
  const ctaBar = $("[data-cta-bar]");
  let lastY = window.scrollY, ticking = false;
  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    nav?.classList.toggle("is-scrolled", y > 40);
    const menuOpen = $("[data-mobile-menu]")?.classList.contains("is-open");
    nav?.classList.toggle("is-hidden", !menuOpen && y > 600 && y > lastY + 4);
    if (y < lastY - 4) nav?.classList.remove("is-hidden");
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    ctaBar?.classList.toggle("is-visible", y > window.innerHeight * 0.6);
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  const navLinks = $$(".nav__links a");
  if ("IntersectionObserver" in window && navLinks.length) {
    const map = new Map(navLinks.map(a => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      navLinks.forEach(a => { a.classList.remove("is-active"); a.removeAttribute("aria-current"); });
      const link = map.get(en.target.id);
      if (link) { link.classList.add("is-active"); link.setAttribute("aria-current", "true"); }
    }), { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ── Mobile-Menü (Fokus-Falle, Esc, Scroll-Lock) ─────────────────────── */
  const menu = $("[data-mobile-menu]");
  const menuBtn = $("[data-menu-toggle]");
  if (menu) { menu.hidden = false; menu.inert = true; }
  function openMenu() {
    if (!menu) return;
    menu.inert = false; menu.classList.add("is-open");
    menuBtn?.setAttribute("aria-expanded", "true"); menuBtn?.setAttribute("aria-label", "Menü schließen");
    lenis?.stop(); document.body.style.overflow = "hidden";
    setTimeout(() => $("a", menu)?.focus(), 200);
  }
  function closeMenu() {
    if (!menu?.classList.contains("is-open")) return;
    menu.classList.remove("is-open"); menu.inert = true;
    menuBtn?.setAttribute("aria-expanded", "false"); menuBtn?.setAttribute("aria-label", "Menü öffnen");
    lenis?.start(); document.body.style.overflow = "";
  }
  menuBtn?.addEventListener("click", () => menu?.classList.contains("is-open") ? (closeMenu(), menuBtn.focus()) : openMenu());
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && menu?.classList.contains("is-open")) { closeMenu(); menuBtn?.focus(); }
    if (e.key === "Tab" && menu?.classList.contains("is-open")) {
      const f = [menuBtn, ...$$("a", menu)].filter(Boolean);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.matchMedia("(min-width: 1024px)").addEventListener?.("change", e => { if (e.matches) closeMenu(); });

  /* ── Reveal-Animationen via Intersection Observer (mit Stagger) ──────── */
  const reveals = $$("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(el => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(entries => {
      const batch = entries.filter(e => e.isIntersecting);
      batch.forEach((en, i) => {
        en.target.style.setProperty("--d", `${Math.min(i, 6) * 0.08}s`);
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(el => io.observe(el));
  }

  /* ── Zähler (zählen hoch, sobald sichtbar) ───────────────────────────── */
  const counters = $$("[data-count]");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, dur = 1600, t0 = performance.now();
      io.unobserve(el);
      if (Number(el.dataset.count) === 0) return;
      const step = now => {
        const p = Math.min(1, (now - t0) / dur);
        // Zielwert jedes Frame neu lesen – kann sich durch geladene Website-Einstellungen ändern
        el.textContent = Math.round(Number(el.dataset.count) * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(step);
      };
      el.textContent = "0";
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    counters.forEach(el => io.observe(el));
  }

  /* ── GSAP + ScrollTrigger: Parallax, Ablauf-Linie, Wort-Highlights ───── */
  if (hasGsap && !reduceMotion) {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    // Hero-Parallax (Bild wandert langsamer, Text blendet leicht aus)
    const heroImg = $("[data-hero-media] img");
    if (heroImg) {
      gsap.to(heroImg, { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero__inner", { yPercent: -8, opacity: 0.25, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    }

    // Dezente Bild-Parallax
    $$("[data-parallax]").forEach(el => {
      const amt = Number(el.dataset.parallax) || 0.1;
      const img = $("picture", el) || el;
      gsap.fromTo(img, { yPercent: -amt * 60 }, { yPercent: amt * 60, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });

    // „Einfach. Klar. Erledigt.“ – Wörter leuchten nacheinander auf
    const words = $$("[data-word]");
    if (words.length) {
      // Farbwechsel statt Transparenz → Text bleibt jederzeit kontrastreich lesbar (≥ 3:1)
      gsap.fromTo(words, { color: "#646a72" }, {
        color: (i, el) => el.classList.contains("accent") ? "#4d78ff" : "#ecebe7",
        stagger: 0.5, ease: "none",
        scrollTrigger: { trigger: ".why__title", start: "top 80%", end: "bottom 45%", scrub: true },
      });
    }

    // Ablauf: Linie füllt sich beim Scrollen, Schritte werden aktiv
    const fill = $("[data-rail-fill]");
    if (fill) {
      const horizontal = window.matchMedia("(min-width: 1024px)");
      const steps = $$(".step");
      ScrollTrigger.create({
        trigger: "[data-process]", start: "top 70%", end: "bottom 60%", scrub: 0.6,
        onUpdate: self => {
          const p = self.progress;
          fill.style.transform = horizontal.matches ? `scaleX(${p})` : `scaleY(${p})`;
          steps.forEach((s, i) => s.classList.toggle("is-active", p >= i / steps.length + 0.02));
        },
      });
    }

    // Überschriften: leichtes Skalieren beim Scrollen
    $$(".footer__word").forEach(el => gsap.fromTo(el, { xPercent: 6 }, { xPercent: -6, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }));

    window.addEventListener("load", () => ScrollTrigger.refresh());
  } else {
    // Ohne GSAP/Bewegung: Endzustände setzen
    const fill = $("[data-rail-fill]");
    if (fill) fill.style.transform = "none";
    $$(".step").forEach(s => s.classList.add("is-active"));
  }

  /* ── Magnetische Buttons (dezent, nur Maus) ──────────────────────────── */
  if (finePointer && !reduceMotion) {
    $$("[data-magnetic]").forEach(btn => {
      btn.addEventListener("pointermove", e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18, y = (e.clientY - r.top - r.height / 2) * 0.25;
        btn.style.translate = `${x}px ${y}px`;
      });
      btn.addEventListener("pointerleave", () => { btn.style.translate = ""; });
    });
  }

  /* ── Leistungen: Akkordeon + wechselnder Bildrahmen ──────────────────── */
  const services = $$("[data-service]");
  const frames = $$("[data-frame]");
  const frameTag = $("[data-frame-tag]");
  function showFrame(key) {
    frames.forEach(f => f.classList.toggle("is-active", f.dataset.frame === key));
    const svc = services.find(s => s.dataset.service === key);
    if (svc && frameTag) frameTag.textContent = `${$(".service__num", svc).textContent} / ${$(".service__title", svc).textContent}`;
  }
  services.forEach(svc => {
    const btn = $("button", svc);
    btn?.addEventListener("click", () => {
      const open = !svc.classList.contains("is-open");
      services.forEach(s => { s.classList.remove("is-open"); $("button", s)?.setAttribute("aria-expanded", "false"); });
      if (open) { svc.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); showFrame(svc.dataset.service); }
      if (hasGsap) setTimeout(() => window.ScrollTrigger.refresh(), 650);
    });
    if (finePointer) svc.addEventListener("pointerenter", () => showFrame(svc.dataset.service));
  });
  $("[data-services]")?.addEventListener("pointerleave", () => {
    const open = services.find(s => s.classList.contains("is-open"));
    if (open) showFrame(open.dataset.service);
  });

  /* ── Website-Einstellungen aus Supabase (gepflegt im internen Bereich) ── */
  // Gleiche Struktur/Validierung wie bisher (Tabelle public.site_settings, key = 'site').
  // Geladen per schlankem REST-Aufruf – ohne die Supabase-Bibliothek beim Seitenaufruf.
  const DEFAULT_SITE = {
    hero: { title_1: "RAUS DAMIT.", title_2: "SAUBER FERTIG.", lead: "Diek Abriss räumt, baut zurück, entsorgt und schafft Platz. Direkt, zuverlässig und mit sauberer Übergabe." },
    contact: { phone: "0163 1769483", email: "info@diek-abriss.de", whatsapp: "491631769483" },
    area: { title: "Augsburg & Umgebung", lead: "Wir sind in Augsburg und vielen Orten in der Umgebung unterwegs.", cities: ["Augsburg", "Aichach", "Königsbrunn", "Mering", "Friedberg", "Gersthofen", "Neusäß", "Stadtbergen", "Bobingen", "Kissing", "Diedorf", "Schwabmünchen", "Meitingen", "Landsberg am Lech", "Fürstenfeldbruck", "Dachau", "Wertingen", "Günzburg", "Burgau", "Thannhausen", "Mindelheim"] },
    faq: [
      { question: "Welche Arbeiten übernehmen Sie?", answer: "Wir unterstützen bei Abriss, Entrümpelung, Demontage, Rückbau und Entsorgung – für Wohnungen, Häuser, Keller, Gärten, Gewerbe und Baustellen." },
      { question: "Wie kann ich eine Anfrage stellen?", answer: "Sie können das Anfrageformular nutzen, uns anrufen oder direkt per WhatsApp schreiben. Fotos helfen uns bei einer schnellen Einschätzung." },
      { question: "Kann ich Fotos mit meiner Anfrage senden?", answer: "Ja. Sie können direkt mit der Kamera ein Foto aufnehmen oder bis zu zehn Fotos aus Ihrer Galerie beziehungsweise Ihren Dateien auswählen." },
      { question: "Übernehmen Sie auch die Entsorgung?", answer: "Ja. Wenn Sie Entsorgung auswählen, berücksichtigen wir den Abtransport und die fachgerechte Entsorgung in der Einschätzung." },
      { question: "In welchem Gebiet sind Sie tätig?", answer: "Wir sind in Augsburg und vielen Orten in der Umgebung unterwegs. Die aktuellen Einsatzorte finden Sie direkt auf dieser Seite." },
    ],
    pricing: {
      base: 400,
      object: { wohnung: 0, keller: 150, haus: 300, gewerbe: 250, garten: 200 },
      work: { abriss: 0, entsorgung: 0, entruempelung: 0, demontage: 0, rueckbau: 0, komplettpaket: 0 },
      size: { klein: 250, mittel: 500, gross: 850, sehr_gross: 1300 },
      disposal: { nein: 0, ja: 180 },
      waste: { moebel: 0, sperrmuell: 80, holz: 140, bauschutt: 220, gartenabfaelle: 120, gemischt: 250, sonstiges: 0 },
    },
  };
  const clone = o => JSON.parse(JSON.stringify(o));
  let site = clone(DEFAULT_SITE);
  const safeText = (v, fb, max = 600) => typeof v === "string" && v.trim() && v.trim().length <= max ? v.trim() : fb;
  const safePrice = (v, fb) => { const n = Number(v); return Number.isFinite(n) && n >= 0 && n <= 100000 ? n : fb; };
  function mergeSite(raw) {
    const m = clone(DEFAULT_SITE);
    if (!raw || typeof raw !== "object") return m;
    ["title_1", "title_2", "lead"].forEach(k => { m.hero[k] = safeText(raw.hero?.[k], m.hero[k]); });
    m.contact.phone = safeText(raw.contact?.phone, m.contact.phone, 40);
    m.contact.email = safeText(raw.contact?.email, m.contact.email, 160);
    m.contact.whatsapp = safeText(raw.contact?.whatsapp, m.contact.whatsapp, 30).replace(/[^0-9]/g, "") || m.contact.whatsapp;
    m.area.title = safeText(raw.area?.title, m.area.title, 100);
    m.area.lead = safeText(raw.area?.lead, m.area.lead, 400);
    if (Array.isArray(raw.area?.cities)) { const c = raw.area.cities.map(x => safeText(x, "", 60)).filter(Boolean).slice(0, 60); if (c.length) m.area.cities = c; }
    if (Array.isArray(raw.faq)) m.faq = raw.faq.map(i => ({ question: safeText(i?.question, "", 180), answer: safeText(i?.answer, "", 900) })).filter(i => i.question && i.answer).slice(0, 15);
    m.pricing.base = safePrice(raw.pricing?.base, m.pricing.base);
    ["object", "work", "size", "disposal", "waste"].forEach(g => Object.keys(m.pricing[g]).forEach(k => { m.pricing[g][k] = safePrice(raw.pricing?.[g]?.[k], m.pricing[g][k]); }));
    return m;
  }
  const setText = (el, text) => { if (el && el.textContent !== text) el.textContent = text; };
  const townKey = name => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
  function applySite() {
    $$("[data-site]").forEach(el => {
      const [group, key] = el.dataset.site.split(".");
      const v = site[group]?.[key];
      if (typeof v === "string") setText(el, v);
    });
    // Kontakt-Links überall (Nav, Hero, Kontakt, Footer, Mobile-Leiste, Floating-Button)
    const tel = `tel:${site.contact.phone.replace(/[^0-9+]/g, "").replace(/^0/, "+49")}`;
    $$('a[href^="tel:"]').forEach(a => { a.href = tel; if (a.getAttribute("aria-label")?.startsWith("Anrufen")) a.setAttribute("aria-label", `Anrufen: ${site.contact.phone}`); });
    $$('a[href^="mailto:"]').forEach(a => { a.href = `mailto:${site.contact.email}`; });
    $$('a[href^="https://wa.me/"]').forEach(a => { a.href = `https://wa.me/${site.contact.whatsapp}`; });
    $$(".nav__phone span, .mobile-menu__foot a[href^='tel:'], .footer a[href^='tel:'], .faq__head a[href^='tel:']").forEach(el => setText(el, site.contact.phone));
    $$(".mobile-menu__foot a[href^='mailto:'], .footer a[href^='mailto:']").forEach(el => setText(el, site.contact.email));
    // Einsatzgebiet: Liste neu aufbauen, Karte nur für gelistete Orte zeigen
    const list = $("[data-area-list]");
    if (list) {
      const current = $$("li", list).map(li => li.textContent).join("|");
      if (current !== site.area.cities.join("|")) {
        list.replaceChildren(...site.area.cities.map(c => { const li = document.createElement("li"); li.textContent = c; li.dataset.town = townKey(c); return li; }));
        bindTowns();
      }
      const keys = new Set(site.area.cities.map(townKey));
      $$(".map__towns [data-town]").forEach(g => { g.style.display = keys.has(g.dataset.town) ? "" : "none"; });
    }
    $$("[data-city-count]").forEach(el => { el.dataset.count = String(site.area.cities.length); setText(el, String(site.area.cities.length)); });
    // FAQ (sichtbar + strukturierte Daten)
    const faqList = $("[data-faq]");
    if (faqList) {
      const current = $$("summary span", faqList).map(x => x.textContent).join("|");
      if (current !== site.faq.map(f => f.question).join("|") || $$(".faq__a p", faqList).map(x => x.textContent).join("|") !== site.faq.map(f => f.answer).join("|")) {
        faqList.replaceChildren(...site.faq.map(f => {
          const d = document.createElement("details"), sm = document.createElement("summary"), q = document.createElement("span"), i = document.createElement("i"), a = document.createElement("div"), p = document.createElement("p");
          q.textContent = f.question; i.setAttribute("aria-hidden", "true"); sm.append(q, i);
          a.className = "faq__a"; p.textContent = f.answer; a.append(p); d.append(sm, a);
          return d;
        }));
      }
      const section = $("#faq");
      if (section) section.hidden = !site.faq.length;
    }
    const ld = $("#ld-json");
    if (ld) {
      try {
        const data = JSON.parse(ld.textContent);
        const faqNode = data["@graph"].find(n => n["@type"] === "FAQPage");
        if (faqNode) faqNode.mainEntity = site.faq.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } }));
        const biz = data["@graph"].find(n => n["@id"]?.endsWith("#business"));
        if (biz) {
          biz.telephone = biz.contactPoint.telephone = site.contact.phone.replace(/^0/, "+49 ");
          biz.email = biz.contactPoint.email = site.contact.email;
          biz.areaServed = site.area.cities.map(name => ({ "@type": "City", name }));
        }
        ld.textContent = JSON.stringify(data);
      } catch (e) { /* JSON-LD bleibt unverändert */ }
    }
    estimate();
  }
  async function loadSite() {
    if (!cfg.supabaseUrl || !cfg.supabaseAnonKey || !window.fetch) return;
    try {
      const res = await fetch(`${cfg.supabaseUrl}/rest/v1/site_settings?key=eq.site&select=value`, {
        headers: { apikey: cfg.supabaseAnonKey, Authorization: `Bearer ${cfg.supabaseAnonKey}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = await res.json();
      if (!rows?.[0]?.value) return;
      site = mergeSite(rows[0].value);
      applySite();
    } catch (err) {
      console.warn("Website-Einstellungen konnten nicht geladen werden – Standardwerte bleiben aktiv.", err);
    }
  }

  /* ── Preis-Orientierung ──────────────────────────────────────────────── */
  const calc = $("[data-calc]");
  const priceEl = $("[data-price]");
  const wasteGroup = $("[data-calc-waste]");
  let shownPrice = 650;
  // Preis einer Auswahl: zuerst aus den Website-Einstellungen (Supabase), sonst Standardwert im HTML
  const picked = name => $(`input[name="${name}"]:checked`, calc);
  const val = name => {
    const el = picked(name);
    if (!el) return 0;
    const configured = site.pricing?.[el.dataset.priceGroup]?.[el.dataset.priceKey];
    return Number.isFinite(configured) ? configured : Number(el.value) || 0;
  };
  // „Mit Entsorgung“ wird über den Schlüssel erkannt – funktioniert auch bei 0 € Zuschlag
  const withDisposal = () => picked("disposal")?.dataset.priceKey === "ja";
  function estimate() {
    if (!calc) return;
    const disp = withDisposal();
    if (wasteGroup) wasteGroup.hidden = !disp;
    const base = Number.isFinite(site.pricing?.base) ? site.pricing.base : 400;
    const n = base + val("obj") + val("work") + val("size") + val("disposal") + (disp ? val("waste") : 0);
    animatePrice(Math.round(n / 10) * 10);
  }
  function animatePrice(to) {
    if (!priceEl) return;
    const from = shownPrice; shownPrice = to;
    if (reduceMotion || from === to) { priceEl.textContent = `ab ${to.toLocaleString("de-DE")} €`; return; }
    const t0 = performance.now(), dur = 600;
    const step = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      priceEl.textContent = `ab ${(Math.round((from + (to - from) * e) / 10) * 10).toLocaleString("de-DE")} €`;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  calc?.addEventListener("change", estimate);
  estimate();

  // Auswahl aus dem Rechner ins Formular übernehmen
  $("[data-calc-apply]")?.addEventListener("click", () => {
    const form = $("#form");
    if (!form || !calc) return;
    const work = $('input[name="work"]:checked', calc)?.dataset.label;
    const obj = $('input[name="obj"]:checked', calc)?.dataset.label;
    const disp = withDisposal();
    const waste = $('input[name="waste"]:checked', calc)?.dataset.label;
    const setSelect = (sel, text) => { const o = [...sel.options].find(o => o.text === text || o.value === text); if (o) sel.value = o.value; };
    if (work) setSelect(form.elements.service, work);
    if (obj) setSelect(form.elements.object_type, obj);
    form.elements.disposal.value = disp ? "Ja" : "Nein";
    if (disp && waste) setSelect(form.elements.disposal_items, waste);
    syncFormDisposal();
  });

  /* ── Einsatzgebiet: Liste ↔ Karte verknüpfen ─────────────────────────── */
  // Liste und Karte teilen sich die Schlüssel aus townKey() (z. B. „Neusäß“ → neusa)
  function bindTowns() {
    const towns = $$(".area__list [data-town]");
    const dots = $$(".map__towns [data-town]");
    const key = el => el.dataset.town;
    const hl = (k, on) => [...towns, ...dots].forEach(t => t.classList.toggle("is-hl", on && key(t) === k));
    [...towns, ...dots].forEach(el => {
      if (el.dataset.bound) return;
      el.dataset.bound = "1";
      el.addEventListener("pointerenter", () => hl(key(el), true));
      el.addEventListener("pointerleave", () => hl(key(el), false));
    });
  }
  bindTowns();

  /* ── FAQ: weiches Öffnen/Schließen von <details> ─────────────────────── */
  // Delegiert, damit auch aus Supabase nachgeladene Einträge animiert werden
  $("[data-faq]")?.addEventListener("click", e => {
    const summary = e.target.closest("summary");
    const d = summary?.parentElement;
    const body = d && $(".faq__a", d);
    if (!body || reduceMotion || !body.animate) return;
    e.preventDefault();
    if (d.open) {
      const a = body.animate([{ height: `${body.offsetHeight}px`, opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 380, easing: "cubic-bezier(.65,0,.35,1)" });
      a.onfinish = () => { d.open = false; if (hasGsap) window.ScrollTrigger.refresh(); };
    } else {
      d.open = true;
      const h = body.offsetHeight;
      const a = body.animate([{ height: "0px", opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 480, easing: "cubic-bezier(.16,1,.3,1)" });
      a.onfinish = () => { if (hasGsap) window.ScrollTrigger.refresh(); };
    }
  });

  /* ── Formular: Validierung, Fotos, Supabase-Upload ───────────────────── */
  const form = $("#form");
  const statusEl = $("#status");
  const fileNames = $("#fileNames");
  const photoPreview = $("#photoPreview");
  const cameraFiles = $("#cameraFiles"), galleryFiles = $("#galleryFiles");
  const formDisposal = $("#f-disposal"), formWaste = $("[data-form-waste]");
  const PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);
  const MAX_PHOTO_SIZE = 10 * 1024 * 1024;
  const MAX_PHOTOS = 10;
  let selectedPhotos = [];
  let previewUrls = [];

  function syncFormDisposal() { if (formWaste) formWaste.hidden = formDisposal?.value !== "Ja"; }
  formDisposal?.addEventListener("change", syncFormDisposal);
  syncFormDisposal();

  function setStatus(text, type = "") { if (!statusEl) return; statusEl.className = `status ${type}`.trim(); statusEl.textContent = text; }

  function addFiles(list) {
    if (!list?.length) return;
    const rejected = [];
    for (const f of list) {
      if (selectedPhotos.length >= MAX_PHOTOS) { rejected.push(`maximal ${MAX_PHOTOS} Fotos möglich`); break; }
      const isHeicByName = /\.(heic|heif)$/i.test(f.name) && !f.type;
      if (!PHOTO_TYPES.has(f.type) && !isHeicByName) { rejected.push(`${f.name}: kein unterstütztes Fotoformat`); continue; }
      if (f.size > MAX_PHOTO_SIZE) { rejected.push(`${f.name}: größer als 10 MB`); continue; }
      if (!selectedPhotos.some(x => x.name === f.name && x.size === f.size && x.lastModified === f.lastModified)) selectedPhotos.push(f);
    }
    renderPhotos();
    if (rejected.length) setStatus(`Nicht hinzugefügt: ${rejected.join(" · ")}`, "err");
  }
  function renderPhotos() {
    previewUrls.forEach(u => URL.revokeObjectURL(u)); previewUrls = [];
    if (fileNames) fileNames.textContent = selectedPhotos.length ? `${selectedPhotos.length} von ${MAX_PHOTOS} Fotos ausgewählt` : `Max. ${MAX_PHOTOS} Fotos · JPG, PNG, WebP oder HEIC · je max. 10 MB`;
    if (!photoPreview) return;
    photoPreview.innerHTML = "";
    selectedPhotos.forEach((file, i) => {
      const wrap = document.createElement("div"); wrap.className = "photo-thumb";
      const img = document.createElement("img"); img.alt = `Foto ${i + 1}`; const url = URL.createObjectURL(file); previewUrls.push(url); img.src = url;
      const rm = document.createElement("button"); rm.type = "button"; rm.className = "photo-remove"; rm.setAttribute("aria-label", `Foto ${i + 1} entfernen`); rm.textContent = "×";
      rm.addEventListener("click", () => { selectedPhotos.splice(i, 1); renderPhotos(); });
      wrap.append(img, rm); photoPreview.appendChild(wrap);
    });
  }
  $("#cameraBtn")?.addEventListener("click", () => cameraFiles?.click());
  $("#galleryBtn")?.addEventListener("click", () => galleryFiles?.click());
  cameraFiles?.addEventListener("change", () => { addFiles(cameraFiles.files); cameraFiles.value = ""; });
  galleryFiles?.addEventListener("change", () => { addFiles(galleryFiles.files); galleryFiles.value = ""; });

  // Drag & Drop
  const drop = $("[data-dropzone]");
  if (drop) {
    ["dragenter", "dragover"].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add("is-drag"); }));
    ["dragleave", "drop"].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.remove("is-drag"); }));
    drop.addEventListener("drop", e => addFiles(e.dataTransfer?.files));
  }

  // Supabase erst laden, wenn das Formular benutzt wird (spart ~200 KB beim Seitenaufruf)
  let sbPromise = null;
  const hasSupabaseCfg = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey);
  function getSupabase() {
    if (!hasSupabaseCfg) return Promise.resolve(null);
    if (!sbPromise) {
      sbPromise = new Promise(resolve => {
        if (window.supabase) return resolve(window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey));
        const s = document.createElement("script");
        s.src = "assets/vendor/supabase.min.js"; s.async = true;
        s.onload = () => resolve(window.supabase ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null);
        s.onerror = () => resolve(null);
        document.head.appendChild(s);
      });
    }
    return sbPromise;
  }
  form?.addEventListener("focusin", () => getSupabase(), { once: true });

  async function uploadPhotos(sb, requestId) {
    if (!sb || !selectedPhotos.length) return [];
    const paths = [];
    for (let i = 0; i < selectedPhotos.length; i++) {
      const file = selectedPhotos[i];
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${requestId}/${Date.now()}-${i}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await sb.storage.from("diek-abriss-fotos").upload(path, file, { upsert: false, cacheControl: "3600", contentType: file.type || "image/heic" });
      if (error) throw new Error(`Foto ${i + 1} konnte nicht hochgeladen werden: ${error.message}`);
      paths.push(path);
    }
    return paths;
  }

  const clean = v => String(v ?? "").trim().replace(/\s+/g, " ");
  function validateField(input, message) {
    if (!input) return true;
    const wrap = input.closest(".field") || input.parentElement;
    input.classList.remove("field-error", "field-ok");
    input.removeAttribute("aria-invalid");
    wrap.querySelector(".field-message")?.remove();
    if (!input.checkValidity()) {
      input.classList.add("field-error"); input.setAttribute("aria-invalid", "true");
      const msg = document.createElement("small"); msg.className = "field-message"; msg.id = `${input.id}-err`; msg.textContent = message;
      input.setAttribute("aria-describedby", msg.id);
      wrap.appendChild(msg);
      return false;
    }
    input.removeAttribute("aria-describedby");
    if (clean(input.value)) input.classList.add("field-ok");
    return true;
  }
  const MESSAGES = {
    first_name: "Bitte einen gültigen Vornamen eingeben.",
    last_name: "Bitte einen gültigen Nachnamen eingeben.",
    phone: "Bitte eine gültige Telefonnummer eingeben.",
    email: "Bitte eine gültige E-Mail-Adresse eingeben.",
    postal_code: "Bitte eine 5-stellige deutsche PLZ eingeben.",
    city: "Bitte den Ort vollständig eingeben.",
    message: "Bitte die Projektbeschreibung etwas ausführlicher ausfüllen.",
    service: "Bitte die Art der Arbeit auswählen.",
    object_type: "Bitte das Objekt auswählen.",
  };
  function validateForm() {
    let ok = true;
    Object.entries(MESSAGES).forEach(([name, msg]) => { ok = validateField(form.elements[name], msg) && ok; });
    const privacy = form.elements.privacy;
    const privOk = privacy?.checked;
    privacy?.closest(".check")?.classList.toggle("check-error", !privOk);
    if (!privOk) ok = false;
    if (!ok) {
      const firstErr = $(".field-error", form) || (privOk ? null : privacy);
      if (firstErr) { scrollToTarget(firstErr.closest(".field") || firstErr.closest(".check")); setTimeout(() => firstErr.focus({ preventScroll: true }), 500); }
    }
    return ok;
  }
  $$("input, select, textarea", form || document.createElement("form")).forEach(el => {
    el.addEventListener("blur", () => { if (MESSAGES[el.name] && clean(el.value)) validateField(el, MESSAGES[el.name]); });
    el.addEventListener("input", () => { el.classList.remove("field-error"); el.removeAttribute("aria-invalid"); });
  });

  form?.addEventListener("submit", async e => {
    e.preventDefault();
    if (!validateForm()) { setStatus("Bitte prüfe die markierten Pflichtfelder. Vor- und Nachname sowie PLZ und Ort müssen vollständig ausgefüllt sein.", "err"); return; }
    const submit = $(".submit", form);
    submit?.classList.add("is-loading"); if (submit) submit.disabled = true;
    setStatus("Anfrage wird gesendet …");
    const fd = new FormData(form);
    const requestId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    // Datenstruktur unverändert zur bestehenden Supabase-Tabelle „contact_requests“
    const r = {
      created_at: new Date().toISOString(),
      name: `${clean(fd.get("first_name"))} ${clean(fd.get("last_name"))}`,
      phone: clean(fd.get("phone")),
      email: clean(fd.get("email")),
      location: `${clean(fd.get("postal_code"))} ${clean(fd.get("city"))}`,
      service: fd.get("service"),
      object_type: fd.get("object_type"),
      disposal: fd.get("disposal") === "Ja",
      disposal_items: fd.get("disposal") === "Ja" ? (fd.get("disposal_items") || null) : null,
      message: clean(fd.get("message")),
      status: "Neu",
      photo_paths: [],
    };
    try {
      const sb = await getSupabase();
      if (sb) {
        r.photo_paths = await uploadPhotos(sb, requestId);
        const { error } = await sb.from("contact_requests").insert(r);
        if (error) throw new Error(`Anfrage konnte nicht gespeichert werden: ${error.message}`);
      } else {
        throw new Error("Die Anfrage kann zurzeit nicht gesendet werden. Bitte kontaktieren Sie uns per Telefon oder WhatsApp.");
      }
      setStatus("✓ Anfrage erfolgreich übermittelt. Wir melden uns schnellstmöglich.", "ok");
      trackEvent("generate_lead", { form: "anfrage", service: r.service });
      form.reset(); selectedPhotos = []; renderPhotos(); syncFormDisposal();
      $$(".field-ok, .field-error", form).forEach(x => x.classList.remove("field-ok", "field-error"));
      $$(".field-message", form).forEach(x => x.remove());
    } catch (err) {
      console.error(err);
      setStatus(`${err?.message || "Unbekannter Fehler"} – Alternativ erreichen Sie uns telefonisch oder per WhatsApp.`, "err");
    } finally {
      submit?.classList.remove("is-loading"); if (submit) submit.disabled = false;
    }
  });

  /* ── Consent + Google Analytics 4 / Google Tag Manager ───────────────── */
  // IDs in config.js eintragen. Ohne IDs wird nichts geladen und kein Banner gezeigt.
  const GA4 = cfg.ga4Id || "", GTM = cfg.gtmId || "";
  const consentBox = $("[data-consent]"), consentOpen = $("[data-consent-open]");
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  function trackEvent(name, params) { if (store.get("diek-consent") === "granted") gtag("event", name, params || {}); }
  function loadTracking() {
    gtag("consent", "update", { analytics_storage: "granted" });
    if (GTM) {
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      const s = document.createElement("script"); s.async = true; s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM)}`; document.head.appendChild(s);
    }
    if (GA4) {
      const s = document.createElement("script"); s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4)}`; document.head.appendChild(s);
      gtag("js", new Date()); gtag("config", GA4, { anonymize_ip: true });
    }
  }
  if (GA4 || GTM) {
    gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
    if (consentOpen) consentOpen.hidden = false;
    const choice = store.get("diek-consent");
    if (choice === "granted") loadTracking();
    else if (!choice && consentBox) consentBox.hidden = false;
    $("[data-consent-accept]")?.addEventListener("click", () => { store.set("diek-consent", "granted"); consentBox.hidden = true; loadTracking(); });
    $("[data-consent-deny]")?.addEventListener("click", () => { store.set("diek-consent", "denied"); consentBox.hidden = true; });
    consentOpen?.addEventListener("click", () => { consentBox.hidden = false; $("[data-consent-accept]")?.focus(); });
    // Klicks auf Telefon/WhatsApp als Conversion messen
    $$('a[href^="tel:"], a[href^="https://wa.me/"], a[href^="mailto:"]').forEach(a => a.addEventListener("click", () => {
      const type = a.href.startsWith("tel:") ? "phone" : a.href.startsWith("mailto:") ? "email" : "whatsapp";
      trackEvent("contact_click", { method: type });
    }));
  }

  loadSite();

  /* ── Kleinkram ───────────────────────────────────────────────────────── */
  $$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
})();
