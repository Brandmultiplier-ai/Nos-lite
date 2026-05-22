"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { usesDesignTokens } from "@/theme/themeClasses";
import { useTheme } from "@/theme/ThemeProvider";

interface CardInfoTipProps {
  text: string;
  /** Short label for assistive tech (avoid duplicating entire tooltip). */
  subject?: string;
  className?: string;
}

const TIP_Z = 10_000;
const POINTER_HIDE_MS = 220;

function collectScrollTargets(start: HTMLElement | null): Set<EventTarget> {
  const targets = new Set<EventTarget>();
  targets.add(window);
  let cur = start?.parentElement;
  while (cur) {
    const s = getComputedStyle(cur);
    if (/(auto|scroll|overlay)/.test(s.overflow + s.overflowY + s.overflowX)) {
      targets.add(cur);
    }
    cur = cur.parentElement;
  }
  return targets;
}

export function CardInfoTip({ text, subject = "Metric", className = "" }: CardInfoTipProps) {
  const { version } = useTheme();
  const focusRingClass = usesDesignTokens(version)
    ? "focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]"
    : "focus-visible:ring-2 focus-visible:ring-[#4940c6]/55";
  const iconClass = usesDesignTokens(version)
    ? "text-[var(--theme-mute)] hover:text-[var(--theme-ink-secondary)]"
    : "text-[#718096] hover:text-[#a0aec0]";
  const tipClass =
    version === "v5"
      ? "w-56 max-w-[min(14rem,calc(100vw-3rem))] rounded-xl border border-[var(--theme-hairline)] bg-[#FFFFFF] px-3 py-2 text-left text-[11px] font-normal leading-snug text-[var(--theme-ink-secondary)] shadow-[var(--theme-elevated-shadow)]"
      : version === "v6"
        ? "w-56 max-w-[min(14rem,calc(100vw-3rem))] rounded-[2px] border border-[var(--theme-hairline)] bg-[#080808] px-3 py-2 text-left text-sm font-normal leading-5 text-[var(--theme-mute)] shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
      : version === "v4"
      ? "w-56 max-w-[min(14rem,calc(100vw-3rem))] rounded-[16px] border border-white/20 bg-[#111111] px-3 py-2 text-left text-[11px] font-normal leading-snug text-[#d1d5db] shadow-[0_12px_32px_rgba(0,0,0,0.65)]"
      : version === "v3"
      ? "w-56 max-w-[min(14rem,calc(100vw-3rem))] rounded-[12px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-raised)] px-3 py-2 text-left text-[11px] font-normal leading-snug text-[var(--theme-ink-secondary)] shadow-[var(--theme-elevated-shadow)]"
      : usesDesignTokens(version)
        ? "w-56 max-w-[min(14rem,calc(100vw-3rem))] rounded-[24px] border border-[var(--theme-hairline)] bg-[#FFFFFF] px-3 py-2 text-left text-[11px] font-normal leading-snug text-[var(--theme-ink-secondary)] shadow-[var(--theme-elevated-shadow)]"
        : "w-56 max-w-[min(14rem,calc(100vw-3rem))] rounded-lg border border-white/[0.12] bg-[#0c101c]/96 px-3 py-2 text-left text-[11px] font-normal leading-snug text-[#D9E4F8] shadow-[0_16px_40px_rgba(0,0,0,0.55)] backdrop-blur-md";
  const wrapRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const base = useId().replace(/:/g, "");
  const tipId = `${base}-desc`;
  const label = `${subject} explanation`;

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(
    () => () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    },
    [],
  );

  const cancelHide = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    hideTimerRef.current = setTimeout(() => setOpen(false), POINTER_HIDE_MS);
  }, []);

  const show = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setOpen(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !mounted) {
      setCoords(null);
      return;
    }

    function reposition() {
      const wrap = wrapRef.current;
      const tip = tipRef.current;
      if (!wrap || !tip) return;

      const r = wrap.getBoundingClientRect();
      const tbox = tip.getBoundingClientRect();

      const gutter = 8;
      let top = r.top - tbox.height - gutter;
      const placeAbove = top >= gutter;
      if (!placeAbove) {
        top = r.bottom + gutter;
      }

      let left = r.left + r.width / 2 - tbox.width / 2;
      const vw = window.innerWidth;
      const maxLeft = Math.max(gutter, vw - tbox.width - gutter);
      left = Math.min(Math.max(left, gutter), maxLeft);

      setCoords({ top, left });
    }

    reposition();
    const raf = requestAnimationFrame(() => reposition());

    const scrollRoots = collectScrollTargets(wrapRef.current);
    for (const t of scrollRoots) {
      t.addEventListener("scroll", reposition, { passive: true, capture: true });
    }

    window.addEventListener("resize", reposition);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(reposition);
      if (wrapRef.current) ro.observe(wrapRef.current);
      if (tipRef.current) ro.observe(tipRef.current);
    }

    return () => {
      cancelAnimationFrame(raf);
      for (const t of scrollRoots) {
        t.removeEventListener("scroll", reposition, true);
      }
      window.removeEventListener("resize", reposition);
      ro?.disconnect();
    };
  }, [open, mounted, text]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(ev: PointerEvent) {
      const t = ev.target as Node;
      if (wrapRef.current?.contains(t)) return;
      if (tipRef.current?.contains(t)) return;
      cancelHide();
      setOpen(false);
    }

    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape") {
        cancelHide();
        setOpen(false);
        wrapRef.current?.querySelector("button")?.dispatchEvent(new FocusEvent("blur"));
      }
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [cancelHide, open]);

  const handleBlur = useCallback(() => {
    queueMicrotask(() => {
      if (!wrapRef.current?.contains(document.activeElement) && !tipRef.current?.contains(document.activeElement)) {
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current);
          hideTimerRef.current = null;
        }
        setOpen(false);
      }
    });
  }, []);

  const tipNode =
    open && mounted && typeof document !== "undefined" ? (
      <span
        ref={tipRef}
        id={tipId}
        role="tooltip"
        onPointerEnter={cancelHide}
        onPointerLeave={scheduleHide}
        style={{
          position: "fixed",
          top: coords?.top ?? -9999,
          left: coords?.left ?? -9999,
          zIndex: TIP_Z,
          visibility: coords ? "visible" : "hidden",
        }}
        className={tipClass}
      >
        {text}
      </span>
    ) : null;

  return (
    <>
      <span
        ref={wrapRef}
        className={`inline-flex shrink-0 ${className}`}
        onPointerEnter={show}
        onPointerLeave={scheduleHide}
        onFocusCapture={show}
        onBlurCapture={handleBlur}
      >
        <button
          type="button"
          className={`-m-0.5 rounded-lg p-0.5 outline-none transition ${iconClass} ${focusRingClass}`}
          aria-label={label}
          aria-describedby={open ? tipId : undefined}
          aria-expanded={open}
        >
          <HiOutlineInformationCircle className="h-4 w-4" aria-hidden />
        </button>
      </span>
      {mounted && tipNode ? createPortal(tipNode, document.body) : null}
    </>
  );
}

interface MetricHeadingWithInfoProps {
  title: string;
  hint: string;
  /** Classes for the title element only */
  titleClassName?: string;
}

export function MetricHeadingWithInfo({
  title,
  hint,
  titleClassName = "text-xs font-semibold uppercase tracking-[0.08em] text-[#A0AEC0]",
}: MetricHeadingWithInfoProps) {
  if (!hint.trim()) {
    return <p className={titleClassName}>{title}</p>;
  }

  return (
    <div className="flex items-start justify-between gap-2">
      <p className={`min-w-0 flex-1 ${titleClassName}`}>{title}</p>
      <CardInfoTip subject={title} text={hint} />
    </div>
  );
}
