(function () {
  const ICONSET_NAME = "miku";
  const ICON_DATA_URLS = [
    "/local/hatsune-miku-icons/all-material-icons/icons-data.js",
    "/www/hatsune-miku-icons/all-material-icons/icons-data.js",
  ];
  const AUTO_REPLACE_MDI = true;
  const AUTO_REPLACE_HA_ICON_RENDERER = true;
  const GRID = 16;
  const CELL = 1.5;
  const OFFSET = 0;
  const ICON_TARGET_SIZE = 22.5;
  const cache = new Map();

  let iconDataPromise;

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
    const canvas = document.createElement("canvas");
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext("2d");
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
  }

  function toPixelPath(sourcePath) {
    const cells = quantizeIconCells(sourcePath);

    if (!cells.length) return sourcePath;

    const rawSquares = cells.map((cell) => ({
      x: Number((cell.x * CELL).toFixed(2)),
      y: Number((cell.y * CELL).toFixed(2)),
      size: CELL,
    }));

    return scaleSquaresToViewBox(rawSquares, CELL)
      .map((cell) => {
        const x = OFFSET + cell.x;
        const y = OFFSET + cell.y;
        return squarePath(Number(x.toFixed(2)), Number(y.toFixed(2)), cell.size);
      })
      .join("");
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

  async function getIcon(name) {
    if (cache.has(name)) return cache.get(name);

    const icons = await loadIconData();
    const icon = icons.find((candidate) => candidate.name === name);
    if (!icon) return undefined;

    const result = {
      path: toPixelPath(icon.path),
      viewBox: "0 0 24 24",
    };

    cache.set(name, result);
    return result;
  }

  window.customIconsets = window.customIconsets || {};
  window.customIconsets[ICONSET_NAME] = getIcon;

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

  function toMikuIcon(value) {
    return typeof value === "string" && value.startsWith("mdi:") ? `${ICONSET_NAME}:${value.slice(4)}` : value;
  }

  function isReplaceableIcon(value) {
    return typeof value === "string" && (value.startsWith("mdi:") || value.startsWith(`${ICONSET_NAME}:`));
  }

  function replaceHaIconRenderer(element) {
    if (!AUTO_REPLACE_HA_ICON_RENDERER || element.localName !== "ha-icon" || element.dataset.mikuReplaced === "true") {
      return;
    }

    const icon = toMikuIcon(element.icon || element.getAttribute("icon"));
    if (!isReplaceableIcon(icon) || !element.parentNode) return;

    const replacement = document.createElement("miku-pixel-icon");
    const computed = window.getComputedStyle(element);
    const width = computed.width && computed.width !== "auto" ? computed.width : "";
    const height = computed.height && computed.height !== "auto" ? computed.height : "";

    Array.from(element.attributes).forEach((attribute) => {
      if (attribute.name !== "icon") {
        replacement.setAttribute(attribute.name, attribute.value);
      }
    });

    replacement.setAttribute("icon", icon);
    replacement.dataset.mikuInjected = "true";

    if (width && width !== "0px") replacement.style.width = width;
    if (height && height !== "0px") replacement.style.height = height;
    if (computed.margin && computed.margin !== "0px") replacement.style.margin = computed.margin;
    replacement.style.flex = computed.flex;
    replacement.style.alignSelf = computed.alignSelf;

    element.dataset.mikuReplaced = "true";
    element.replaceWith(replacement);
  }

  function parsePixelSquares(pathData) {
    const squares = [];
    const pattern = /M(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)h(\d+(?:\.\d+)?)v\3h-\3z/g;
    let match;

    while ((match = pattern.exec(pathData))) {
      squares.push({
        x: Number(match[1]),
        y: Number(match[2]),
        size: Number(match[3]),
      });
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

  function parseColor(color) {
    if (!color) return null;

    const rgb = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (rgb) {
      return {
        r: Number(rgb[1]),
        g: Number(rgb[2]),
        b: Number(rgb[3]),
      };
    }

    const hex = color.match(/^#([0-9a-f]{6})$/i);
    if (hex) {
      return {
        r: Number.parseInt(hex[1].slice(0, 2), 16),
        g: Number.parseInt(hex[1].slice(2, 4), 16),
        b: Number.parseInt(hex[1].slice(4, 6), 16),
      };
    }

    return null;
  }

  function toRgb(color) {
    return `rgb(${Math.max(0, Math.min(255, Math.round(color.r)))}, ${Math.max(0, Math.min(255, Math.round(color.g)))}, ${Math.max(0, Math.min(255, Math.round(color.b)))})`;
  }

  function mix(color, other, amount) {
    return {
      r: color.r + (other.r - color.r) * amount,
      g: color.g + (other.g - color.g) * amount,
      b: color.b + (other.b - color.b) * amount,
    };
  }

  function pathToSquares(pathData) {
    const pixelSquares = parsePixelSquares(pathData);
    if (pixelSquares.length >= 4) return pixelSquares;

    const cells = quantizeIconCells(pathData);
    if (!cells.length) return [];

    return cells.map((cell) => ({
      x: Number((cell.x * CELL).toFixed(2)),
      y: Number((cell.y * CELL).toFixed(2)),
      size: CELL,
    }));
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

    const path = element.shadowRoot.querySelector("path.primary-path:not([data-miku-colorized]), path:not([data-miku-colorized])");
    const svg = element.shadowRoot.querySelector("svg");
    if (!path || !svg) return;

    const squares = pathToSquares(path.getAttribute("d") || "");
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

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    let base = parseColor(window.getComputedStyle(element).color) || { r: 0, g: 229, b: 212 };
    const luminance = base.r * 0.2126 + base.g * 0.7152 + base.b * 0.0722;
    if (luminance < 42) {
      base = { r: 0, g: 229, b: 212 };
    }
    const pink = { r: 244, g: 91, b: 211 };
    const cyan = { r: 170, g: 252, b: 255 };
    const dark = { r: 17, g: 24, b: 32 };
    const lowerColor = mix(base, dark, 0.22);
    const bodyColor = base;
    const highlightColor = mix(base, cyan, 0.62);
    const accentColor = mix(base, pink, 0.72);
    const layers = [
      { squares: scaledSquares, fill: toRgb(mix(base, dark, 0.72)), dx: size * 0.72, dy: size * 0.72 },
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
      group.appendChild(layerPath);
    });

    path.dataset.mikuColorized = "true";
    path.replaceWith(group);
  }

  function replaceIconElement(element) {
    if (element.localName !== "ha-icon") return;

    const icon = element.icon || element.getAttribute("icon");
    const mikuIcon = toMikuIcon(icon);
    if (mikuIcon !== icon) {
      element.setAttribute("icon", mikuIcon);
      element.icon = mikuIcon;
    }

    replaceHaIconRenderer(element);
  }

  function replaceIcons(root) {
    if (!root || !root.querySelectorAll) return;

    root.querySelectorAll("ha-svg-icon").forEach(colorizeRenderedSvgIcon);
    root.querySelectorAll("ha-icon[icon^='mdi:'], ha-icon[icon^='miku:']").forEach(replaceIconElement);
    root.querySelectorAll("*").forEach((element) => {
      if (element.shadowRoot) {
        replaceIcons(element.shadowRoot);
      }
    });
  }

  function watchIcons() {
    const originalSetAttribute = Element.prototype.setAttribute;
    const originalAttachShadow = Element.prototype.attachShadow;

    Element.prototype.setAttribute = function patchedSetAttribute(name, value) {
      const nextValue = this.localName === "ha-icon" && name === "icon" ? toMikuIcon(value) : value;
      const result = originalSetAttribute.call(this, name, nextValue);
      if (this.localName === "ha-icon" && name === "icon") {
        queueMicrotask(() => replaceIconElement(this));
      }
      return result;
    };

    Element.prototype.attachShadow = function patchedAttachShadow(init) {
      const shadowRoot = originalAttachShadow.call(this, init);
      observeRoot(shadowRoot);
      queueMicrotask(() => replaceIcons(shadowRoot));
      return shadowRoot;
    };

    customElements.whenDefined("ha-icon").then(() => {
      const proto = customElements.get("ha-icon").prototype;
      const descriptor = Object.getOwnPropertyDescriptor(proto, "icon");

      if (descriptor?.set && !proto.__mikuIconPatched) {
        Object.defineProperty(proto, "icon", {
          configurable: true,
          enumerable: descriptor.enumerable,
          get: descriptor.get,
          set(value) {
            descriptor.set.call(this, toMikuIcon(value));
            queueMicrotask(() => replaceIconElement(this));
          },
        });
        proto.__mikuIconPatched = true;
      }

      replaceIcons(document);
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.target instanceof Element) {
          replaceIconElement(mutation.target);
          colorizeRenderedSvgIcon(mutation.target);
          if (mutation.target.shadowRoot) replaceIcons(mutation.target.shadowRoot);
        }

        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          replaceIconElement(node);
          colorizeRenderedSvgIcon(node);
          replaceIcons(node);
          if (node.shadowRoot) replaceIcons(node.shadowRoot);
        });
      });
    });

    function observeRoot(root) {
      observer.observe(root, {
        attributeFilter: ["icon", "d", "class", "style"],
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    observeRoot(document.documentElement);
    replaceIcons(document);
    window.setInterval(() => replaceIcons(document), 1500);
  }

  if (AUTO_REPLACE_MDI) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", watchIcons, { once: true });
    } else {
      watchIcons();
    }
  }
})();
