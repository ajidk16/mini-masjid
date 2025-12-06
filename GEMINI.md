# TadBeer - Project Context for AI Assistant

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | SvelteKit | ^2.48.5 |
| **Language** | Svelte 5 | ^5.43.8 |
| **Styling** | Tailwind CSS v4 | ^4.1.17 |
| **Components** | DaisyUI | ^5.5.8 |
| **Icons** | Lucide Svelte | ^0.555.0 |
| **Database ORM** | Drizzle ORM | ^0.44.7 |
| **Database** | Neon (Serverless PostgreSQL) | ^1.0.2 |
| **i18n** | Paraglide-js | ^2.5.0 |
| **Testing** | Vitest + Playwright | ^4.0.10 |

---

## Svelte 5 Runes (WAJIB DIGUNAKAN)

```svelte
<script lang="ts">
  // State
  let count = $state(0);
  let items = $state<string[]>([]);
  
  // Derived
  let doubled = $derived(count * 2);
  let total = $derived.by(() => items.reduce((a, b) => a + b.length, 0));
  
  // onMount
  onMount(() => {
    console.log('count changed:', count);
  });
  
  // Props
  let { title, children }: { title: string; children: Snippet } = $props();
</script>

{@render children()}
```

---

## Custom Theme Colors

```css
/* Light: Islamic Green & Amber */
primary: Emerald-500
secondary: Emerald-800  
accent: Amber-500

/* Dark: Darker variants */
primary: Emerald-400
secondary: Emerald-300
accent: Amber-400
```

---

## Lucide Icons Usage

```svelte
<script lang="ts">
  	import { Menu, X, ArrowDown, MapPin, Phone, Mail, Clock, MessageCircle, Plus, Trash2, SquarePen, Search, Settings, User, House, Calendar, Heart } from 'lucide-svelte';
</script>

<Menu class="w-6 h-6" />
<CheckCircle class="w-5 h-5 text-success" />
```

---

## Animation Utilities (layout.css)

```css
/* Hover Effects */
.hover-lift    /* translateY(-4px) + shadow on hover */
.hover-grow    /* scale(1.05) on hover */

/* Animations */
.animate-fadeIn       /* Fade in from bottom */
.animate-slideIn      /* Slide from left */
.animate-bounce-gentle /* Gentle bounce loop */

/* Scroll Reveal */
.scroll-reveal        /* Fade up on scroll */
.scroll-reveal-left   /* Slide from left on scroll */
.scroll-reveal-right  /* Slide from right on scroll */
.stagger-1 to .stagger-6  /* Delay 0.1s - 0.6s */

/* Parallax */
.parallax-hero   /* Min-height 100vh, flex center */
.parallax-bg     /* Fixed background with overlay */

/* Effects */
.glass           /* Glassmorphism backdrop-blur */
.gradient-text   /* Primary to accent gradient text */
.islamic-pattern /* Subtle Islamic cross pattern */
```

---

## DaisyUI Component Reference

### Layout Components

#### navbar
```html
<header class="navbar bg-base-100">
  <div class="navbar-start">{logo}</div>
  <div class="navbar-center">{menu}</div>
  <div class="navbar-end">{actions}</div>
</header>
```

#### card
```html
<div class="card {card-border|card-dash} {card-xs|card-sm|card-md|card-lg|card-xl}">
  <figure><img src="" alt="" /></figure>
  <div class="card-body">
    <h2 class="card-title">{title}</h2>
    <p>{content}</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Action</button>
    </div>
  </div>
</div>
```

#### drawer
```html
<div class="drawer {drawer-end}">
  <input id="drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">{main content}</div>
  <div class="drawer-side">
    <label for="drawer" class="drawer-overlay"></label>
    <ul class="menu bg-base-200 min-h-full w-80 p-4">{menu items}</ul>
  </div>
</div>
```

#### modal
```html
<button onclick="my_modal.showModal()" class="btn">Open</button>
<dialog id="my_modal" class="modal {modal-bottom|modal-middle}">
  <div class="modal-box">
    <h3 class="text-lg font-bold">{title}</h3>
    <p class="py-4">{content}</p>
    <div class="modal-action">
      <form method="dialog"><button class="btn">Close</button></form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop"><button>close</button></form>
</dialog>
```

### Form Components

#### input
```html
<input type="text" class="input {input-bordered} {input-primary|input-error} {input-xs|input-sm|input-md|input-lg}" />
```

#### select
```html
<select class="select {select-bordered} {select-primary} {select-sm|select-md|select-lg}">
  <option disabled selected>Pick one</option>
  <option>Option</option>
</select>
```

#### textarea
```html
<textarea class="textarea {textarea-bordered} {textarea-primary}" rows="3"></textarea>
```

#### checkbox / toggle
```html
<input type="checkbox" class="checkbox {checkbox-primary} {checkbox-sm|checkbox-lg}" />
<input type="checkbox" class="toggle {toggle-primary} {toggle-sm|toggle-lg}" />
```

#### radio
```html
<input type="radio" name="radio-group" class="radio {radio-primary}" />
```

### Action Components

#### btn
```html
<button class="btn {btn-primary|btn-secondary|btn-accent|btn-neutral|btn-ghost|btn-link|btn-outline} {btn-xs|btn-sm|btn-md|btn-lg|btn-xl} {btn-circle|btn-square}">
  {text}
</button>
```
- Loading: `<button class="btn"><span class="loading loading-spinner"></span>Loading</button>`
- Disabled: `tabindex="-1" role="button" aria-disabled="true" class="btn btn-disabled"`

#### dropdown
```html
<div class="dropdown {dropdown-end|dropdown-top|dropdown-left|dropdown-right}">
  <div tabindex="0" role="button" class="btn">Click</div>
  <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow">
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
  </ul>
</div>
```

### Data Display

#### table
```html
<div class="overflow-x-auto">
  <table class="table {table-zebra} {table-pin-rows} {table-xs|table-sm|table-md|table-lg}">
    <thead><tr><th>Name</th><th>Value</th></tr></thead>
    <tbody><tr><td>Data</td><td>Value</td></tr></tbody>
  </table>
</div>
```

#### badge
```html
<span class="badge {badge-primary|badge-secondary|badge-accent|badge-ghost|badge-outline} {badge-xs|badge-sm|badge-md|badge-lg}">Badge</span>
```

#### alert
```html
<div role="alert" class="alert {alert-info|alert-success|alert-warning|alert-error}">
  <svg>...</svg>
  <span>Message</span>
</div>
```

#### stat
```html
<div class="stats {stats-vertical}">
  <div class="stat">
    <div class="stat-title">Title</div>
    <div class="stat-value">Value</div>
    <div class="stat-desc">Description</div>
  </div>
</div>
```

#### tabs
```html
<div role="tablist" class="tabs {tabs-box|tabs-border|tabs-lift}">
  <button role="tab" class="tab {tab-active}">Tab 1</button>
  <button role="tab" class="tab">Tab 2</button>
</div>
```

### Navigation

#### menu
```html
<ul class="menu {menu-horizontal} bg-base-200 rounded-box">
  <li><a>Item 1</a></li>
  <li><a class="active">Active</a></li>
  <li><details><summary>Parent</summary><ul><li><a>Child</a></li></ul></details></li>
</ul>
```

#### breadcrumbs
```html
<div class="breadcrumbs text-sm">
  <ul>
    <li><a>Home</a></li>
    <li><a>Documents</a></li>
    <li>Current</li>
  </ul>
</div>
```

#### steps
```html
<ul class="steps {steps-vertical}">
  <li class="step step-primary">Step 1</li>
  <li class="step step-primary">Step 2</li>
  <li class="step">Step 3</li>
</ul>
```

#### pagination
```html
<div class="join">
  <button class="join-item btn">«</button>
  <button class="join-item btn btn-active">1</button>
  <button class="join-item btn">2</button>
  <button class="join-item btn">»</button>
</div>
```

### Feedback

#### loading
```html
<span class="loading {loading-spinner|loading-dots|loading-ring|loading-ball|loading-bars|loading-infinity} {loading-xs|loading-sm|loading-md|loading-lg}"></span>
```

#### progress
```html
<progress class="progress {progress-primary} w-56" value="70" max="100"></progress>
```

#### skeleton
```html
<div class="skeleton h-32 w-32"></div>
<div class="skeleton h-4 w-full"></div>
```

#### toast
```html
<div class="toast {toast-start|toast-center|toast-end} {toast-top|toast-middle|toast-bottom}">
  <div class="alert alert-success"><span>Message</span></div>
</div>
```

### Content

#### avatar
```html
<div class="avatar {avatar-online|avatar-offline}">
  <div class="w-24 rounded-full">
    <img src="..." />
  </div>
</div>
```

#### carousel
```html
<div class="carousel {carousel-center} w-full">
  <div class="carousel-item"><img src="..." /></div>
  <div class="carousel-item"><img src="..." /></div>
</div>
```

#### collapse
```html
<div class="collapse {collapse-arrow|collapse-plus} bg-base-200">
  <input type="checkbox" />
  <div class="collapse-title text-xl font-medium">Title</div>
  <div class="collapse-content"><p>Content</p></div>
</div>
```

#### divider
```html
<div class="divider {divider-primary}">OR</div>
```

#### indicator
```html
<div class="indicator">
  <span class="indicator-item badge badge-primary">99+</span>
  <div class="bg-base-300 p-4">Content</div>
</div>
```

---

## Svelte MCP Tools

### 1. list-sections
Use FIRST to discover documentation sections.

### 2. get-documentation
Fetch full docs for specific sections.

### 3. svelte-autofixer
MUST use when writing Svelte code - keep calling until no issues.

### 4. playground-link
Generate playground link (only after user confirmation, never for project files).

---

## Common Patterns

### Page with Load Data
```svelte
<!-- +page.server.ts -->
<script lang="ts">
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ locals }) => {
  return { user: locals.user };
};
</script>

<!-- +page.svelte -->
<script lang="ts">
  let { data } = $props();
</script>
```

### Form Action
```svelte
<!-- +page.server.ts -->
export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    // process...
    return { success: true };
  }
};

<!-- +page.svelte -->
<form method="POST" use:enhance>
  <input name="field" />
  <button type="submit">Submit</button>
</form>
```

### Responsive Grid
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {#each items as item}<div class="card">{item}</div>{/each}
</div>
```

### Mobile-First Navbar
```svelte
<header class="navbar fixed top-0 z-50 glass">
  <div class="navbar-start">
    <a href="/" class="btn btn-ghost text-xl">Logo</a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal">{desktop menu}</ul>
  </div>
  <div class="navbar-end">
    <button class="btn btn-ghost lg:hidden" onclick={() => open = !open}>
      {#if open}<X />{:else}<Menu />{/if}
    </button>
  </div>
</header>
```
