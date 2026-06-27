// Override prefers-reduced-motion so Motion animations always run in this
// preview environment, regardless of OS accessibility settings.
if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
  const _matchMedia = window.matchMedia.bind(window);
  window.matchMedia = (query: string): MediaQueryList => {
    if (query.includes("prefers-reduced-motion")) {
      return {
        matches: query.includes("no-preference"),
        media: query,
        onchange: null,
        addListener() {},
        removeListener() {},
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent: () => false,
      } as unknown as MediaQueryList;
    }
    return _matchMedia(query);
  };
}
