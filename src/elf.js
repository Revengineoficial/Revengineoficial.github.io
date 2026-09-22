//#region ELF64 constants
const ELF_MAGIC = [0x7f, 0x45, 0x4c, 0x46];

const ELFCLASS64 = 2;
const ELFDATA2LSB = 1;

const ELF_ET_EXEC = 2;
const ELF_ET_DYN = 3;

const ELF_PT_LOAD = 1;
const ELF_PT_DYNAMIC = 2;

const ELF_EM_X86_64 = 62;

const ELF_PF_X = 1;
const ELF_PF_W = 2;
const ELF_PF_R = 4;

const ELF_DT_NULL = 0;
const ELF_DT_PLTRELSZ = 2;
const ELF_DT_HASH = 4;
const ELF_DT_STRTAB = 5;
const ELF_DT_SYMTAB = 6;
const ELF_DT_RELA = 7;
const ELF_DT_RELASZ = 8;
const ELF_DT_RELAENT = 9;
const ELF_DT_STRSZ = 10;
const ELF_DT_SYMENT = 11;
const ELF_DT_PLTREL = 20;
const ELF_DT_JMPREL = 23;
const ELF_DT_GNU_HASH = 0x6ffffef5;

const ELF_R_X86_64_64 = 1;
const ELF_R_X86_64_GLOB_DAT = 6;
const ELF_R_X86_64_JUMP_SLOT = 7;
const ELF_R_X86_64_RELATIVE = 8;

const ELF_STT_OBJECT = 1;
const ELF_STT_FUNC = 2;

const ELF_STB_WEAK = 2;

const ELF64_EHDR_SIZE = 0x40;
const ELF64_PHDR_SIZE = 56;

// Ceilings for the variable-length tables. A payload is untrusted input: a
// crafted DT_RELASZ or .gnu.hash must not be able to turn into a multi-gigabyte
// loop or a read far outside the image. These are generous - real WebKit images
// stay well under them - and anything above is refused outright.
const ELF_MAX_PHDRS = 0x100;
const ELF_MAX_SYMBOLS = 0x80000;
const ELF_MAX_RELOCS = 0x40000;
const ELF_MAX_STRTAB = 0x1000000;
const ELF_MAX_BUCKETS = 0x100000;

// Loader-local mappings, deliberately independent of loader.js so this file can
// be evaluated before it.
const ELF_PROT_READ = 1;
const ELF_PROT_WRITE = 2;
const ELF_PROT_EXEC = 4;
const ELF_MAP_SHARED = 1;
const ELF_MAP_PRIVATE = 2;
const ELF_MAP_FIXED = 0x10;
const ELF_MAP_ANONYMOUS = 0x1000;
//#endregion

//#region Reader
// Uniform byte access over either a Uint8Array (payload on disk) or the target
// address space (a module we already have arw against).
// Address-space reads go through a backend so the same parser works before and
// after the arw primitive exists: ps4/derive.js passes an rw-backed reader while
// only the usermode UAF is available, everything else uses the fast arw path.
const ELF_DEFAULT_BACKEND = (addr, len) => new Uint8Array(ArrayBuffer.from(addr, len));

class ElfReader {
  constructor(bytes, base, backend) {
    this.bytes = bytes || null;
    this.base = base || null;
    this.backend = backend || ELF_DEFAULT_BACKEND;

    if (this.bytes === null && this.base === null) {
      throw new Error("ElfReader needs bytes or a base address !!");
    }
  }

  static from_bytes(bytes) {
    return new ElfReader(bytes, null, null);
  }

  static from_memory(base, backend) {
    return new ElfReader(null, new BInt(base), backend);
  }

  get is_memory() {
    return this.bytes === null;
  }

  get length() {
    return this.is_memory ? 0 : this.bytes.length;
  }

  // Ceiling on how much of the image a read may claim. A file-backed reader
  // knows its extent, so anything past it is a malformed header or a truncated
  // download and has to be an error rather than a silently clamped subarray.
  // A live module has no known extent, so memory-backed readers skip the check
  // and let the backend fault.
  require_range(offset, len) {
    if (this.is_memory) return;

    if (offset < 0 || len < 0 || offset + len > this.bytes.length) {
      throw new Error(
        `ELF read out of bounds: ${len} bytes at 0x${offset.toString(16)} ` +
          `(image is ${this.bytes.length} bytes) !!`
      );
    }
  }

  // Longest read that can still be satisfied starting at `offset`. Memory-backed
  // readers have no known extent, so they report infinity and leave the ceiling
  // to whichever table limit the caller is applying.
  available(offset) {
    if (this.is_memory) return Infinity;

    return offset >= this.bytes.length ? 0 : this.bytes.length - offset;
  }

  // Raw copy of `len` bytes at `offset`, relative to the reader's origin.
  raw(offset, len) {
    if (this.is_memory) {
      return this.backend(this.base.add(offset), len);
    }

    this.require_range(offset, len);

    return this.bytes.subarray(offset, offset + len);
  }

  u8(offset) { return this.raw(offset, 1)[0]; }

  // subarray() keeps the parent buffer, so every wider read has to honour
  // byteOffset instead of building a view from the start of the buffer.
  view(offset, len) {
    const bytes = this.raw(offset, len);
    return new DataView(bytes.buffer, bytes.byteOffset, len);
  }

  u16(offset) { return this.view(offset, 2).getUint16(0, true); }
  u32(offset) { return this.view(offset, 4).getUint32(0, true); }
  s32(offset) { return this.view(offset, 4).getInt32(0, true); }

  u64(offset) {
    const view = this.view(offset, 8);
    return new BInt(view.getUint32(4, true), view.getUint32(0, true));
  }

  // Absolute address of a reader-relative offset.
  addr(offset) {
    if (!this.is_memory) {
      throw new Error("Reader is not memory-backed !!");
    }

    return this.base.add(offset);
  }

  cstr_at(offset) {
    if (this.is_memory) {
      return String.from(this.base.add(offset));
    }

    let end = offset;
    while (end < this.bytes.length && this.bytes[end] !== 0) {
      end++;
    }

    let out = "";
    for (let i = offset; i < end; i++) {
      out += String.fromCharCode(this.bytes[i]);
    }

    return out;
  }
}
//#endregion

//#region ELF64
// Minimal, read-only ELF64 parser good enough to resolve dynamic symbols and
// relocations out of a live module, or to drive the payload loader below.
class Elf64 {
  constructor(reader) {
    this.reader = reader;
    this.segments = [];
    this.dyn = new Map();
    this._symbols = null;
    this._strtab = null;

    this.parse_header();
    this.parse_program_headers();
    this.parse_dynamic();
  }

  static is_elf(bytes) {
    if (bytes.length < 4) return false;

    for (let i = 0; i < 4; i++) {
      if (bytes[i] !== ELF_MAGIC[i]) return false;
    }

    return true;
  }

  static from_bytes(bytes) {
    return new Elf64(ElfReader.from_bytes(bytes));
  }

  static from_memory(base, backend) {
    return new Elf64(ElfReader.from_memory(base, backend));
  }

  parse_header() {
    const r = this.reader;

    r.require_range(0, ELF64_EHDR_SIZE);

    if (!Elf64.is_elf(r.raw(0, 4))) {
      throw new Error("Not an ELF image !!");
    }

    if (r.u8(4) !== ELFCLASS64) {
      throw new Error("Only ELF64 is supported !!");
    }

    if (r.u8(5) !== ELFDATA2LSB) {
      throw new Error("Only little endian ELF is supported !!");
    }

    this.type = r.u16(0x10);
    this.machine = r.u16(0x12);
    this.entry = r.u64(0x18);
    this.phoff = r.u64(0x20);
    this.phentsize = r.u16(0x36);
    this.phnum = r.u16(0x38);

    if (this.machine !== ELF_EM_X86_64) {
      throw new Error(`Unsupported ELF machine 0x${this.machine.toString(16)} !!`);
    }

    // e_phentsize is fixed by the ABI for ELF64. Refusing anything else keeps a
    // bogus stride from walking the parser through the image at 64K steps.
    if (this.phnum !== 0 && this.phentsize !== ELF64_PHDR_SIZE) {
      throw new Error(`Bogus e_phentsize ${this.phentsize} (expected ${ELF64_PHDR_SIZE}) !!`);
    }

    if (this.phnum > ELF_MAX_PHDRS) {
      throw new Error(`Bogus e_phnum ${this.phnum} (limit ${ELF_MAX_PHDRS}) !!`);
    }

    r.require_range(this.phoff.u, this.phnum * ELF64_PHDR_SIZE);
  }

  parse_program_headers() {
    const r = this.reader;
    const phoff = this.phoff.u;

    for (let i = 0; i < this.phnum; i++) {
      const off = phoff + i * ELF64_PHDR_SIZE;

      const seg = {
        type: r.u32(off),
        flags: r.u32(off + 4),
        offset: r.u64(off + 8),
        vaddr: r.u64(off + 0x10),
        paddr: r.u64(off + 0x18),
        filesz: r.u64(off + 0x20),
        memsz: r.u64(off + 0x28),
        align: r.u64(off + 0x30),
      };

      this.segments.push(seg);
    }
  }

  get loads() {
    return this.segments.filter((s) => s.type === ELF_PT_LOAD);
  }

  parse_dynamic() {
    const dynamic = this.segments.find((s) => s.type === ELF_PT_DYNAMIC);
    if (dynamic === undefined) return;

    const r = this.reader;
    // In an image on disk PT_DYNAMIC carries a file offset; in a live module the
    // dynamic array is mapped at its virtual address.
    const start = this.reader.is_memory ? dynamic.vaddr.u : dynamic.offset.u;
    const count = Math.floor(dynamic.filesz.u / 16);

    for (let i = 0; i < count; i++) {
      const off = start + i * 16;
      const tag = r.u64(off);
      const val = r.u64(off + 8);

      if (tag.eq(ELF_DT_NULL)) break;

      this.dyn.set(tag.u, val);
    }
  }

  dtag(tag) {
    const value = this.dyn.get(tag);
    return value === undefined ? undefined : value;
  }

  // Map a virtual address to a reader-relative offset through the segment table.
  vaddr_to_offset(va) {
    for (const seg of this.loads) {
      if (va.gte(seg.vaddr) && va.lt(seg.vaddr.add(seg.filesz))) {
        return va.sub(seg.vaddr).add(seg.offset);
      }
    }

    // Images whose first PT_LOAD sits at 0/0 map identically.
    return va;
  }

  // Dynamic entries are virtual addresses in both readers: absolute in a live
  // module, image relative in a file. Normalise to a reader-relative offset.
  dyn_offset(value) {
    if (this.reader.is_memory) return value.sub(this.base);

    return this.vaddr_to_offset(value);
  }

  // Absolute base address of the loaded image (0 for a file-backed reader).
  get base() {
    return this.reader.is_memory ? this.reader.base : new BInt(0);
  }

  strtab() {
    if (this._strtab !== null) return this._strtab;

    const offset = this.dtag(ELF_DT_STRTAB);

    if (offset === undefined) {
      this._strtab = null;
      return null;
    }

    const start = this.dyn_offset(offset);

    // DT_STRSZ is attacker-controlled when the payload is: clamp it to the image
    // and to a sane ceiling instead of trusting it.
    const declared = this.dtag(ELF_DT_STRSZ);
    const size = Math.min(
      declared === undefined ? 0x10000 : declared.u,
      this.reader.available(start.u),
      ELF_MAX_STRTAB
    );

    const buf = this.reader.raw(start.u, size);
    this._strtab = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);

    return this._strtab;
  }

  // Number of symbol table entries; DT_SYMTAB carries no size, so it has to be
  // recovered from whichever hash table the module ships.
  symbol_count() {
    const symtab = this.dtag(ELF_DT_SYMTAB);
    if (symtab === undefined) return 0;

    const symtab_off = this.dyn_offset(symtab).u;

    const hash = this.dtag(ELF_DT_HASH);
    if (hash !== undefined) {
      const hash_off = this.dyn_offset(hash).u;
      const nchain = this.reader.u32(hash_off + 4);
      if (nchain !== 0) return nchain;
    }

    const gnu = this.dtag(ELF_DT_GNU_HASH);
    if (gnu !== undefined) {
      const gnu_off = this.dyn_offset(gnu).u;
      const r = this.reader;

      const nbuckets = r.u32(gnu_off);
      const symbias = r.u32(gnu_off + 4);
      const bloom_size = r.u32(gnu_off + 8);

      // A crafted hash table must not be able to size the symbol walk. Give up
      // on the count rather than looping; symbols() then reports an empty table.
      if (nbuckets > ELF_MAX_BUCKETS || bloom_size > ELF_MAX_BUCKETS || symbias > ELF_MAX_SYMBOLS) {
        logger.debug(`gnu hash is not credible on this image (buckets ${nbuckets}, bloom ${bloom_size})`);
        return 0;
      }

      const buckets_off = gnu_off + 16 + bloom_size * 8;

      let max_index = 0;

      for (let i = 0; i < nbuckets; i++) {
        const b = r.u32(buckets_off + i * 4);
        if (b > max_index) max_index = b;
      }

      if (max_index === 0) {
        return symbias;
      }

      // Walk the chain of the last bucket to find the end of the symbol table.
      const chains_off = buckets_off + nbuckets * 4;

      let index = max_index;
      let guard = 0;

      while (guard++ < ELF_MAX_SYMBOLS) {
        const chain = r.u32(chains_off + (index - symbias) * 4);
        if ((chain & 1) !== 0) break;
        index++;
      }

      return Math.min(index + 1, ELF_MAX_SYMBOLS);
    }

    return 0;
  }

  symbols() {
    if (this._symbols !== null) return this._symbols;

    const strtab = this.strtab();
    const symtab = this.dtag(ELF_DT_SYMTAB);

    if (strtab === null || symtab === undefined) {
      this._symbols = [];
      return this._symbols;
    }

    const symtab_off = this.dyn_offset(symtab).u;
    const ent = this.dtag(ELF_DT_SYMENT);
    const entsize = ent === undefined ? 24 : ent.u;

    // DT_SYMTAB carries no size, so the count comes from the hash table - and a
    // hash table inside a payload is not trustworthy. Cap it by what the image
    // actually holds as well.
    const declared = this.symbol_count();
    const count = Math.min(
      declared,
      Math.floor(this.reader.available(symtab_off) / entsize),
      ELF_MAX_SYMBOLS
    );

    const out = [];

    for (let i = 0; i < count; i++) {
      const off = symtab_off + i * entsize;

      const st_name = this.reader.u32(off);
      const st_info = this.reader.u8(off + 4);
      const st_shndx = this.reader.u16(off + 6);
      const st_value = this.reader.u64(off + 8);
      const st_size = this.reader.u64(off + 0x10);

      // st_name indexes the string table, which is already loaded in full.
      if (st_name === 0 || st_name >= strtab.length) continue;

      let end = st_name;
      while (end < strtab.length && strtab[end] !== 0) end++;

      let name = "";
      for (let k = st_name; k < end; k++) name += String.fromCharCode(strtab[k]);

      out.push({
        name,
        value: st_value,
        size: st_size,
        // SHN_UNDEF: the symbol is only referenced here, the definition lives in
        // another module. That is exactly the set the payload loader has to
        // resolve out of the target's own address space.
        defined: st_shndx !== 0,
        type: st_info & 0xf,
        bind: st_info >>> 4,
        index: i,
      });
    }

    this._symbols = out;
    return out;
  }

  // Absolute address of a defined symbol, or undefined when the module only
  // imports it (in which case use got()).
  resolve(name) {
    const sym = this.symbols().find((s) => s.name === name);
    if (sym === undefined || !sym.defined || sym.value.eq(0)) return undefined;

    return this.reader.is_memory ? this.base.add(sym.value) : sym.value;
  }

  // All relocation entries from DT_RELA and DT_JMPREL, normalised to
  // reader-relative offsets.
  relocations() {
    const out = [];
    const ela_ent = this.dtag(ELF_DT_RELAENT);
    const entsize = ela_ent === undefined ? 24 : ela_ent.u;

    const collect = (table, size) => {
      if (table === undefined || size === undefined) return;
      if (entsize === 0) return;

      const start = this.dyn_offset(table).u;

      // The table size is read from the image, so it is capped twice: by the
      // image extent and by a hard ceiling.
      const count = Math.min(
        Math.floor(size.u / entsize),
        Math.floor(this.reader.available(start) / entsize),
        ELF_MAX_RELOCS
      );

      for (let i = 0; i < count; i++) {
        const off = start + i * entsize;

        out.push({
          offset: this.reader.u64(off),
          info: this.reader.u64(off + 8),
          addend: this.reader.u64(off + 0x10),
        });
      }
    };

    collect(this.dtag(ELF_DT_RELA), this.dtag(ELF_DT_RELASZ));
    collect(this.dtag(ELF_DT_JMPREL), this.dtag(ELF_DT_PLTRELSZ));

    return out;
  }

  // Address of the GOT slot that the loader filled in for an imported symbol.
  // This is what the exploit code calls `__imp_<name>`.
  got(name) {
    const target = this.symbols().find((s) => s.name === name);
    if (target === undefined) return undefined;

    const rel = this.relocations().find((r) => {
      const sym_index = r.info.shr(32).u;
      const type = r.info.and(0xffffffff).u;

      if (sym_index !== target.index) return false;

      return (
        type === ELF_R_X86_64_GLOB_DAT ||
        type === ELF_R_X86_64_JUMP_SLOT ||
        type === ELF_R_X86_64_64
      );
    });

    if (rel === undefined) return undefined;

    return this.reader.is_memory ? this.base.add(rel.offset) : rel.offset;
  }

  // Absolute address of the code a GOT slot points at (the imported function
  // itself), read out of the live image.
  got_target(name) {
    const slot = this.got(name);
    if (slot === undefined) return undefined;

    const offset = this.reader.is_memory ? slot.sub(this.base).u : this.vaddr_to_offset(slot).u;
    const value = this.reader.u64(offset);

    return value.eq(0) ? undefined : value;
  }

  // Executable byte ranges as reader-relative offsets, for gadget scanning.
  text_ranges() {
    return this.loads
      .filter((s) => (s.flags & ELF_PF_X) !== 0)
      .map((s) => ({
        // reader-relative: virtual address for a live module, file offset for
        // an image on disk
        offset: this.reader.is_memory ? s.vaddr.u : s.offset.u,
        vaddr: s.vaddr.u,
        size: s.filesz.u,
      }));
  }
}
//#endregion

//#region Module discovery
// Walk down page-aligned addresses from a known code/data pointer until the ELF
// header of the owning module shows up. Removes any need for a hardcoded
// "vtable offset" constant to establish webkit_base.
function find_module_base(addr, backend, max_pages = 0x8000, align = 0x1000) {
  const read = typeof backend === "function" ? backend : ELF_DEFAULT_BACKEND;
  const page = new BInt(align);
  let probe = new BInt(addr).alignDown(align);

  for (let i = 0; i < max_pages; i++) {
    try {
      const hdr = read(probe, 0x40);

      const is_elf =
        hdr[0] === ELF_MAGIC[0] &&
        hdr[1] === ELF_MAGIC[1] &&
        hdr[2] === ELF_MAGIC[2] &&
        hdr[3] === ELF_MAGIC[3];

      if (is_elf) {
        // Sanity: a real ELF64 header has the machine field set to x86-64.
        const view = new DataView(hdr.buffer, hdr.byteOffset, 0x40);

        if (view.getUint8(4) === ELFCLASS64 && view.getUint16(0x12, true) === ELF_EM_X86_64) {
          return probe;
        }
      }
    } catch (e) {
      // unreadable page, keep walking
    }

    if (probe.lte(page)) break;
    probe = probe.sub(page);
  }

  return undefined;
}
//#endregion

//#region Payload loader
// Loads an ET_DYN/ET_EXEC x86-64 ELF into the target's address space, applies
// R_X86_64_RELATIVE relocations and starts its entry point on a new thread.
// This is what open source HEN payloads (GoldHEN, PS4HEN, ...) need: they ship
// as ELFs, not as flat blobs.
function load_elf(data, opts = {}) {
  const elf = Elf64.from_bytes(data);
  const loads = elf.loads;

  if (loads.length === 0) {
    throw new Error("ELF has no PT_LOAD segments !!");
  }

  // Refuse a segment that points outside the image before anything is mapped. A
  // truncated download would otherwise be copied together with whatever follows
  // the buffer, and subarray() would clamp the file offset without a word.
  for (const seg of loads) {
    const end = seg.offset.add(seg.filesz);

    if (end.gt(data.length)) {
      throw new Error(
        `ELF segment is outside the image: file [0x${seg.offset.toString(16)}..0x${end.toString(16)}] ` +
          `but the payload is ${data.length} bytes !!`
      );
    }

    if (seg.memsz.lt(seg.filesz)) {
      throw new Error("ELF segment declares memsz < filesz !!");
    }
  }

  const page = PAGE_SIZE;
  const prot = ELF_PROT_READ | ELF_PROT_WRITE | ELF_PROT_EXEC;

  let base;

  if (elf.type === ELF_ET_DYN) {
    // Position independent: ask for anonymous memory and use whatever address
    // the kernel hands back as the load bias.
    let total = 0;

    for (const seg of loads) {
      const end = seg.vaddr.add(seg.memsz).alignUp(page).u;
      if (end > total) total = end;
    }

    base = fn.mmap.invoke(0, total, prot, ELF_MAP_PRIVATE | ELF_MAP_ANONYMOUS, -1, 0);

    if (base.eq(-1)) {
      throw new SyscallError(`Unable to map ${total} bytes for ELF image !!`);
    }
  } else {
    // Absolute image: place segments at their declared virtual addresses.
    base = new BInt(0);
  }

  for (const seg of loads) {
    const vaddr = base.add(seg.vaddr);
    const map_addr = vaddr.alignDown(page);
    const skew = vaddr.sub(map_addr);
    const size = skew.add(seg.memsz).alignUp(page);

    if (elf.type === ELF_ET_EXEC) {
      const got = fn.mmap.invoke(map_addr, size, prot, ELF_MAP_SHARED | ELF_MAP_FIXED, -1, 0);

      if (got.eq(-1)) {
        throw new SyscallError(`Unable to map segment at ${map_addr} !!`);
      }
    }

    if (seg.filesz.u !== 0) {
      const src = data.subarray(seg.offset.u, seg.offset.u + seg.filesz.u);

      // mem.copy takes addresses, not array indices: keep the BInt.
      mem.copy(map_addr.add(skew), src.buffer.data().add(src.byteOffset), seg.filesz.u);
    }

    if (seg.memsz.u > seg.filesz.u) {
      mem.bset(map_addr.add(skew).add(seg.filesz), seg.memsz.u - seg.filesz.u, 0);
    }
  }

  // Relocations. R_X86_64_RELATIVE fixes up the image bias; GLOB_DAT, JUMP_SLOT
  // and 64 are imports, which are filled from the caller's table. An import with
  // no address in this process is reported, never guessed at - a wrong function
  // pointer is a jump into nothing.
  const imports = opts.imports === undefined || opts.imports === null ? {} : opts.imports;

  let relative = 0;
  let imported = 0;

  const unresolved = [];

  for (const rel of elf.relocations()) {
    const type = rel.info.and(0xffffffff).u;
    const sym_index = rel.info.shr(32).u;

    if (type === ELF_R_X86_64_RELATIVE) {
      // Only a position independent image is loaded at a bias, so only it has
      // relative relocations worth applying.
      if (elf.type !== ELF_ET_DYN) continue;

      arw.view(base.add(rel.offset)).setBInt(0, base.add(rel.addend), true);
      relative++;
      continue;
    }

    if (
      type !== ELF_R_X86_64_GLOB_DAT &&
      type !== ELF_R_X86_64_JUMP_SLOT &&
      type !== ELF_R_X86_64_64
    ) {
      continue;
    }

    const sym = elf.symbols().find((s) => s.index === sym_index);
    const name = sym === undefined ? `symbol#${sym_index}` : sym.name;
    const slot = imports[name];

    if (slot === undefined) {
      // A weak reference is defined to resolve to zero.
      if (sym !== undefined && sym.bind === ELF_STB_WEAK) {
        arw.view(base.add(rel.offset)).setBInt(0, new BInt(0), true);
        continue;
      }

      if (unresolved.indexOf(name) === -1) unresolved.push(name);
      continue;
    }

    const value = rel.addend.eq(0) ? slot : slot.add(rel.addend);

    arw.view(base.add(rel.offset)).setBInt(0, value, true);
    imported++;
  }

  logger.debug(`applied ${relative} relative and ${imported} symbol relocations`);

  if (unresolved.length !== 0) {
    logger.error(`ELF imports with no address in this process: ${unresolved.join(", ")}`);
  }

  const entry = base.add(elf.entry);
  logger.info(`ELF entry: ${entry}`);

  const pthread_addr_addr = mem.alloc(8);

  if (fn.pthread_create.invoke(pthread_addr_addr, 0, entry, 0)) {
    throw new Error("Unable to create ELF thread !!");
  }

  const pthread_addr = arw.view(pthread_addr_addr).getBInt(0, true);
  const pthread_id = arw.view(pthread_addr).getBInt(0, true);

  logger.info(`Created ELF thread with id ${pthread_id} !!`);

  mem.free(pthread_addr_addr);

  if (opts.exit) {
    fn.kill = new NativeFunction(0x25, "bigint");
    fn.kill.invoke(fn.getpid.invoke(), 9);
  }

  // Optional out-parameter: the caller gets what the load actually did without
  // the return value having to change shape.
  if (opts.report !== undefined && opts.report !== null) {
    opts.report.format = "elf";
    opts.report.type =
      elf.type === ELF_ET_DYN ? "ET_DYN" : elf.type === ELF_ET_EXEC ? "ET_EXEC" : `type ${elf.type}`;
    opts.report.base = base;
    opts.report.entry = entry;
    opts.report.segments = loads.length;
    opts.report.relative = relative;
    opts.report.imported = imported;
    opts.report.unresolved = unresolved;
  }

  return entry;
}
//#endregion
