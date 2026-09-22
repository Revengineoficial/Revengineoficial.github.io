//#region Firmware matrix
// Single source of truth for "what does this build actually know about".
//
// SUPPORTED  -> exact offsets shipped in ps4/constants.js and verified on real
//               hardware by the original authors.
// DERIVABLE  -> the firmware is recognised, no offsets are shipped, and the
//               runtime deriver (ps4/derive.js) is expected to recover them
//               from the live image before anything is used.
// UNKNOWN    -> newer than anything this build has heard of. Derivation is
//               still attempted, but nothing is assumed.
// UNSUPPORTED-> the usermode chain does not exist for this platform at all.
const FW_STATE = {
  SUPPORTED: "supported",
  DERIVABLE: "derivable",
  UNKNOWN: "unknown",
  UNSUPPORTED: "unsupported",
};

// minor byte values (the hex part of e.g. "11.02") that ship real constants
const FIRMWARE_TABLE = {
  4: {
    6: [0x00, 0x20, 0x50, 0x51, 0x70],
    7: [0x00, 0x50, 0x51],
    8: [0x00, 0x03, 0x50],
    9: [0x00, 0x03, 0x50],
    10: [0x00, 0x50],
    11: [0x00, 0x02],
  },
  5: {},
};

// recognised, not shipped, expected to be solved by the deriver
const DERIVABLE_MAJORS = { 4: [12, 13, 14] };

const FIRMWARE_MATRIX = [
  { console: 4, range: "6.00 - 11.02", state: FW_STATE.SUPPORTED, note: "exact offsets in constants.js" },
  { console: 4, range: "12.00 - 14.xx", state: FW_STATE.DERIVABLE, note: "solved at runtime by ps4/derive.js" },
  { console: 4, range: "> 14.xx", state: FW_STATE.UNKNOWN, note: "deriver only, no assumptions" },
  { console: 5, range: "any", state: FW_STATE.UNSUPPORTED, note: "PS5 needs an ASLR defeat + vtable recovery" },
];
//#endregion

//#region Version
const version = {
  console: undefined,
  major: undefined,
  minor: undefined,
  ua: undefined,
  init() {
    this.ua = navigator.userAgent;

    logger.info(`Agent: ${this.ua}`);

    // Accepts every PlayStation UA shape seen in the wild:
    //   (PlayStation 4 11.00)      (PlayStation 4/11.00)
    //   (PlayStation 5 8.60)       (PlayStation 5/08.60)
    //   (PlayStation(R)4 9.00)     (PlayStation®4 9.00)
    // The trailing pair is a firmware revision in *hex*: 11.02 -> 0x02,
    // 11.50 -> 0x50, 14.00 -> 0x00.
    const patterns = [
      /PlayStation[\u00ae®]?\s*(\d+)\s*[\/\s]\s*(\d+)\.(\d+)/i,
      /PlayStation[\u00ae®]?(\d+)\.(\d+)\.(\d+)/i,
    ];

    let matches = null;

    for (const pattern of patterns) {
      matches = this.ua.match(pattern);
      if (matches !== null) break;
    }

    if (matches === null) {
      throw new Error(`${this.ua} not supported !!`);
    }

    this.console = parseInt(matches[1], 10);
    this.major = parseInt(matches[2], 10);
    this.minor = parseInt(matches[3], 16);

    logger.info(`Firmware: ${this}`);
    logger.info(`Support state: ${this.state}`);

    if (this.state === FW_STATE.UNSUPPORTED) {
      logger.error(`Console ${this.console} is not supported by this build`);
      return;
    }

    if (this.state !== FW_STATE.SUPPORTED) {
      logger.error(`No shipped offsets for ${this} - ps4/derive.js will be required`);
    }
  },
  get minor_hex() {
    return this.minor.toString(16).padStart(2, "0");
  },
  get minor_dec() {
    return this.minor.toString(10).padStart(2, "0");
  },
  // Display form, e.g. "11.02" or "14.00".
  get str() {
    return this.toString();
  },
  get is_ps4() {
    return this.console === 4;
  },
  get is_ps5() {
    return this.console === 5;
  },
  get key() {
    return `${this.console}:${this.major}.${this.minor_hex}`;
  },
  get state() {
    const table = FIRMWARE_TABLE[this.console];
    if (table === undefined) return FW_STATE.UNSUPPORTED;

    const minor = table[this.major];
    if (minor !== undefined) {
      // A major the authors shipped is "supported" wholesale: resolution walks
      // down to the nearest lower minor, which is the original behaviour. That
      // is also why 11.50 resolves against 11.02 - the change to CSSFontFace
      // property handling above 11.02 is the limitation the README calls out,
      // not something this table can detect.
      return FW_STATE.SUPPORTED;
    }

    const derivable = DERIVABLE_MAJORS[this.console] || [];
    if (derivable.includes(this.major)) return FW_STATE.DERIVABLE;
    if (derivable.length > 0 && this.major > derivable[derivable.length - 1]) return FW_STATE.UNKNOWN;

    return FW_STATE.UNSUPPORTED;
  },
  get is_supported() {
    return this.state === FW_STATE.SUPPORTED;
  },
  get is_derivable() {
    return this.state === FW_STATE.DERIVABLE || this.state === FW_STATE.UNKNOWN;
  },
  get is_unsupported() {
    return this.state === FW_STATE.UNSUPPORTED;
  },
  // Throws unless the firmware can be driven, so no caller can silently run the
  // chain against offsets that do not belong to it.
  require_toolchain() {
    if (this.is_unsupported) {
      throw new Error(`${this} has no usermode toolchain in this build`);
    }

    if (this.is_derivable) {
      throw new Error(`${this} needs runtime derivation - call derive_all() first`);
    }
  },
  toString() {
    return `${this.major}.${this.minor.toString(16).padStart(2, "0")}`;
  },
  matrix() {
    return FIRMWARE_MATRIX;
  },
};
//#endregion
