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

    return cells
      .map((cell) => {
        const x = OFFSET + cell.x * CELL;
        const y = OFFSET + cell.y * CELL;
        return squarePath(Number(x.toFixed(2)), Number(y.toFixed(2)), CELL);
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

  function colorizeRenderedSvgIcon(element) {
    if (element.localName !== "ha-svg-icon" || !element.shadowRoot) return;

    const path = element.shadowRoot.querySelector("path.primary-path:not([data-miku-colorized])");
    const svg = element.shadowRoot.querySelector("svg");
    if (!path || !svg) return;

    const squares = parsePixelSquares(path.getAttribute("d") || "");
    if (squares.length < 4) return;

    const size = squares[0].size || CELL;
    const keys = new Set(squares.map((square) => `${square.x},${square.y}`));
    const xs = squares.map((square) => square.x);
    const ys = squares.map((square) => square.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const width = maxX - minX + size;

    const highlight = [];
    const body = [];
    const lower = [];

    squares.forEach((square) => {
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
    const layers = [
      { squares, fill: "#111820", dx: size, dy: size },
      { squares: lower, fill: "#00b8aa" },
      { squares: body, fill: "#00e5d4" },
      { squares: highlight, fill: "#aafcff" },
      { squares: accents, fill: "#f45bd3" },
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
      observer.observe(root, { childList: true, subtree: true });
    }

    observeRoot(document.documentElement);
    replaceIcons(document);
  }

  if (AUTO_REPLACE_MDI) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", watchIcons, { once: true });
    } else {
      watchIcons();
    }
  }
})();
