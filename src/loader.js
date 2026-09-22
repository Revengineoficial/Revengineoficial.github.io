//#region Contants
const PF_X = 1;
const PF_W = 2;
const PF_R = 4;

const PROT_READ = 1;
const PROT_WRITE = 2;
const PROT_EXEC = 4;

const ET_DYN = 3;
const ET_EXEC = 2;

const MAP_SHARED = 1;
const MAP_PRIVATE = 2;
const MAP_FIXED = 0x10;
const MAP_ANONYMOUS = 0x1000;

const PT_LOAD = 1;
const SHT_RELA = 4;
const MADV_DONTNEED = 5;
const R_X86_64_RELATIVE = 8;

fn.munmap = new NativeFunction(0x49, "number");
fn.mprotect = new NativeFunction(0x4A, "number");
fn.madvise = new NativeFunction(0x4B, "number");
fn.mmap = new NativeFunction(0x1DD, "bint");
fn.jitshm_create = new NativeFunction(0x215, "number");
fn.mname = new NativeFunction(0x24C, "number");
fn.kexec = new NativeFunction(0x295, "number");
//#endregion Constants

//#region pthread_create
// Used to be a bare `webkit_base + constants.wk_pthread_create`. On firmware
// with no shipped constant that call is a jump into whatever happens to live at
// that offset, so the address is resolved in three steps now, most trustworthy
// first:
//   1. a value the runtime deriver already proved against this image
//   2. the WebKit GOT slot for `pthread_create`, read out of the live module
//   3. the shipped constant, for the firmware ranges it was verified on
function init_pthread_create() {
  if (constants.is_derived("wk_pthread_create")) {
    const addr = webkit_base.add(constants.wk_pthread_create);
    logger.info(`pthread_create from derivation: ${addr}`);
    fn.pthread_create = new NativeFunction(addr, "number");
    return;
  }

  if (typeof Elf64 !== "undefined") {
    try {
      const target = Elf64.from_memory(webkit_base).got_target("pthread_create");

      if (target !== undefined) {
        logger.info(`pthread_create from the WebKit GOT: ${target}`);
        fn.pthread_create = new NativeFunction(target, "number");
        return;
      }
    } catch (e) {
      logger.debug(`GOT lookup for pthread_create failed: ${e.message}`);
    }
  }

  try {
    const offset = constants.wk_pthread_create;
    logger.info(`pthread_create from the shipped table: +0x${offset.toString(16)}`);
    fn.pthread_create = new NativeFunction(webkit_base.add(offset), "number");
  } catch (e) {
    throw new Error(
      `Unable to resolve pthread_create (${e.message}) - run derive_all() before loading a payload`
    );
  }
}

init_pthread_create();
//#endregion

//#region Functions
// Flat payload: page aligned anonymous mapping, copied in, started on a thread.
// This is the original path and the one a .bin that is not an ELF still takes.
function load_bin(data, exit) {
  const sz = data.length.alignUp(PAGE_SIZE);
  const prot = PROT_READ | PROT_WRITE | PROT_EXEC;
  const flags = MAP_PRIVATE | MAP_ANONYMOUS;

  const entry_addr = fn.mmap.invoke(0, sz, prot, flags, -1, 0);
  logger.debug(`entry_addr: ${entry_addr}`);
  if (entry_addr.eq(-1)) {
    throw new SyscallError(`Unable to map memory with size ${sz} !!`);
  }

  mem.copy(entry_addr, data.buffer.data(), data.length);

  const pthread_addr_addr = mem.alloc(8);

  if (fn.pthread_create.invoke(pthread_addr_addr, 0, entry_addr, 0)) {
    throw new Error(`Unable to create bin thread !!`);
  }

  const pthread_addr = arw.view(pthread_addr_addr).getBInt(0, true);
  const pthread_id = arw.view(pthread_addr).getBInt(0, true);

  logger.info(`Created bin thread with id ${pthread_id} !!`);

  mem.free(pthread_addr_addr);

  if (exit) {
    fn.kill = new NativeFunction(0x25, "bigint");

    const pid = fn.getpid.invoke();

    fn.kill.invoke(pid, 9);
  }

  return entry_addr;
}

// Dispatcher used by everything that starts a payload. Open source HEN images
// are ELFs and need segment mapping plus relocations; anything else keeps the
// flat behaviour.
//
// Accepts either a boolean (exit) or an options object, so a caller that has an
// import table to offer can hand it over.
function load_payload(data, opts) {
  const options = typeof opts === "boolean" || opts === undefined ? { exit: opts === true } : opts;

  if (data.length >= 4 && Elf64.is_elf(data)) {
    logger.info("payload is an ELF image");

    return load_elf(data, options);
  }

  logger.info("payload is a flat blob");

  return load_bin(data, options.exit === true);
}
//#endregion
