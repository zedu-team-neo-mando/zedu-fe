"use client";

// Behavior-triggered copy personalization for bootcamps solution page.
import { useEffect, useRef } from "react";

type Slot = "heroCta" | "heroSub" | "finalHead";

export const BehaviorPersonalization = () => {
  const returning = useRef<boolean | null>(null);

  useEffect(() => {
    const heroSub = document.querySelector<HTMLElement>(
      '[data-personalize="hero-subhead"]'
    );
    const heroCtaBtn = document.querySelector<HTMLElement>(
      '[data-personalize="hero-ctas"] a:first-of-type button'
    );
    const comparison = document.querySelector<HTMLElement>(
      '[data-personalize="comparison"]'
    );
    const finalCta = document.querySelector<HTMLElement>(
      '[data-personalize="final-cta"]'
    );
    const finalHead = document.querySelector<HTMLElement>(
      '[data-personalize="final-cta"] h2'
    );

    const taken: Partial<Record<Slot, number>> = {};
    const locked = new WeakSet<HTMLElement>();

    const lockHeight = (el: HTMLElement) => {
      if (!locked.has(el)) {
        locked.add(el);
        el.style.minHeight = el.offsetHeight + "px";
      }
    };

    const setText = (el: HTMLElement, text: string) => {
      lockHeight(el);
      if (el === heroCtaBtn) {
        if (el.firstChild) (el.firstChild as Text).nodeValue = text;
      } else {
        el.textContent = text;
      }
    };

    const swap = (
      slot: Slot,
      el: HTMLElement | null,
      priority: number,
      text: string
    ) => {
      if (!el) return;
      const current = taken[slot];
      if (current !== undefined && current <= priority) return;
      taken[slot] = priority;
      setText(el, text);
    };

    // TRIGGER 1 (priority 1): comparison dwell
    let t1Fired = false;
    let dwellTimer: ReturnType<typeof setTimeout> | null = null;
    let compObserver: IntersectionObserver | null = null;
    if (comparison) {
      compObserver = new IntersectionObserver(
        (entries) => {
          if (t1Fired) return;
          const entry = entries[0];
          if (!entry) return;
          const visible =
            entry.isIntersecting &&
            (entry.intersectionRatio >= 0.5 ||
              entry.intersectionRect.height >= window.innerHeight * 0.5);

          if (visible && dwellTimer === null) {
            dwellTimer = setTimeout(() => {
              t1Fired = true;
              swap("heroCta", heroCtaBtn, 1, "See how bootcamps run cohorts");
              compObserver?.disconnect();
              dwellTimer = null;
            }, 5000);
          } else if (!visible && dwellTimer !== null) {
            clearTimeout(dwellTimer);
            dwellTimer = null;
          }
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] }
      );
      compObserver.observe(comparison);
    }

    // TRIGGER 2 (priority 2): pricing hover
    let t2Fired = false;
    const handleMouseOver = (e: MouseEvent) => {
      if (t2Fired) return;
      const a = (e.target as Element | null)?.closest?.('a[href="/pricing"]');
      if (!a || a.contains(e.relatedTarget as Node | null)) return;
      t2Fired = true;
      swap(
        "heroSub",
        heroSub,
        2,
        "Built for programs that care about outcomes, not just chat."
      );
      swap("heroCta", heroCtaBtn, 2, "Talk to sales about pricing");
      document.removeEventListener("mouseover", handleMouseOver);
    };
    document.addEventListener("mouseover", handleMouseOver);

    // TRIGGER 3 (priority 3): CTA intent miss
    let t3Fired = false;
    let ctaClicked = false;
    const handleClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      const href = a?.getAttribute("href") ?? "";
      if (
        href.startsWith("/contact-sales") ||
        href.startsWith("/auth/sign-up")
      ) {
        ctaClicked = true;
      }
    };
    document.addEventListener("click", handleClick, true);

    let finalCtaObserver: IntersectionObserver | null = null;
    if (finalCta) {
      finalCtaObserver = new IntersectionObserver(
        (entries) => {
          if (t3Fired) return;
          const entry = entries[0];
          if (!entry || !entry.isIntersecting) return;
          const scrollHeight = document.documentElement.scrollHeight;
          const scrolled =
            scrollHeight > 0
              ? (window.scrollY + window.innerHeight) / scrollHeight
              : 0;
          if (scrolled >= 0.75 && !ctaClicked) {
            t3Fired = true;
            swap(
              "finalHead",
              finalHead,
              3,
              "Not ready for a demo? See a 3-minute walkthrough"
            );
            finalCtaObserver?.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      finalCtaObserver.observe(finalCta);
    }

    // TRIGGER 4 (priority 4): return visit
    let t4Fired = false;
    if (returning.current === null) {
      try {
        returning.current =
          sessionStorage.getItem("zedu_bootcamps_visited") === "1";
        sessionStorage.setItem("zedu_bootcamps_visited", "1");
      } catch {
        returning.current = false;
      }
    }
    if (returning.current && !t4Fired) {
      t4Fired = true;
      swap("heroSub", heroSub, 4, "Welcome back — ready to see it in action?");
    }

    return () => {
      compObserver?.disconnect();
      if (dwellTimer !== null) clearTimeout(dwellTimer);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("click", handleClick, true);
      finalCtaObserver?.disconnect();
    };
  }, []);

  return null;
};
