const SAMSUNG_S90F_REMOTE_GROUPS = [
  {
    title: "Power",
    tone: "power",
    keys: [
      ["KEY_POWER", "Power"],
      ["KEY_POWERON", "Power On"],
      ["KEY_POWEROFF", "Power Off"],
    ],
  },
  {
    title: "Inputs",
    tone: "input",
    keys: [
      ["KEY_SOURCE", "Source"],
      ["KEY_HDMI", "HDMI"],
      ["KEY_TV", "TV"],
      ["KEY_DTV", "Digital TV"],
      ["KEY_ANTENA", "Antenna"],
      ["KEY_AV1", "AV1"],
      ["KEY_AV2", "AV2"],
      ["KEY_AV3", "AV3"],
      ["KEY_COMPONENT1", "Component 1"],
      ["KEY_COMPONENT2", "Component 2"],
      ["KEY_SVIDEO1", "S-Video 1"],
      ["KEY_SVIDEO2", "S-Video 2"],
      ["KEY_SVIDEO3", "S-Video 3"],
      ["KEY_FM_RADIO", "FM Radio"],
      ["KEY_DVI", "DVI"],
      ["KEY_DVR", "DVR"],
      ["KEY_AMBIENT", "Ambient"],
    ],
  },
  {
    title: "SmartThings",
    tone: "smartthings",
    keys: [
      ["ST_TV", "TV"],
      ["ST_HDMI1", "HDMI 1"],
      ["ST_HDMI2", "HDMI 2"],
      ["ST_HDMI3", "HDMI 3"],
      ["ST_HDMI4", "HDMI 4"],
      ["ST_CHUP", "Channel Up"],
      ["ST_CHDOWN", "Channel Down"],
      ...Array.from({ length: 20 }, (_, index) => [`ST_CH${index + 1}`, `Channel ${index + 1}`]),
      ["ST_MUTE", "Mute"],
      ["ST_VOLUP", "Volume Up"],
      ["ST_VOLDOWN", "Volume Down"],
      ...Array.from({ length: 20 }, (_, index) => [`ST_VOL${(index + 1) * 5}`, `Volume ${(index + 1) * 5}`]),
    ],
  },
  {
    title: "Numbers",
    tone: "number",
    keys: [
      ["KEY_1", "1"],
      ["KEY_2", "2"],
      ["KEY_3", "3"],
      ["KEY_4", "4"],
      ["KEY_5", "5"],
      ["KEY_6", "6"],
      ["KEY_7", "7"],
      ["KEY_8", "8"],
      ["KEY_9", "9"],
      ["KEY_0", "0"],
      ["KEY_11", "11"],
      ["KEY_12", "12"],
      ["KEY_PLUS100", "+100"],
      ["KEY_MINUS", "-"],
      ["KEY_PRECH", "Previous Channel"],
    ],
  },
  {
    title: "Channel",
    tone: "channel",
    keys: [
      ["KEY_CHUP", "Channel Up"],
      ["KEY_CHDOWN", "Channel Down"],
      ["KEY_PRECH", "Previous Channel"],
      ["KEY_FAVCH", "Favorites"],
      ["KEY_CH_LIST", "Channel List"],
      ["KEY_AUTO_PROGRAM", "Auto Program"],
      ["KEY_MAGIC_CHANNEL", "Magic Channel"],
    ],
  },
  {
    title: "Volume",
    tone: "volume",
    keys: [
      ["KEY_VOLUP", "Volume Up"],
      ["KEY_VOLDOWN", "Volume Down"],
      ["KEY_MUTE", "Mute"],
    ],
  },
  {
    title: "Navigation",
    tone: "nav",
    keys: [
      ["KEY_UP", "Up"],
      ["KEY_DOWN", "Down"],
      ["KEY_LEFT", "Left"],
      ["KEY_RIGHT", "Right"],
      ["KEY_ENTER", "Enter"],
      ["KEY_RETURN", "Back"],
      ["KEY_EXIT", "Exit"],
      ["KEY_WHEEL_LEFT", "Wheel Left"],
      ["KEY_WHEEL_RIGHT", "Wheel Right"],
    ],
  },
  {
    title: "Media",
    tone: "media",
    keys: [
      ["KEY_REWIND", "Rewind"],
      ["KEY_STOP", "Stop"],
      ["KEY_PLAY", "Play"],
      ["KEY_FF", "Fast Forward"],
      ["KEY_REC", "Record"],
      ["KEY_PAUSE", "Pause"],
      ["KEY_LIVE", "Live"],
      ["KEY_QUICK_REPLAY", "Quick Replay"],
      ["KEY_STILL_PICTURE", "Still Picture"],
      ["KEY_INSTANT_REPLAY", "Instant Replay"],
      ["KEY_FF_", "Fast Forward Alt"],
      ["KEY_REWIND_", "Rewind Alt"],
    ],
  },
  {
    title: "Color",
    tone: "color",
    keys: [
      ["KEY_RED", "Red"],
      ["KEY_GREEN", "Green"],
      ["KEY_YELLOW", "Yellow"],
      ["KEY_CYAN", "Cyan"],
    ],
  },
  {
    title: "Menus",
    tone: "menu",
    keys: [
      ["KEY_MENU", "Menu"],
      ["KEY_TOPMENU", "Top Menu"],
      ["KEY_TOOLS", "Tools"],
      ["KEY_HOME", "Home"],
      ["KEY_CONTENTS", "Contents"],
      ["KEY_GUIDE", "Guide"],
      ["KEY_DISC_MENU", "Disc Menu"],
      ["KEY_DVR_MENU", "DVR Menu"],
      ["KEY_HELP", "Help"],
      ["KEY_MORE", "More"],
      ["KEY_APP_LIST", "Apps"],
    ],
  },
  {
    title: "OSD",
    tone: "osd",
    keys: [
      ["KEY_INFO", "Info"],
      ["KEY_CAPTION", "Caption"],
      ["KEY_CLOCK_DISPLAY", "Clock Display"],
      ["KEY_SETUP_CLOCK_TIMER", "Setup Clock"],
      ["KEY_SUB_TITLE", "Subtitle"],
    ],
  },
  {
    title: "Picture",
    tone: "picture",
    keys: [
      ["KEY_ASPECT", "Aspect"],
      ["KEY_PICTURE_SIZE", "Picture Size"],
      ["KEY_4_3", "4:3"],
      ["KEY_16_9", "16:9"],
      ["KEY_EXT14", "3:4 Alt"],
      ["KEY_EXT15", "16:9 Alt"],
      ["KEY_PMODE", "Picture Mode"],
      ["KEY_PANORAMA", "Panorama"],
      ["KEY_DYNAMIC", "Dynamic"],
      ["KEY_STANDARD", "Standard"],
      ["KEY_MOVIE1", "Movie"],
      ["KEY_GAME", "Game"],
      ["KEY_CUSTOM", "Custom"],
      ["KEY_EXT9", "Movie Alt"],
      ["KEY_EXT10", "Standard Alt"],
      ["KEY_ZOOM_MOVE", "Zoom Move"],
      ["KEY_ZOOM_IN", "Zoom In"],
      ["KEY_ZOOM_OUT", "Zoom Out"],
      ["KEY_ZOOM1", "Zoom 1"],
      ["KEY_ZOOM2", "Zoom 2"],
    ],
  },
  {
    title: "PIP",
    tone: "pip",
    keys: [
      ["KEY_PIP_ONOFF", "PIP On/Off"],
      ["KEY_PIP_SWAP", "PIP Swap"],
      ["KEY_PIP_SIZE", "PIP Size"],
      ["KEY_PIP_CHUP", "PIP Channel Up"],
      ["KEY_PIP_CHDOWN", "PIP Channel Down"],
      ["KEY_PIP_SCAN", "PIP Scan"],
      ["KEY_AUTO_ARC_PIP_SMALL", "PIP Small"],
      ["KEY_AUTO_ARC_PIP_WIDE", "PIP Wide"],
      ["KEY_AUTO_ARC_PIP_RIGHT_BOTTOM", "PIP Bottom Right"],
      ["KEY_AUTO_ARC_PIP_SOURCE_CHANGE", "PIP Source"],
      ["KEY_AUTO_ARC_PIP_DOUBLE", "PIP Double"],
      ["KEY_AUTO_ARC_PIP_LARGE", "PIP Large"],
      ["KEY_AUTO_ARC_PIP_LEFT_TOP", "PIP Left Top"],
      ["KEY_AUTO_ARC_PIP_RIGHT_TOP", "PIP Right Top"],
      ["KEY_AUTO_ARC_PIP_LEFT_BOTTOM", "PIP Left Bottom"],
      ["KEY_AUTO_ARC_PIP_CH_CHANGE", "PIP Channel Change"],
    ],
  },
  {
    title: "Modes",
    tone: "mode",
    keys: [
      ["KEY_VCR_MODE", "VCR Mode"],
      ["KEY_CATV_MODE", "CATV Mode"],
      ["KEY_DSS_MODE", "DSS Mode"],
      ["KEY_TV_MODE", "TV Mode"],
      ["KEY_DVD_MODE", "DVD Mode"],
      ["KEY_STB_MODE", "STB Mode"],
      ["KEY_PCMODE", "PC Mode"],
    ],
  },
  {
    title: "Teletext",
    tone: "teletext",
    keys: [
      ["KEY_TTX_MIX", "Teletext Mix"],
      ["KEY_TTX_SUBFACE", "Teletext Subface"],
    ],
  },
  {
    title: "Other",
    tone: "other",
    keys: [
      ["KEY_PANNEL_CHDOWN", "3D"],
      ["KEY_ANYNET", "Anynet+"],
      ["KEY_ESAVING", "Energy Saving"],
      ["KEY_SLEEP", "Sleep Timer"],
      ["KEY_DTV_SIGNAL", "DTV Signal"],
      ["KEY_ADDDEL", "Add/Delete"],
      ["KEY_AD", "Audio Description"],
      ["KEY_LINK", "Link"],
      ["KEY_TURBO", "Turbo"],
      ["KEY_CONVERGENCE", "Convergence"],
      ["KEY_DEVICE_CONNECT", "Device Connect"],
      ["KEY_RSURF", "RSURF"],
      ["KEY_ANGLE", "Angle"],
      ["KEY_RESERVED1", "Reserved 1"],
      ["KEY_PROGRAM", "Program"],
      ["KEY_BOOKMARK", "Bookmark"],
      ["KEY_PRINT", "Print"],
      ["KEY_CLEAR", "Clear"],
      ["KEY_VCHIP", "V-Chip"],
      ["KEY_REPEAT", "Repeat"],
      ["KEY_DOOR", "Door"],
      ["KEY_OPEN", "Open"],
      ["KEY_DMA", "DMA"],
      ["KEY_MTS", "MTS"],
      ["KEY_DNIe", "DNIe"],
      ["KEY_SRS", "SRS"],
      ["KEY_CONVERT_AUDIO_MAINSUB", "Audio Main/Sub"],
      ["KEY_MDC", "MDC"],
      ["KEY_SEFFECT", "Sound Effect"],
      ["KEY_PERPECT_FOCUS", "Perfect Focus"],
      ["KEY_CALLER_ID", "Caller ID"],
      ["KEY_SCALE", "Scale"],
      ["KEY_MAGIC_BRIGHT", "Magic Bright"],
      ["KEY_W_LINK", "W Link"],
      ["KEY_DTV_LINK", "DTV Link"],
      ["KEY_BACK_MHP", "Back MHP"],
      ["KEY_ALT_MHP", "Alternate MHP"],
      ["KEY_DNSe", "DNSe"],
      ["KEY_RSS", "RSS"],
      ["KEY_ENTERTAINMENT", "Entertainment"],
      ["KEY_ID_INPUT", "ID Input"],
      ["KEY_ID_SETUP", "ID Setup"],
      ["KEY_ANYVIEW", "AnyView"],
      ["KEY_MS", "MS"],
      ["KEY_MIC", "Mic"],
      ["KEY_NINE_SEPERATE", "Nine Separate"],
      ["KEY_AUTO_FORMAT", "Auto Format"],
      ["KEY_DNET", "DNET"],
    ],
  },
  {
    title: "Auto Arc",
    tone: "arc",
    keys: [
      ["KEY_AUTO_ARC_C_FORCE_AGING", "Force Aging"],
      ["KEY_AUTO_ARC_CAPTION_ENG", "Caption English"],
      ["KEY_AUTO_ARC_USBJACK_INSPECT", "USB Jack Inspect"],
      ["KEY_AUTO_ARC_RESET", "Auto Arc Reset"],
      ["KEY_AUTO_ARC_LNA_ON", "LNA On"],
      ["KEY_AUTO_ARC_LNA_OFF", "LNA Off"],
      ["KEY_AUTO_ARC_ANYNET_MODE_OK", "Anynet Mode OK"],
      ["KEY_AUTO_ARC_ANYNET_AUTO_START", "Anynet Auto Start"],
      ["KEY_AUTO_ARC_CAPTION_ON", "Caption On"],
      ["KEY_AUTO_ARC_CAPTION_OFF", "Caption Off"],
      ["KEY_AUTO_ARC_AUTOCOLOR_SUCCESS", "Auto Color Success"],
      ["KEY_AUTO_ARC_AUTOCOLOR_FAIL", "Auto Color Fail"],
      ["KEY_AUTO_ARC_JACK_IDENT", "Jack Ident"],
      ["KEY_AUTO_ARC_CAPTION_KOR", "Caption Korean"],
      ["KEY_AUTO_ARC_ANTENNA_AIR", "Antenna Air"],
      ["KEY_AUTO_ARC_ANTENNA_CABLE", "Antenna Cable"],
      ["KEY_AUTO_ARC_ANTENNA_SATELLITE", "Antenna Satellite"],
    ],
  },
  {
    title: "Panel",
    tone: "panel",
    keys: [
      ["KEY_PANNEL_POWER", "Panel Power"],
      ["KEY_PANNEL_CHUP", "Panel Channel Up"],
      ["KEY_PANNEL_VOLUP", "Panel Volume Up"],
      ["KEY_PANNEL_VOLDOW", "Panel Volume Down"],
      ["KEY_PANNEL_ENTER", "Panel Enter"],
      ["KEY_PANNEL_MENU", "Panel Menu"],
      ["KEY_PANNEL_SOURCE", "Panel Source"],
    ],
  },
  {
    title: "Extended",
    tone: "extended",
    keys: [
      ["KEY_EXT1", "Ext 1"],
      ["KEY_EXT2", "Ext 2"],
      ["KEY_EXT3", "Ext 3"],
      ["KEY_EXT4", "Ext 4"],
      ["KEY_EXT5", "Ext 5"],
      ["KEY_EXT6", "Ext 6"],
      ["KEY_EXT7", "Ext 7"],
      ["KEY_EXT8", "Ext 8"],
      ["KEY_EXT11", "Ext 11"],
      ["KEY_EXT12", "Ext 12"],
      ["KEY_EXT13", "Ext 13"],
      ["KEY_EXT16", "Ext 16"],
      ["KEY_EXT17", "Ext 17"],
      ["KEY_EXT18", "Ext 18"],
      ["KEY_EXT19", "Ext 19"],
      ["KEY_EXT20", "Ext 20"],
      ["KEY_EXT21", "Ext 21"],
      ["KEY_EXT22", "Ext 22"],
      ["KEY_EXT23", "Ext 23"],
      ["KEY_EXT24", "Ext 24"],
      ["KEY_EXT25", "Ext 25"],
      ["KEY_EXT26", "Ext 26"],
      ["KEY_EXT27", "Ext 27"],
      ["KEY_EXT28", "Ext 28"],
      ["KEY_EXT29", "Ext 29"],
      ["KEY_EXT30", "Ext 30"],
      ["KEY_EXT31", "Ext 31"],
      ["KEY_EXT32", "Ext 32"],
      ["KEY_EXT33", "Ext 33"],
      ["KEY_EXT34", "Ext 34"],
      ["KEY_EXT35", "Ext 35"],
      ["KEY_EXT36", "Ext 36"],
      ["KEY_EXT37", "Ext 37"],
      ["KEY_EXT38", "Ext 38"],
      ["KEY_EXT39", "Ext 39"],
      ["KEY_EXT40", "Ext 40"],
      ["KEY_EXT41", "Ext 41"],
    ],
  },
  {
    title: "Service",
    tone: "service",
    keys: [
      ["KEY_FACTORY", "Factory"],
      ["KEY_3SPEED", "3 Speed"],
    ],
  },
];

const QUICK_APP_BUTTONS = [
  ["KEY_HOME", "Home", "mdi:home"],
  ["KEY_SOURCE", "Source", "mdi:import"],
  ["KEY_GUIDE", "Guide", "mdi:television-guide"],
  ["KEY_INFO", "Info", "mdi:information-outline"],
];

const SERVICE_SEQUENCES = [
  {
    command: ["KEY_INFO", "KEY_MENU", "KEY_MUTE", "KEY_POWER"],
    label: "Info Menu Mute Power",
  },
  {
    command: ["KEY_MUTE", "KEY_1", "KEY_8", "KEY_2", "KEY_POWER"],
    label: "Mute 182 Power",
  },
];

class SamsungSmartRemoteCard extends HTMLElement {
  static getStubConfig() {
    return {
      type: "custom:samsung-smart-remote-card",
      entity: "remote.samsung_tv",
      name: "Samsung S90F",
    };
  }

  setConfig(config) {
    const remoteEntity = config.entity || config.remote_entity;

    if (!remoteEntity) {
      throw new Error("Please define a Samsung remote entity");
    }

    this.config = {
      entity: remoteEntity,
      name: "Samsung S90F",
      show_header: true,
      show_service_buttons: true,
      show_all_keys: true,
      show_keypad: true,
      service_delay: 0.45,
      repeat_start_ms: 420,
      repeat_interval_ms: 180,
      ...config,
      entity: remoteEntity,
    };

    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }

    this.render();
  }

  set hass(hass) {
    this._hass = hass;

    if (this._isRepeatingKey) {
      this._needsRenderAfterRepeat = true;
      return;
    }

    this.render();
  }

  getCardSize() {
    return this.config?.show_all_keys ? 8 : 6;
  }

  render() {
    if (!this.shadowRoot || !this.config || !this._hass) {
      return;
    }

    this._activeRepeatStop?.();
    this._activeRepeatStop = undefined;

    if (this.shadowRoot.querySelector(".all-keys")) {
      this._allKeysOpen = this.shadowRoot.querySelector(".all-keys").open;
    }

    if (typeof this._keypadVisible !== "boolean") {
      this._keypadVisible = this.config.show_keypad !== false;
    }

    const remote = this._hass.states[this.config.entity];

    if (!remote) {
      this.shadowRoot.innerHTML = this.renderError(`Remote entity not found: ${this.config.entity}`);
      return;
    }

    const name = this.config.name || remote.attributes.friendly_name || "Samsung S90F";

    this.shadowRoot.innerHTML = `
      ${this.renderStyles()}
      <ha-card>
        <div class="remote-shell">
          ${this.config.show_header ? this.renderHeader(name, remote.state) : ""}
          <div class="remote-face" aria-label="${this.escape(name)} remote">
            ${this.renderTopCluster()}
            ${this.renderNavigationCluster()}
            ${this.renderChannelVolumeCluster()}
            ${this.renderKeypadToggle()}
            ${this._keypadVisible ? this.renderNumberPad() : ""}
            ${this.renderMediaCluster()}
            ${this.config.show_service_buttons ? this.renderServiceCluster() : ""}
          </div>
          ${this.config.show_all_keys ? this.renderAllKeys() : ""}
        </div>
      </ha-card>
    `;

    this.bindCommandButtons();

    this.shadowRoot.querySelectorAll("[data-sequence]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        this.sendCommand(JSON.parse(button.dataset.sequence), Number(this.config.service_delay));
      });
    });

    const allKeys = this.shadowRoot.querySelector(".all-keys");
    if (allKeys) {
      allKeys.addEventListener("toggle", () => {
        this._allKeysOpen = allKeys.open;
      });
    }

    const keypadToggle = this.shadowRoot.querySelector("[data-toggle-keypad]");
    if (keypadToggle) {
      keypadToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        this._keypadVisible = !this._keypadVisible;
        this.render();
      });
    }
  }

  renderHeader(name, state) {
    const stateText = state || "unknown";

    return `
      <div class="remote-header">
        <div>
          <div class="eyebrow">Samsung OLED S90F</div>
          <div class="title">${this.escape(name)}</div>
        </div>
        <div class="state-pill">
          <span></span>
          ${this.escape(stateText)}
        </div>
      </div>
    `;
  }

  renderTopCluster() {
    return `
      <section class="top-cluster">
        ${this.renderIconButton("KEY_POWER", "Power", "mdi:power", "round power")}
        <div class="quick-grid">
          ${QUICK_APP_BUTTONS.map(([key, label, icon]) => this.renderIconButton(key, label, icon, "quick")).join("")}
        </div>
      </section>
    `;
  }

  renderNavigationCluster() {
    return `
      <section class="nav-cluster">
        ${this.renderKey("KEY_UP", "Up", "nav up", "mdi:chevron-up")}
        ${this.renderKey("KEY_LEFT", "Left", "nav left", "mdi:chevron-left")}
        ${this.renderKey("KEY_ENTER", "OK", "nav ok")}
        ${this.renderKey("KEY_RIGHT", "Right", "nav right", "mdi:chevron-right")}
        ${this.renderKey("KEY_DOWN", "Down", "nav down", "mdi:chevron-down")}
      </section>
      <section class="back-row">
        ${this.renderIconButton("KEY_RETURN", "Back", "mdi:keyboard-return", "pill")}
        ${this.renderIconButton("KEY_HOME", "Home", "mdi:home-outline", "pill accent")}
        ${this.renderIconButton("KEY_EXIT", "Exit", "mdi:exit-to-app", "pill")}
      </section>
    `;
  }

  renderChannelVolumeCluster() {
    return `
      <section class="rocker-grid">
        <div class="rocker volume">
          ${this.renderKey("KEY_VOLUP", "Volume Up", "rocker-btn", "mdi:plus", true)}
          <div class="rocker-label">VOL</div>
          ${this.renderKey("KEY_VOLDOWN", "Volume Down", "rocker-btn", "mdi:minus", true)}
        </div>
        ${this.renderIconButton("KEY_MUTE", "Mute", "mdi:volume-off", "mute")}
        <div class="rocker channel">
          ${this.renderKey("KEY_CHUP", "Channel Up", "rocker-btn", "mdi:chevron-up", true)}
          <div class="rocker-label">CH</div>
          ${this.renderKey("KEY_CHDOWN", "Channel Down", "rocker-btn", "mdi:chevron-down", true)}
        </div>
      </section>
    `;
  }

  renderKeypadToggle() {
    return `
      <button class="keypad-toggle" data-toggle-keypad aria-expanded="${this._keypadVisible ? "true" : "false"}" aria-label="${this._keypadVisible ? "Hide keypad" : "Show keypad"}">
        <span>${this._keypadVisible ? "Hide keypad" : "Show keypad"}</span>
        <ha-icon icon="${this._keypadVisible ? "mdi:chevron-up" : "mdi:dialpad"}"></ha-icon>
      </button>
    `;
  }

  renderNumberPad() {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    return `
      <section class="number-grid">
        ${numbers.map((number) => this.renderKey(`KEY_${number}`, number, "number")).join("")}
        ${this.renderKey("KEY_PRECH", "PRE", "number small")}
        ${this.renderKey("KEY_0", "0", "number")}
        ${this.renderKey("KEY_CH_LIST", "LIST", "number small")}
      </section>
    `;
  }

  renderMediaCluster() {
    return `
      <section class="media-grid">
        ${this.renderIconButton("KEY_REWIND", "Rewind", "mdi:rewind", "media", true)}
        ${this.renderIconButton("KEY_PLAY", "Play", "mdi:play", "media play")}
        ${this.renderIconButton("KEY_PAUSE", "Pause", "mdi:pause", "media")}
        ${this.renderIconButton("KEY_FF", "Fast Forward", "mdi:fast-forward", "media", true)}
        ${this.renderIconButton("KEY_STOP", "Stop", "mdi:stop", "media")}
        ${this.renderIconButton("KEY_REC", "Record", "mdi:record-rec", "media rec")}
      </section>
      <section class="color-row">
        ${this.renderColorKey("KEY_RED", "Red", "#e53935")}
        ${this.renderColorKey("KEY_GREEN", "Green", "#43a047")}
        ${this.renderColorKey("KEY_YELLOW", "Yellow", "#fdd835")}
        ${this.renderColorKey("KEY_CYAN", "Cyan", "#00acc1")}
      </section>
    `;
  }

  renderServiceCluster() {
    return `
      <section class="service-panel">
        <div class="service-title">
          <ha-icon icon="mdi:tools"></ha-icon>
          Service
        </div>
        <div class="service-grid">
          ${this.renderKey("KEY_FACTORY", "Factory", "service")}
          ${this.renderKey("KEY_3SPEED", "3 Speed", "service")}
          ${SERVICE_SEQUENCES.map((item) => this.renderSequenceButton(item.command, item.label)).join("")}
        </div>
      </section>
    `;
  }

  renderAllKeys() {
    return `
      <details class="all-keys" ${this._allKeysOpen ? "open" : ""}>
        <summary>
          <span>All Samsung key codes</span>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </summary>
        <div class="group-stack">
          ${SAMSUNG_S90F_REMOTE_GROUPS.map((group) => `
            <section class="key-group tone-${this.escape(group.tone)}">
              <h3>${this.escape(group.title)}</h3>
              <div class="key-grid">
                ${group.keys.map(([key, label]) => this.renderTextButton(key, label)).join("")}
              </div>
            </section>
          `).join("")}
        </div>
      </details>
    `;
  }

  renderIconButton(command, label, icon, classes = "", repeatable = false) {
    return `
      <button class="remote-btn icon-btn ${classes}" data-command="${this.escape(command)}" ${repeatable ? "data-repeatable=\"true\"" : ""} title="${this.escape(label)}" aria-label="${this.escape(label)}">
        <ha-icon icon="${this.escape(icon)}"></ha-icon>
      </button>
    `;
  }

  renderColorKey(command, label, color) {
    return `
      <button class="remote-btn color-key" style="--key-color: ${this.escape(color)};" data-command="${this.escape(command)}" title="${this.escape(label)}" aria-label="${this.escape(label)}"></button>
    `;
  }

  renderKey(command, label, classes = "", icon = "", repeatable = false) {
    const shouldRepeat = repeatable || ["KEY_UP", "KEY_DOWN", "KEY_LEFT", "KEY_RIGHT"].includes(command);

    return `
      <button class="remote-btn ${classes}" data-command="${this.escape(command)}" ${shouldRepeat ? "data-repeatable=\"true\"" : ""} title="${this.escape(command)}" aria-label="${this.escape(label)}">
        ${icon ? `<ha-icon icon="${this.escape(icon)}"></ha-icon>` : `<span>${this.escape(label)}</span>`}
      </button>
    `;
  }

  renderTextButton(command, label) {
    return `
      <button class="text-key" data-command="${this.escape(command)}" title="${this.escape(command)}">
        <span>${this.escape(label || command)}</span>
        <small>${this.escape(command)}</small>
      </button>
    `;
  }

  renderSequenceButton(command, label) {
    return `
      <button class="remote-btn service sequence" data-sequence="${this.escape(JSON.stringify(command))}" title="${this.escape(command.join(" > "))}">
        <span>${this.escape(label)}</span>
      </button>
    `;
  }

  bindCommandButtons() {
    this.shadowRoot.querySelectorAll("[data-command]").forEach((button) => {
      if (button.dataset.repeatable === "true") {
        this.bindRepeatingButton(button);
        return;
      }

      button.addEventListener("click", (event) => {
        event.stopPropagation();
        this.sendCommand(button.dataset.command);
      });
    });
  }

  bindRepeatingButton(button) {
    let startTimer;
    let repeatTimer;
    let didRepeat = false;
    let isActive = false;

    const clearTimers = () => {
      window.clearTimeout(startTimer);
      window.clearInterval(repeatTimer);
      startTimer = undefined;
      repeatTimer = undefined;
    };

    const stop = (event) => {
      event?.stopPropagation();

      if (!isActive) {
        return;
      }

      isActive = false;
      this._isRepeatingKey = false;
      clearTimers();
      this._activeRepeatStop = undefined;

      if (!didRepeat) {
        this.sendCommand(button.dataset.command);
      }

      if (this._needsRenderAfterRepeat) {
        this._needsRenderAfterRepeat = false;
        this.render();
      }
    };

    button.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) {
        return;
      }

      event.stopPropagation();
      didRepeat = false;
      isActive = true;
      this._isRepeatingKey = true;
      this._needsRenderAfterRepeat = false;
      clearTimers();
      this._activeRepeatStop = clearTimers;
      button.setPointerCapture?.(event.pointerId);

      startTimer = window.setTimeout(() => {
        didRepeat = true;
        this.sendCommand(button.dataset.command);
        repeatTimer = window.setInterval(() => {
          this.sendCommand(button.dataset.command);
        }, Number(this.config.repeat_interval_ms) || 180);
      }, Number(this.config.repeat_start_ms) || 420);
    });

    button.addEventListener("pointerup", stop);
    button.addEventListener("pointercancel", stop);
    button.addEventListener("pointerleave", (event) => {
      if (event.buttons === 1) {
        stop(event);
      }
    });
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.detail === 0) {
        this.sendCommand(button.dataset.command);
      }
    });
  }

  sendCommand(command, delay = 0) {
    if (!this._hass) {
      return;
    }

    const data = {
      entity_id: this.config.entity,
      command,
    };

    if (Array.isArray(command) && delay > 0) {
      data.delay_secs = delay;
    }

    this._hass.callService("remote", "send_command", data);
    this.dispatchEvent(
      new CustomEvent("haptic", {
        bubbles: true,
        composed: true,
        detail: "selection",
      }),
    );
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
          background: linear-gradient(155deg, color-mix(in srgb, var(--ha-card-background, #202124) 88%, #111 12%), #101214);
          border: var(--ha-card-border-width, 1px) solid color-mix(in srgb, var(--divider-color, #3a3d42) 70%, transparent);
          border-radius: var(--ha-card-border-radius, 14px);
          box-shadow: var(--ha-card-box-shadow, none);
          color: var(--primary-text-color);
          overflow: hidden;
        }

        .remote-shell {
          box-sizing: border-box;
          margin: 0 auto;
          max-width: 430px;
          padding: 18px;
        }

        .remote-header {
          align-items: center;
          display: flex;
          gap: 14px;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .eyebrow {
          color: var(--secondary-text-color);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .title {
          font-size: 20px;
          font-weight: 800;
          line-height: 1.15;
          margin-top: 2px;
        }

        .state-pill {
          align-items: center;
          background: color-mix(in srgb, var(--secondary-text-color) 16%, transparent);
          border-radius: 999px;
          color: var(--secondary-text-color);
          display: inline-flex;
          font-size: 12px;
          font-weight: 800;
          gap: 7px;
          max-width: 45%;
          padding: 7px 10px;
          text-transform: uppercase;
        }

        .state-pill span {
          background: var(--success-color, #43a047);
          border-radius: 999px;
          flex: 0 0 auto;
          height: 8px;
          width: 8px;
          box-shadow: 0 0 12px color-mix(in srgb, var(--success-color, #43a047) 70%, transparent);
        }

        .remote-face {
          background:
            radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--primary-color, #03a9f4) 18%, transparent), transparent 32%),
            linear-gradient(180deg, #282b31, #17191d 62%, #111316);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 36px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 18px 42px rgba(0, 0, 0, 0.24);
          display: grid;
          gap: 14px;
          padding: 18px 16px 22px;
        }

        .top-cluster {
          align-items: center;
          display: grid;
          gap: 12px;
          grid-template-columns: 58px minmax(0, 1fr);
        }

        .quick-grid {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .remote-btn,
        .text-key {
          -webkit-tap-highlight-color: transparent;
          align-items: center;
          appearance: none;
          border: 0;
          box-sizing: border-box;
          color: #f7f9fb;
          cursor: pointer;
          display: inline-flex;
          font: inherit;
          justify-content: center;
          letter-spacing: 0;
          min-width: 0;
          user-select: none;
        }

        .remote-btn {
          background: linear-gradient(180deg, #3c4149, #242830);
          border-radius: 999px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 8px 16px rgba(0, 0, 0, 0.25);
          font-size: 13px;
          font-weight: 800;
          min-height: 42px;
          padding: 0 10px;
        }

        .remote-btn:active,
        .text-key:active {
          transform: translateY(1px);
        }

        .remote-btn:focus-visible,
        .text-key:focus-visible,
        summary:focus-visible {
          outline: 2px solid var(--primary-color);
          outline-offset: 2px;
        }

        .remote-btn ha-icon {
          height: 21px;
          width: 21px;
        }

        .round {
          height: 58px;
          min-height: 58px;
          width: 58px;
        }

        .power {
          background: linear-gradient(180deg, #ff7168, #b91c1c);
        }

        .quick {
          background: linear-gradient(180deg, #40566f, #26394f);
        }

        .nav-cluster {
          display: grid;
          grid-template-areas:
            ". up ."
            "left ok right"
            ". down .";
          grid-template-columns: repeat(3, minmax(74px, 1fr));
          gap: 14px;
          margin: 6px auto 2px;
          max-width: 360px;
          width: min(100%, 360px);
        }

        .nav {
          background: linear-gradient(180deg, #4b5058, #2b3038);
          min-height: 70px;
        }

        .nav.up { grid-area: up; }
        .nav.left { grid-area: left; }
        .nav.right { grid-area: right; }
        .nav.down { grid-area: down; }

        .nav.ok {
          background: linear-gradient(180deg, var(--primary-color, #03a9f4), #106b91);
          font-size: 20px;
          grid-area: ok;
          min-height: 86px;
        }

        .back-row {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .pill {
          background: linear-gradient(180deg, #343940, #20242a);
        }

        .pill.accent {
          background: linear-gradient(180deg, #3f7c6c, #255244);
        }

        .rocker-grid {
          align-items: center;
          display: grid;
          gap: 14px;
          grid-template-columns: 1fr 58px 1fr;
        }

        .rocker {
          background: #111316;
          border-radius: 28px;
          display: grid;
          gap: 6px;
          padding: 7px;
        }

        .rocker-btn {
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
          min-height: 48px;
        }

        .volume .rocker-btn {
          background: linear-gradient(180deg, #4f6f9c, #29456e);
        }

        .channel .rocker-btn {
          background: linear-gradient(180deg, #6f6a42, #4a4526);
        }

        .rocker-label {
          color: var(--secondary-text-color);
          font-size: 12px;
          font-weight: 900;
          text-align: center;
        }

        .mute {
          align-self: center;
          background: linear-gradient(180deg, #6c465c, #492b3b);
          height: 58px;
          min-height: 58px;
        }

        .keypad-toggle {
          -webkit-tap-highlight-color: transparent;
          align-items: center;
          appearance: none;
          background: linear-gradient(180deg, color-mix(in srgb, var(--primary-color, #03a9f4) 28%, #343940), #20242a);
          border: 1px solid color-mix(in srgb, var(--primary-color, #03a9f4) 38%, transparent);
          border-radius: 999px;
          box-sizing: border-box;
          color: #f7f9fb;
          cursor: pointer;
          display: inline-flex;
          font: inherit;
          font-size: 12px;
          font-weight: 900;
          gap: 12px;
          justify-content: center;
          letter-spacing: 0;
          min-height: 36px;
          padding: 5px 16px;
          text-transform: uppercase;
          user-select: none;
          width: 100%;
        }

        .keypad-toggle ha-icon {
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          box-sizing: border-box;
          display: inline-flex;
          flex: 0 0 auto;
          height: 30px;
          justify-content: center;
          padding: 5px;
          width: 30px;
        }

        .keypad-toggle:active {
          transform: translateY(1px);
        }

        .keypad-toggle:focus-visible {
          outline: 2px solid var(--primary-color);
          outline-offset: 2px;
        }

        .number-grid {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .number {
          background: linear-gradient(180deg, #353a42, #20242a);
          font-size: 18px;
          min-height: 44px;
        }

        .number.small {
          color: #dce4ec;
          font-size: 11px;
        }

        .media-grid {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(6, minmax(0, 1fr));
        }

        .media {
          background: linear-gradient(180deg, #39515a, #24383f);
          min-height: 40px;
          padding: 0;
        }

        .media.play {
          background: linear-gradient(180deg, #4f8754, #2f5d34);
        }

        .media.rec {
          background: linear-gradient(180deg, #a93b45, #6f2028);
        }

        .color-row {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .color-key {
          background: var(--key-color);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 8px 14px rgba(0, 0, 0, 0.24);
          min-height: 24px;
        }

        .service-panel {
          background: rgba(112, 32, 32, 0.28);
          border: 1px solid rgba(255, 120, 120, 0.25);
          border-radius: 22px;
          padding: 10px;
        }

        .service-title {
          align-items: center;
          color: #ffb4aa;
          display: flex;
          font-size: 12px;
          font-weight: 900;
          gap: 7px;
          margin: 0 0 8px;
          text-transform: uppercase;
        }

        .service-title ha-icon {
          height: 16px;
          width: 16px;
        }

        .service-grid {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .service {
          background: linear-gradient(180deg, #9d3030, #5b1a1a);
          border: 1px solid rgba(255, 180, 170, 0.22);
          color: #fff5f3;
          min-height: 38px;
        }

        .sequence {
          border-radius: 14px;
          grid-column: span 2;
          line-height: 1.15;
          padding: 7px 10px;
        }

        .all-keys {
          margin-top: 14px;
        }

        summary {
          align-items: center;
          background: color-mix(in srgb, var(--primary-color, #03a9f4) 18%, transparent);
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          font-size: 13px;
          font-weight: 900;
          justify-content: space-between;
          list-style: none;
          padding: 12px 14px;
        }

        summary::-webkit-details-marker {
          display: none;
        }

        details[open] summary ha-icon {
          transform: rotate(180deg);
        }

        .group-stack {
          display: grid;
          gap: 12px;
          margin-top: 12px;
        }

        .key-group {
          background: color-mix(in srgb, var(--secondary-background-color, #22252b) 74%, transparent);
          border-left: 5px solid var(--group-color, var(--primary-color));
          border-radius: 8px;
          padding: 12px;
        }

        .key-group h3 {
          font-size: 13px;
          letter-spacing: 0;
          margin: 0 0 10px;
        }

        .key-grid {
          display: grid;
          gap: 7px;
          grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
        }

        .text-key {
          align-items: flex-start;
          background: color-mix(in srgb, var(--group-color, var(--primary-color)) 16%, #20242a);
          border: 1px solid color-mix(in srgb, var(--group-color, var(--primary-color)) 42%, transparent);
          border-radius: 8px;
          flex-direction: column;
          min-height: 50px;
          padding: 8px 9px;
          text-align: left;
        }

        .text-key span {
          color: #f9fbfd;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.15;
          overflow-wrap: anywhere;
        }

        .text-key small {
          color: color-mix(in srgb, #f9fbfd 58%, transparent);
          font-size: 10px;
          line-height: 1.2;
          margin-top: 4px;
          overflow-wrap: anywhere;
        }

        .tone-power { --group-color: #ef5350; }
        .tone-input { --group-color: #42a5f5; }
        .tone-smartthings { --group-color: #00bcd4; }
        .tone-number { --group-color: #90a4ae; }
        .tone-channel { --group-color: #fdd835; }
        .tone-volume { --group-color: #5c9ded; }
        .tone-nav { --group-color: #26c6da; }
        .tone-media { --group-color: #66bb6a; }
        .tone-color { --group-color: #ab47bc; }
        .tone-menu { --group-color: #26a69a; }
        .tone-osd { --group-color: #7e57c2; }
        .tone-picture { --group-color: #ffb74d; }
        .tone-pip { --group-color: #ec407a; }
        .tone-mode { --group-color: #8d6e63; }
        .tone-teletext { --group-color: #78909c; }
        .tone-other { --group-color: #b0bec5; }
        .tone-arc { --group-color: #ff7043; }
        .tone-panel { --group-color: #9ccc65; }
        .tone-extended { --group-color: #29b6f6; }
        .tone-service { --group-color: #e53935; }

        .error {
          color: var(--error-color, #db4437);
          padding: 16px;
        }

        @media (max-width: 380px) {
          .remote-shell {
            padding: 12px;
          }

          .remote-face {
            border-radius: 30px;
            padding: 14px 12px 18px;
          }

          .nav-cluster {
            gap: 10px;
            grid-template-columns: repeat(3, minmax(58px, 1fr));
            max-width: 292px;
            width: 100%;
          }

          .nav {
            min-height: 58px;
          }

          .nav.ok {
            font-size: 17px;
            min-height: 72px;
          }

          .quick-grid,
          .media-grid {
            gap: 6px;
          }

          .remote-btn {
            min-height: 38px;
          }
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

if (!customElements.get("samsung-smart-remote-card")) {
  customElements.define("samsung-smart-remote-card", SamsungSmartRemoteCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "samsung-smart-remote-card",
  name: "Samsung Smart Remote Card",
  description: "A physical remote style card for Samsung Smart TV remote.send_command keys",
});
