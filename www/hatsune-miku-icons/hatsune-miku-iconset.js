(function () {
  const ICONSET_NAME = "miku";
  const ICON_DATA_URL = "/local/hatsune-miku-icons/all-material-icons/icons-data.js";
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
        const script = document.createElement("script");
        script.src = ICON_DATA_URL;
        script.async = true;
        script.onload = () => resolve(window.MIKU_MDI_ICONS || []);
        script.onerror = () => reject(new Error(`Unable to load ${ICON_DATA_URL}`));
        document.head.appendChild(script);
      });
    }

    return iconDataPromise;
  }

  function squarePath(x, y, size) {
    return `M${x} ${y}h${size}v${size}h-${size}z`;
  }

  function toPixelPath(sourcePath) {
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

    return cells
      .map((cell) => {
        const x = OFFSET + (cell.x + offsetX) * CELL;
        const y = OFFSET + (cell.y + offsetY) * CELL;
        return squarePath(Number(x.toFixed(2)), Number(y.toFixed(2)), CELL);
      })
      .join("");
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
