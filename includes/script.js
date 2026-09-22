let timerId = null;
const label = document.getElementById('autoJbLabel');
const checkbox = document.getElementById('autoJbInput');
const jeilbrekBtn = document.getElementById('jeilbrek');
const UAElement = document.getElementById("UA");
const FWElement = document.getElementById("FW");

const storedAutoJb = localStorage.getItem("autoJb");
let autoJbValue = storedAutoJb !== null ? storedAutoJb === "true" : true;

// choose one of kernel exploits
var exploitChain = localStorage.getItem("exploitChain") || "lapse";
const netctrlRadio = document.getElementById("netctrl-exploit");
const lapseRadio = document.getElementById("lapse-exploit");
const kexForm = document.getElementById('kernel-options');

// Show user agent
UAElement.innerText += " " + navigator.userAgent;

// Firmware + support state, read from the same detector the chain uses
(function show_firmware() {
    try {
        version.init();
        FWElement.innerText += ` PlayStation ${version.console} ${version} - offsets: ${version.state}`;
    } catch (e) {
        FWElement.innerText += ` unrecognised (${e.message})`;
    }
})();

//#region Firmware matrix
(function render_matrix() {
    const table = document.getElementById("fwMatrix");

    table.innerHTML =
        "<tr><th>console</th><th>firmware</th><th>state</th><th>notes</th></tr>" +
        version.matrix()
            .map(
                (row) =>
                    `<tr class="state-${row.state}"><td>PS${row.console}</td><td>${row.range}</td>` +
                    `<td>${row.state}</td><td>${row.note}</td></tr>`
            )
            .join("");

    const hint = document.getElementById("fwHint");

    if (version.is_unsupported) {
        hint.innerText = `This build cannot drive PlayStation ${version.console}.`;
    } else if (version.is_derivable) {
        hint.innerText =
            `No shipped offsets for ${version}. The derivation phase runs before init_arw() and ` +
            `converges the offsets it cannot prove across page loads - keep reloading until the report stops shrinking.`;
    } else {
        hint.innerText = `${version} has a verified offset table. Derivation is skipped.`;
    }
})();
//#endregion

//#region HEN
const henSelect = document.getElementById("henSelect");
const henPath = document.getElementById("henPath");
const henUrl = document.getElementById("henUrl");
const henFormat = document.getElementById("henFormat");
const henOut = () => document.getElementById("deriveOut");

const HEN_SELECTED_KEY = "cssfontface_hen_selected";

function hen_profiles() {
    return typeof hen_state === "undefined" ? {} : hen_state.all();
}

function render_hen() {
    const profiles = hen_profiles();

    henSelect.innerHTML = Object.keys(profiles)
        .map((id) => `<option value="${id}">${profiles[id].name}</option>`)
        .join("");

    const stored = localStorage.getItem(HEN_SELECTED_KEY);

    if (stored !== null && profiles[stored] !== undefined) {
        henSelect.value = stored;
    }

    apply_hen_profile();
}

function apply_hen_profile() {
    const profiles = hen_profiles();
    const profile = profiles[henSelect.value];

    if (profile === undefined) return;

    if (typeof hen_state !== "undefined") {
        hen_state.selected = henSelect.value;
    }

    henPath.value = profile.path || "";
    henUrl.value = profile.url || "";
    henFormat.value = profile.format || "auto";

    henPath.disabled = profile.source === "fixed";
}

// The form fields are the session override for the selected profile: whatever is
// typed here is what the loader fetches, without editing the table.
function commit_hen_profile() {
    const profiles = hen_profiles();
    const profile = profiles[henSelect.value];

    if (profile === undefined) return;

    if (henUrl.value.length !== 0) {
        profile.url = henUrl.value;
        profile.path = undefined;
    } else {
        profile.path = henPath.value;
        profile.url = undefined;
    }

    profile.format = henFormat.value;

    if (typeof hen_state !== "undefined") {
        hen_state.selected = henSelect.value;
        hen_state.cache.clear();
    }
}

henSelect.addEventListener("change", function () {
    localStorage.setItem(HEN_SELECTED_KEY, henSelect.value);
    apply_hen_profile();
});

[henPath, henUrl, henFormat].forEach((el) =>
    el.addEventListener("change", commit_hen_profile)
);

document.getElementById("henPrefetch").addEventListener("click", async function (e) {
    e.target.disabled = true;

    try {
        commit_hen_profile();
        const result = await hen_prefetch([henSelect.value]);
        henOut().textContent = JSON.stringify(result, null, 2);
    } catch (err) {
        henOut().textContent = `prefetch failed: ${err.message}`;
    }

    e.target.disabled = false;
});

document.getElementById("henStatus").addEventListener("click", function () {
    henOut().textContent = JSON.stringify(hen_status(), null, 2);
});

render_hen();
//#endregion

//#region Derivation controls
function derive_loaded() {
    return typeof derive_phase_a === "function";
}

document.getElementById("deriveRun").addEventListener("click", async function () {
    const out = document.getElementById("deriveOut");

    if (!derive_loaded()) {
        out.textContent = "derive.js is not loaded - it is pulled in by doJb() on firmware with no shipped table.";
        return;
    }

    const rw = typeof jb !== "undefined" ? jb.rw : undefined;

    if (rw === undefined && (typeof arw === "undefined" || arw.master === undefined)) {
        out.textContent = "no read primitive yet - run the jailbreak first.";
        return;
    }

    try {
        const report = await derive_all(rw);
        out.textContent = `${derive_report_markdown()}\n\n${JSON.stringify(constants.dump(), null, 2)}`;
        logger.info(derive_report_markdown());
    } catch (err) {
        out.textContent = `derivation failed: ${err.message}`;
    }
});

document.getElementById("deriveDump").addEventListener("click", function () {
    if (!derive_loaded() || typeof constants === "undefined") return;
    document.getElementById("deriveOut").textContent = constants.dump_json();
});

document.getElementById("deriveMarkdown").addEventListener("click", function () {
    if (!derive_loaded()) return;
    document.getElementById("deriveOut").textContent = derive_report_markdown();
});

document.getElementById("sweepReset").addEventListener("click", function () {
    if (typeof sweep === "undefined") {
        document.getElementById("deriveOut").textContent = "derive.js is not loaded.";
        return;
    }

    sweep.reset();
    document.getElementById("deriveOut").textContent = "sweep state cleared - reload to start from the first candidate.";
});
//#endregion

kexForm.addEventListener("change", function (event) {
    localStorage.setItem("exploitChain", event.target.value);
    exploitChain = event.target.value;
});

// jailbreak execution
jeilbrekBtn.addEventListener("click", function (e){
    jeilbrekBtn.disabled = true;
    stopInterval();
    doJb();
});

checkbox.addEventListener('change', function () {
    localStorage.setItem("autoJb", checkbox.checked);
    if (checkbox.checked == true && jeilbrekBtn.disabled == false) {
        jailbreakCountdown();
        return;
    }

    stopInterval();
});

function stopInterval(){
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
    label.textContent = "Auto Jailbreak";
}

function jailbreakCountdown() {
    stopInterval();

    let countdown = 5;
    label.textContent = `Auto Jailbreaking in: ${countdown}`;
    timerId = setInterval(() => {
        countdown--;
        label.textContent = `Auto Jailbreaking in: ${countdown}`;

        if (countdown < 0) {
            jeilbrekBtn.disabled = true;
            clearInterval(timerId);
            timerId = null;
            label.textContent = 'Executing';
            doJb();
        }
    }, 1000);
}

function cacheProgress(e) {
    var Percent = (Math.round(e.loaded / e.total * 100));
    document.title = "Caching: " + Percent + "%";
}

function displayCacheProgress() {
    setTimeout(function () {
        // show a tick
        document.title = "\u2713";
    }, 1000);
    setTimeout(function () {
        // location.reload();
        document.title = "CSSFontFace exploit";
    }, 3000);
}

document.addEventListener("DOMContentLoaded", function() {
    // Cache handling
    if (window.applicationCache) {
        window.applicationCache.addEventListener("progress", cacheProgress, false);
        window.applicationCache.oncached = function (e) { displayCacheProgress(); };
        window.applicationCache.onupdateready = function (e) { displayCacheProgress(); };
    }

    // choose prefered exploit chain
    if (exploitChain == "netctrl") {
        netctrlRadio.checked = true;
    } else {
        lapseRadio.checked = true;
    }

    // apply autojb localStorage value
    checkbox.checked = autoJbValue;

    if (autoJbValue) jailbreakCountdown();
});
