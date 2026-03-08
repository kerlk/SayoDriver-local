let wasm_bindgen;
(function() {
    const __exports = {};
    let script_src;
    if (typeof document !== 'undefined' && document.currentScript !== null) {
        script_src = new URL(document.currentScript.src, location.href).toString();
    }
    let wasm = undefined;

    function addToExternrefTable0(obj) {
        const idx = wasm.__externref_table_alloc();
        wasm.__wbindgen_export_2.set(idx, obj);
        return idx;
    }

    function handleError(f, args) {
        try {
            return f.apply(this, args);
        } catch (e) {
            const idx = addToExternrefTable0(e);
            wasm.__wbindgen_exn_store(idx);
        }
    }

    let WASM_VECTOR_LEN = 0;

    let cachedUint8ArrayMemory0 = null;

    function getUint8ArrayMemory0() {
        if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
            cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
        }
        return cachedUint8ArrayMemory0;
    }

    const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

    const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
        ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
    }
        : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    });

    function passStringToWasm0(arg, malloc, realloc) {

        if (realloc === undefined) {
            const buf = cachedTextEncoder.encode(arg);
            const ptr = malloc(buf.length, 1) >>> 0;
            getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
            WASM_VECTOR_LEN = buf.length;
            return ptr;
        }

        let len = arg.length;
        let ptr = malloc(len, 1) >>> 0;

        const mem = getUint8ArrayMemory0();

        let offset = 0;

        for (; offset < len; offset++) {
            const code = arg.charCodeAt(offset);
            if (code > 0x7F) break;
            mem[ptr + offset] = code;
        }

        if (offset !== len) {
            if (offset !== 0) {
                arg = arg.slice(offset);
            }
            ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
            const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
            const ret = encodeString(arg, view);

            offset += ret.written;
            ptr = realloc(ptr, len, offset, 1) >>> 0;
        }

        WASM_VECTOR_LEN = offset;
        return ptr;
    }

    let cachedDataViewMemory0 = null;

    function getDataViewMemory0() {
        if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
            cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
        }
        return cachedDataViewMemory0;
    }

    const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

    if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

    function getStringFromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
    }

    function isLikeNone(x) {
        return x === undefined || x === null;
    }

    function getArrayU8FromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
    }

    const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(state => {
        wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b)
    });

    function makeMutClosure(arg0, arg1, dtor, f) {
        const state = { a: arg0, b: arg1, cnt: 1, dtor };
        const real = (...args) => {
            // First up with a closure we increment the internal reference
            // count. This ensures that the Rust closure environment won't
            // be deallocated while we're invoking it.
            state.cnt++;
            const a = state.a;
            state.a = 0;
            try {
                return f(a, state.b, ...args);
            } finally {
                if (--state.cnt === 0) {
                    wasm.__wbindgen_export_6.get(state.dtor)(a, state.b);
                    CLOSURE_DTORS.unregister(state);
                } else {
                    state.a = a;
                }
            }
        };
        real.original = state;
        CLOSURE_DTORS.register(real, state, state);
        return real;
    }

    function debugString(val) {
        // primitive types
        const type = typeof val;
        if (type == 'number' || type == 'boolean' || val == null) {
            return  `${val}`;
        }
        if (type == 'string') {
            return `"${val}"`;
        }
        if (type == 'symbol') {
            const description = val.description;
            if (description == null) {
                return 'Symbol';
            } else {
                return `Symbol(${description})`;
            }
        }
        if (type == 'function') {
            const name = val.name;
            if (typeof name == 'string' && name.length > 0) {
                return `Function(${name})`;
            } else {
                return 'Function';
            }
        }
        // objects
        if (Array.isArray(val)) {
            const length = val.length;
            let debug = '[';
            if (length > 0) {
                debug += debugString(val[0]);
            }
            for(let i = 1; i < length; i++) {
                debug += ', ' + debugString(val[i]);
            }
            debug += ']';
            return debug;
        }
        // Test for built-in
        const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
        let className;
        if (builtInMatches && builtInMatches.length > 1) {
            className = builtInMatches[1];
        } else {
            // Failed to match the standard '[object ClassName]'
            return toString.call(val);
        }
        if (className == 'Object') {
            // we're a user defined class or Object
            // JSON.stringify avoids problems with cycles, and is generally much
            // easier than looping through ownProperties of `val`.
            try {
                return 'Object(' + JSON.stringify(val) + ')';
            } catch (_) {
                return 'Object';
            }
        }
        // errors
        if (val instanceof Error) {
            return `${val.name}: ${val.message}\n${val.stack}`;
        }
        // TODO we could test for more things here, like `Set`s and `Map`s.
        return className;
    }
    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallback2u8bool = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallback2u8bool(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDisplayData = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDisplayData(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerStringContent = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerStringContent(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSayoScript = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSayoScript(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDeviceStatus = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDeviceStatus(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerRwBytes = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerRwBytes(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerRFConfig = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerRFConfig(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackDeviceStatus = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackDeviceStatus(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackVecu8 = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackVecu8(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDWidget = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDWidget(ptr);
    };

    /**
     * @returns {number}
     */
    __exports.frb_get_rust_content_hash = function() {
        const ret = wasm.frb_get_rust_content_hash();
        return ret;
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDisplayAssetsPacket = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDisplayAssetsPacket(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerVecu8 = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerVecu8(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerByteArray = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerByteArray(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSayoColorData = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSayoColorData(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackString = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackString(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerBroadCast = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerBroadCast(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackf64 = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackf64(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackDeviceStatus = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackDeviceStatus(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSayoScript = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSayoScript(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerVecu8 = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerVecu8(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAdvancedKeyBinding = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAdvancedKeyBinding(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLcdDrawData = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLcdDrawData(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerInputEvent = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerInputEvent(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDPic = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDPic(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerHidReportHeader = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerHidReportHeader(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerRwBytes = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerRwBytes(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerBroadCastData = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerBroadCastData(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerOptionalBytes = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerOptionalBytes(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDeviceInfo = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDeviceInfo(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerBroadCastData = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerBroadCastData(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAnalogKeyInfo = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAnalogKeyInfo(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDeviceInfo = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDeviceInfo(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerTriggerMouseHid = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerTriggerMouseHid(ptr);
    };

    /**
     * @param {number} func_id
     * @param {any} port_
     * @param {any} ptr_
     * @param {number} rust_vec_len_
     * @param {number} data_len_
     */
    __exports.frb_pde_ffi_dispatcher_primary = function(func_id, port_, ptr_, rust_vec_len_, data_len_) {
        wasm.frb_pde_ffi_dispatcher_primary(func_id, port_, ptr_, rust_vec_len_, data_len_);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLcdDrawData = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLcdDrawData(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDFill = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDFill(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerKeyData = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerKeyData(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallback2u128bool = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallback2u128bool(ptr);
    };

    /**
     * @param {number} func_id
     * @param {any} ptr_
     * @param {number} rust_vec_len_
     * @param {number} data_len_
     * @returns {any}
     */
    __exports.frb_pde_ffi_dispatcher_sync = function(func_id, ptr_, rust_vec_len_, data_len_) {
        const ret = wasm.frb_pde_ffi_dispatcher_sync(func_id, ptr_, rust_vec_len_, data_len_);
        return ret;
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAdvancedKeyBinding = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAdvancedKeyBinding(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerTriggerKeyboardHid = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerTriggerKeyboardHid(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackString = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackString(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAdvancedSystemConfig = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAdvancedSystemConfig(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDWidget = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDWidget(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDisplayAssetsPacket = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDisplayAssetsPacket(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAnalogKeyInfo2 = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAnalogKeyInfo2(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDeviceStatus = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDeviceStatus(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallback2u128Vecu8 = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallback2u128Vecu8(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerArcdynFnu128mutBroadCastSendSyncstatic = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerArcdynFnu128mutBroadCastSendSyncstatic(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDPic = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDPic(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerTriggerMouseHid = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerTriggerMouseHid(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAnalogKeyInfo2 = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAnalogKeyInfo2(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAnalogKeyInfo = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAnalogKeyInfo(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDisplayAssets = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDisplayAssets(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLEDInfo = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLEDInfo(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDInfo = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDInfo(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallback2u128bool = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallback2u128bool(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallback2u8bool = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallback2u8bool(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerKeyData = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerKeyData(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDisplayAssets = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDisplayAssets(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerTriggerKeyboardHid = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerTriggerKeyboardHid(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackf64 = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackf64(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerColorTable = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerColorTable(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerOptionalBytes = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerOptionalBytes(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallback2u128Vecu8 = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallback2u128Vecu8(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerTouchSensitivity = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerTouchSensitivity(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerByteArray = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerByteArray(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackInputEvent = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackInputEvent(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerReportDecoder = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerReportDecoder(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSayoColorData = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSayoColorData(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerStringContent = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerStringContent(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSystemInfo = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSystemInfo(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLedData = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLedData(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLEDInfo = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLEDInfo(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDFill = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDFill(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDInfo = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDInfo(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDFont = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDFont(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerTriggerMeidaHid = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerTriggerMeidaHid(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAdvancedSystemConfig = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAdvancedSystemConfig(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSayoScriptPacket = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSayoScriptPacket(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerTriggerMeidaHid = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerTriggerMeidaHid(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerGamePadCfg = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerGamePadCfg(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerInputEvent = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerInputEvent(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerRFConfig = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerRFConfig(ptr);
    };

    /**
     * @param {number} call_id
     * @param {any} ptr_
     * @param {number} rust_vec_len_
     * @param {number} data_len_
     */
    __exports.frb_dart_fn_deliver_output = function(call_id, ptr_, rust_vec_len_, data_len_) {
        wasm.frb_dart_fn_deliver_output(call_id, ptr_, rust_vec_len_, data_len_);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerScreenBuffer = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerScreenBuffer(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerKeyInfo = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerKeyInfo(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSystemInfo = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSystemInfo(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLedEffect = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLedEffect(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerScreenBuffer = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerScreenBuffer(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerKeyInfo = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerKeyInfo(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackInputEvent = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackInputEvent(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerArcdynFnu128mutBroadCastSendSyncstatic = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerArcdynFnu128mutBroadCastSendSyncstatic(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSayoScriptPacket = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSayoScriptPacket(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAmbientLED = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAmbientLED(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerHidReportHeader = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerHidReportHeader(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDFont = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLCDFont(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLedEffect = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLedEffect(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDisplayData = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerDisplayData(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerReportDecoder = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerReportDecoder(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerBroadCast = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerBroadCast(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerGamePadCfg = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerGamePadCfg(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLedData = function(ptr) {
        wasm.rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerLedData(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerTouchSensitivity = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerTouchSensitivity(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAmbientLED = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerAmbientLED(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerColorTable = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerColorTable(ptr);
    };

    /**
     * @param {number} ptr
     */
    __exports.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackVecu8 = function(ptr) {
        wasm.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerSafeCallbackVecu8(ptr);
    };

    /**
     * @param {any} progress
     * @returns {Promise<Promise<any>>}
     */
    __exports.send_firmware_progress = function(progress) {
        const ret = wasm.send_firmware_progress(progress);
        return ret;
    };

    /**
     * @param {any} event_js
     * @returns {Promise<Promise<any>>}
     */
    __exports.on_device_report_arrived = function(event_js) {
        const ret = wasm.on_device_report_arrived(event_js);
        return ret;
    };

    /**
     * @param {any} event_js
     * @param {boolean} connected
     * @returns {Promise<Promise<any>>}
     */
    __exports.on_connection_changed = function(event_js, connected) {
        const ret = wasm.on_connection_changed(event_js, connected);
        return ret;
    };

    function takeFromExternrefTable0(idx) {
        const value = wasm.__wbindgen_export_2.get(idx);
        wasm.__externref_table_dealloc(idx);
        return value;
    }
    /**
     * @param {number} ptr
     * @returns {any}
     */
    __exports.frb_dart_opaque_rust2dart_decode = function(ptr) {
        const ret = wasm.frb_dart_opaque_rust2dart_decode(ptr);
        return ret;
    };

    /**
     * @param {number} ptr
     */
    __exports.frb_dart_opaque_drop_thread_box_persistent_handle = function(ptr) {
        wasm.frb_dart_opaque_drop_thread_box_persistent_handle(ptr);
    };

    function passArrayJsValueToWasm0(array, malloc) {
        const ptr = malloc(array.length * 4, 4) >>> 0;
        for (let i = 0; i < array.length; i++) {
            const add = addToExternrefTable0(array[i]);
            getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
        }
        WASM_VECTOR_LEN = array.length;
        return ptr;
    }
    /**
     * ## Safety
     * This function reclaims a raw pointer created by [`TransferClosure`], and therefore
     * should **only** be used in conjunction with it.
     * Furthermore, the WASM module in the worker must have been initialized with the shared
     * memory from the host JS scope.
     * @param {number} payload
     * @param {any[]} transfer
     */
    __exports.receive_transfer_closure = function(payload, transfer) {
        const ptr0 = passArrayJsValueToWasm0(transfer, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.receive_transfer_closure(payload, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    };

    __exports.wasm_start_callback = function() {
        wasm.wasm_start_callback();
    };

    /**
     * # Safety
     *
     * This should never be called manually.
     * @param {any} handle
     * @param {any} dart_handler_port
     * @returns {number}
     */
    __exports.frb_dart_opaque_dart2rust_encode = function(handle, dart_handler_port) {
        const ret = wasm.frb_dart_opaque_dart2rust_encode(handle, dart_handler_port);
        return ret >>> 0;
    };

    function __wbg_adapter_42(arg0, arg1) {
        wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h3272e36c247790ec(arg0, arg1);
    }

    function __wbg_adapter_45(arg0, arg1, arg2) {
        wasm.closure428_externref_shim(arg0, arg1, arg2);
    }

    function __wbg_adapter_50(arg0, arg1, arg2) {
        wasm.closure466_externref_shim(arg0, arg1, arg2);
    }

    function __wbg_adapter_333(arg0, arg1, arg2, arg3) {
        wasm.closure511_externref_shim(arg0, arg1, arg2, arg3);
    }

    const WorkerPoolFinalization = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(ptr => wasm.__wbg_workerpool_free(ptr >>> 0, 1));

    class WorkerPool {

        static __wrap(ptr) {
            ptr = ptr >>> 0;
            const obj = Object.create(WorkerPool.prototype);
            obj.__wbg_ptr = ptr;
            WorkerPoolFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            WorkerPoolFinalization.unregister(this);
            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_workerpool_free(ptr, 0);
        }
        /**
         * @param {number | null} [initial]
         * @param {string | null} [script_src]
         * @param {string | null} [worker_js_preamble]
         * @returns {WorkerPool}
         */
        static new(initial, script_src, worker_js_preamble) {
            var ptr0 = isLikeNone(script_src) ? 0 : passStringToWasm0(script_src, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            var ptr1 = isLikeNone(worker_js_preamble) ? 0 : passStringToWasm0(worker_js_preamble, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            const ret = wasm.workerpool_new(isLikeNone(initial) ? 0x100000001 : (initial) >>> 0, ptr0, len0, ptr1, len1);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return WorkerPool.__wrap(ret[0]);
        }
        /**
         * Creates a new `WorkerPool` which immediately creates `initial` workers.
         *
         * The pool created here can be used over a long period of time, and it
         * will be initially primed with `initial` workers. Currently workers are
         * never released or gc'd until the whole pool is destroyed.
         *
         * # Errors
         *
         * Returns any error that may happen while a JS web worker is created and a
         * message is sent to it.
         * @param {number} initial
         * @param {string} script_src
         * @param {string} worker_js_preamble
         */
        constructor(initial, script_src, worker_js_preamble) {
            const ptr0 = passStringToWasm0(script_src, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(worker_js_preamble, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            const ret = wasm.workerpool_new_raw(initial, ptr0, len0, ptr1, len1);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            this.__wbg_ptr = ret[0] >>> 0;
            WorkerPoolFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
    }
    __exports.WorkerPool = WorkerPool;

    async function __wbg_load(module, imports) {
        if (typeof Response === 'function' && module instanceof Response) {
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                try {
                    return await WebAssembly.instantiateStreaming(module, imports);

                } catch (e) {
                    if (module.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                    } else {
                        throw e;
                    }
                }
            }

            const bytes = await module.arrayBuffer();
            return await WebAssembly.instantiate(bytes, imports);

        } else {
            const instance = await WebAssembly.instantiate(module, imports);

            if (instance instanceof WebAssembly.Instance) {
                return { instance, module };

            } else {
                return instance;
            }
        }
    }

    function __wbg_get_imports() {
        const imports = {};
        imports.wbg = {};
        imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
            const ret = arg0.buffer;
            return ret;
        };
        imports.wbg.__wbg_byteLength_1bdb96d98ab0d871 = function(arg0) {
            const ret = arg0.byteLength;
            return ret;
        };
        imports.wbg.__wbg_byteOffset_d7656012e66edc5f = function(arg0) {
            const ret = arg0.byteOffset;
            return ret;
        };
        imports.wbg.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
            const ret = arg0.call(arg1);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.call(arg1, arg2);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_call_833bed5770ea2041 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.call(arg1, arg2, arg3);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_clearTimeout_5a54f8841c30079a = function(arg0) {
            const ret = clearTimeout(arg0);
            return ret;
        };
        imports.wbg.__wbg_close_e927b1690632b835 = function(arg0) {
            const ret = arg0.close();
            return ret;
        };
        imports.wbg.__wbg_collections_b34df3ba9e2cf6f4 = function(arg0) {
            const ret = arg0.collections;
            return ret;
        };
        imports.wbg.__wbg_createObjectURL_6e98d2f9c7bd9764 = function() { return handleError(function (arg0, arg1) {
            const ret = URL.createObjectURL(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments) };
        imports.wbg.__wbg_crypto_dd1b8f71596b161a = function(arg0) {
            const ret = arg0.crypto;
            return ret;
        };
        imports.wbg.__wbg_data_432d9c3df2630942 = function(arg0) {
            const ret = arg0.data;
            return ret;
        };
        imports.wbg.__wbg_data_abeb242764125124 = function(arg0) {
            const ret = arg0.data;
            return ret;
        };
        imports.wbg.__wbg_device_897e6e73fb2b9357 = function(arg0) {
            const ret = arg0.device;
            return ret;
        };
        imports.wbg.__wbg_device_c8329ccac08b8ca8 = function(arg0) {
            const ret = arg0.device;
            return ret;
        };
        imports.wbg.__wbg_error_076d4beefd7cfd14 = function(arg0, arg1) {
            console.error(getStringFromWasm0(arg0, arg1));
        };
        imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            }
        };
        imports.wbg.__wbg_eval_e10dc02e9547f640 = function() { return handleError(function (arg0, arg1) {
            const ret = eval(getStringFromWasm0(arg0, arg1));
            return ret;
        }, arguments) };
        imports.wbg.__wbg_from_2a5d3e218e67aa85 = function(arg0) {
            const ret = Array.from(arg0);
            return ret;
        };
        imports.wbg.__wbg_getDevices_916883032bafc9b1 = function(arg0) {
            const ret = arg0.getDevices();
            return ret;
        };
        imports.wbg.__wbg_getRandomValues_760c8e927227643e = function() { return handleError(function (arg0, arg1) {
            arg0.getRandomValues(arg1);
        }, arguments) };
        imports.wbg.__wbg_getUint8_749a77380c219f58 = function(arg0, arg1) {
            const ret = arg0.getUint8(arg1 >>> 0);
            return ret;
        };
        imports.wbg.__wbg_get_67b2ba62fc30de12 = function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.get(arg0, arg1);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_get_b9b93047fe3cf45b = function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        };
        imports.wbg.__wbg_has_a5ea9117f258a0ec = function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.has(arg0, arg1);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_hid_890a1b64f4c510a6 = function(arg0) {
            const ret = arg0.hid;
            return ret;
        };
        imports.wbg.__wbg_instanceof_BroadcastChannel_102292ddffa430f7 = function(arg0) {
            let result;
            try {
                result = arg0 instanceof BroadcastChannel;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_instanceof_ErrorEvent_24a579ed4d838fe9 = function(arg0) {
            let result;
            try {
                result = arg0 instanceof ErrorEvent;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_instanceof_HidConnectionEvent_cb17b7031440c1f2 = function(arg0) {
            let result;
            try {
                result = arg0 instanceof HIDConnectionEvent;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_instanceof_HidDevice_281d00db95a533c6 = function(arg0) {
            let result;
            try {
                result = arg0 instanceof HIDDevice;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_instanceof_HidInputReportEvent_7be134dd50b26ea9 = function(arg0) {
            let result;
            try {
                result = arg0 instanceof HIDInputReportEvent;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_instanceof_MessageEvent_2e467ced55f682c9 = function(arg0) {
            let result;
            try {
                result = arg0 instanceof MessageEvent;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_instanceof_MessagePort_17e6fe07f7e99f84 = function(arg0) {
            let result;
            try {
                result = arg0 instanceof MessagePort;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_instanceof_Window_def73ea0955fc569 = function(arg0) {
            let result;
            try {
                result = arg0 instanceof Window;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_isArray_a1eab7e0d067391b = function(arg0) {
            const ret = Array.isArray(arg0);
            return ret;
        };
        imports.wbg.__wbg_is_c7481c65e7e5df9e = function(arg0, arg1) {
            const ret = Object.is(arg0, arg1);
            return ret;
        };
        imports.wbg.__wbg_length_a446193dc22c12f8 = function(arg0) {
            const ret = arg0.length;
            return ret;
        };
        imports.wbg.__wbg_length_e2d2a49132c1b256 = function(arg0) {
            const ret = arg0.length;
            return ret;
        };
        imports.wbg.__wbg_log_026e3009324431bf = function(arg0, arg1) {
            console.log(getStringFromWasm0(arg0, arg1));
        };
        imports.wbg.__wbg_log_fbf2ef4b66b41dbe = function(arg0, arg1) {
            console.log(getStringFromWasm0(arg0, arg1));
        };
        imports.wbg.__wbg_message_d1685a448ba00178 = function(arg0, arg1) {
            const ret = arg1.message;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_msCrypto_60a4979188f6b80b = function(arg0) {
            const ret = arg0.msCrypto;
            return ret;
        };
        imports.wbg.__wbg_name_235b92ab39fceaf8 = function(arg0, arg1) {
            const ret = arg1.name;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_navigator_1577371c070c8947 = function(arg0) {
            const ret = arg0.navigator;
            return ret;
        };
        imports.wbg.__wbg_new_23a2665fac83c611 = function(arg0, arg1) {
            try {
                var state0 = {a: arg0, b: arg1};
                var cb0 = (arg0, arg1) => {
                    const a = state0.a;
                    state0.a = 0;
                    try {
                        return __wbg_adapter_333(a, state0.b, arg0, arg1);
                    } finally {
                        state0.a = a;
                    }
                };
                const ret = new Promise(cb0);
                return ret;
            } finally {
                state0.a = state0.b = 0;
            }
        };
        imports.wbg.__wbg_new_405e22f390576ce2 = function() {
            const ret = new Object();
            return ret;
        };
        imports.wbg.__wbg_new_78feb108b6472713 = function() {
            const ret = new Array();
            return ret;
        };
        imports.wbg.__wbg_new_7f19378ebfdc87d5 = function() { return handleError(function (arg0, arg1) {
            const ret = new BroadcastChannel(getStringFromWasm0(arg0, arg1));
            return ret;
        }, arguments) };
        imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
            const ret = new Error();
            return ret;
        };
        imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
            const ret = new Uint8Array(arg0);
            return ret;
        };
        imports.wbg.__wbg_new_b1a33e5095abf678 = function() { return handleError(function (arg0, arg1) {
            const ret = new Worker(getStringFromWasm0(arg0, arg1));
            return ret;
        }, arguments) };
        imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
            const ret = new Function(getStringFromWasm0(arg0, arg1));
            return ret;
        };
        imports.wbg.__wbg_newwithargs_ab6ffe8cd6c19c04 = function(arg0, arg1, arg2, arg3) {
            const ret = new Function(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
            return ret;
        };
        imports.wbg.__wbg_newwithblobsequenceandoptions_1db4479a1a2d4229 = function() { return handleError(function (arg0, arg1) {
            const ret = new Blob(arg0, arg1);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
            const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
            return ret;
        };
        imports.wbg.__wbg_newwithlength_a381634e90c276d4 = function(arg0) {
            const ret = new Uint8Array(arg0 >>> 0);
            return ret;
        };
        imports.wbg.__wbg_node_0deadde112ce24bb = function(arg0) {
            const ret = arg0.node;
            return ret;
        };
        imports.wbg.__wbg_now_807e54c39636c349 = function() {
            const ret = Date.now();
            return ret;
        };
        imports.wbg.__wbg_now_d18023d54d4e5500 = function(arg0) {
            const ret = arg0.now();
            return ret;
        };
        imports.wbg.__wbg_open_a95fae7936477724 = function(arg0) {
            const ret = arg0.open();
            return ret;
        };
        imports.wbg.__wbg_opened_1fee39ed52b14681 = function(arg0) {
            const ret = arg0.opened;
            return ret;
        };
        imports.wbg.__wbg_performance_c185c0cdc2766575 = function(arg0) {
            const ret = arg0.performance;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_postMessage_33814d4dc32c2dcf = function() { return handleError(function (arg0, arg1) {
            arg0.postMessage(arg1);
        }, arguments) };
        imports.wbg.__wbg_postMessage_6edafa8f7b9c2f52 = function() { return handleError(function (arg0, arg1) {
            arg0.postMessage(arg1);
        }, arguments) };
        imports.wbg.__wbg_postMessage_83a8d58d3fcb6c13 = function() { return handleError(function (arg0, arg1) {
            arg0.postMessage(arg1);
        }, arguments) };
        imports.wbg.__wbg_postMessage_f961e53b9731ca83 = function() { return handleError(function (arg0, arg1, arg2) {
            arg0.postMessage(arg1, arg2);
        }, arguments) };
        imports.wbg.__wbg_process_0caa4f154b97e834 = function(arg0) {
            const ret = arg0.process;
            return ret;
        };
        imports.wbg.__wbg_productId_1e25b157d6ce1ea8 = function(arg0) {
            const ret = arg0.productId;
            return ret;
        };
        imports.wbg.__wbg_productName_8cde08bc89b2a109 = function(arg0, arg1) {
            const ret = arg1.productName;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_push_737cfc8c1432c2c6 = function(arg0, arg1) {
            const ret = arg0.push(arg1);
            return ret;
        };
        imports.wbg.__wbg_queueMicrotask_6808622725a52272 = function(arg0) {
            const ret = arg0.queueMicrotask;
            return ret;
        };
        imports.wbg.__wbg_queueMicrotask_ef0e86b0263a71ee = function(arg0) {
            queueMicrotask(arg0);
        };
        imports.wbg.__wbg_randomFillSync_82e8b56b81896e30 = function() { return handleError(function (arg0, arg1) {
            arg0.randomFillSync(arg1);
        }, arguments) };
        imports.wbg.__wbg_reportId_750c9113c4ef126f = function(arg0) {
            const ret = arg0.reportId;
            return ret;
        };
        imports.wbg.__wbg_requestDevice_b9904d52d001d64d = function(arg0, arg1) {
            const ret = arg0.requestDevice(arg1);
            return ret;
        };
        imports.wbg.__wbg_require_1a22b236558b5786 = function() { return handleError(function () {
            const ret = module.require;
            return ret;
        }, arguments) };
        imports.wbg.__wbg_resolve_4851785c9c5f573d = function(arg0) {
            const ret = Promise.resolve(arg0);
            return ret;
        };
        imports.wbg.__wbg_sendReport_4d1024566077f413 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.sendReport(arg1, getArrayU8FromWasm0(arg2, arg3));
            return ret;
        }, arguments) };
        imports.wbg.__wbg_setTimeout_db2dbaeefb6f39c7 = function() { return handleError(function (arg0, arg1) {
            const ret = setTimeout(arg0, arg1);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_set_37837023f3d740e8 = function(arg0, arg1, arg2) {
            arg0[arg1 >>> 0] = arg2;
        };
        imports.wbg.__wbg_set_3f1d0b984ed272ed = function(arg0, arg1, arg2) {
            arg0[arg1] = arg2;
        };
        imports.wbg.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
            arg0.set(arg1, arg2 >>> 0);
        };
        imports.wbg.__wbg_set_bb8cecf6a62b9f46 = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(arg0, arg1, arg2);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_setfilters_35abbff30813c430 = function(arg0, arg1) {
            arg0.filters = arg1;
        };
        imports.wbg.__wbg_setonconnect_c9ef0838e03b63b8 = function(arg0, arg1) {
            arg0.onconnect = arg1;
        };
        imports.wbg.__wbg_setondisconnect_706d44981a6c92b1 = function(arg0, arg1) {
            arg0.ondisconnect = arg1;
        };
        imports.wbg.__wbg_setonerror_57eeef5feb01fe7a = function(arg0, arg1) {
            arg0.onerror = arg1;
        };
        imports.wbg.__wbg_setoninputreport_de1916af49f98e5f = function(arg0, arg1) {
            arg0.oninputreport = arg1;
        };
        imports.wbg.__wbg_setonmessage_5a885b16bdc6dca6 = function(arg0, arg1) {
            arg0.onmessage = arg1;
        };
        imports.wbg.__wbg_settype_39ed370d3edd403c = function(arg0, arg1, arg2) {
            arg0.type = getStringFromWasm0(arg1, arg2);
        };
        imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
            const ret = arg1.stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_subarray_aa9065fa9dc5df96 = function(arg0, arg1, arg2) {
            const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
            return ret;
        };
        imports.wbg.__wbg_then_44b73946d2fb3e7d = function(arg0, arg1) {
            const ret = arg0.then(arg1);
            return ret;
        };
        imports.wbg.__wbg_then_48b406749878a531 = function(arg0, arg1, arg2) {
            const ret = arg0.then(arg1, arg2);
            return ret;
        };
        imports.wbg.__wbg_unshift_c290010f73f04fb1 = function(arg0, arg1) {
            const ret = arg0.unshift(arg1);
            return ret;
        };
        imports.wbg.__wbg_vendorId_1deaa2bcf37d36e4 = function(arg0) {
            const ret = arg0.vendorId;
            return ret;
        };
        imports.wbg.__wbg_versions_134d8f3c6de79566 = function(arg0) {
            const ret = arg0.versions;
            return ret;
        };
        imports.wbg.__wbindgen_boolean_get = function(arg0) {
            const v = arg0;
            const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
            return ret;
        };
        imports.wbg.__wbindgen_cb_drop = function(arg0) {
            const obj = arg0.original;
            if (obj.cnt-- == 1) {
                obj.a = 0;
                return true;
            }
            const ret = false;
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper3129 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 401, __wbg_adapter_42);
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper3243 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 429, __wbg_adapter_45);
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper3244 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 429, __wbg_adapter_45);
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper3350 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 467, __wbg_adapter_50);
            return ret;
        };
        imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
            const ret = debugString(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbindgen_init_externref_table = function() {
            const table = wasm.__wbindgen_export_2;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
            ;
        };
        imports.wbg.__wbindgen_is_array = function(arg0) {
            const ret = Array.isArray(arg0);
            return ret;
        };
        imports.wbg.__wbindgen_is_falsy = function(arg0) {
            const ret = !arg0;
            return ret;
        };
        imports.wbg.__wbindgen_is_function = function(arg0) {
            const ret = typeof(arg0) === 'function';
            return ret;
        };
        imports.wbg.__wbindgen_is_object = function(arg0) {
            const val = arg0;
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        };
        imports.wbg.__wbindgen_is_string = function(arg0) {
            const ret = typeof(arg0) === 'string';
            return ret;
        };
        imports.wbg.__wbindgen_is_undefined = function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        };
        imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
            const ret = arg0 === arg1;
            return ret;
        };
        imports.wbg.__wbindgen_memory = function() {
            const ret = wasm.memory;
            return ret;
        };
        imports.wbg.__wbindgen_module = function() {
            const ret = __wbg_init.__wbindgen_wasm_module;
            return ret;
        };
        imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'number' ? obj : undefined;
            getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
        };
        imports.wbg.__wbindgen_number_new = function(arg0) {
            const ret = arg0;
            return ret;
        };
        imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        };
        imports.wbg.__wbindgen_throw = function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        };

        return imports;
    }

    function __wbg_init_memory(imports, memory) {

    }

    function __wbg_finalize_init(instance, module) {
        wasm = instance.exports;
        __wbg_init.__wbindgen_wasm_module = module;
        cachedDataViewMemory0 = null;
        cachedUint8ArrayMemory0 = null;


        wasm.__wbindgen_start();
        return wasm;
    }

    function initSync(module) {
        if (wasm !== undefined) return wasm;


        if (typeof module !== 'undefined') {
            if (Object.getPrototypeOf(module) === Object.prototype) {
                ({module} = module)
            } else {
                console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
            }
        }

        const imports = __wbg_get_imports();

        __wbg_init_memory(imports);

        if (!(module instanceof WebAssembly.Module)) {
            module = new WebAssembly.Module(module);
        }

        const instance = new WebAssembly.Instance(module, imports);

        return __wbg_finalize_init(instance, module);
    }

    async function __wbg_init(module_or_path) {
        if (wasm !== undefined) return wasm;


        if (typeof module_or_path !== 'undefined') {
            if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
                ({module_or_path} = module_or_path)
            } else {
                console.warn('using deprecated parameters for the initialization function; pass a single object instead')
            }
        }

        if (typeof module_or_path === 'undefined' && typeof script_src !== 'undefined') {
            module_or_path = script_src.replace(/\.js$/, '_bg.wasm');
        }
        const imports = __wbg_get_imports();

        if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
            module_or_path = fetch(module_or_path);
        }

        __wbg_init_memory(imports);

        const { instance, module } = await __wbg_load(await module_or_path, imports);

        return __wbg_finalize_init(instance, module);
    }

    wasm_bindgen = Object.assign(__wbg_init, { initSync }, __exports);

})();
