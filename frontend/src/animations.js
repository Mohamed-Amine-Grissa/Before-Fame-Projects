/* ——— animations.js · GSAP scroll + interaction utilities ——— */
/* All animations use transform/opacity only. Respects prefers-reduced-motion. */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REDUCED = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── Section scroll reveals ─────────────────────────────────────────────────
// Targets elements with [data-reveal] attribute
// Optional [data-reveal-delay="ms"] for per-element stagger offset
export function initSectionReveals() {
  if (REDUCED) return;

  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    const delay = parseFloat(el.dataset.revealDelay || "0") / 1000;
    gsap.fromTo(
      el,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 87%",
          once: true,
        },
      }
    );
  });
}

// ── Stagger-reveal children of a container ────────────────────────────────
// 40–60ms stagger per child as required
export function initStaggerReveal(container, stagger = 0.05) {
  if (REDUCED || !container) return;
  const children = Array.from(container.children);
  if (!children.length) return;

  gsap.fromTo(
    children,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.85,
      stagger,               // 50ms default → within 40–60ms target
      ease: "power3.out",
      scrollTrigger: {
        trigger: container,
        start: "top 82%",
        once: true,
      },
    }
  );
}

// ── GSAP countup on scroll into view ─────────────────────────────────────
// Replaces element text content with animated number
export function initGsapCountup(el, target, opts = {}) {
  if (!el) return;
  const { suffix = "", prefix = "", duration = 1.8, decimals = 0 } = opts;
  const obj = { val: 0 };

  gsap.to(obj, {
    val: target,
    duration: REDUCED ? 0.001 : duration,
    ease: "power2.out",
    scrollTrigger: {
      trigger: el,
      start: "top 80%",
      once: true,
    },
    onUpdate() {
      const rounded = decimals > 0 ? obj.val.toFixed(decimals) : Math.round(obj.val);
      el.textContent = prefix + Number(rounded).toLocaleString("en-US") + suffix;
    },
  });
}

// ── 3D card tilt on hover ─────────────────────────────────────────────────
// perspective(1000px) rotateX/Y from mouse delta, spring-back on leave
// Returns cleanup function
export function initCardTilt(card, { maxX = 8, maxY = 6 } = {}) {
  if (REDUCED || !card) return () => {};

  card.style.transformStyle = "preserve-3d";
  card.style.willChange = "transform";

  const onMove = (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 → 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    /* 400ms ease — smooth without feeling sluggish */
    gsap.to(card, {
      rotateY: x * maxX * 2,
      rotateX: -y * maxY * 2,
      transformPerspective: 1000,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const onLeave = () => {
    /* cubic-bezier spring-back — 0.5s as specified */
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.65)",
      overwrite: "auto",
    });
  };

  card.addEventListener("mousemove", onMove);
  card.addEventListener("mouseleave", onLeave);

  return () => {
    card.removeEventListener("mousemove", onMove);
    card.removeEventListener("mouseleave", onLeave);
    gsap.killTweensOf(card);
  };
}

// ── Hero background parallax on scroll ────────────────────────────────────
// Element drifts at slower rate than scroll creating depth layer
export function initHeroParallax(element, trigger) {
  if (REDUCED || !element || !trigger) return;
  gsap.to(element, {
    yPercent: 18,
    ease: "none",
    scrollTrigger: {
      trigger,
      start: "top top",
      end: "bottom top",
      scrub: 1.2,
    },
  });
}

// ── Page-enter stagger (after route transition) ────────────────────────────
// Stagger children 40ms · Power3.easeInOut · 600ms total feel
export function pageEnterStagger(container) {
  if (REDUCED || !container) return;
  const children = Array.from(container.children);
  gsap.fromTo(
    children,
    { y: 24, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.65,
      stagger: 0.04,
      ease: "power3.inOut",
      clearProps: "all",
    }
  );
}

// ── Kill all ScrollTrigger instances (call on unmount) ─────────────────────
export function killAllTriggers() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
}
