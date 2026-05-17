# Samsung Smart Remote Card

A Home Assistant Lovelace custom card for Samsung Smart TV remotes. It is shaped like a physical smart remote for everyday use, with a colored expandable drawer that exposes the Samsung key-code catalog used by the Samsung TV integrations.

The card sends commands with Home Assistant's `remote.send_command` service. It is intended for Samsung OLED S90F / modern Tizen TVs, but Samsung support can vary by model, firmware, country, source, and whether the TV accepts a key over WebSocket at that moment.

## Install

1. Copy the `samsung-smart-remote-card` folder into your Home Assistant `www` folder.
2. Add it as a dashboard resource:

```yaml
url: /local/samsung-smart-remote-card/samsung-smart-remote-card.js
type: module
```

3. Add the card to a dashboard:

```yaml
type: custom:samsung-smart-remote-card
entity: remote.samsung_tv
name: Living Room S90F
grid_options:
  columns: full
```

## Options

| Option | Required | Default | Description |
| --- | --- | --- | --- |
| `entity` | Yes |  | Samsung TV `remote` entity. `remote_entity` is also accepted as an alias. |
| `name` | No | `Samsung S90F` | Header name. |
| `show_header` | No | `true` | Show the card title and remote state. |
| `show_service_buttons` | No | `true` | Show service keys such as `KEY_FACTORY`, `KEY_3SPEED`, and service-menu sequences. |
| `show_all_keys` | No | `true` | Show the expandable all-key drawer. |
| `service_delay` | No | `0.45` | Delay in seconds between keys for service-menu command sequences. |

## Notes

The factory and service-menu buttons are intentionally red and separated from the everyday controls. They can open service menus or change TV behavior, depending on firmware and model support.

The all-key drawer includes the Samsung key codes listed in the Home Assistant Samsung TV / SamsungTV Smart key-code references, grouped by function: power, inputs, numbers, channel, volume, navigation, media, color keys, menus, OSD, picture, PIP, modes, teletext, other keys, Auto Arc, panel, extended, and service keys.

The SmartThings group includes the `ST_TV`, `ST_HDMI1`-`ST_HDMI4`, channel, mute, volume, and direct channel/volume preset commands described by the SamsungTV Smart docs. Those commands require SmartThings support in the backing integration.

For modern Samsung TVs, `KEY_POWER` is often the practical power toggle. `KEY_POWERON` and `KEY_POWEROFF` are included because they are part of the published key list, but support can vary.
