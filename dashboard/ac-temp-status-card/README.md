# A/C Temp Status Card

A lightweight Home Assistant Lovelace custom card that shows an A/C temperature number entity and changes the card background when the A/C is running.

By default, the card treats the A/C as on when `sensor.energy_monitor_load_power` is greater than `10`.

## Install

1. Copy the `dashboard` folder into your Home Assistant `www` folder.
2. Add it as a dashboard resource:

```yaml
url: /local/dashboard/ac-temp-status-card/ac-temp-status-card.js
type: module
```

3. Add the card to a dashboard:

```yaml
type: custom:ac-temp-status-card
entity: number.bedroom_controls_a_c_temp
power_entity: sensor.energy_monitor_load_power
name: A/C Temp
grid_options:
  columns: full
```

## Options

| Option | Required | Default | Description |
| --- | --- | --- | --- |
| `entity` | Yes |  | Temperature number entity. |
| `power_entity` | No | `sensor.energy_monitor_load_power` | Power sensor used to detect whether the A/C is running. |
| `name` | No | `A/C Temp` | Card title. |
| `icon` | No | `mdi:thermometer` | Icon shown on the right. |
| `show_status` | No | `false` | Show `A/C is On` or `A/C is Off` inside the card. |
| `power_threshold` | No | `10` | A/C is on when `power_entity` is greater than this value. |
| `on_label` | No | `A/C is On` | Status text shown when on. |
| `off_label` | No | `A/C is Off` | Status text shown when off. |

The card uses Home Assistant theme variables. When the A/C is off it keeps the normal card background, and when it is on it blends the background with the theme success color.
