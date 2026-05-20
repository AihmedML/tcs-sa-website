# Thought Creators Redesign Design

## Goal

Rebuild Thought Creators as a premium Arabic-first storytelling website inspired by Clever Mellow's cinematic scroll rhythm, while using Thought Creators' blue brand, real project imagery, and TheYearofTheCamel typography.

## Direction

The homepage should lead with proof: interiors, facades, commercial spaces, and execution work from Thought Creators' Instagram. Services and packages should follow the portfolio story, not lead it. The tone is confident, visual, and startup-polished without becoming a generic SaaS landing page.

## Core Experience

- A full-screen hero acts like a digital stage with huge RTL Arabic typography.
- A Three.js shader background creates a painted blue texture that reacts to cursor movement.
- Lenis provides smooth premium scrolling.
- GSAP ScrollTrigger animates each section as a chapter: hero, projects, services, process, packages, and contact.
- Project photos are interactive. Hovering a project lifts it, zooms the image, dims competing imagery, and reveals a project label/action. Keyboard focus and tap states must still expose the same information.

## Visual System

- Primary color: deep Thought Creators blue with brighter electric-blue transitions.
- Neutral support: off-white, ink black, slate, and small warm highlights from the project photography.
- Typography: TheYearofTheCamel for Arabic display and major labels, with a readable system fallback for small body copy.
- Layout: dark full-viewport chapters, huge sparse typography, floating project cards, horizontal/stacked image movement, and restrained rounded corners.

## Content Structure

1. Hero: "نحوّل المساحات إلى تجربة تُرى" with CTA buttons for works and WhatsApp.
2. Featured projects: real project images with hover/tap reveals.
3. Services: design, execution, finishing, interiors, facades, events/brand support.
4. Process: discovery, design, execution, delivery.
5. Packages/contact: simplified conversion area with WhatsApp, Instagram, and email.

## Technical Design

- Use Vite with vanilla JavaScript modules.
- Use npm packages: `three`, `gsap`, and `lenis`.
- Keep assets local under `public/assets`.
- Initialize Three.js in `src/background.js`.
- Initialize Lenis and GSAP ScrollTrigger in `src/animations.js`.
- Keep project data in `src/projects.js`.
- Keep DOM bootstrapping in `src/main.js`.

## Verification

- Build must pass with `npm run build`.
- A browser smoke test must confirm chapter sections exist, project cards exist, hover/focus reveal text, and the WebGL canvas is present.
- Manual browser screenshots must verify desktop and mobile layouts render without blank canvas, overlapping CTA text, or unusable project cards.
