# Hatsune Miku Pixel Icons

This folder contains a Hatsune Miku-inspired pixel icon set for Home Assistant.

## Home Assistant setup

Add this JavaScript file globally through `configuration.yaml`.
This is required for Home Assistant shell areas such as the sidebar.

```yaml
frontend:
  extra_module_url:
    - /local/hatsune-miku-icons/hatsune-miku-iconset.js
```

Restart Home Assistant after changing `configuration.yaml`, then hard-refresh the browser or clear the frontend cache.

The iconset registers a multicolor renderer for custom cards and a frontend patch for Home Assistant's rendered SVG icons.
For ordinary Home Assistant cards, keep using normal `mdi:` icon names and let Home Assistant render them first:

```yaml
icon: mdi:home
icon: mdi:lightbulb
icon: mdi:battery
icon: mdi:fan
```

The frontend script then pixelizes and colorizes the rendered SVG path at runtime. This avoids size mismatches between predefined `miku:` icons and realtime-converted icons.

The script also auto-replaces `mdi:` icons with matching `miku:` icons at runtime so the Home Assistant sidebar and built-in shell icons pick up the pixel style.

Note: Home Assistant's built-in `ha-icon` renderer paints iconsets as a single `currentColor` path. The `miku:` iconset can provide the pixel shape, but true multicolor cyan/magenta pixels require a custom renderer.

This package registers `<miku-pixel-icon>` for custom cards:

```html
<miku-pixel-icon icon="miku:home"></miku-pixel-icon>
```

The bundled dashboard cards use this element so they can show multicolor pixel icons.

The script intentionally reaches into Home Assistant's rendered frontend DOM and replaces SVG paths with layered pixel-color paths. Some closed or heavily re-rendered Home Assistant internals may still fall back to normal icons.

## Preview

Open `/local/hatsune-miku-icons/all-material-icons/preview.html` in Home Assistant to browse the full icon catalog.
