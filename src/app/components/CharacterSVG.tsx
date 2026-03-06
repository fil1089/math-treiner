import { useEffect, useRef, useState, useCallback } from "react";
import svgRaw from "../../imports/mascot.svg?raw";

/* ── Shadow config (editable via debug panel) ───────────────────────── */
interface ShadowConfig {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  opacity: number;
  blur: number;
}

const DEFAULT_SHADOW: ShadowConfig = {
  cx: 512,
  cy: 966,
  rx: 341,
  ry: 22,
  opacity: 0.06,
  blur: 6,
};

export function CharacterSVG({
  size = 220,
  showShadowPanel = false,
}: {
  size?: number | string;
  mood?: "happy" | "thinking" | "sad" | "surprised" | "celebrating";
  showShadowPanel?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<SVGEllipseElement | null>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement | null>(null);

  // References to the gaze groups to move them directly without re-rendering the whole SVG
  const gazeLRef = useRef<SVGGElement | null>(null);
  const gazeRRef = useRef<SVGGElement | null>(null);
  // Store the eye centers for math
  const eyeCentersRef = useRef<{ l: { x: number, y: number }, r: { x: number, y: number } } | null>(null);

  const [shadow, setShadow] = useState<ShadowConfig>({ ...DEFAULT_SHADOW });

  /* Apply shadow changes live without rebuilding the whole SVG */
  useEffect(() => {
    const el = shadowRef.current;
    const bl = blurRef.current;
    if (!el || !bl) return;
    el.setAttribute("cx", String(shadow.cx));
    el.setAttribute("cy", String(shadow.cy));
    el.setAttribute("rx", String(shadow.rx));
    el.setAttribute("ry", String(shadow.ry));
    el.setAttribute("fill-opacity", String(shadow.opacity));
    bl.setAttribute("stdDeviation", String(shadow.blur));
  }, [shadow]);

  /* Build inline SVG once on mount */
  useEffect(() => {
    if (!containerRef.current) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgRaw, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) return;

    const ns = "http://www.w3.org/2000/svg";
    const paths = Array.from(svg.querySelectorAll("path"));
    const parentEl = svg as unknown as Element;

    function findAllPaths(dStart: string): Element[] {
      return paths.filter((p) =>
        p.getAttribute("d")?.trimStart().startsWith(dStart)
      );
    }
    function findPath(dStart: string): Element | null {
      return findAllPaths(dStart)[0] ?? null;
    }

    /* ── 1. Legs group (STATIC) ──────────────────────────────────────── */
    const legsGroup = document.createElementNS(ns, "g");
    const addedToLegs = new Set<Element>();
    function addToLegs(el: Element) {
      if (!addedToLegs.has(el)) { addedToLegs.add(el); legsGroup.appendChild(el); }
    }

    ["M415.684", "M412.219", "M415.754", "M418.438", "M605.975", "M551.015", "M547.806", "M605.806"]
      .forEach((d) => findAllPaths(d).forEach(addToLegs));

    Array.from(svg.querySelectorAll("ellipse")).forEach(addToLegs);

    // Shoe paths: lines 88-102. Exclude M353.306 / M338.209 (those are arm paths!)
    ["M338.354", "M504.925", "M479.941", "M479.984", "M410.159", "M387.676",
      "M660.6", "M519.295", "M544.335", "M543.965", "M549.79", "M545.44", "M638.17"]
      .forEach((d) => findAllPaths(d).forEach(addToLegs));

    /* ── 2a. Arm groups (subtle pendulum, independent of body sway) ─────
     *  Right arm (viewer right, x≈670): lines 5-6 (M671.693, M683.973)
     *  (Excluded M673.535, M664.17, M672.5 because they are the backpack pocket)
     * ─────────────────────────────────────────────────────────────────── */
    const armRGroup = document.createElementNS(ns, "g");
    armRGroup.setAttribute("class", "anim-arm-r");
    ["M671.693", "M683.973"]
      .forEach((d) => findAllPaths(d).forEach((p) => armRGroup.appendChild(p)));

    // Left arm (viewer left, x≈353): lines 103-105
    const armLGroup = document.createElementNS(ns, "g");
    armLGroup.setAttribute("class", "anim-arm-l");
    ["M353.306", "M338.209"]
      .forEach((d) => findAllPaths(d).forEach((p) => armLGroup.appendChild(p)));

    // Insert arm groups into DOM (still part of upper body area)
    parentEl.appendChild(armRGroup);
    parentEl.appendChild(armLGroup);

    /* ── 3. Eyes ─────────────────────────────────────────────────────── */
    const insertRef = findPath("M474.506");

    function buildEye(outerD: string, whiteD: string, pupilD: string, hlD: string, blinkCls: string, isRight: boolean) {
      const gazeGroup = document.createElementNS(ns, "g");
      gazeGroup.setAttribute("class", "anim-gaze");

      // Save refs for DOM manipulation driven by mouse movements
      if (isRight) gazeRRef.current = gazeGroup as unknown as SVGGElement;
      else gazeLRef.current = gazeGroup as unknown as SVGGElement;

      [pupilD, hlD].forEach((d) => { const p = findPath(d); if (p) gazeGroup.appendChild(p); });

      const blinkGroup = document.createElementNS(ns, "g");
      blinkGroup.setAttribute("class", `anim-blink ${blinkCls}`);
      [outerD, whiteD].forEach((d) => { const p = findPath(d); if (p) blinkGroup.appendChild(p); });
      blinkGroup.appendChild(gazeGroup);

      if (insertRef) parentEl.insertBefore(blinkGroup, insertRef);
      else parentEl.appendChild(blinkGroup);
    }

    buildEye("M438.956", "M441.515", "M441.126", "M455.658", "anim-blink-l", false);
    buildEye("M581.635", "M582.415", "M573.41", "M588.685", "anim-blink-r", true);

    /* ── 4. Body group (sways) ───────────────────────────────────────── */
    const bodyGroup = document.createElementNS(ns, "g");
    bodyGroup.setAttribute("class", "anim-body");
    Array.from(parentEl.children).forEach((child) => bodyGroup.appendChild(child));

    /* ── 5. Shadow ───────────────────────────────────────────────────── */
    let defsEl = svg.querySelector("defs");
    if (!defsEl) {
      defsEl = document.createElementNS(ns, "defs");
      svg.insertBefore(defsEl, svg.firstChild);
    }
    const filter = document.createElementNS(ns, "filter");
    filter.setAttribute("id", "char-shadow-blur");
    filter.setAttribute("x", "-60%"); filter.setAttribute("y", "-100%");
    filter.setAttribute("width", "220%"); filter.setAttribute("height", "300%");
    const blur = document.createElementNS(ns, "feGaussianBlur");
    blur.setAttribute("in", "SourceGraphic");
    blur.setAttribute("stdDeviation", String(DEFAULT_SHADOW.blur));
    filter.appendChild(blur);
    defsEl.appendChild(filter);
    blurRef.current = blur as unknown as SVGFEGaussianBlurElement;

    const shadowEl = document.createElementNS(ns, "ellipse");
    shadowEl.setAttribute("cx", String(DEFAULT_SHADOW.cx));
    shadowEl.setAttribute("cy", String(DEFAULT_SHADOW.cy));
    shadowEl.setAttribute("rx", String(DEFAULT_SHADOW.rx));
    shadowEl.setAttribute("ry", String(DEFAULT_SHADOW.ry));
    shadowEl.setAttribute("fill", "#0d1f2d");
    shadowEl.setAttribute("fill-opacity", String(DEFAULT_SHADOW.opacity));
    shadowEl.setAttribute("filter", "url(#char-shadow-blur)");
    shadowRef.current = shadowEl as unknown as SVGEllipseElement;

    /* Order: shadow → legs (static) → body (sways on top) */
    parentEl.appendChild(shadowEl);
    parentEl.appendChild(legsGroup);
    parentEl.appendChild(bodyGroup);

    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.style.width = "100%";
    svg.style.height = "100%";

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(svg);

    // Schedule calculating the eye centers after the SVG is mounted and rendered to DOM
    setTimeout(() => {
      const lWhite = findPath("M441.515");
      const rWhite = findPath("M582.415");
      if (lWhite && rWhite) {
        const lRect = lWhite.getBoundingClientRect();
        const rRect = rWhite.getBoundingClientRect();
        eyeCentersRef.current = {
          l: { x: lRect.left + lRect.width / 2, y: lRect.top + lRect.height / 2 },
          r: { x: rRect.left + rRect.width / 2, y: rRect.top + rRect.height / 2 }
        };
      }
    }, 100);
  }, []);

  /* ── Interactive Eye Tracking ────────────────────────────────────────── */
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!gazeLRef.current || !gazeRRef.current || !eyeCentersRef.current || !containerRef.current) return;

      let clientX, clientY;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // Max movement radius in SVG coordinate space (approximate matching pupil bounds)
      const MAX_MOVE = 8;

      const calcOffset = (center: { x: number, y: number }) => {
        const dx = clientX - center.x;
        const dy = clientY - center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // If cursor is very close, don't move or move slightly
        if (dist < 10) return { x: 0, y: 0 };

        // Use a non-linear scale so eyes move faster initially and slow down near the edge
        // Distance is in screen pixels, MAX_MOVE is in SVG viewBox space.
        // We estimate ~300px on screen equals full edge look
        const factor = Math.min(dist / 300, 1);
        const nx = dx / dist;
        const ny = dy / dist;

        return {
          x: nx * (MAX_MOVE * factor),
          y: ny * (MAX_MOVE * factor)
        };
      };

      const lOffset = calcOffset(eyeCentersRef.current.l);
      const rOffset = calcOffset(eyeCentersRef.current.r);

      gazeLRef.current.style.transform = `translate(${lOffset.x}px, ${lOffset.y}px)`;
      gazeRRef.current.style.transform = `translate(${rOffset.x}px, ${rOffset.y}px)`;
    };

    // Recalculate centers on resize or scroll
    const handleLayoutChange = () => {
      if (!containerRef.current) return;
      const svg = containerRef.current.querySelector('svg');
      if (!svg) return;

      const paths = Array.from(svg.querySelectorAll("path"));
      const lWhite = paths.find(p => p.getAttribute("d")?.trimStart().startsWith("M441.515"));
      const rWhite = paths.find(p => p.getAttribute("d")?.trimStart().startsWith("M582.415"));

      if (lWhite && rWhite) {
        const lRect = lWhite.getBoundingClientRect();
        const rRect = rWhite.getBoundingClientRect();
        eyeCentersRef.current = {
          l: { x: lRect.left + lRect.width / 2, y: lRect.top + lRect.height / 2 },
          r: { x: rRect.left + rRect.width / 2, y: rRect.top + rRect.height / 2 }
        };
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("resize", handleLayoutChange);
    window.addEventListener("scroll", handleLayoutChange, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("resize", handleLayoutChange);
      window.removeEventListener("scroll", handleLayoutChange);
    };
  }, []);

  const containerStyle: React.CSSProperties =
    size === "100%"
      ? { height: "100%", maxHeight: "190px", width: "auto", margin: "0 auto", display: "block" }
      : { width: size, height: "auto", margin: "0 auto", display: "block" };

  return (
    <>
      <style>{`
        /* ── Body sway — very subtle, pivot at shorts/shin junction 71% ── */
        @keyframes charBodySway {
          0%,  100% { transform: rotate(0deg)     translateY(0px);  }
          25%        { transform: rotate(0.35deg)  translateY(-1px); }
          75%        { transform: rotate(-0.28deg) translateY(-0.7px); }
        }
        .anim-body {
          transform-box: view-box;
          transform-origin: 50% 71%;
          animation: charBodySway 3.4s ease-in-out infinite;
        }



        /* ── Eye blink ───────────────────────────────────────────────── */
        @keyframes charEyeBlink {
          0%, 88%, 100% { transform: scaleY(1);    }
          91%           { transform: scaleY(0.06); }
          94%           { transform: scaleY(1);    }
        }
        .anim-blink {
          transform-box: fill-box;
          transform-origin: center;
          animation: charEyeBlink 5s ease-in-out infinite;
        }
        .anim-blink-r { animation-delay: 0.04s; }

        /* ── Eye gaze (dynamic script handles movement now) ──────────── */
        .anim-gaze {
          transition: transform 0.1s ease-out;
        }
      `}</style>

      <div ref={containerRef} style={containerStyle} />

      {/* ── Shadow debug panel ─────────────────────────────────────────── */}
      {showShadowPanel && (
        <div style={{
          position: "fixed", bottom: 16, right: 16, zIndex: 9999,
          background: "rgba(15,25,40,0.88)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(100,180,220,0.25)",
          borderRadius: 12, padding: "14px 18px", minWidth: 260,
          color: "#e0f0ff", fontFamily: "monospace", fontSize: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 13, color: "#7dd3fc" }}>
            🎛 Shadow Controls
          </div>
          {([
            ["cx — X смещение", "cx", 0, 1024, 1],
            ["cy — Y позиция", "cy", 900, 1050, 1],
            ["rx — ширина", "rx", 50, 400, 1],
            ["ry — высота", "ry", 4, 60, 1],
            ["opacity", "opacity", 0, 0.5, 0.01],
            ["blur", "blur", 0, 40, 1],
          ] as [string, keyof ShadowConfig, number, number, number][]).map(([label, key, min, max, step]) => (
            <div key={key} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ color: "#94a3b8" }}>{label}</span>
                <span style={{ color: "#f0f9ff" }}>{Number(shadow[key]).toFixed(step < 1 ? 2 : 0)}</span>
              </div>
              <input
                type="range" min={min} max={max} step={step}
                value={shadow[key]}
                onChange={(e) =>
                  setShadow((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                }
                style={{ width: "100%", accentColor: "#38bdf8" }}
              />
            </div>
          ))}
          <button
            onClick={() => setShadow({ ...DEFAULT_SHADOW })}
            style={{
              marginTop: 6, width: "100%", padding: "5px 0",
              background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.4)",
              borderRadius: 6, color: "#7dd3fc", cursor: "pointer", fontSize: 11,
            }}
          >
            Сбросить
          </button>
          <div style={{ marginTop: 10, color: "#64748b", fontSize: 10, lineHeight: 1.5 }}>
            cx:{shadow.cx} cy:{shadow.cy} rx:{shadow.rx} ry:{shadow.ry}<br />
            opacity:{shadow.opacity.toFixed(2)} blur:{shadow.blur}
          </div>
        </div>
      )}
    </>
  );
}
