//#region Profiles
// Open source homebrew enablers. Each entry only describes how the payload is
// packaged and what it expects from the platform - the exploit never assumes
// anything about a payload's contents beyond its container format.
const HEN_CACHE_KEY = "cssfontface_hen_profiles";

const HEN_PROFILES = {
  goldhen: {
    name: "GoldHEN",
    repo: "https://github.com/GoldHEN/GoldHEN",
    path: "src/payload.bin",
    format: "elf",
    loader: "elf",
    kernel: true,
    hw: ["ps4"],
    note: "Open source homebrew enabler. Ships as an ELF payload, needs the kernel exploit first.",
  },
  ps4hen: {
    name: "PS4HEN",
    repo: "https://github.com/Scene-Collective/ps4-hen",
    path: "src/payload.bin",
    format: "elf",
    loader: "elf",
    kernel: true,
    hw: ["ps4"],
    note: "Original open source HEN by Scene Collective. ELF payload.",
  },
  ps4debug: {
    name: "PS4Debug",
    repo: "https://github.com/GoldHEN/GoldHEN_Plugins_Repository",
    path: "src/payload.bin",
    format: "elf",
    loader: "elf",
    kernel: true,
    hw: ["ps4"],
    note: "Open source debug stub, exposes a GDB-compatible TCP endpoint.",
  },
  custom: {
    name: "Custom payload",
    repo: null,
    path: "src/payload.bin",
    format: "auto",
    loader: "auto",
    kernel: true,
    hw: ["ps4"],
    note: "Any open source payload. Container format is sniffed at load time.",
  },
};

// Payloads whose first bytes are not an ELF header are loaded flat: map a page
// aligned region, copy, and start it on a thread. That is what the original
// build always did.
const HEN_FORMATS = {
  ELF: "elf",
  RAW: "raw",
};
//#endregion

//#region State
const hen_state = {
  profiles: HEN_PROFILES,
  selected: "goldhen",
  loaded: null,
  cache: new Map(),
  custom() {
    const out = {};

    if (typeof localStorage === "undefined") return out;

    try {
      const raw = localStorage.getItem(HEN_CACHE_KEY);
      if (raw !== null) Object.assign(out, JSON.parse(raw));
    } catch (e) {
      logger.debug(`hen: no custom profiles (${e.message})`);
    }

    return out;
  },
  all() {
    return Object.assign({}, HEN_PROFILES, this.custom());
  },
  get(id) {
    const profile = this.all()[id];

    if (profile === undefined) {
      throw new Error(`Unknown HEN profile ${id} !!`);
    }

    return profile;
  },
  register(id, profile) {
    if (typeof id !== "string" || id.length === 0) {
      throw new Error("HEN profile id must be a non-empty string !!");
    }

    if (profile.path === undefined && profile.url === undefined) {
      throw new Error(`HEN profile ${id} has no path or url !!`);
    }

    const custom = this.custom();
    custom[id] = profile;

    localStorage.setItem(HEN_CACHE_KEY, JSON.stringify(custom));

    logger.info(`registered HEN profile ${id}`);

    return profile;
  },
  unregister(id) {
    const custom = this.custom();

    delete custom[id];

    localStorage.setItem(HEN_CACHE_KEY, JSON.stringify(custom));

    return true;
  },
  reset() {
    this.loaded = null;
    this.cache.clear();
    return true;
  },
};
//#endregion

//#region Helpers
function hen_source(profile) {
  if (profile.url !== undefined && profile.url.length !== 0) return profile.url;

  return profile.path;
}

function hen_sniff(bytes) {
  if (bytes.length >= 4 && Elf64.is_elf(bytes)) return HEN_FORMATS.ELF;

  return HEN_FORMATS.RAW;
}

// SHA-256 of the payload, when the context can produce one. `crypto.subtle` is
// only present in a secure context, which the console page is served in.
async function hen_digest(bytes) {
  if (typeof crypto === "undefined" || crypto.subtle === undefined) return undefined;

  try {
    const digest = await crypto.subtle.digest("SHA-256", bytes);

    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (e) {
    logger.debug(`hen: cannot hash the payload (${e.message})`);
    return undefined;
  }
}

// Every payload is inspected before it is started. A payload that does not
// match its declared container is rejected rather than jumped into, and a
// profile that pins a hash only accepts exactly that image.
async function hen_verify(profile, bytes) {
  const sniffed = hen_sniff(bytes);

  if (profile.format !== "auto" && profile.format !== sniffed) {
    throw new Error(
      `${profile.name} declares ${profile.format} but the payload is ${sniffed} !!`
    );
  }

  if (sniffed === HEN_FORMATS.ELF) {
    const elf = Elf64.from_bytes(bytes);

    if (elf.entry.eq(0)) {
      throw new Error(`${profile.name} has no entry point !!`);
    }

    if (elf.loads.length === 0) {
      throw new Error(`${profile.name} has no loadable segments !!`);
    }

    return Object.assign(await hen_pinned(profile, bytes), {
      format: HEN_FORMATS.ELF,
      entry: elf.entry,
      segments: elf.loads.length,
      type: elf.type === ELF_ET_DYN ? "ET_DYN" : elf.type === ELF_ET_EXEC ? "ET_EXEC" : "other",
    });
  }

  if (bytes.length < 0x10) {
    throw new Error(`${profile.name} payload is too small to be executable !!`);
  }

  return Object.assign(await hen_pinned(profile, bytes), {
    format: HEN_FORMATS.RAW,
    entry: null,
    segments: 1,
    type: "flat",
  });
}

// A profile may pin the digest of the payload it expects. A payload that does
// not match is refused: a HEN is kernel-level code, and "close enough" is not a
// thing a hash check can be. If the profile pins one and the context cannot
// hash, the load is refused as well rather than silently unverified.
async function hen_pinned(profile, bytes) {
  const sha256 = await hen_digest(bytes);

  if (profile.sha256 === undefined || profile.sha256 === null) {
    return { sha256 };
  }

  if (sha256 === undefined) {
    throw new Error(`${profile.name} pins a sha256 but this context cannot compute one !!`);
  }

  if (sha256.toLowerCase() !== String(profile.sha256).trim().toLowerCase()) {
    throw new Error(
      `${profile.name} does not match its pinned sha256 - expected ${profile.sha256}, got ${sha256} !!`
    );
  }

  return { sha256, pinned: true };
}

async function hen_fetch(profile) {
  const source = hen_source(profile);

  if (hen_state.cache.has(source)) {
    return hen_state.cache.get(source);
  }

  logger.info(`fetching ${profile.name} from ${source}`);

  const response = await fetch(source, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`${profile.name} fetch failed: HTTP ${response.status}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());

  logger.info(`${profile.name}: ${bytes.length} bytes`);

  hen_state.cache.set(source, bytes);

  return bytes;
}
//#endregion

//#region Load
// Addresses this process can hand to a payload that imports them.
//
// An observable process image is not a linker: only functions whose address the
// chain has already proved are offered, and nothing is ever substituted for
// something else. An import that is not here is left alone and reported, which
// is why load_elf takes a report object.
function hen_imports() {
  const out = {};

  const place = (name, base, prop) => {
    try {
      if (base === undefined || base === null) return;

      const offset = constants[prop];

      if (typeof offset !== "number") return;

      out[name] = base.add(offset);
    } catch (e) {
      logger.debug(`hen: no address for ${name} (${e.message})`);
    }
  };

  place("strerror", typeof libc_base === "undefined" ? undefined : libc_base, "c_strerror");
  place("_error", typeof libkernel_base === "undefined" ? undefined : libkernel_base, "k__error");
  place(
    "pthread_create",
    typeof webkit_base === "undefined" ? undefined : webkit_base,
    "wk_pthread_create"
  );

  // The loader already resolved pthread_create once, and it may have come from
  // the WebKit GOT rather than the shipped table. That answer is better.
  try {
    if (fn !== undefined && fn.pthread_create !== undefined && fn.pthread_create.addr instanceof BInt) {
      out.pthread_create = fn.pthread_create.addr;
    }
  } catch (e) {
    // no loader in this context yet
  }

  return out;
}

function hen_available() {
  return (
    typeof fn.mmap !== "undefined" &&
    typeof fn.pthread_create !== "undefined" &&
    typeof constants.ready === "boolean" &&
    constants.ready
  );
}

// Starts an open source HEN payload. Assumes the kernel side of the chain has
// already run: a HEN needs kernel patches in place before its ELF image is
// worth mapping.
async function hen_load(id, opts = {}) {
  const profile = hen_state.get(id === undefined ? hen_state.selected : id);

  if (profile.kernel && !hen_available()) {
    throw new Error(
      `${profile.name} needs the kernel stage - unresolved constants: ${constants.missing().join(", ")}`
    );
  }

  const bytes = await hen_fetch(profile);
  const info = await hen_verify(profile, bytes);

  logger.info(`loading ${profile.name} (${info.format}, ${info.type}, ${info.segments} segment(s))`);

  const report = {};
  let result;

  if (info.format === HEN_FORMATS.ELF) {
    const imports = hen_imports();

    logger.debug(`offering ${Object.keys(imports).length} import(s) to ${profile.name}`);

    result = load_elf(bytes, { exit: opts.exit === true, imports, report });
  } else {
    result = load_bin(bytes, opts.exit === true);
  }

  hen_state.loaded = Object.assign({}, info, {
    id,
    profile: profile.name,
    started_at: result,
    report,
  });

  if (report.unresolved !== undefined && report.unresolved.length !== 0) {
    logger.error(
      `${profile.name} imports ${report.unresolved.join(", ")}, which this build cannot place - ` +
        `those GOT slots are zero and the payload may fault`
    );
  }

  logger.info(`${profile.name} started at ${result} !!`);

  return hen_state.loaded;
}

// Warms the HTTP cache for every reachable profile so a HEN can be started
// without a round trip once the chain has run. Verification runs here too, so a
// payload that is the wrong container - or does not match its pinned hash - is
// reported before the chain is committed to rather than after.
async function hen_prefetch(ids) {
  const targets = ids === undefined ? Object.keys(hen_state.all()) : ids;
  const out = {};

  for (const id of targets) {
    try {
      const profile = hen_state.get(id);
      const bytes = await hen_fetch(profile);
      const info = await hen_verify(profile, bytes);

      out[id] = {
        ok: true,
        bytes: bytes.length,
        format: info.format,
        type: info.type,
        segments: info.segments,
        sha256: info.sha256 === undefined ? null : info.sha256,
        pinned: info.pinned === true,
      };
    } catch (e) {
      out[id] = { ok: false, error: e.message };
      logger.debug(`hen: ${id} unavailable (${e.message})`);
    }
  }

  return out;
}

function hen_status() {
  const out = { selected: hen_state.selected, loaded: hen_state.loaded, profiles: {} };

  for (const [id, profile] of Object.entries(hen_state.all())) {
    out.profiles[id] = {
      name: profile.name,
      source: hen_source(profile),
      format: profile.format,
      pinned: profile.sha256 !== undefined && profile.sha256 !== null,
      cached: hen_state.cache.has(hen_source(profile)),
      bytes: hen_state.cache.has(hen_source(profile)) ? hen_state.cache.get(hen_source(profile)).length : 0,
    };
  }

  return out;
}
//#endregion
