import "./Titlebar.css";

export default function Titlebar() {
  const debounce = (func: any, wait: any) => {
    let timeout: any;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  if ("windowControlsOverlay" in navigator) {
    (navigator as any).windowControlsOverlay.addEventListener(
      "geometrychange",
      debounce((e: any) => {
        // Detect if the Window Controls Overlay is visible.
        const isOverlayVisible = (navigator as any).windowControlsOverlay
          .visible;

        // Get the size and position of the title bar area.
        const titleBarRect = e.titlebarAreaRect;

        console.log(
          `The overlay is ${
            isOverlayVisible ? "visible" : "hidden"
          }, the title bar width is ${titleBarRect.width}px`
        );
      }, 200)
    );
  }
  return (
    <div class="titlebar">
    </div>
  );
}
