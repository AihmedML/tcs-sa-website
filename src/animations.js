import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export function initAnimations(background) {
  const lenis = new Lenis({
    duration: 1.18,
    smoothWheel: true,
    wheelMultiplier: 0.86,
    touchMultiplier: 1.1,
  });

  lenis.on("scroll", ({ progress }) => {
    ScrollTrigger.update();
    background?.setScroll(progress);
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll("[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.scrollTarget);
      if (target) {
        lenis.scrollTo(target, { offset: -20 });
      }
    });
  });

  gsap.utils.toArray(".scene").forEach((scene, index) => {
    const items = scene.querySelectorAll(".reveal");
    gsap.fromTo(
      items,
      { y: 72, autoAlpha: 0, filter: "blur(12px)" },
      {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: scene,
          start: index === 0 ? "top 80%" : "top 62%",
          end: "bottom 38%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  gsap.utils.toArray(".chapter-title").forEach((title) => {
    gsap.fromTo(
      title,
      { letterSpacing: "0.04em", opacity: 0.28 },
      {
        letterSpacing: "0em",
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: title.closest(".scene"),
          start: "top bottom",
          end: "center center",
          scrub: true,
        },
      },
    );
  });

  gsap.utils.toArray(".project-card").forEach((card, index) => {
    gsap.fromTo(
      card,
      { y: 120 + index * 20, rotate: index % 2 === 0 ? -3 : 3 },
      {
        y: 0,
        rotate: index % 2 === 0 ? -0.7 : 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".project-gallery",
          start: "top 78%",
          end: "bottom 25%",
          scrub: 1,
        },
      },
    );
  });

  const orbit = document.querySelector(".brand-orbit");
  if (orbit) {
    gsap.to(orbit, {
      yPercent: -6,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.4,
      },
    });

    orbit.addEventListener("pointermove", (event) => {
      const rect = orbit.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      orbit.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`);
      orbit.style.setProperty("--tilt-y", `${(x * 10).toFixed(2)}deg`);
    });

    orbit.addEventListener("pointerleave", () => {
      orbit.style.setProperty("--tilt-x", "0deg");
      orbit.style.setProperty("--tilt-y", "0deg");
    });
  }

  ScrollTrigger.refresh();

  return lenis;
}
