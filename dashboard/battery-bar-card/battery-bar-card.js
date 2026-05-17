class BatteryBarCard extends HTMLElement {
  static getStubConfig() {
    return {
      entity: "sensor.phone_battery_level",
      name: "Battery",
    };
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Please define an entity");
    }

    this.config = {
      name: "Battery",
      icon: "mdi:battery",
      show_icon: true,
      show_percentage: true,
      height: 54,
      low: 20,
      warn: 50,
      full: 90,
      ...config,
    };

    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }

    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  getCardSize() {
    return 2;
  }

  render() {
    if (!this.shadowRoot || !this.config || !this._hass) {
      return;
    }

    const stateObj = this._hass.states[this.config.entity];
    if (!stateObj) {
      this.shadowRoot.innerHTML = this.renderError(`Entity not found: ${this.config.entity}`);
      return;
    }

    const rawLevel = Number.parseFloat(stateObj.state);
    const level = Number.isFinite(rawLevel) ? Math.max(0, Math.min(100, rawLevel)) : 0;
    const isCharging = this.getChargingState();
    const colorClass = this.getLevelClass(level, isCharging);
    const name = this.config.name || stateObj.attributes.friendly_name || this.config.entity;
    const unit = stateObj.attributes.unit_of_measurement || "%";
    const stateText = Number.isFinite(rawLevel) ? `${Math.round(level)}${unit}` : stateObj.state;
    const icon = isCharging ? "mdi:battery-charging" : this.config.icon;
    const levelLabel = Number.isFinite(rawLevel) ? `${Math.round(level)} percent` : stateObj.state;

    this.shadowRoot.innerHTML = `
      ${this.renderStyles()}
      <ha-card>
        <button class="card-shell" aria-label="${this.escape(name)} battery ${this.escape(levelLabel)}">
          <div class="battery-row">
            <div class="track" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${level}">
              <div class="fill ${colorClass}" style="width: ${level}%;"></div>
              <div class="bar-content">
                <div class="title">
                  ${this.config.show_icon ? `<miku-pixel-icon icon="${this.escape(icon)}"></miku-pixel-icon>` : ""}
                  <span>${this.escape(name)}</span>
                </div>
                ${this.config.show_percentage ? `<span class="state">${this.escape(stateText)}</span>` : ""}
              </div>
            </div>
            <div class="cap"></div>
          </div>
          ${isCharging ? `<div class="subtle">Charging</div>` : ""}
        </button>
      </ha-card>
    `;

    this.shadowRoot.querySelector(".card-shell").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          bubbles: true,
          composed: true,
          detail: { entityId: this.config.entity },
        }),
      );
    });
  }

  getChargingState() {
    if (typeof this.config.charging === "boolean") {
      return this.config.charging;
    }

    const chargingEntity = this.config.charging_entity;
    if (!chargingEntity || !this._hass.states[chargingEntity]) {
      return false;
    }

    const chargingState = String(this._hass.states[chargingEntity].state).toLowerCase();
    return ["on", "charging", "true", "home", "plugged in"].includes(chargingState);
  }

  getLevelClass(level, isCharging) {
    if (isCharging) {
      return "charging";
    }

    if (level <= this.config.low) {
      return "low";
    }

    if (level <= this.config.warn) {
      return "warn";
    }

    if (level >= this.config.full) {
      return "full";
    }

    return "ok";
  }

  renderError(message) {
    return `
      ${this.renderStyles()}
      <ha-card>
        <div class="error">${this.escape(message)}</div>
      </ha-card>
    `;
  }

  renderStyles() {
    const height = Number(this.config?.height) || 14;

    return `
      <style>
        :host {
          display: block;
        }

        ha-card {
          background: var(--ha-card-background, var(--card-background-color, #fff));
          border-radius: var(--ha-card-border-radius, 12px);
          border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
          box-shadow: var(--ha-card-box-shadow, none);
          overflow: hidden;
        }

        .card-shell {
          appearance: none;
          background: transparent;
          border: 0;
          color: var(--primary-text-color);
          cursor: pointer;
          display: block;
          font: inherit;
          padding: 0;
          text-align: left;
          width: 100%;
        }

        .card-shell:focus-visible {
          outline: 2px solid var(--primary-color);
          outline-offset: -4px;
        }

        .battery-row {
          align-items: center;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 5px;
          gap: 4px;
        }

        .track {
          background: var(--divider-color, #e0e0e0);
          background: color-mix(in srgb, var(--secondary-text-color) 14%, transparent);
          border-radius: var(--ha-card-border-radius, 12px);
          height: ${height}px;
          overflow: hidden;
          position: relative;
        }

        .fill {
          border-radius: 0;
          height: 100%;
          min-width: ${height > 8 ? 5 : 2}px;
          transition: width 180ms ease, background-color 180ms ease;
        }

        .fill.low {
          background: var(--error-color, #db4437);
        }

        .fill.warn {
          background: var(--warning-color, #ffa600);
        }

        .fill.ok {
          background: var(--success-color, #43a047);
        }

        .fill.full,
        .fill.charging {
          background: var(--primary-color);
        }

        .bar-content {
          align-items: center;
          background: color-mix(in srgb, #000 30%, transparent);
          color: var(--primary-text-color);
          display: flex;
          gap: 14px;
          inset: 0;
          justify-content: space-between;
          padding: 0 16px;
          pointer-events: none;
          position: absolute;
          text-shadow: 0 1px 2px color-mix(in srgb, var(--ha-card-background, #000) 38%, transparent);
        }

        .title {
          align-items: center;
          display: flex;
          font-size: 16px;
          font-weight: 600;
          gap: 10px;
          min-width: 0;
        }

        .title span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        miku-pixel-icon {
          color: currentColor;
          flex: 0 0 auto;
          height: 22px;
          width: 22px;
        }

        .state {
          color: currentColor;
          flex: 0 0 auto;
          font-size: 16px;
          font-weight: 700;
        }

        .cap {
          background: var(--divider-color, #e0e0e0);
          background: color-mix(in srgb, var(--secondary-text-color) 28%, transparent);
          border-radius: 0 3px 3px 0;
          height: ${Math.max(18, Math.round(height * 0.46))}px;
        }

        .subtle {
          color: var(--secondary-text-color);
          font-size: 12px;
          margin: 8px 16px 12px;
        }

        .error {
          color: var(--error-color, #db4437);
          padding: 16px;
        }
      </style>
    `;
  }

  escape(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}

if (!customElements.get("battery-bar-card")) {
  customElements.define("battery-bar-card", BatteryBarCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "battery-bar-card",
  name: "Battery Bar Card",
  description: "A Home Assistant themed battery level bar",
});
