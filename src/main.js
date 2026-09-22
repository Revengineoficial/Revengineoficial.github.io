// Scripts already on the page must not be evaluated twice: every file here
// declares top level `const`s, and a second evaluation would throw.
const loaded_scripts = new Set(
  Array.from(document.querySelectorAll("script[src]")).map((tag) => tag.getAttribute("src"))
);

function load_script(src, remote = true, transfer = []) {
  if (loaded_scripts.has(src)) {
    return Promise.resolve();
  }

  loaded_scripts.add(src);

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Every piece of state the page needs after a run, for the UI and for poking
// from the console.
const jb = {
  stage: "idle",
  rw: undefined,
  report: undefined,
  hen: undefined,
  set(stage) {
    this.stage = stage;
    logger.debug(`stage: ${stage}`);
  },
};

// The kernel stage needs the firmware's patch shellcode and kernel offsets.
// Those are hand written per firmware, so a derived-but-unpatched unit reports
// what is missing instead of calling into an offset that does not exist.
function kernel_stage_available() {
  if (version.is_supported) return true;

  return constants.is_derived("KPATCH") && constants.is_derived("SYSENT_661");
}

async function doJb() {
  await load_script("src/version.js");
  await load_script("src/misc.js");

  version.init();

  await load_script("src/elf.js");
  await load_script("src/hen.js");

  if (version.is_unsupported) {
    logger.error(`Console ${version.console} is not supported by this build`);
    return;
  }

  try {
    switch (version.console) {
      case 4:
        await load_script("src/ps4/constants.js");
        await load_script("src/ps4/userland.js");

        if (version.is_derivable) {
          await load_script("src/ps4/derive.js");
        }

        break;
      case 5:
        // PS5 needs an ASLR defeat and vtable recovery before this chain is
        // usable at all.
        logger.error("PlayStation 5 is not supported by this chain (see README)");
        return;
      default:
        logger.error(`Unsupported console ${version.console}`);
        return;
    }

    logger.info("===USERLAND===");
    jb.set("userland");

    let rw = undefined;

    if (arw.master === undefined) {
      rw = await init_rw();
      jb.rw = rw;
    } else if (version.is_derivable) {
      throw new Error("worker-accelerated runs cannot derive offsets, disable the worker path");
    }

    // Derivation has to happen before init_arw, which is the first consumer of
    // the layout offsets. A table committed from an earlier run short circuits
    // the whole thing.
    if (version.is_derivable) {
      jb.set("derive-load");

      const reused = await derive_load_saved();

      if (reused) {
        logger.info("using the committed offset table, skipping runtime derivation");
      } else {
        jb.set("derive-a");
        jb.report = await derive_phase_a(rw);
      }

      jb.reused_table = reused;
    }

    init_arw(rw);
    init_rop();
    init_syscalls();

    if (version.is_derivable && !jb.reused_table) {
      jb.set("derive-b");
      jb.report = await derive_phase_b(rw);

      logger.info(derive_report_markdown());

      if (!constants.ready) {
        logger.error("derivation incomplete - stopping before the kernel stage");
        logger.error(`missing: ${constants.missing().join(", ")}`);
        return;
      }
    }

    logger.info("===END===");
    jb.set("kernel");

    await load_script("src/loader.js");
    await load_script("src/workers.js");

    if (version.console === 4) {
      await load_script("src/ps4/kernel.js");
    }

    await load_script(`src/${exploitChain}.js`);

    logger.info(`===${exploitChain.toUpperCase()}===`);

    try {
      if (exploitChain == "lapse") {
        init();
        await setup();
        await double_free_reqs2();
        leak_kaddrs();
        double_free_reqs1();
        make_karw();

        // Increase reference counts for the pipes
        inc_karw_pipe_refcnt();

        logger.info("Corrupted context cleanup started...");

        // Remove pktinfo pointers
        remove_pktinfo_from_so(pktopts_twins[0]);

        // Remove rthdr pointers
        remove_rthdr_from_so(pktopts_twins[1]);
        remove_rthdr_from_so(rthdr_twins[0]);

        logger.info("Corrupted context cleanup completed !!");
      } else {
        init();
        await setup();
        await ucred_triple_free();
        leak_kqueue();
        await make_karw();

        inc_karw_pipe_refcnt();

        logger.info("Corrupted context cleanup started...");

        // Remove rthdr pointers from triplets
        for (let i = 0; i < triplets.length; i++) {
          remove_rthdr_from_so(triplets[i]);
        }

        // Remove triple freed file from free list
        remove_uaf_file();

        logger.info("Corrupted context cleanup completed !!");
      }
    } finally {
      cleanup();
    }

    find_all_proc();

    // Avoid reapplying if already done
    if (fn.setuid.invoke(0) === -1) {
      jailbreak();

      if (!kernel_stage_available()) {
        logger.error("kernel patches unavailable for this firmware:");
        logger.error(`  ${constants.missing().join(", ")}`);
        logger.error("the unit is up to usermode read/write only - see README on porting the kernel stage");
        jb.set("usermode-only");
        return;
      }

      jb.set("patches");

      const kpatches_rsp = await fetch(`src/ps4/patches/${constants.KPATCH}`);
      const kpatches_buf = await kpatches_rsp.arrayBuffer();
      const kpatches_u8 = new Uint8Array(kpatches_buf);

      kernel_patches(kpatches_u8);

      jb.set("hen");

      try {
        jb.hen = await hen_load(hen_state.selected, { exit: false });
      } catch (e) {
        logger.error(`HEN load failed: ${e.message}`);
        logger.error("fall back: place an open source payload at src/payload.bin and retry");
      }
    }

    jb.set("done");
    logger.info("===END===");
  } catch (e) {
    logger.error(e.message);
    logger.error(e.stack);
    jb.set("failed");
    //mem.free_all();
  }
}
