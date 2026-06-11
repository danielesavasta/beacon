# Componenti — Pattern HTML, CSS, JS

Ogni componente segue questo pattern:
- `.astro` per struttura e props
- `styles/components/nome-componente.css` importato nel layout o nel componente stesso
- Script Vanilla JS inline nel `.astro` solo se strettamente locale al componente; altrimenti `public/js/nome-componente.js`

---

## Navigation / Header

**Principi:**
- `<header>` con `<nav>` e `aria-label`
- Menu mobile: toggle con `aria-expanded`, `aria-controls`
- Skip link visibile al focus prima di tutto il resto
- Sticky opzionale via `position: sticky`

```astro
<!-- src/components/Header.astro -->
---
import LangSwitcher from './LangSwitcher.astro';
const { lang, t } = Astro.props;
---
<header class="site-header">
  <div class="site-header__inner container">
    <a class="site-header__logo" href={`/${lang}/`} aria-label="Home">
      <slot name="logo" />
    </a>
    <nav class="site-nav" aria-label={t('nav.label')}>
      <ul class="site-nav__list" role="list">
        <li><a class="site-nav__link" href={`/${lang}/`}>{t('nav.home')}</a></li>
        <li><a class="site-nav__link" href={`/${lang}/chi-siamo/`}>{t('nav.about')}</a></li>
        <li><a class="site-nav__link" href={`/${lang}/contatti/`}>{t('nav.contact')}</a></li>
      </ul>
    </nav>
    <LangSwitcher currentLang={lang} currentPath={Astro.url.pathname} />
    <button
      class="site-nav__toggle"
      aria-expanded="false"
      aria-controls="mobile-menu"
      aria-label={t('nav.toggle')}
    >
      <span class="site-nav__toggle-icon" aria-hidden="true"></span>
    </button>
  </div>
</header>
```

**CSS key patterns:**
```css
.site-header {
  position: sticky;
  top: 0;
  z-index: var(--z-raised);
  background: var(--color-surface);
  border-bottom: var(--border-width) solid var(--color-border);
}
.site-header__inner {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  padding-block: var(--space-4);
}
.site-nav__link:focus-visible {
  outline: 0.125rem solid var(--color-focus);
  outline-offset: 0.25rem;
  border-radius: var(--radius-sm);
}
/* Menu mobile */
@media (max-width: 48rem) {
  .site-nav__list {
    display: none;
    position: absolute;
    /* ... */
  }
  .site-nav__list.is-open { display: flex; flex-direction: column; }
}
```

---

## Hero / Banner

**Principi:**
- `<section>` con heading H1
- Immagine di sfondo via CSS o `<img>` con `alt` significativo
- CTA con `<a>` o `<button>` secondo semantica
- Testo sempre leggibile su immagine (overlay o testo su area solida)

```astro
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__content container">
    <h1 class="hero__title" id="hero-title">{t('hero.title')}</h1>
    <p class="hero__subtitle">{t('hero.subtitle')}</p>
    <a class="btn btn--primary" href={`/${lang}/contatti/`}>{t('hero.cta')}</a>
  </div>
</section>
```

**CSS key patterns:**
```css
.hero {
  min-block-size: clamp(20rem, 60vh, 40rem);
  display: grid;
  place-items: center;
  background-color: var(--color-primary);
  color: var(--color-white);
}
.hero__title {
  font-size: clamp(var(--text-2xl), 5vw, var(--text-5xl));
  font-weight: var(--font-black);
  line-height: var(--leading-tight);
}
```

---

## Card e Grid layout

**Principi:**
- Grid intrinsico: `auto-fill` + `minmax()` — nessun breakpoint necessario
- Card con `<article>` se contenuto indipendente
- Immagini con `aspect-ratio` per stabilità layout

```astro
<section class="card-grid container" aria-label={t('cards.label')}>
  {items.map(item => (
    <article class="card">
      <img class="card__img" src={item.image} alt={item.imageAlt} loading="lazy" />
      <div class="card__body">
        <h2 class="card__title">{item.title}</h2>
        <p class="card__text">{item.description}</p>
        <a class="btn btn--secondary" href={item.href}>{t('card.readMore')}</a>
      </div>
    </article>
  ))}
</section>
```

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  gap: var(--space-8);
}
.card__img {
  aspect-ratio: 16 / 9;
  object-fit: cover;
  width: 100%;
}
```

---

## Form e Input

**Principi:**
- Ogni `<input>` ha un `<label>` associato (`for`/`id`)
- Errori con `aria-describedby` e `role="alert"`
- Mai placeholder come sostituto della label
- Validazione nativa HTML + JS progressivo

```astro
<form class="contact-form" novalidate>
  <div class="form-field">
    <label class="form-field__label" for="name">{t('form.name')}</label>
    <input
      class="form-field__input"
      type="text"
      id="name"
      name="name"
      autocomplete="name"
      required
      aria-describedby="name-error"
    />
    <span class="form-field__error" id="name-error" role="alert" aria-live="polite"></span>
  </div>
  <button class="btn btn--primary" type="submit">{t('form.submit')}</button>
</form>
```

```css
.form-field__input {
  display: block;
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--text-base);
  background: var(--color-surface);
  color: var(--color-text);
  transition: border-color var(--duration-fast) var(--easing-default);
}
.form-field__input:focus-visible {
  outline: 0.125rem solid var(--color-focus);
  outline-offset: 0.125rem;
  border-color: var(--color-primary);
}
.form-field__input[aria-invalid="true"] {
  border-color: var(--color-secondary);
}
```

---

## Modal / Overlay

**Principi:**
- Usa `<dialog>` nativo (supporto moderno, gestisce focus trap nativo)
- Fallback JS per `showModal()` / `close()`
- Escape chiude il modal
- Focus torna al trigger all'chiusura

```astro
<button class="btn btn--primary" data-modal-open="my-modal">{t('modal.open')}</button>

<dialog class="modal" id="my-modal" aria-labelledby="modal-title">
  <div class="modal__inner">
    <header class="modal__header">
      <h2 class="modal__title" id="modal-title">{t('modal.title')}</h2>
      <button class="modal__close" data-modal-close aria-label={t('modal.close')}>✕</button>
    </header>
    <div class="modal__body">
      <slot />
    </div>
  </div>
</dialog>
```

```js
// public/js/modal.js
document.querySelectorAll('[data-modal-open]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const modal = document.getElementById(trigger.dataset.modalOpen);
    modal?.showModal();
  });
});
document.querySelectorAll('[data-modal-close]').forEach(btn => {
  btn.closest('dialog')?.addEventListener('click', e => {
    if (e.target === e.currentTarget || e.target.hasAttribute('data-modal-close')) {
      e.currentTarget.close();
    }
  });
});
```

```css
.modal {
  border: none;
  border-radius: var(--radius-lg);
  padding: 0;
  max-width: min(90vw, 40rem);
  box-shadow: var(--shadow-lg);
  background: var(--color-surface);
  color: var(--color-text);
}
.modal::backdrop {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(0.25rem);
}
```

---

## Animazioni / Transizioni

**Principi:**
- Rispetta `prefers-reduced-motion`: disabilita animazioni non essenziali
- Transizioni su interazioni (hover, focus) via `transition` sul singolo elemento
- Animazioni di entrata con `@keyframes` e `animation-fill-mode: both`
- Mai `transition: all` — specifica le proprietà

```css
/* Reset globale per motion ridotto */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Fade in */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in var(--duration-slow) var(--easing-default) both;
}

/* Transizione su bottoni */
.btn {
  transition:
    background-color var(--duration-fast) var(--easing-default),
    color            var(--duration-fast) var(--easing-default),
    box-shadow       var(--duration-fast) var(--easing-default);
}
```

---

## Footer

```astro
<footer class="site-footer">
  <div class="site-footer__inner container">
    <p class="site-footer__copy">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
    <nav aria-label={t('footer.nav')}>
      <ul class="site-footer__links" role="list">
        <li><a href={`/${lang}/privacy/`}>{t('footer.privacy')}</a></li>
        <li><a href={`/${lang}/cookie/`}>{t('footer.cookie')}</a></li>
      </ul>
    </nav>
  </div>
</footer>
```

```css
.site-footer {
  margin-top: auto;
  border-top: var(--border-width) solid var(--color-border);
  padding-block: var(--space-8);
  background: var(--color-bg-subtle);
}
.site-footer__inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
}
```

---

## Utilities globali

```css
/* utilities.css */
.container {
  width: min(100% - var(--space-8), var(--container-xl));
  margin-inline: auto;
}
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
.skip-link {
  position: absolute;
  top: -100%;
  left: var(--space-4);
  background: var(--color-primary);
  color: var(--color-white);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-weight: var(--font-bold);
  text-decoration: none;
  z-index: var(--z-toast);
}
.skip-link:focus { top: var(--space-4); }
```
