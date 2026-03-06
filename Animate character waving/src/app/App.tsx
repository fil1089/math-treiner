import { useEffect, useRef } from "react";
import svgRaw    from "../imports/марионетка.svg?raw";
import svgLowRaw from "../imports/рука_опущена.svg?raw";

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgRaw, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) return;

    /* All paths; in this SVG they are direct children of <svg> (no clip group). */
    const paths = Array.from(svg.querySelectorAll("path"));
    const parentEl = paths[0].parentNode as Element; // the <svg> element itself

    /* ── utilities ────────────────────────────────────────────────────────── */
    const ns = "http://www.w3.org/2000/svg";
    function g(...cls: string[]) {
      const el = document.createElementNS(ns, "g");
      if (cls.length) el.setAttribute("class", cls.join(" "));
      return el;
    }
    function findPath(dStart: string) {
      return paths.find(p => p.getAttribute("d")?.trimStart().startsWith(dStart)) ?? null;
    }

    /* ── 1. Three-segment puppet arm ──────────────────────────────────────
     *
     *  Segment A (upper arm / shoulder):  paths M717.934, M722.975
     *  Segment B (forearm / elbow):       paths M744.964, M747.539
     *  Segment C (hand / wrist):          paths M809.339, M809.978, M840.886
     *
     *  DOM hierarchy (nested so each child rotates in parent's frame):
     *
     *    shoulderGroup.anim-arm-shoulder   ← rotates around shoulder joint
     *      segA paths (upper arm)
     *      elbowGroup.anim-arm-elbow       ← rotates around elbow joint
     *        segB paths (forearm)
     *        wristGroup.anim-arm-wrist     ← rotates around wrist joint
     *          segC paths (hand)
     *
     *  The whole tree is inserted BEFORE the main body path so the arm
     *  renders behind the torso (z-order preserved).
     * ──────────────────────────────────────────────────────────────────── */

    // Build wrist group (hand, innermost)
    const wristGroup = g("anim-arm-wrist");
    ["M809.339", "M809.978", "M840.886"].forEach(d => {
      const p = findPath(d);
      if (p) wristGroup.appendChild(p);
    });

    // Build elbow group (forearm + wrist)
    const elbowGroup = g("anim-arm-elbow");
    ["M744.964", "M747.539"].forEach(d => {
      const p = findPath(d);
      if (p) elbowGroup.appendChild(p);
    });
    elbowGroup.appendChild(wristGroup);

    // Build shoulder group (upper arm + elbow)
    const shoulderGroup = g("anim-arm-shoulder", "anim-raised-arm");
    ["M717.934", "M722.975"].forEach(d => {
      const p = findPath(d);
      if (p) shoulderGroup.appendChild(p);
    });
    shoulderGroup.appendChild(elbowGroup);

    // Insert arm group before the main body so it renders behind the torso
    const bodyStartPath = findPath("M435.19");
    if (bodyStartPath) parentEl.insertBefore(shoulderGroup, bodyStartPath);
    else parentEl.appendChild(shoulderGroup);

    /* ── 1b. Lowered arm (from рука_опущена.svg) ──────────────────────────
     *  Paths [3], [4], [5] from the second SVG represent the arm hanging
     *  down. We clone them into a separate group and toggle visibility
     *  in sync with the raised-arm group (they never overlap on screen).
     * ──────────────────────────────────────────────────────────────────── */
    const docLow = parser.parseFromString(svgLowRaw, "image/svg+xml");
    const svgLow = docLow.querySelector("svg");
    if (svgLow) {
      const pathsLow = Array.from(svgLow.querySelectorAll("path"));
      const loweredArmGroup = g("anim-lowered-arm");
      // indices 3, 4, 5 → fill body, dark outline, inner detail
      [3, 4, 5].forEach(i => {
        if (pathsLow[i]) loweredArmGroup.appendChild(pathsLow[i].cloneNode(true) as Element);
      });
      // Insert at same z-level as raised arm (before main body)
      if (bodyStartPath) parentEl.insertBefore(loweredArmGroup, bodyStartPath);
      else parentEl.appendChild(loweredArmGroup);
    }

    /* ── 2. Eyes ──────────────────────────────────────────────────────────
     *  insertRef = mouth path (M474.506) — stable anchor, never moved.
     *  Both blink groups are inserted before it, preserving z-order.
     * ──────────────────────────────────────────────────────────────────── */
    const insertRef = findPath("M474.506");

    function buildEye(
      outerD: string,
      whiteD: string,
      pupilD: string,
      hlD:    string,
      blinkClass: string,
      gazeDelay: string
    ) {
      const outer = findPath(outerD);
      const white = findPath(whiteD);
      const pupil = findPath(pupilD);
      const hl    = findPath(hlD);

      const gazeGroup = g("anim-gaze");
      gazeGroup.style.animationDelay = gazeDelay;
      if (pupil) gazeGroup.appendChild(pupil);
      if (hl)    gazeGroup.appendChild(hl);

      const blinkGroup = g("anim-blink", blinkClass);
      if (outer) blinkGroup.appendChild(outer);
      if (white) blinkGroup.appendChild(white);
      blinkGroup.appendChild(gazeGroup);

      if (insertRef) parentEl.insertBefore(blinkGroup, insertRef);
      else parentEl.appendChild(blinkGroup);
    }

    buildEye("M438.956", "M441.515", "M441.126", "M455.658", "anim-blink-l", "0s");
    buildEye("M581.635", "M582.415", "M573.41",  "M588.685", "anim-blink-r", "0s");

    /* ── 3. Legs / shoes group (STATIC) ───────────────────────────────────
     *
     *  Shin paths  → indices 39–46 in the original paths[] array
     *  Shoe-cap ellipses → all <ellipse> elements in the SVG
     *  Shoe detail paths → indices 88–102
     *
     *  Collected BEFORE building bodyGroup so they are NOT included there.
     *  Rendered ON TOP of bodyGroup (appended last) → always visible.
     * ──────────────────────────────────────────────────────────────────── */
    const legsGroup = document.createElementNS(ns, "g"); // no animation class

    // Shin paths
    for (let i = 39; i <= 46; i++) {
      if (paths[i]) legsGroup.appendChild(paths[i]);
    }
    // White ellipse shoe-caps (cx≈616/407)
    Array.from(parentEl.querySelectorAll("ellipse")).forEach(el =>
      legsGroup.appendChild(el)
    );
    // Shoe detail paths
    for (let i = 88; i <= 102; i++) {
      if (paths[i]) legsGroup.appendChild(paths[i]);
    }

    /* ── 4. Body group (everything that sways) ────────────────────────────
     *  After steps 1–3 the only remaining children of parentEl are the
     *  upper-body elements (gold arm parts, shoulderGroup, body/hair/face
     *  paths, blink groups, mouth, and the hanging left-arm paths[103-105]).
     *  Move them ALL into bodyGroup.
     * ──────────────────────────────────────────────────────────────────── */
    const bodyGroup = g("anim-body");
    Array.from(parentEl.children).forEach(child => bodyGroup.appendChild(child));

    /* ── 5. Shadow + blur filter + final assembly ─────────────────────────
     *  DOM order in <svg>:
     *    shadow    (static ellipse on the ground)
     *    bodyGroup (upper body sways, pivot at waist ≈ y 728 = 71 %)
     *    legsGroup (shins + shoes, static, rendered ON TOP)
     * ──────────────────────────────────────────────────────────────────── */
    let defsEl = svg.querySelector("defs");
    if (!defsEl) {
      defsEl = document.createElementNS(ns, "defs");
      svg.insertBefore(defsEl, svg.firstChild);
    }
    const filter = document.createElementNS(ns, "filter");
    filter.setAttribute("id", "shadow-blur");
    filter.setAttribute("x", "-40%");
    filter.setAttribute("y", "-80%");
    filter.setAttribute("width", "180%");
    filter.setAttribute("height", "260%");
    const blur = document.createElementNS(ns, "feGaussianBlur");
    blur.setAttribute("in", "SourceGraphic");
    blur.setAttribute("stdDeviation", "14");
    filter.appendChild(blur);
    defsEl.appendChild(filter);

    const shadow = document.createElementNS(ns, "ellipse");
    shadow.setAttribute("cx",           "450");
    shadow.setAttribute("cy",           "960");
    shadow.setAttribute("rx",           "250");
    shadow.setAttribute("ry",           "24");
    shadow.setAttribute("fill",         "#0d2030");
    shadow.setAttribute("fill-opacity", "0.25");
    shadow.setAttribute("filter",       "url(#shadow-blur)");

    parentEl.appendChild(shadow);    // static
    parentEl.appendChild(bodyGroup); // sways
    parentEl.appendChild(legsGroup); // static, on top

    /* ── 6. Resize SVG ────────────────────────────────────────────────── */
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.style.width  = "100%";
    svg.style.height = "100%";

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(svg);
  }, []);

  return (
    <div className="size-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-teal-50">
      <style>{`

        /* ── 3-segment puppet arm ──────────────────────────────────────────
         *
         *  All three groups use transform-box: view-box so their origins
         *  reference the same 1024×1024 coordinate space.
         *
         *  Pivot points (SVG units → percentages):
         *    Shoulder ≈ (682, 488)  →  66.6 %, 47.7 %
         *    Elbow    ≈ (758, 443)  →  74.0 %, 43.3 %
         *    Wrist    ≈ (800, 408)  →  78.1 %, 39.8 %
         *
         *  Each joint has a slightly larger amplitude and a small time-lag
         *  relative to its parent, creating the ripple / puppet-wave look.
         * ──────────────────────────────────────────────────────────────── */

        /* — Shoulder (root rotation) — */
        @keyframes waveArmShoulder {
          0%   { transform: rotate(0deg);   }
          10%  { transform: rotate(-15deg); }
          22%  { transform: rotate(10deg);  }
          34%  { transform: rotate(-16deg); }
          46%  { transform: rotate(10deg);  }
          58%  { transform: rotate(-12deg); }
          70%  { transform: rotate(6deg);   }
          82%  { transform: rotate(-3deg);  }
          92%  { transform: rotate(1deg);   }
          100% { transform: rotate(0deg);   }
        }
        .anim-arm-shoulder {
          transform-box: view-box;
          transform-origin: 66.6% 47.7%;
          animation: waveArmShoulder 2.2s ease-in-out infinite;
        }

        /* — Elbow (added on top of shoulder, slight lag) — */
        @keyframes waveArmElbow {
          0%   { transform: rotate(0deg);   }
          14%  { transform: rotate(-10deg); }
          26%  { transform: rotate(14deg);  }
          38%  { transform: rotate(-10deg); }
          50%  { transform: rotate(14deg);  }
          62%  { transform: rotate(-8deg);  }
          74%  { transform: rotate(5deg);   }
          86%  { transform: rotate(-2deg);  }
          95%  { transform: rotate(0.5deg); }
          100% { transform: rotate(0deg);   }
        }
        .anim-arm-elbow {
          transform-box: view-box;
          transform-origin: 74.0% 43.3%;
          animation: waveArmElbow 2.2s ease-in-out infinite;
        }

        /* — Wrist (most exaggerated, most lag) — */
        @keyframes waveArmWrist {
          0%   { transform: rotate(0deg);   }
          18%  { transform: rotate(-12deg); }
          32%  { transform: rotate(18deg);  }
          44%  { transform: rotate(-12deg); }
          56%  { transform: rotate(18deg);  }
          67%  { transform: rotate(-10deg); }
          78%  { transform: rotate(7deg);   }
          89%  { transform: rotate(-3deg);  }
          97%  { transform: rotate(1deg);   }
          100% { transform: rotate(0deg);   }
        }
        .anim-arm-wrist {
          transform-box: view-box;
          transform-origin: 78.1% 39.8%;
          animation: waveArmWrist 2.2s ease-in-out infinite;
        }

        /* ── Body sway (pivot at shorts/shin junction ≈ y 728 = 71 %) ──── */
        @keyframes bodySway {
          0%,  100% { transform: rotate(0deg)    translateY(0px);  }
          25%       { transform: rotate(1deg)     translateY(-3px); }
          75%       { transform: rotate(-0.8deg)  translateY(-2px); }
        }
        .anim-body {
          transform-box: view-box;
          transform-origin: 50% 71%;
          animation: bodySway 3.2s ease-in-out infinite;
        }

        /* ── Eye blink ──────────────────────────────────────────────────── */
        @keyframes eyeBlink {
          0%, 88%, 100% { transform: scaleY(1);    }
          91%           { transform: scaleY(0.06); }
          94%           { transform: scaleY(1);    }
        }
        .anim-blink {
          transform-box: fill-box;
          transform-origin: center;
          animation: eyeBlink 5s ease-in-out infinite;
        }
        .anim-blink-r { animation-delay: 0.04s; }

        /* ── Eye gaze ───────────────────────────────────────────────────── */
        @keyframes eyeGaze {
          0%,  10%   { transform: translate(0px,    0px);  }
          20%,  42%  { transform: translate(3px,    1px);  }
          52%,  70%  { transform: translate(-2.5px, 1px);  }
          78%,  87%  { transform: translate(1px,    2.5px);}
          95%, 100%  { transform: translate(0px,    0px);  }
        }
        .anim-gaze {
          animation: eyeGaze 6s ease-in-out infinite;
        }

        /* ── Arm state machine (9 s full cycle) ─────────────────────────────
         *
         *  Timeline:
         *    0 %  –  61 % ( 0 s – 5.5 s ) → raised arm visible, waving
         *    61 % –  66 % ( 5.5 s – 5.9 s) → cross-fade to lowered
         *    66 % –  88 % ( 5.9 s – 7.9 s) → lowered arm visible, resting
         *    88 % –  93 % ( 7.9 s – 8.4 s) → cross-fade back to raised
         *    93 % – 100 % ( 8.4 s – 9 s  ) → raised arm visible (pre-wave)
         *
         *  The wave animations (.anim-arm-shoulder/elbow/wrist) run continuously
         *  at 2.2 s and are simply invisible during the lowered phase.
         * ──────────────────────────────────────────────────────────────────── */
        @keyframes raisedArmShow {
          0%,  61% { opacity: 1; }
          66%      { opacity: 0; }
          88%      { opacity: 0; }
          93%      { opacity: 1; }
          100%     { opacity: 1; }
        }
        .anim-raised-arm {
          animation:
            waveArmShoulder 2.2s ease-in-out infinite,
            raisedArmShow   9s  ease-in-out infinite;
        }

        @keyframes loweredArmShow {
          0%,  61% { opacity: 0; }
          66%      { opacity: 1; }
          88%      { opacity: 1; }
          93%      { opacity: 0; }
          100%     { opacity: 0; }
        }
        .anim-lowered-arm {
          animation: loweredArmShow 9s ease-in-out infinite;
        }
      `}</style>

      <div
        ref={containerRef}
        style={{ width: "420px", height: "420px" }}
      />

      <p
        style={{
          marginTop: "16px",
          color: "#0e7490",
          fontSize: "1.1rem",
          letterSpacing: "0.05em",
          opacity: 0.85,
        }}
      >
        👋 Привет!
      </p>
    </div>
  );
}