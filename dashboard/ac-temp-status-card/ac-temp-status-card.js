class AcTempStatusCard extends HTMLElement {
  static getStubConfig() {
    return {
      entity: "number.bedroom_controls_a_c_temp",
      power_entity: "sensor.energy_monitor_load_power",
      name: "A/C Temp",
    };
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Please define an entity");
    }

    this.config = {
      name: "A/C Temp",
      icon: "mdi:thermometer",
      power_entity: config.power_entity || "sensor.energy_monitor_load_power",
      power_threshold: 10,
      show_status: false,
      on_label: "A/C is On",
      off_label: "A/C is Off",
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

    const tempEntity = this._hass.states[this.config.entity];
    const powerEntity = this._hass.states[this.config.power_entity];

    if (!tempEntity) {
      this.shadowRoot.innerHTML = this.renderError(`Entity not found: ${this.config.entity}`);
      return;
    }

    if (!powerEntity) {
      this.shadowRoot.innerHTML = this.renderError(`Entity not found: ${this.config.power_entity}`);
      return;
    }

    const power = Number.parseFloat(powerEntity.state);
    const isOn = Number.isFinite(power) && power > Number(this.config.power_threshold);
    const name = this.config.name || tempEntity.attributes.friendly_name || this.config.entity;
    const unit = tempEntity.attributes.unit_of_measurement || "";
    const temp = this.formatTemperature(tempEntity.state);
    const stateLabel = isOn ? this.config.on_label : this.config.off_label;

    this.shadowRoot.innerHTML = `
      ${this.renderStyles()}
      <ha-card class="${isOn ? "is-on" : "is-off"}">
        <button class="card-shell" aria-label="${this.escape(name)} ${this.escape(temp)} ${this.escape(unit)} ${this.escape(stateLabel)}">
          <div class="header-row">
            <div class="name">${this.escape(name)}</div>
            <ha-icon icon="${this.escape(this.config.icon)}"></ha-icon>
          </div>
          <div class="value-row">
            <span class="temperature">${this.escape(temp)}</span>
            ${unit ? `<span class="unit">${this.escape(unit)}</span>` : ""}
          </div>
          ${this.config.show_status ? `
            <div class="status-row">
              <span class="status-dot"></span>
              <span>${this.escape(stateLabel)}</span>
            </div>
          ` : ""}
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

  formatTemperature(value) {
    const numericValue = Number.parseFloat(value);

    if (!Number.isFinite(numericValue)) {
      return value;
    }

    return Number.isInteger(numericValue) ? String(numericValue) : numericValue.toFixed(1);
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
    return `
      <style>
        :host {
          display: block;
        }

        ha-card {
          background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
          border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #3a3a3a));
          border-radius: var(--ha-card-border-radius, 14px);
          box-shadow: var(--ha-card-box-shadow, none);
          color: var(--primary-text-color);
          overflow: hidden;
          transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
        }

        ha-card.is-on {
          --ac-active-rgb: var(--rgb-success-color, 0, 245, 168);
          background:
            radial-gradient(circle at 84% 18%, rgba(var(--ac-active-rgb), 0.34), transparent 32%),
            linear-gradient(135deg, rgba(var(--ac-active-rgb), 0.30), rgba(var(--ac-active-rgb), 0.13) 46%, rgba(7, 19, 31, 0.10)),
            var(--ha-card-background, var(--card-background-color, #1c1c1c));
          border-color: rgba(var(--ac-active-rgb), 0.72);
          box-shadow:
            var(--ha-card-box-shadow, none),
            inset 0 0 0 1px rgba(var(--ac-active-rgb), 0.14),
            0 0 28px rgba(var(--ac-active-rgb), 0.24);
        }

        .card-shell {
          appearance: none;
          background: transparent;
          border: 0;
          color: inherit;
          cursor: pointer;
          display: block;
          font: inherit;
          min-height: 156px;
          padding: 24px;
          text-align: left;
          width: 100%;
        }

        .card-shell:focus-visible {
          outline: 2px solid var(--primary-color);
          outline-offset: -5px;
        }

        .header-row {
          align-items: center;
          display: flex;
          gap: 16px;
          justify-content: space-between;
        }

        .name {
          color: var(--secondary-text-color);
          font-size: 16px;
          font-weight: 700;
          line-height: 1.2;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        ha-icon {
          flex: 0 0 auto;
          height: 24px;
          width: 24px;
        }

        .value-row {
          align-items: baseline;
          display: flex;
          gap: 6px;
          margin-top: 24px;
        }

        .temperature {
          font-size: 40px;
          font-weight: 400;
          letter-spacing: 0;
          line-height: 1;
        }

        .unit {
          color: var(--primary-text-color);
          font-size: 20px;
          line-height: 1;
        }

        .status-row {
          align-items: center;
          color: var(--primary-text-color);
          display: flex;
          font-size: 16px;
          font-weight: 600;
          gap: 10px;
          margin-top: 28px;
        }

        .status-dot {
          background: var(--disabled-text-color, #8d8d8d);
          border-radius: 999px;
          box-shadow: 0 0 12px color-mix(in srgb, var(--disabled-text-color, #8d8d8d) 45%, transparent);
          display: inline-block;
          height: 16px;
          width: 16px;
        }

        ha-card.is-on .status-dot {
          background: var(--success-color, #43a047);
          box-shadow: 0 0 16px color-mix(in srgb, var(--success-color, #43a047) 75%, transparent);
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

if (!customElements.get("ac-temp-status-card")) {
  customElements.define("ac-temp-status-card", AcTempStatusCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "ac-temp-status-card",
  name: "A/C Temp Status Card",
  description: "A temperature entity card that turns green when A/C load power is above a threshold",
});
