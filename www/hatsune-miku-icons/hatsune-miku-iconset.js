(function () {
  const ICONSET_NAME = "miku";
  const ICON_DATA_URLS = [
    "/local/hatsune-miku-icons/all-material-icons/icons-data.js",
    "/www/hatsune-miku-icons/all-material-icons/icons-data.js",
  ];
  const AUTO_REPLACE_MDI = true;
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

    if (!cells.length) return sourcePath;

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

  function replaceIconElement(element) {
    if (element.localName !== "ha-icon") return;

    const icon = element.icon || element.getAttribute("icon");
    const mikuIcon = toMikuIcon(icon);
    if (mikuIcon !== icon) {
      element.setAttribute("icon", mikuIcon);
      element.icon = mikuIcon;
    }
  }

  function replaceIcons(root) {
    if (!root || !root.querySelectorAll) return;

    root.querySelectorAll("ha-icon[icon^='mdi:']").forEach(replaceIconElement);
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
      return originalSetAttribute.call(this, name, nextValue);
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
