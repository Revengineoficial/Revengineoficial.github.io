# Kernel patch shellcode

One position independent blob per firmware, applied by `kernel_patches()` in
`public/src/ps4/kernel.js`: it points sysent entry 661 at a `jmp qword ptr [rsi]`
gadget, maps the blob read/write/executable, calls it through the `kexec` syscall,
then puts the original handler back.

| firmware | blob | bytes | entry 11 (upstream) | entry 661 (here) | jmp rsi gadget | sha256 |
| :--- | :--- | ---: | ---: | ---: | ---: | :--- |
| 6.00 | `600.bin` | 245 | — | — | — | `0926e4aad37d` |
| 6.20 | `620.bin` | 245 | — | — | — | `e239de491039` |
| 6.50 | `650.bin` | 285 | — | — | — | `1083e8b16f1c` |
| 6.70 | `670.bin` | 285 | — | — | — | `589afd201592` |
| 7.00 | `700.bin` | 427 | — | — | — | `b2793ae0c589` |
| 7.50 | `750.bin` | 606 | — | — | — | `70bb383269fa` |
| 8.00 | `800.bin` | 589 | — | — | — | `aa30be1ce005` |
| 8.50 | `850.bin` | 589 | — | — | — | `889aeea9e4d4` |
| 9.00 | `900.bin` | 589 | 0x1100520 | 0x1107f00 | 0x4c7ad | `1645039fd48e` |
| 9.03 | `903.bin` | 589 | — | 0x1103f00 | 0x5325b | `779a980d04af` |
| 9.50 | `950.bin` | 589 | — | 0x1100ee0 | 0x15a6d | `d3d536b07cf9` |
| 10.00 | `1000.bin` | 589 | — | 0x110a980 | 0x68b1 | `954ff624c9c9` |
| 10.50 | `1050.bin` | 632 | — | 0x110a5b0 | 0x50ded | `fbf815d2d47a` |
| 11.00 | `1100.bin` | 632 | — | 0x1109350 | 0x71a21 | `15497a2b748d` |
| 11.02 | `1102.bin` | 632 | 0x1101970 | 0x1109350 | 0x71a21 | `4634f7bcdaee` |
| 11.50 / 11.52 | `1150.bin` | 320 | 0x1102d80 | 0x110a760 | 0x704d5 | `c2aacb2e4847` |
| 12.00 / 12.02 | `1200.bin` | 320 | 0x1102d80 | 0x110a760 | 0x47b31 | `05b19b101cff` |
| 12.50 / 12.52 | `1250.bin` | 320 | 0x1102d80 | 0x110a760 | 0x47b31 | `47c6832bea21` |
| 13.00 | `1300.bin` | 320 | 0x1102d80 | 0x110a760 | 0x47b31 | `eccbf55db75f` |
| 13.02 / 13.04 | `1302.bin` | 320 | 0x1102d80 | 0x110a760 | 0x47b31 | `251654104b67` |
| 13.50 | `1350.bin` | 320 | 0x1102d80 | 0x110a760 | 0x47b31 | `0e7c03afe969` |
| 13.52 | `1352.bin` | 320 | 0x1102d80 | 0x110a760 | 0x4d6d0 | `2b4fba5be837` |
| 14.00 | `1400.bin` | 320 | 0x1102d80 | 0x110a760 | 0x250be | `318790f89a56` |

Firmwares sharing a row share a blob: an upstream build that covers two revisions
means every code offset it patches is identical on both, which is a much stronger
statement than "close enough". 12.00 and 12.02 have the same kernel, 13.02 and
13.04 have the same kernel.

## Where the values come from

**6.00 to 11.02** shipped with this repository. They are untouched, and they are
`--` in the upstream columns above because the blob is the only place those
offsets appear in a form this repository can read.

**11.50 and newer** were added from two public sources, and both were checked
against the rows this repository already carried before anything was written
down:

* **The patch blobs and the jmp gadgets** - `Al-Azif/ps4-exploit-kpatches`
  (PSFree lineage, GNU AGPLv3). One blob per firmware; its `sysent_11_off` and
  its gadget site are read straight out of the source and independently
  confirmed against the compiled blob, by looking for both as displacements in
  the instruction stream (see `tests/firmware.test.js`).

* **`SYSENT_661` and `EVF_OFFSET`** - the public firmware table that this
  repository's own offsets come from, which publishes 11.50 through 13.52 and
  agrees to the byte with every `evf`, `sysent` and `jmp` row already in
  `constants.js` for 5.56 - 11.02.

* **Every row from 10.00 up, checked a second time** - `Scene-Collective/ps4-hen`,
  which publishes one offset file per firmware and added 14.00 support on
  2026-09-19. It names the sysent array's *entry 0* rather than an entry near
  this repository's, so its column is not comparable by eye; entry 661 is
  `SYSENT_addr + 661 * 0x30`, and computing it agrees with every `SYSENT_661`
  this repository ships from 10.00 through 14.00:

  | firmware | ps4-hen `SYSENT_addr` | + 661 entries | shipped here |
  | :--- | ---: | ---: | ---: |
  | 10.00 | `0x1102d90` | `0x110a980` | `0x110a980` |
  | 10.50 | `0x11029c0` | `0x110a5b0` | `0x110a5b0` |
  | 11.00 | `0x1101760` | `0x1109350` | `0x1109350` |
  | 11.02 | `0x1101760` | `0x1109350` | `0x1109350` |
  | 11.50 - 14.00 | `0x1102b70` | `0x110a760` | `0x110a760` |

  `tests/firmware.test.js` computes that column rather than pinning it, so a row
  that drifts is caught against the source, not against a copy of itself.

### A gadget that was one firmware out

The 13.52 row used to carry `0x47b31`, which is 13.50's. The two upstream sources
disagreed about 13.52 and nothing tied the shipped value to the shellcode that
ships with it - both were only ever compared against each other, and the row
followed the table. The blob settled it: `1352.bin` has `(0x4d6d0 - 0x1c0)`
folded into its instruction stream, and the offsets file published alongside a
13.52 BD-JB scanner lists `0x4D6D0` as its gadget site too. The row follows the
blob now, and the assertion that decides it - every shipped `JMP_RSI_GADGET` must
be present in its own blob as a displacement - is in the suite, so the next row
that disagrees with its shellcode fails instead of shipping.

### Why entry 11 plus a constant is entry 661

The upstream blobs patch sysent entry **11**; this repository patches entry
**661**. They are 650 entries apart, and an entry is `0x30` bytes:

```
650 * 0x30 == 0x79e0
```

So `sysent_11_off + 0x79e0` has to equal the table's `sysent` for every firmware
where both are known. It does, on 9.00, 11.02, 12.00 and 13.52 - the same
constant, four independent firmwares. The two sources also agree on the `jmp`
gadget for 11.50 through 13.50, which is what shows they share a kernel base and
that their offsets are directly interchangeable.

This is the arithmetic behind the 14.00 row, and it is asserted in
`tests/firmware.test.js` rather than left in a commit message.

### 14.00

`SYSENT_661` is `0x110a760`, the same value the table publishes for 12.00 through
13.52, because the upstream 14.00 blob carries the same `sysent_11_off` as its
12.00 through 13.52 blobs: the sysent array did not move across that range.
`JMP_RSI_GADGET` is `0x250be`, the site its 14.00 build installs and measured on
14.00. `1400.bin` is compiled from that source.

`EVF_OFFSET` is `0x784798`, **inferred** rather than published, and the reasoning
is short enough to check:

* `evf_cv` is a **data-section** object. `evf_cv_addr` points at the eight bytes
  spelling `evf cv`, so the anchor is carried by the kernel's data layout, not by
  its text.
* ps4-hen's 14.00 file lists the **same data offsets as its 13.52 file**, all
  fifteen of them: `PRISON0`, `ROOTVNODE`, `M_TEMP`, `MINI_SYSCORE_SELF_BINARY`,
  `ALLPROC`, the six `SBL_*` symbols, `FPU_CTX`, `SYSENT` and both proc offsets.
  `tests/firmware.test.js` holds both columns and asserts nothing moved.
* The code *did* move across that boundary - ps4-hen's `memcmp` goes from
  `0x394ad0` to `0x394d80`, `+0x2b0` - which is what makes the data identity
  informative instead of trivial.
* The value itself last moved at 12.00 and then held for six kernel revisions
  through 13.52, in this table and in an independent one of the same lineage.
  The suite asserts that invariance too.

It is also the one kernel offset here that can be wrong without panicking.
`lapse.js` reads the eight bytes at `kernel_base + EVF_OFFSET` and throws unless
they spell `evf cv`, then checks the proc pointer and this process's pid, all
before any kernel write. A wrong anchor is a refused run.

`KL_LOCK` is still **not** shipped and is not guessed. `kl_lock` is a
text-region address - `0xe6c60` on 13.52 - and the text moved between 13.52 and
14.00, so nothing off-console decides it. `constants.KL_LOCK` throws for 14.00,
naming itself, and `netctrl`, which anchors on it, refuses to run; `lapse`, which
anchors on evf, runs.

## Rebuilding a blob

The upstream tree builds each one with `gcc -O3 -std=gnu11 -masm=intel
-fcf-protection=none -nostartfiles -Tscript.ld`, then
`objcopy -O binary --only-section=.text`. Any x86-64 toolchain that can emit raw
machine code will do; no libc, no linker script constraints beyond putting
`kpatch` first. Cross building on Windows with the MSYS2 toolchain works by
compiling to assembly and assembling with `as`, because mingw's `ld` refuses a
non-PE output:

```sh
gcc -S --no-async-unwind-tables -O3 -std=gnu11 -masm=intel 1400.c -o 1400.s
as 1400.s -o 1400.o
objcopy -O binary --only-section=.text 1400.o 1400.bin
```

#### Verifying a rebuild

Do not trust a rebuild by eye. Every blob here is 320 bytes and every one of them
encodes two things that can be checked mechanically: the sysent entry it patches
and the gadget it installs, both as displacements from the kernel base `rdmsr`
leaves in a register. `tests/firmware.test.js` asserts, per firmware, that both
displacements are present, that the blob reads the syscall MSR, clears and
restores CR0.WP, and returns zero. A blob that fails those is not shipped.

The sha256 column above is pinned in the same test, so a blob cannot change under
a firmware it was measured for without the suite noticing.

## Licence

The 11.50 and newer blobs are compiled from PSFree lineage sources released under
the GNU AGPLv3. That obligation travels with them: if you redistribute this
repository with those blobs, the licence applies.
