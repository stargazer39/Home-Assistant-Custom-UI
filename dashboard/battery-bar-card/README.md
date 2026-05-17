# Battery Bar Card

A lightweight Home Assistant Lovelace custom card that displays a battery sensor as a full-width themed battery bar.

## Install

1. Copy the `dashboard` folder into your Home Assistant `www` folder.
2. Add it as a dashboard resource:

```yaml
url: /local/dashboard/battery-bar-card/battery-bar-card.js
type: module
```

3. Add the card to a dashboard:

```yaml
type: custom:battery-bar-card
entity: sensor.phone_battery_level
name: Phone
charging_entity: binary_sensor.phone_is_charging
```

## Options

| Option | Required | Default | Description |
| --- | --- | --- | --- |
| `entity` | Yes |  | Battery level sensor. |
| `name` | No | `Battery` | Card title. |
| `icon` | No | `mdi:battery` | Header icon. |
| `show_icon` | No | `true` | Show the icon inside the bar. |
| `show_percentage` | No | `true` | Show percentage text inside the bar. |
| `height` | No | `54` | Bar height in pixels. |
| `low` | No | `20` | Low battery threshold. |
| `warn` | No | `50` | Warning threshold. |
| `full` | No | `90` | Full threshold. |
| `charging` | No | `false` | Force charging state. |
| `charging_entity` | No |  | Entity used to detect charging. |

The card uses standard Home Assistant theme variables so it follows the current dashboard look, including card background, border radius, text color, primary color, success, warning, and error colors.
