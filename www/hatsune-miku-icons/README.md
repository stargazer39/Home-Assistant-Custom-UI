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

The iconset registers the `miku:` prefix, so you can use it anywhere Home Assistant accepts an icon:

```yaml
icon: miku:home
icon: miku:lightbulb
icon: miku:battery
icon: miku:fan
```

The icon names mirror Material Design Icons names without the `mdi:` prefix.

The script also auto-replaces `mdi:` icons with matching `miku:` icons at runtime so the Home Assistant sidebar and built-in shell icons pick up the pixel style.

Note: Home Assistant's built-in `ha-icon` renderer paints iconsets as a single `currentColor` path. The `miku:` iconset can provide the pixel shape, but true multicolor cyan/magenta pixels are only possible in custom cards or HTML previews that render their own SVG/canvas. The theme sets normal icons to Miku cyan and active icons to Miku pink.

## Preview

Open `/local/hatsune-miku-icons/all-material-icons/preview.html` in Home Assistant to browse the full icon catalog.
