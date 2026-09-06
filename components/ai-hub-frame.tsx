"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Embeds the standalone AI Maths & Science Hub page.
 *
 * It is loaded in a sandboxed iframe rather than inlined into the site, because
 * the hub's coding playground runs whatever JavaScript a student types. A
 * sandbox without `allow-same-origin` puts that code on its own opaque origin,
 * where it cannot read this site's cookies, storage or DOM — a student
 * experimenting (or pasting something they found) can only affect their own
 * frame.
 *
 * The frame reports its own height back by postMessage so the page grows to fit
 * it, instead of trapping students in a scrollbar inside a scrollbar.
 */
export default function AiHubFrame({ src, title }: { src: string; title: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  // First-paint height, before the frame reports its own. Measured: the hub's
  // four tabs run 843-1169px at desktop width, so starting near the top of
  // that range means the page barely shifts once the real height arrives.
  const [height, setHeight] = useState(1200);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      /*
        The frame has an opaque origin, so `event.origin` is the string "null"
        and proves nothing. Identify the sender by its window handle instead,
        then check the message shape — anything else on the bus is ignored.
      */
      const frame = frameRef.current;
      if (!frame || event.source !== frame.contentWindow) return;

      const data = event.data as { type?: unknown; height?: unknown } | null;
      if (!data || data.type !== "ai-hub-height") return;

      const next = Number(data.height);
      // Bounds-checked: a broken or hostile frame must not be able to stretch
      // the page to an absurd size.
      if (Number.isFinite(next) && next > 400 && next < 20000) {
        setHeight(Math.ceil(next));
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={frameRef}
      src={src}
      title={title}
      sandbox="allow-scripts"
      style={{ height }}
      className="w-full rounded-lg border border-mist-200 bg-mist-100"
    />
  );
}
