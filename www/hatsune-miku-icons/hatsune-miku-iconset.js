(function () {
  const ICON_DATA_URLS = [
    "/local/hatsune-miku-icons/all-material-icons/icons-data.js",
    "/www/hatsune-miku-icons/all-material-icons/icons-data.js",
  ];
  const AUTO_COLORIZE_RENDERED_SVG_ICONS = true;
  const GRID = 16;
  const CELL = 1.5;
  const ICON_TARGET_SIZE = 22.5;
  
  let iconDataPromise;
  let observer;
  let pollInterval;
  const colorCache = new Map();

  function loadIconData() {
    if (window.MIKU_MDI_ICONS) {
      return Promise.resolve(window.MIKU_MDI_ICONS);
    }

    if (!iconDataPromise) {
      iconDataPromise = new Promise((resolve, reject) => {
        let index = 0;

        function tryLoad() {
          const url = ICON_DATA_URLS[index];
          if (!url) {
            reject(new Error(`Unable to load icon data from ${ICON_DATA_URLS.join(", ")}`));
            return;
          }

          const script = document.createElement("script");
          script.src = url;
          script.async = true;
          script.onload = () => resolve(window.MIKU_MDI_ICONS || []);
          script.onerror = () => {
            script.remove();
            index += 1;
            tryLoad();
          };
          document.head.appendChild(script);
        }

        tryLoad();
      });
    }

    return iconDataPromise;
  }

  function squarePath(x, y, size) {
    return `M${x} ${y}h${size}v${size}h-${size}z`;
  }

  function quantizeIconCells(sourcePath) {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 24;
      canvas.height = 24;
      const ctx = canvas.getContext("2d");
      if (!ctx) return [];
      
      const source = new Path2D(sourcePath);
      const cells = [];

      for (let y = 0; y < GRID; y += 1) {
        for (let x = 0; x < GRID; x += 1) {
          const sourceX = ((x + 0.5) / GRID) * 24;
          const sourceY = ((y + 0.5) / GRID) * 24;
          if (ctx.isPointInPath(source, sourceX, sourceY)) {
            cells.push({ x, y });
          }
        }
      }

      if (!cells.length) return [];

      const minX = Math.min(...cells.map((cell) => cell.x));
      const maxX = Math.max(...cells.map((cell) => cell.x));
      const minY = Math.min(...cells.map((cell) => cell.y));
      const maxY = Math.max(...cells.map((cell) => cell.y));
      const width = maxX - minX + 1;
      const height = maxY - minY + 1;
      const offsetX = Math.round((GRID - width) / 2) - minX;
      const offsetY = Math.round((GRID - height) / 2) - minY;

      return cells.map((cell) => ({ x: cell.x + offsetX, y: cell.y + offsetY }));
    } catch (error) {
      console.warn("Error in quantizeIconCells:", error);
      return [];
    }
  }

  function drawMulticolorIcon(canvas, sourcePath) {
    const ctx = canvas.getContext("2d");
    const cells = quantizeIconCells(sourcePath);
    const cellSize = canvas.width / GRID;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    if (!cells.length) return;

    const occupied = new Set(cells.map((cell) => `${cell.x},${cell.y}`));
    const minX = Math.min(...cells.map((cell) => cell.x));
    const maxX = Math.max(...cells.map((cell) => cell.x));
    const minY = Math.min(...cells.map((cell) => cell.y));
    const width = maxX - minX + 1;

    ctx.fillStyle = "#111820";
    cells.forEach((cell) => {
      ctx.fillRect((cell.x + 1) * cellSize, (cell.y + 1) * cellSize, cellSize, cellSize);
    });

    cells.forEach((cell) => {
      const topEdge = !occupied.has(`${cell.x},${cell.y - 1}`);
      const leftEdge = !occupied.has(`${cell.x - 1},${cell.y}`);
      const lower = cell.y > GRID / 2 + 1;

      ctx.fillStyle = lower ? "#00b8aa" : "#00e5d4";
      if (topEdge || leftEdge) ctx.fillStyle = "#6ff7ee";
      if (topEdge && cell.y < GRID / 2) ctx.fillStyle = "#aafcff";
      ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
    });

    const accentY = Math.max(0, Math.min(GRID - 2, minY - 1));
    const accentLeft = Math.max(1, minX - 1);
    const accentRight = Math.min(GRID - 2, maxX + 1);

    ctx.fillStyle = "#f45bd3";
    ctx.fillRect(accentLeft * cellSize, accentY * cellSize, cellSize, cellSize);
    ctx.fillRect(accentRight * cellSize, accentY * cellSize, cellSize, cellSize);

    if (width > 4) {
      ctx.fillStyle = "#00e5d4";
      ctx.fillRect(Math.max(0, accentLeft - 1) * cellSize, (accentY + 1) * cellSize, cellSize, cellSize * 2);
      ctx.fillRect(Math.min(GRID - 1, accentRight + 1) * cellSize, (accentY + 1) * cellSize, cellSize, cellSize * 2);
    }
  }

  class MikuPixelIcon extends HTMLElement {
    static get observedAttributes() {
      return ["icon"];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
            height: 1em;
            line-height: 0;
            width: 1em;
          }

          canvas {
            display: block;
            height: 100%;
            image-rendering: pixelated;
            width: 100%;
          }
        </style>
        <canvas width="64" height="64" aria-hidden="true"></canvas>
      `;
      this.canvas = this.shadowRoot.querySelector("canvas");
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      this.render();
    }

    set icon(value) {
      if (value) {
        this.setAttribute("icon", value);
      } else {
        this.removeAttribute("icon");
      }
    }

    get icon() {
      return this.getAttribute("icon");
    }

    async render() {
      const iconName = (this.icon || "").replace(/^(mdi|miku):/, "");
      if (!iconName || !this.canvas) return;

      const icons = await loadIconData();
      const icon = icons.find((candidate) => candidate.name === iconName);
      if (!icon) return;

      drawMulticolorIcon(this.canvas, icon.path);
    }
  }

  if (!customElements.get("miku-pixel-icon")) {
    customElements.define("miku-pixel-icon", MikuPixelIcon);
  }

  function parsePixelSquares(pathData) {
    if (!pathData || typeof pathData !== "string") return [];
    
    const squares = [];
    const pattern = /M(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)h(\d+(?:\.\d+)?)v\3h-\3z/g;
    let match;

    while ((match = pattern.exec(pathData))) {
      const x = Number(match[1]);
      const y = Number(match[2]);
      const size = Number(match[3]);
      if (!isNaN(x) && !isNaN(y) && !isNaN(size) && size > 0) {
        squares.push({ x, y, size });
      }
    }

    return squares;
  }

  function makePath(squares, dx = 0, dy = 0) {
    return squares
      .map((square) => {
        const x = Number((square.x + dx).toFixed(2));
        const y = Number((square.y + dy).toFixed(2));
        return squarePath(x, y, square.size);
      })
      .join("");
  }

  // Pre-computed color palette
  const COLOR_PALETTE = {
    pink: { r: 244, g: 91, b: 211 },
    cyan: { r: 170, g: 252, b: 255 },
    dark: { r: 17, g: 24, b: 32 },
    base: { r: 0, g: 229, b: 212 },
  };

  function parseColor(color) {
    if (!color) return null;
    if (colorCache.has(color)) return colorCache.get(color);

    let result = null;
    const rgb = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (rgb) {
      result = {
        r: Number(rgb[1]),
        g: Number(rgb[2]),
        b: Number(rgb[3]),
      };
    } else {
      const hex = color.match(/^#([0-9a-f]{6})$/i);
      if (hex) {
        result = {
          r: Number.parseInt(hex[1].slice(0, 2), 16),
          g: Number.parseInt(hex[1].slice(2, 4), 16),
          b: Number.parseInt(hex[1].slice(4, 6), 16),
        };
      }
    }

    if (result) colorCache.set(color, result);
    return result;
  }

  function toRgb(color) {
    const r = Math.max(0, Math.min(255, Math.round(color.r)));
    const g = Math.max(0, Math.min(255, Math.round(color.g)));
    const b = Math.max(0, Math.min(255, Math.round(color.b)));
    return `rgb(${r}, ${g}, ${b})`;
  }

  function mix(color, other, amount) {
    return {
      r: color.r + (other.r - color.r) * amount,
      g: color.g + (other.g - color.g) * amount,
      b: color.b + (other.b - color.b) * amount,
    };
  }

  function pathToSquares(pathData) {
    try {
      const pixelSquares = parsePixelSquares(pathData);
      if (pixelSquares.length >= 4) return pixelSquares;

      const cells = quantizeIconCells(pathData);
      if (!cells.length) return [];

      return cells.map((cell) => ({
        x: Number((cell.x * CELL).toFixed(2)),
        y: Number((cell.y * CELL).toFixed(2)),
        size: CELL,
      }));
    } catch (error) {
      console.warn("Error in pathToSquares:", error);
      return [];
    }
  }

  function scaleSquaresToViewBox(squares, size) {
    const xs = squares.map((square) => square.x);
    const ys = squares.map((square) => square.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs) + size;
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys) + size;
    const width = maxX - minX;
    const height = maxY - minY;
    const target = ICON_TARGET_SIZE;
    const scale = Math.min(target / width, target / height);
    const offsetX = (24 - width * scale) / 2;
    const offsetY = (24 - height * scale) / 2;
    const scaledSize = Number((size * scale).toFixed(2));

    return squares.map((square) => ({
      x: Number((offsetX + (square.x - minX) * scale).toFixed(2)),
      y: Number((offsetY + (square.y - minY) * scale).toFixed(2)),
      size: scaledSize,
    }));
  }

  function colorizeRenderedSvgIcon(element) {
    if (element.localName !== "ha-svg-icon" || !element.shadowRoot) return;

    const existingGroup = element.shadowRoot.querySelector("g[data-miku-colorized='true']");
    const path = element.shadowRoot.querySelector("path:not([data-miku-layer]):not([data-miku-source='true'])");
    const svg = element.shadowRoot.querySelector("svg");
    
    if (!path || !svg) {
      // Handle color updates when path is missing but group exists
      if (existingGroup) {
        const lastColor = existingGroup.dataset.mikuColor || "";
        const nextColor = window.getComputedStyle(element).color;
        if (nextColor && nextColor !== lastColor) {
          existingGroup.remove();
          const source = element.shadowRoot.querySelector("path[data-miku-source='true']");
          if (source) source.removeAttribute("data-miku-colorized");
          colorizeRenderedSvgIcon(element);
        }
      }
      return;
    }

    const pathData = path.getAttribute("d") || "";
    const currentColor = window.getComputedStyle(element).color;
    
    // Skip if already colorized with same data
    if (
      existingGroup &&
      existingGroup.dataset.mikuSourcePath === pathData &&
      existingGroup.dataset.mikuColor === currentColor
    ) {
      return;
    }

    if (existingGroup) existingGroup.remove();

    const squares = pathToSquares(pathData);
    if (squares.length < 4) return;

    const sourceSize = squares[0].size || CELL;
    const scaledSquares = scaleSquaresToViewBox(squares, sourceSize);
    const size = scaledSquares[0].size || sourceSize;
    const keys = new Set(scaledSquares.map((square) => `${square.x},${square.y}`));
    const xs = scaledSquares.map((square) => square.x);
    const ys = scaledSquares.map((square) => square.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const width = maxX - minX + size;

    const highlight = [];
    const body = [];
    const lower = [];

    scaledSquares.forEach((square) => {
      const topEdge = !keys.has(`${square.x},${Number((square.y - size).toFixed(2))}`);
      const leftEdge = !keys.has(`${Number((square.x - size).toFixed(2))},${square.y}`);

      if (topEdge || leftEdge) {
        highlight.push(square);
      } else if (square.y > minY + (maxY - minY) * 0.58) {
        lower.push(square);
      } else {
        body.push(square);
      }
    });

    const accentY = Math.max(0, minY - size);
    const accentLeft = Math.max(0, minX - size);
    const accentRight = Math.min(24 - size, maxX + size);
    const accents = [
      { x: accentLeft, y: accentY, size },
      { x: accentRight, y: accentY, size },
    ];

    if (width > size * 4) {
      accents.push(
        { x: Math.max(0, accentLeft - size), y: accentY + size, size },
        { x: Math.min(24 - size, accentRight + size), y: accentY + size, size },
      );
    }

    // Compute colors once
    let baseColor = parseColor(currentColor) || COLOR_PALETTE.base;
    const luminance = baseColor.r * 0.2126 + baseColor.g * 0.7152 + baseColor.b * 0.0722;
    if (luminance < 42) {
      baseColor = COLOR_PALETTE.base;
    }

    const lowerColor = mix(baseColor, COLOR_PALETTE.dark, 0.22);
    const bodyColor = baseColor;
    const highlightColor = mix(baseColor, COLOR_PALETTE.cyan, 0.62);
    const accentColor = mix(baseColor, COLOR_PALETTE.pink, 0.72);

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.dataset.mikuColorized = "true";
    group.dataset.mikuSourcePath = pathData;
    group.dataset.mikuColor = currentColor;

    const layers = [
      { squares: scaledSquares, fill: toRgb(mix(baseColor, COLOR_PALETTE.dark, 0.72)), dx: size * 0.72, dy: size * 0.72 },
      { squares: lower, fill: toRgb(lowerColor) },
      { squares: body, fill: toRgb(bodyColor) },
      { squares: highlight, fill: toRgb(highlightColor) },
      { squares: accents, fill: toRgb(accentColor) },
    ];

    layers.forEach((layer) => {
      if (!layer.squares.length) return;

      const layerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      layerPath.setAttribute("d", makePath(layer.squares, layer.dx || 0, layer.dy || 0));
      layerPath.setAttribute("fill", layer.fill);
      layerPath.dataset.mikuLayer = "true";
      group.appendChild(layerPath);
    });

    path.dataset.mikuSource = "true";
    path.dataset.mikuColorized = "true";
    path.setAttribute("visibility", "hidden");
    path.after(group);
  }

  function replaceIcons(root, processRecursive = true) {
    if (!root || !root.querySelectorAll) return;

    // Only process ha-svg-icon elements
    root.querySelectorAll("ha-svg-icon").forEach((element) => {
      const existingGroup = element.shadowRoot?.querySelector("g[data-miku-colorized='true']");
      
      // Only re-render if no colorized group exists or if icon attribute changed
      if (!existingGroup) {
        colorizeRenderedSvgIcon(element);
      }
    });
    
    // Only recurse through shadow roots if explicitly requested (from mutation observer)
    if (processRecursive) {
      root.querySelectorAll("*").forEach((element) => {
        if (element.shadowRoot) {
          replaceIcons(element.shadowRoot, true);
        }
      });
    }
  }

  function watchIcons() {
    const originalAttachShadow = Element.prototype.attachShadow;
    let attachShadowPatched = false;

    const patchAttachShadow = function (init) {
      const shadowRoot = originalAttachShadow.call(this, init);
      observeRoot(shadowRoot);
      queueMicrotask(() => replaceIcons(shadowRoot));
      return shadowRoot;
    };

    Element.prototype.attachShadow = patchAttachShadow;
    attachShadowPatched = true;

    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "icon") {
          if (mutation.target instanceof Element && mutation.target.localName === "ha-svg-icon") {
            // Remove existing colorized group to force re-render on icon change
            const existingGroup = mutation.target.shadowRoot?.querySelector("g[data-miku-colorized='true']");
            if (existingGroup) existingGroup.remove();
            colorizeRenderedSvgIcon(mutation.target);
          }
        }

        // Process newly added nodes
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.localName === "ha-svg-icon") {
            colorizeRenderedSvgIcon(node);
          }
          // Check children for ha-svg-icon elements
          if (node.querySelectorAll) {
            node.querySelectorAll("ha-svg-icon").forEach(colorizeRenderedSvgIcon);
          }
          if (node.shadowRoot) {
            node.shadowRoot.querySelectorAll("ha-svg-icon").forEach(colorizeRenderedSvgIcon);
          }
        });
      });
    });

    function observeRoot(root) {
      observer.observe(root, {
        attributeFilter: ["icon", "class", "style"],
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    observeRoot(document.documentElement);
    replaceIcons(document, true);
    
    // Minimal polling - only for orphaned icons that appear without mutations
    pollInterval = window.setInterval(() => {
      document.querySelectorAll("ha-svg-icon").forEach((element) => {
        const existingGroup = element.shadowRoot?.querySelector("g[data-miku-colorized='true']");
        if (!existingGroup) {
          colorizeRenderedSvgIcon(element);
        }
      });
    }, 30000);
    
    // Add cleanup function to window for manual cleanup if needed
    window.stopMikuIconizer = () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
      if (attachShadowPatched) {
        Element.prototype.attachShadow = originalAttachShadow;
        attachShadowPatched = false;
      }
    };
  }

  if (AUTO_COLORIZE_RENDERED_SVG_ICONS) {
    try {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", watchIcons, { once: true });
      } else {
        watchIcons();
      }
    } catch (error) {
      console.error("Failed to initialize Miku iconizer:", error);
    }
  }
})();
