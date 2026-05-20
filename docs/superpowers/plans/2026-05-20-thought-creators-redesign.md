# Thought Creators Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local Vite website for Thought Creators with cinematic scroll storytelling, a cursor-reactive Three.js background, GSAP ScrollTrigger scene animation, Lenis smooth scrolling, and interactive project photography.

**Architecture:** The site is a static Vite app with focused modules: project data, Three.js background, scroll animation setup, and DOM bootstrapping. Assets live in `public/assets` so build output is self-contained.

**Tech Stack:** Vite, vanilla JavaScript, Three.js, GSAP ScrollTrigger, Lenis, Playwright smoke testing.

---

## File Structure

- `package.json`: npm dependencies and scripts.
- `index.html`: document shell and root structure.
- `src/main.js`: imports CSS/data/modules and boots interactions.
- `src/styles.css`: full responsive visual system.
- `src/projects.js`: project/service/process/contact data.
- `src/background.js`: Three.js shader background.
- `src/animations.js`: Lenis and GSAP ScrollTrigger setup.
- `tests/smoke.mjs`: browser smoke test for required sections and hover/focus behavior.
- `public/assets/*`: local logo, font, and project images.

### Task 1: Scaffold And Assets

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create directory: `src`
- Create directory: `public/assets`
- Copy/download: logo, font files, and selected Thought Creators project images

- [ ] Create Vite package metadata with scripts for `dev`, `build`, and `test:smoke`.
- [ ] Download TheYearofTheCamel font from the Ministry of Culture font platform and extract selected weights.
- [ ] Copy selected Instagram work thumbnails into `public/assets`.

### Task 2: Red Test

**Files:**
- Create: `tests/smoke.mjs`

- [ ] Write a Playwright smoke test that expects: `.scene` sections, `.project-card` cards, `.webgl-bg canvas`, and a project hover/focus reveal.
- [ ] Run `npm run test:smoke` and confirm it fails before production implementation because the app is not built yet.

### Task 3: Main Site

**Files:**
- Create: `src/projects.js`
- Create: `src/main.js`
- Create: `src/styles.css`

- [ ] Build the Arabic RTL page structure with hero, projects, services, process, packages, and contact chapters.
- [ ] Add project cards using local images.
- [ ] Add hover/focus states for project photo interaction.
- [ ] Make desktop and mobile layouts responsive.

### Task 4: Motion Systems

**Files:**
- Create: `src/background.js`
- Create: `src/animations.js`
- Modify: `src/main.js`

- [ ] Implement Three.js full-screen shader background with cursor and scroll color response.
- [ ] Implement Lenis smooth scroll and sync it with GSAP's ticker.
- [ ] Implement GSAP ScrollTrigger scene reveals, project card movement, and chapter color transitions.

### Task 5: Verification

**Files:**
- No new files unless fixes are required.

- [ ] Run `npm run build`.
- [ ] Run `npm run test:smoke`.
- [ ] Start local dev server.
- [ ] Verify desktop and mobile screenshots in browser.
