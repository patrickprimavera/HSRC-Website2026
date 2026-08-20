const POSITIONS = [
    {
        id: "propertyassistant",
        label: "Property Assistant"
    },
    {
        id: "salesperson",
        label: "Real Estate Salesperson"
    },
    {
        id: "salesmanager",
        label: "Sales Manager"
    },
    {
        id: "salesdirector",
        label: "Sales Director"
    },
    {
        id: "seniorsalesdirector",
        label: "Senior Sales Director"
    },

];


let applicationData = {

    classification: "",
    existingIdNumber: "",
    validId: "",
    branch: "",

    license: "",
    position: "",

    dateStarted: "",
    validUntil: "",
    underSupervision: "",

    prcNo: "",
    dhsudNo: "",

    fullName: "",
    address: "",
    birthdate: "",
    contactNumber: "",
    email: "",

    sss: "",
    tin: "",
    pagibig: "",
    philhealth: "",

    teamSalesHead: "",

    emergencyName: "",
    emergencyContact: "",

    photo: "",
    signature: ""

};


const idSystemBtn = document.getElementById("idSystemBtn");

const idModal = document.getElementById("idModal");

const idOverlay = document.getElementById("idOverlay");

const idCloseBtn = document.getElementById("idCloseBtn");

idSystemBtn.addEventListener("click", () => {

    idModal.classList.remove("hidden");

    idOverlay.classList.remove("hidden");

    checkExistingIDSystemAccess();

});

/* ============================================
   HSRC ID SYSTEM ACCESS GATE
   ============================================ */

function showIDAccessGate() {

    const modalContent =
        document.querySelector("#idModal .p-8");

    if (!modalContent) return;

    modalContent.innerHTML = `

        <div class="text-center">

            <div class="w-20 h-20 mx-auto mb-6
                        rounded-full
                        bg-[#024746]/10
                        flex items-center justify-center">

                <span class="text-4xl">🔐</span>

            </div>

            <h3 class="text-2xl md:text-3xl font-bold text-[#024746] mb-3">

                HSRC ID System Access

            </h3>

            <p class="text-slate-500 leading-6 mb-7">

                Please enter your registered email address
                to request access to the HSRC ID System.

            </p>

            <div class="text-left">

                <label
                    for="idAccessEmail"
                    class="block text-sm font-semibold text-slate-700 mb-2">

                    Email Address

                </label>

                <input
                    id="idAccessEmail"
                    type="email"
                    placeholder="Enter your registered email"
                    autocomplete="email"
                    class="w-full border rounded-xl px-4 py-3
                           focus:outline-none
                           focus:ring-2
                           focus:ring-[#024746]
                           focus:border-[#024746]">

            </div>

            <div
                id="idAccessMessage"
                class="hidden mt-4 text-sm rounded-xl p-4">

            </div>

            <div class="flex gap-3 mt-7">

    <button
        id="idAccessCloseBtn"
        type="button"
        class="flex-1 px-6 py-3
               border rounded-xl
               font-semibold
               hover:bg-slate-50">

        Close

    </button>

    <button
        id="idAccessRequestBtn"
        type="button"
        class="flex-1
               bg-[#024746]
               hover:bg-[#03635f]
               text-white
               px-6 py-3
               rounded-xl
               font-semibold">

        Request Access

    </button>

</div>

        </div>

    `;

    document
        .getElementById("idAccessCloseBtn")
        .addEventListener(
            "click",
            closeIDModal
        );
    document
        .getElementById("idAccessRequestBtn")
        .addEventListener(
            "click",
            requestIDSystemAccess
        );

}

async function requestIDSystemAccess() {

    const emailInput =
        document.getElementById("idAccessEmail");

    const requestBtn =
        document.getElementById("idAccessRequestBtn");

    const email =
        emailInput?.value?.trim().toLowerCase() || "";

    // =============================================
    // VALIDATE EMAIL
    // =============================================

    if (!email) {

        showIDAccessMessage(
            "Please enter your registered email address.",
            "error"
        );

        emailInput?.focus();

        return;
    }

    // =============================================
    // BASIC EMAIL VALIDATION
    // =============================================

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        showIDAccessMessage(
            "Please enter a valid email address.",
            "error"
        );

        emailInput?.focus();

        return;
    }

    // =============================================
    // PREVENT DOUBLE CLICK
    // =============================================

    if (requestBtn) {

        requestBtn.disabled = true;

        requestBtn.innerHTML = `
            <span class="inline-flex items-center gap-2">
                <span class="w-4 h-4
                    border-2
                    border-white/30
                    border-t-white
                    rounded-full
                    animate-spin">
                </span>

                Checking...
            </span>
        `;
    }

    try {

        console.log(
            "HSRC ID ACCESS EMAIL:",
            email
        );

        // =============================================
        // SEND JSON POST TO GOOGLE APPS SCRIPT
        // =============================================

        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                action: "id_request_access",
                payload: {
                    email: email
                }
            }),
            redirect: "follow"
        });
        // =============================================
        // READ RESPONSE
        // =============================================

        const responseText =
            await response.text();

        console.log(
            "HSRC ID RAW RESPONSE:",
            responseText
        );

        let result;

        try {

            result =
                JSON.parse(responseText);

        } catch (jsonError) {

            console.error(
                "HSRC ID INVALID JSON:",
                jsonError
            );

            throw new Error(
                "The server returned an invalid response."
            );

        }

        console.log(
            "HSRC ID ACCESS REQUEST RESULT:",
            result
        );

        // =============================================
        // SERVER ERROR
        // =============================================

        if (!result.ok) {

            showIDAccessError(
                result.error ||
                "Unable to submit your access request."
            );

            return;
        }

        // =============================================
        // APPROVED
        // =============================================

        if (
            result.status ===
            "APPROVED"
        ) {

            showIDAccessApproved(
                result.message
            );

            return;
        }

        // =============================================
        // PENDING
        // =============================================

        if (
            result.status ===
            "PENDING"
        ) {

            showIDAccessPending(
                result.message
            );

            return;
        }

        // =============================================
        // REJECTED
        // =============================================

        if (
            result.status ===
            "REJECTED"
        ) {

            showIDAccessRejected(
                result.message
            );

            return;
        }

        // =============================================
        // UNKNOWN RESPONSE
        // =============================================

        showIDAccessError(
            result.message ||
            "Your request has been processed."
        );

    } catch (error) {

        console.error(
            "HSRC ID ACCESS REQUEST ERROR:",
            error
        );

        showIDAccessError(
            error.message ||
            "Unable to connect to the server."
        );

    } finally {

        if (requestBtn) {

            requestBtn.disabled = false;

            requestBtn.innerHTML =
                "Request Access";

        }

    }

}

function showIDAccessMessage(
    message,
    type = "info"
) {

    const messageBox =
        document.getElementById(
            "idAccessMessage"
        );

    if (!messageBox) return;

    messageBox.classList.remove(
        "hidden",
        "bg-red-50",
        "bg-green-50",
        "bg-yellow-50",
        "bg-blue-50",
        "text-red-700",
        "text-green-700",
        "text-yellow-700",
        "text-blue-700"
    );

    if (type === "error") {

        messageBox.classList.add(
            "bg-red-50",
            "text-red-700"
        );

    }

    else if (type === "success") {

        messageBox.classList.add(
            "bg-green-50",
            "text-green-700"
        );

    }

    else if (type === "warning") {

        messageBox.classList.add(
            "bg-yellow-50",
            "text-yellow-700"
        );

    }

    else {

        messageBox.classList.add(
            "bg-blue-50",
            "text-blue-700"
        );

    }

    messageBox.textContent =
        message;

}

function showIDAccessError(message) {

    const modalContent =
        document.querySelector("#idModal .p-8");

    if (!modalContent) return;

    modalContent.innerHTML = `

        <div class="text-center py-8">

            <div class="w-20 h-20 mx-auto mb-6
                        rounded-full
                        bg-red-100
                        flex items-center justify-center">

                <div class="w-12 h-12
                            rounded-full
                            bg-red-50
                            border-4
                            border-red-200
                            flex items-center justify-center">

                    <span class="text-2xl text-red-600">
                        ✕
                    </span>

                </div>

            </div>

            <h3
                class="text-2xl font-bold
                       text-red-700 mb-3">

                Request Failed

            </h3>

            <p
                class="text-slate-500
                       leading-6
                       max-w-md
                       mx-auto">

                ${message}

            </p>

            <button
                id="idAccessErrorTryAgainBtn"
                type="button"
                class="mt-8 w-full
                       rounded-2xl
                       bg-[#024746]
                       hover:bg-[#03635f]
                       text-white
                       py-3.5
                       font-bold
                       transition">

                Try Again

            </button>

        </div>

    `;

    document
        .getElementById(
            "idAccessErrorTryAgainBtn"
        )
        .addEventListener(
            "click",
            showIDAccessGate
        );

}

/* ============================================
   HSRC ID SYSTEM ACCESS LOADING
   ============================================ */

function showIDAccessLoading() {

    const modalContent =
        document.querySelector("#idModal .p-8");

    if (!modalContent) return;

    modalContent.innerHTML = `

        <div class="text-center py-8">

            <div class="w-20 h-20 mx-auto mb-6
                        rounded-full
                        bg-[#024746]/10
                        flex items-center justify-center">

                <div class="w-10 h-10
                            border-4
                            border-[#024746]/20
                            border-t-[#024746]
                            rounded-full
                            animate-spin">
                </div>

            </div>

            <h3 class="text-2xl font-bold
                       text-[#024746] mb-3">

                Processing Request

            </h3>

            <p class="text-slate-500 leading-6">

                Please wait while we submit
                your HSRC ID System access request.

            </p>

            <p class="text-xs text-slate-400 mt-4">

                This may take a few seconds.

            </p>

        </div>

    `;

}

/* ============================================
   HSRC ID SYSTEM ACCESS - PENDING
   ============================================ */

function showIDAccessPending(message) {

    const modalContent =
        document.querySelector("#idModal .p-8");

    if (!modalContent) return;

    modalContent.innerHTML = `

        <div class="text-center py-6">

            <!-- PENDING ICON -->

            <div class="relative w-24 h-24 mx-auto mb-7">

                <div
                    class="absolute inset-0 rounded-full
                           bg-amber-100 animate-pulse">
                </div>

                <div
                    class="relative w-24 h-24 rounded-full
                           bg-amber-50 border-4 border-amber-200
                           flex items-center justify-center">

                    <span class="text-4xl">
                        ⏳
                    </span>

                </div>

            </div>

            <!-- TITLE -->

            <h3
                class="text-2xl md:text-3xl font-extrabold
                       text-[#024746] mb-3">

                Access Request Submitted

            </h3>

            <!-- DESCRIPTION -->

            <p
                class="text-slate-500 leading-6 max-w-md mx-auto">

                Your request to access the HSRC ID System
                has been successfully submitted.

            </p>

            <!-- STATUS CARD -->

            <div
                class="mt-6 rounded-2xl
                       border border-amber-200
                       bg-amber-50
                       p-5 text-left">

                <div class="flex items-center gap-3">

                    <div
                        class="w-10 h-10 rounded-full
                               bg-amber-100
                               flex items-center justify-center">

                        <span>🟡</span>

                    </div>

                    <div>

                        <p
                            class="font-bold text-amber-800">

                            Pending Admin Approval

                        </p>

                        <p
                            class="text-sm text-amber-700 mt-1">

                            ${message || "Please wait for the administrator to review your request."}

                        </p>

                    </div>

                </div>

            </div>

            <!-- INFORMATION -->

            <p
                class="mt-5 text-sm text-slate-400 leading-6">

                Once your request is approved, you will receive
                an email with your secure HSRC ID System access link.

            </p>

            <!-- CLOSE -->

            <button
                id="idAccessPendingCloseBtn"
                type="button"
                class="mt-8 w-full
                       rounded-2xl
                       bg-[#024746]
                       hover:bg-[#03635f]
                       text-white
                       py-3.5
                       font-bold
                       transition">

                Close

            </button>

        </div>

    `;

    document
        .getElementById("idAccessPendingCloseBtn")
        .addEventListener(
            "click",
            closeIDModal
        );

}

/* ============================================
   HSRC ID SYSTEM ACCESS - APPROVED
   ============================================ */

function showIDAccessApproved(message) {

    const modalContent =
        document.querySelector("#idModal .p-8");

    if (!modalContent) return;

    modalContent.innerHTML = `

        <div class="text-center py-6">

            <!-- APPROVED ICON -->

            <div class="relative w-24 h-24 mx-auto mb-7">

                <div
                    class="absolute inset-0 rounded-full
                           bg-green-100 animate-pulse">
                </div>

                <div
                    class="relative w-24 h-24 rounded-full
                           bg-green-50 border-4 border-green-200
                           flex items-center justify-center">

                    <span class="text-4xl">
                        ✓
                    </span>

                </div>

            </div>

            <!-- TITLE -->

            <h3
                class="text-2xl md:text-3xl font-extrabold
                       text-[#024746] mb-3">

                Access Approved!

            </h3>

            <p
                class="text-slate-500 leading-6 max-w-md mx-auto">

                Your access to the HSRC ID System has been
                approved by the administrator.

            </p>

            <!-- APPROVED CARD -->

            <div
                class="mt-6 rounded-2xl
                       border border-green-200
                       bg-green-50
                       p-5 text-left">

                <div class="flex items-center gap-3">

                    <div
                        class="w-10 h-10 rounded-full
                               bg-green-100
                               flex items-center justify-center">

                        <span>🟢</span>

                    </div>

                    <div>

                        <p
                            class="font-bold text-green-800">

                            ID System Access Granted

                        </p>

                        <p
                            class="text-sm text-green-700 mt-1">

                            ${message || "You may now continue to the HSRC ID System."}

                        </p>

                    </div>

                </div>

            </div>

            <!-- CONTINUE -->

            <button
                id="idAccessContinueBtn"
                type="button"
                class="mt-8 w-full
                       rounded-2xl
                       bg-[#024746]
                       hover:bg-[#03635f]
                       text-white
                       py-3.5
                       font-bold
                       transition">

                Continue to ID System

            </button>

            <!-- CLOSE -->

            <button
                id="idAccessApprovedCloseBtn"
                type="button"
                class="mt-3 w-full
                       rounded-2xl
                       border border-slate-200
                       hover:bg-slate-50
                       text-slate-600
                       py-3
                       font-semibold
                       transition">

                Close

            </button>

        </div>

    `;

    document
        .getElementById("idAccessContinueBtn")
        .addEventListener(
            "click",
            () => {

                showIDWelcomeScreen();

            }
        );

    document
        .getElementById("idAccessApprovedCloseBtn")
        .addEventListener(
            "click",
            closeIDModal
        );

}

/* ============================================
   HSRC ID SYSTEM ACCESS - REJECTED
   ============================================ */

function showIDAccessRejected(message) {

    const modalContent =
        document.querySelector("#idModal .p-8");

    if (!modalContent) return;

    modalContent.innerHTML = `

        <div class="text-center py-6">

            <!-- REJECTED ICON -->

            <div class="relative w-24 h-24 mx-auto mb-7">

                <div
                    class="absolute inset-0 rounded-full
                           bg-red-100 animate-pulse">
                </div>

                <div
                    class="relative w-24 h-24 rounded-full
                           bg-red-50 border-4 border-red-200
                           flex items-center justify-center">

                    <span class="text-4xl">
                        ✕
                    </span>

                </div>

            </div>

            <!-- TITLE -->

            <h3
                class="text-2xl md:text-3xl font-extrabold
                       text-[#024746] mb-3">

                Access Request Rejected

            </h3>

            <p
                class="text-slate-500 leading-6 max-w-md mx-auto">

                Unfortunately, your request to access the
                HSRC ID System was not approved.

            </p>

            <!-- REJECTED CARD -->

            <div
                class="mt-6 rounded-2xl
                       border border-red-200
                       bg-red-50
                       p-5 text-left">

                <div class="flex items-center gap-3">

                    <div
                        class="w-10 h-10 rounded-full
                               bg-red-100
                               flex items-center justify-center">

                        <span>🔴</span>

                    </div>

                    <div>

                        <p
                            class="font-bold text-red-800">

                            Access Not Granted

                        </p>

                        <p
                            class="text-sm text-red-700 mt-1">

                            ${message || "Please contact the administrator for assistance regarding your access request."}

                        </p>

                    </div>

                </div>

            </div>

            <!-- INFORMATION -->

            <p
                class="mt-5 text-sm text-slate-400 leading-6">

                If you believe this was a mistake, please
                contact your Sales Manager or HSRC administrator.

            </p>

            <!-- CLOSE -->

            <button
                id="idAccessRejectedCloseBtn"
                type="button"
                class="mt-8 w-full
                       rounded-2xl
                       bg-[#024746]
                       hover:bg-[#03635f]
                       text-white
                       py-3.5
                       font-bold
                       transition">

                Close

            </button>

        </div>

    `;

    document
        .getElementById("idAccessRejectedCloseBtn")
        .addEventListener(
            "click",
            closeIDModal
        );

}

/* ============================================
   CHECK EXISTING HSRC ID SYSTEM ACCESS
   ============================================ */

async function checkExistingIDSystemAccess() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const accessToken =
        params.get("id_access") || "";

    // =========================================
    // APPROVAL LINK WITH TOKEN
    // =========================================

    if (accessToken) {

        await validateIDAccessToken(
            accessToken
        );

        return;

    }

    // =========================================
    // NO TOKEN
    // SHOW ACCESS REQUEST GATE
    // =========================================

    showIDAccessGate();

}

/* ============================================
   VALIDATE HSRC ID SYSTEM ACCESS TOKEN
   ============================================ */

async function validateIDAccessToken(accessToken) {

    const modalContent =
        document.querySelector("#idModal .p-8");

    // =========================================
    // SHOW LOADING SCREEN
    // =========================================

    showIDAccessLoading();

    try {

        const response =
            await fetch(
                WEB_APP_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({

                        action:
                            "id_validate_access_token",

                        payload: {

                            accessToken:
                                accessToken

                        }

                    })

                }
            );

        const result =
            await response.json();

        console.log(
            "HSRC ID ACCESS TOKEN RESULT:",
            result
        );

        // =========================================
        // VALID APPROVED TOKEN
        // =========================================

        if (
            result.ok &&
            result.status === "APPROVED"
        ) {

            showIDAccessApproved(
                result.message
            );

            return;

        }

        // =========================================
        // INVALID TOKEN
        // =========================================

        showIDAccessInvalid(
            result.error ||
            "This HSRC ID System access link is invalid or expired."
        );

    } catch (error) {

        console.error(
            "HSRC ID ACCESS TOKEN ERROR:",
            error
        );

        showIDAccessMessage(
            "Unable to verify your access. Please try again.",
            "error"
        );

    }

}

/* ============================================
   HSRC ID SYSTEM ACCESS - INVALID TOKEN
   ============================================ */

function showIDAccessInvalid(message) {

    const modalContent =
        document.querySelector("#idModal .p-8");

    if (!modalContent) return;

    modalContent.innerHTML = `

        <div class="text-center py-6">

            <!-- INVALID ICON -->

            <div class="relative w-24 h-24 mx-auto mb-7">

                <div
                    class="absolute inset-0 rounded-full
                           bg-red-100 animate-pulse">
                </div>

                <div
                    class="relative w-24 h-24 rounded-full
                           bg-red-50 border-4 border-red-200
                           flex items-center justify-center">

                    <span class="text-4xl">
                        🔒
                    </span>

                </div>

            </div>

            <!-- TITLE -->

            <h3
                class="text-2xl md:text-3xl font-extrabold
                       text-[#024746] mb-3">

                Access Link Invalid

            </h3>

            <!-- DESCRIPTION -->

            <p
                class="text-slate-500 leading-6 max-w-md mx-auto">

                This HSRC ID System access link is
                invalid or has expired.

            </p>

            <!-- STATUS CARD -->

            <div
                class="mt-6 rounded-2xl
                       border border-red-200
                       bg-red-50
                       p-5 text-left">

                <div class="flex items-center gap-3">

                    <div
                        class="w-10 h-10 rounded-full
                               bg-red-100
                               flex items-center justify-center">

                        <span>🔴</span>

                    </div>

                    <div>

                        <p
                            class="font-bold text-red-800">

                            Access Not Verified

                        </p>

                        <p
                            class="text-sm text-red-700 mt-1">

                            ${message ||
        "Please use the secure access link sent to your registered email address."}

                        </p>

                    </div>

                </div>

            </div>

            <!-- INFORMATION -->

            <p
                class="mt-5 text-sm text-slate-400 leading-6">

                If you need access to the HSRC ID System,
                please submit a new access request.

            </p>

            <!-- CLOSE -->

            <button
                id="idAccessInvalidCloseBtn"
                type="button"
                class="mt-8 w-full
                       rounded-2xl
                       bg-[#024746]
                       hover:bg-[#03635f]
                       text-white
                       py-3.5
                       font-bold
                       transition">

                Close

            </button>

        </div>

    `;

    document
        .getElementById("idAccessInvalidCloseBtn")
        .addEventListener(
            "click",
            closeIDModal
        );

}

idCloseBtn.addEventListener("click", closeIDModal);

function closeIDModal() {

    idModal.classList.add("hidden");

    idOverlay.classList.add("hidden");

}

function showClassificationStep() {

    const modalContent =
        document.querySelector("#idModal .p-8");


    modalContent.innerHTML = `

        <!-- =========================================
             STEP PROGRESS
             ========================================= -->

        <div class="mb-6">

            <div class="flex justify-between text-sm text-slate-500 mb-2">

                <span>Step 1 of 8</span>

                <span>12%</span>

            </div>


            <div class="w-full bg-slate-200 rounded-full h-2">

                <div
                    class="bg-[#024746] h-2 rounded-full"
                    style="width:12%">
                </div>

            </div>

        </div>


        <!-- =========================================
             TITLE
             ========================================= -->

        <h3 class="text-2xl font-bold text-[#024746] mb-2">

            Classification

        </h3>


        <p class="text-slate-500 mb-6">

            Please select your classification.

        </p>


        <!-- =========================================
             CLASSIFICATION OPTIONS
             ========================================= -->

        <div class="space-y-4">


            <!-- NEW AGENT -->

            <label
                class="border rounded-xl p-4 flex items-center gap-3
                       cursor-pointer hover:border-[#024746]">

                <input
                    type="radio"
                    name="classification"
                    value="new">

                <span class="font-medium">

                    New Agent

                </span>

            </label>


            <!-- OLD AGENT -->

            <label
                class="border rounded-xl p-4 flex items-center gap-3
                       cursor-pointer hover:border-[#024746]">

                <input
                    type="radio"
                    name="classification"
                    value="old">

                <span class="font-medium">

                    Old Agent

                </span>

            </label>


            <!-- FOR RENEWAL -->

            <label
                class="border rounded-xl p-4 flex items-center gap-3
                       cursor-pointer hover:border-[#024746]">

                <input
                    type="radio"
                    name="classification"
                    value="renewal">

                <span class="font-medium">

                    For Renewal

                </span>

            </label>


        </div>


        <!-- =========================================
             NAVIGATION BUTTONS
             ========================================= -->

        <div class="flex justify-between mt-8">


            <button
                id="classificationBack"
                type="button"
                class="px-6 py-3 rounded-xl border">

                ← Back

            </button>


            <button
                id="classificationNext"
                type="button"
                class="bg-[#024746]
                       hover:bg-[#03635f]
                       text-white
                       px-8 py-3
                       rounded-xl
                       font-semibold">

                Next →

            </button>


        </div>

    `;


    /* =============================================
       CLASSIFICATION INPUTS
       ============================================= */

    const classificationInputs =
        document.querySelectorAll(
            'input[name="classification"]'
        );


    /* =============================================
       CLASSIFICATION CHANGE
       ============================================= */

    classificationInputs.forEach(
        input => {

            input.addEventListener(
                "change",
                function () {

                    applicationData.classification =
                        this.value;

                }
            );

        }
    );


    /* =============================================
       BACK BUTTON
       ============================================= */

    document
        .getElementById("classificationBack")
        ?.addEventListener(
            "click",
            showIDWelcomeScreen
        );


    /* =============================================
       NEXT BUTTON
       ============================================= */

    document
        .getElementById("classificationNext")
        ?.addEventListener(
            "click",
            function () {


                /* =================================
                   CLASSIFICATION REQUIRED
                   ================================= */

                if (
                    !applicationData.classification
                ) {

                    alert(
                        "Please select your classification."
                    );

                    return;

                }


                /* =================================
                   GO TO STEP 2
                   ================================= */

                showLicenseStep();

            }
        );


    /* =============================================
       RESTORE PREVIOUS SELECTION
       ============================================= */

    if (
        applicationData.classification
    ) {

        const savedClassification =
            document.querySelector(
                `input[name="classification"][value="${applicationData.classification}"]`
            );


        if (savedClassification) {

            savedClassification.checked =
                true;

        }

    }

}

const idStartBtn = document.getElementById("idStartBtn");

idStartBtn.addEventListener("click", showClassificationStep);

function showLicenseStep() {

    // =============================================
    // GET CLASSIFICATION
    // =============================================

    const selected =
        document.querySelector(
            'input[name="classification"]:checked'
        );

    // If coming from Step 1 → Step 2,
    // save the selected classification.
    if (selected) {

        applicationData.classification =
            selected.value;

    }

    // If there is still no saved classification,
    // only then show the validation.
    if (!applicationData.classification) {

        alert("Please select your classification.");
        return;

    }


    // =============================================
    // BUILD STEP 2
    // =============================================

    const modalContent =
        document.querySelector("#idModal .p-8");


    modalContent.innerHTML = `

        <div class="mb-6">

            <div class="flex justify-between text-sm text-slate-500 mb-2">

                <span>Step 2 of 8</span>

                <span>25%</span>

            </div>

            <div class="w-full bg-slate-200 rounded-full h-2">

                <div
                    class="bg-[#024746] h-2 rounded-full transition-all duration-300"
                    style="width:25%">
                </div>

            </div>

        </div>


        <h3 class="text-2xl font-bold text-[#024746] mb-2">

            PRC & DHSUD License

        </h3>


        <p class="text-slate-500 mb-6">

            Please select your license status.

        </p>


        <div class="space-y-4">


            <div
                id="renewal-id-container"
                style="display:none;"
                class="space-y-2 mb-4">

                <label class="block text-sm font-semibold text-slate-700">

                    Existing ID Number
                    <span class="text-red-500">*</span>

                </label>


                <input
    type="text"
    id="existingIdNumber"
    placeholder="000-000"
    maxlength="7"
    inputmode="numeric"
    class="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#024746] focus:border-[#024746]">

            </div>


            <label
                class="border rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-[#024746]">

                <input
                    type="radio"
                    name="license"
                    value="yes">

                <span>
                    Yes, I have PRC & DHSUD License
                </span>

            </label>


            <label
                class="border rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-[#024746]">

                <input
                    type="radio"
                    name="license"
                    value="none">

                <span>
                    None
                </span>

            </label>


        </div>


        <div class="flex justify-between mt-8">


            <button
                id="backClassification"
                type="button"
                class="px-6 py-3 rounded-xl border">

                ← Back

            </button>


            <button
                id="nextPosition"
                type="button"
                class="bg-[#024746] hover:bg-[#03635f] text-white px-8 py-3 rounded-xl font-semibold">

                Next →

            </button>


        </div>

    `;


    // =============================================
    // BACK → STEP 1
    // =============================================

    document
        .getElementById("backClassification")
        .addEventListener(
            "click",
            showClassificationStep
        );


    // =============================================
    // NEXT → STEP 3
    // =============================================

    document
        .getElementById("nextPosition")
        .addEventListener(
            "click",
            () => showPositionStep(false)
        );


    // =============================================
    // RENEWAL
    // =============================================

    const renewalContainer =
        document.getElementById(
            "renewal-id-container"
        );


    if (
        applicationData.classification ===
        "renewal"
    ) {

        renewalContainer.style.display =
            "block";


        // Renewal automatically uses YES

        applicationData.license =
            "yes";


        const yesLicense =
            document.querySelector(
                'input[name="license"][value="yes"]'
            );


        if (yesLicense) {

            yesLicense.checked = true;

        }

    }

    else {

        renewalContainer.style.display =
            "none";

    }


    // =============================================
    // RESTORE LICENSE SELECTION
    // =============================================

    if (
        applicationData.license
    ) {

        const savedLicense =
            document.querySelector(
                `input[name="license"][value="${applicationData.license}"]`
            );


        if (savedLicense) {

            savedLicense.checked =
                true;

        }

    }


    // =============================================
    // RESTORE EXISTING ID NUMBER
    // =============================================

    if (
        applicationData.classification ===
        "renewal" &&
        applicationData.existingIdNumber
    ) {

        const existingIdInput =
            document.getElementById(
                "existingIdNumber"
            );


        if (existingIdInput) {

            existingIdInput.value =
                applicationData.existingIdNumber;

        }

    }

    // =============================================
    // EXISTING ID NUMBER AUTO FORMAT: 000-000
    // =============================================

    const existingIdInput =
        document.getElementById("existingIdNumber");

    if (existingIdInput) {

        existingIdInput.addEventListener(
            "input",
            function () {

                // Keep numbers only
                let value =
                    this.value.replace(/\D/g, "");

                // Maximum 6 digits
                value =
                    value.substring(0, 6);

                // Add "-" automatically after 3 digits
                if (value.length > 3) {

                    value =
                        value.substring(0, 3) +
                        "-" +
                        value.substring(3);

                }

                this.value = value;

            }
        );

    }

}

// Restore previously selected license
if (applicationData.license) {

    const savedLicense = document.querySelector(
        `input[name="license"][value="${applicationData.license}"]`
    );

    if (savedLicense) {
        savedLicense.checked = true;
    }

}

// Restore existing ID number for renewal
if (
    applicationData.classification === "renewal" &&
    applicationData.existingIdNumber
) {

    const existingIdInput =
        document.getElementById("existingIdNumber");

    if (existingIdInput) {
        existingIdInput.value =
            applicationData.existingIdNumber;
    }

}

async function showPositionStep(isBack = false) {

    // =============================================
    // GET LICENSE SELECTION
    // =============================================

    const selected =
        document.querySelector(
            'input[name="license"]:checked'
        );

    // =============================================
    // STEP 2 → NEXT → STEP 3
    // Validate license only when moving forward
    // =============================================

    if (!isBack) {

        if (!selected) {

            alert("Please select your license status.");
            return;

        }

        applicationData.license =
            selected.value;

    }

    // =============================================
    // STEP 4 → BACK → STEP 3
    // Use previously saved license
    // No validation / no alert
    // =============================================

    if (
        isBack &&
        !applicationData.license
    ) {

        console.warn(
            "No saved license found while going back to Step 3."
        );

        return;

    }


    // =============================================
    // RENEWAL VALIDATION
    // ONLY RUN WHEN COMING FROM STEP 2
    // =============================================

    if (
        selected &&
        applicationData.classification === "renewal"
    ) {

        const existingIdInput =
            document.getElementById(
                "existingIdNumber"
            );

        const existingId =
            existingIdInput
                ? existingIdInput.value.trim()
                : applicationData.existingIdNumber;


        if (!existingId) {

            alert(
                "Please enter your Existing ID Number."
            );

            return;

        }


        // Prevent double-click while checking

        const nextButton =
            document.getElementById(
                "nextPosition"
            );


        if (nextButton) {

            nextButton.disabled = true;
            nextButton.textContent =
                "Checking ID...";

        }


        try {

            const response =
                await fetch(
                    WEB_APP_URL,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },

                        body: JSON.stringify({

                            action:
                                "id_validate_existing_id",

                            existingIdNo:
                                existingId

                        })

                    }
                );


            const result =
                await response.json();


            if (!result.ok) {

                alert(
                    result.error ||
                    "ID Number not found. Please check your Existing ID Number."
                );


                if (nextButton) {

                    nextButton.disabled =
                        false;

                    nextButton.textContent =
                        "Next →";

                }

                return;

            }


            /*
             * Existing ID successfully verified
             */

            applicationData.existingIdNumber =
                result.idNumber;


        } catch (error) {

            console.error(
                "Existing ID validation error:",
                error
            );


            alert(
                "Unable to verify the Existing ID Number. Please try again."
            );


            if (nextButton) {

                nextButton.disabled =
                    false;

                nextButton.textContent =
                    "Next →";

            }

            return;

        }


        if (nextButton) {

            nextButton.disabled =
                false;

            nextButton.textContent =
                "Next →";

        }

    }


    // =============================================
    // BUILD STEP 3
    // =============================================

    const modalContent =
        document.querySelector(
            "#idModal .p-8"
        );


    let positionHTML = "";


    const availablePositions =
        POSITIONS.filter(position => {

            if (
                applicationData.license ===
                "none"
            ) {

                return [

                    "propertyassistant",
                    "salesmanager",
                    "salesdirector",
                    "seniorsalesdirector"

                ].includes(
                    position.id
                );

            }

            return true;

        });


    availablePositions.forEach(
        position => {

            positionHTML += `

                <label
                    class="border rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-[#024746]">

                    <input
                        type="radio"
                        name="position"
                        value="${position.id}">

                    <span>
                        ${position.label}
                    </span>

                </label>

            `;

        }
    );


    modalContent.innerHTML = `

        <div class="mb-6">

            <div
                class="flex justify-between text-sm text-slate-500 mb-2">

                <span>
                    Step 3 of 8
                </span>

                <span>
                    38%
                </span>

            </div>


            <div
                class="w-full bg-slate-200 rounded-full h-2">

                <div
                    class="bg-[#024746] h-2 rounded-full"
                    style="width:38%">
                </div>

            </div>

        </div>


        <h3
            class="text-2xl font-bold text-[#024746] mb-2">

            Select Position

        </h3>


        <p
            class="text-slate-500 mb-6">

            Please select your current position.

        </p>


        <div class="space-y-4">

            ${positionHTML}

        </div>


        <div
            class="flex justify-between mt-8">


            <button
                id="backLicense"
                type="button"
                class="px-6 py-3 rounded-xl border">

                ← Back

            </button>


            <button
                id="nextDetails"
                type="button"
                class="bg-[#024746] hover:bg-[#03635f] text-white px-8 py-3 rounded-xl font-semibold">

                Next →

            </button>


        </div>

    `;


    // =============================================
    // STEP 3 → BACK → STEP 2
    // =============================================

    document
        .getElementById("backLicense")
        .addEventListener(
            "click",
            () => showLicenseStep(true)
        );


    // =============================================
    // STEP 3 → NEXT → STEP 4
    // =============================================

    document
        .getElementById("nextDetails")
        .addEventListener(
            "click",
            () => showDetailsStep(false)
        );


    // =============================================
    // RESTORE POSITION
    // =============================================

    if (
        applicationData.position
    ) {

        const savedPosition =
            document.querySelector(
                `input[name="position"][value="${applicationData.position}"]`
            );


        if (savedPosition) {

            savedPosition.checked =
                true;

        }

    }

}

function showDetailsStep(isBack = false) {

    if (!isBack) {

        const selected =
            document.querySelector(
                'input[name="position"]:checked'
            );

        if (!selected) {

            alert("Please select your position.");
            return;

        }

        applicationData.position = String(selected.value).trim().toLowerCase();

    }

    const modalContent = document.querySelector("#idModal .p-8");


    let fields = `
<div class="space-y-5">

    <div>
        <label class="block text-sm font-semibold mb-2">
            Date Started <span class="text-red-500">*</span>
        </label>

        <input
            id="dateStarted"
            type="date"
            class="w-full border rounded-xl px-4 py-3">
    </div>

    ${applicationData.license === "none" ? `
    <div>
        <label class="block text-sm font-semibold mb-2">
            Under Supervision of <span class="text-red-500">*</span>
        </label>

        <input
            id="underSupervision"
            type="text"
            placeholder="Enter Supervisor Name"
            class="w-full border rounded-xl px-4 py-3">
    </div>
    ` : ""}

    <div>
        <label class="block text-sm font-semibold mb-2">
            PRC Number <span class="text-red-500">*</span>
        </label>

        <input
            id="prcNo"
            type="text"
            placeholder="Enter PRC Number"
            class="w-full border rounded-xl px-4 py-3">
    </div>

    <div>
        <label class="block text-sm font-semibold mb-2">
            DHSUD Number <span class="text-red-500">*</span>
        </label>

        <input
            id="dhsudNo"
            type="text"
            placeholder="Enter DHSUD Number"
            class="w-full border rounded-xl px-4 py-3">
    </div>

</div>
`;

    modalContent.innerHTML = `
        <div class="mb-6">

            <div class="flex justify-between text-sm text-slate-500 mb-2">
                <span>Step 4 of 8</span>
                <span>50%</span>
            </div>

            <div class="w-full bg-slate-200 rounded-full h-2">
                <div class="bg-[#024746] h-2 rounded-full"
                     style="width:50%">
                </div>
            </div>

        </div>

        <h3 class="text-2xl font-bold text-[#024746] mb-2">
            Applicant Details
        </h3>

        <p class="text-slate-500 mb-6">
            Complete the required information.
        </p>

        ${fields}

        <div class="flex justify-between mt-8">

            <button id="backPosition"
                class="px-6 py-3 border rounded-xl">
                ← Back
            </button>

            <button id="nextPersonal"
                class="bg-[#024746] text-white px-8 py-3 rounded-xl">
                Next →
            </button>

        </div>
    `;

    document
        .getElementById("backPosition")
        .addEventListener(
            "click",
            () => showPositionStep(true)
        );

    document
        .getElementById("nextPersonal")
        .addEventListener("click", saveApplicantDetails);

    // =============================================
    // RESTORE PREVIOUS LICENSE SELECTION
    // =============================================

    if (applicationData.license) {

        const savedLicense =
            document.querySelector(
                `input[name="license"][value="${applicationData.license}"]`
            );

        if (savedLicense) {
            savedLicense.checked = true;
        }

    }


    // =============================================
    // RESTORE EXISTING ID NUMBER FOR RENEWAL
    // =============================================

    if (
        applicationData.classification === "renewal" &&
        applicationData.existingIdNumber
    ) {

        const existingIdInput =
            document.getElementById("existingIdNumber");

        if (existingIdInput) {

            existingIdInput.value =
                applicationData.existingIdNumber;

        }

    }

}



function saveApplicantDetails() {

    // Make sure saved position still exists
    if (!applicationData.position) {

        alert("Please select your position.");

        return;

    }

    const dateStarted = document.getElementById("dateStarted").value;
    const underSupervision = document.getElementById("underSupervision") ? document.getElementById("underSupervision").value.trim() : "";
    const prcNo = document.getElementById("prcNo").value.trim();
    const dhsudNo = document.getElementById("dhsudNo").value.trim();

    if (!dateStarted) {
        alert("Please select your Date Started.");
        return;
    }

    if (
        applicationData.license === "none" &&
        !underSupervision
    ) {
        alert("Please enter the Supervisor Name.");
        return;
    }

    if (!prcNo) {
        alert("Please enter your PRC Number.");
        return;
    }

    if (!dhsudNo) {
        alert("Please enter your DHSUD Number.");
        return;
    }

    applicationData.dateStarted = dateStarted;
    applicationData.underSupervision = underSupervision;
    applicationData.prcNo = prcNo;
    applicationData.dhsudNo = dhsudNo;

    /*************************************************
     * CALCULATE ID VALID UNTIL
     *************************************************/

    const validityYears = {

        propertyassistant: 1,
        salesperson: 1,
        salesmanager: 2,
        salesdirector: 3,
        seniorsalesdirector: 3

    };

    const years = validityYears[applicationData.position];

    console.log("POSITION VALUE:", applicationData.position);
    console.log("POSITION TYPE:", typeof applicationData.position);

    if (!years) {

        alert("Unable to determine ID validity for this position.");
        return;

    }

    const validUntilDate = new Date(dateStarted + "T00:00:00");

    validUntilDate.setFullYear(
        validUntilDate.getFullYear() + years
    );

    applicationData.validUntil =
        validUntilDate.toISOString().split("T")[0];

    console.log("ID VALID UNTIL:", applicationData.validUntil);

    console.log(applicationData);

    showPersonalInformation();

}

function showPersonalInformation() {

    const modalContent = document.querySelector("#idModal .p-8");

    modalContent.innerHTML = `

        <div class="mb-6">

            <div class="flex justify-between text-sm text-slate-500 mb-2">
                <span>Step 5 of 8</span>
                <span>63%</span>
            </div>

            <div class="w-full bg-slate-200 rounded-full h-2">
                <div class="bg-[#024746] h-2 rounded-full"
                     style="width:63%">
                </div>
            </div>

        </div>

        <h3 class="text-2xl font-bold text-[#024746] mb-2">
            Personal Information
        </h3>

        <p class="text-slate-500 mb-6">
            Complete your personal and company information.
        </p>

        <div class="space-y-5">

            <input id="fullName"
                type="text"
                placeholder="Full Name *"
                class="w-full border rounded-xl px-4 py-3">

            <textarea id="address"
                placeholder="Full Home Address *"
                class="w-full border rounded-xl px-4 py-3"></textarea>

            <input id="idSystemBirthdate"
    name="birthdate"
    type="date"
    class="w-full border rounded-xl px-4 py-3">

            <input id="contactNumber"
                type="text"
                placeholder="Contact Number *"
                class="w-full border rounded-xl px-4 py-3">

            <input id="idSystemEmail"
                type="email"
                placeholder="Email Address *"
                class="w-full border rounded-xl px-4 py-3">

            <hr>

            <input id="sss"
                type="text"
                placeholder="SSS Number"
                class="w-full border rounded-xl px-4 py-3">

            <input id="tin"
                type="text"
                placeholder="TIN Number"
                class="w-full border rounded-xl px-4 py-3">

            <input id="pagibig"
                type="text"
                placeholder="Pag-IBIG Number"
                class="w-full border rounded-xl px-4 py-3">

            <input id="philhealth"
                type="text"
                placeholder="PhilHealth Number"
                class="w-full border rounded-xl px-4 py-3">

            <hr>

            <input id="teamSalesHead"
                type="text"
                placeholder="Team Name / Sales Head *"
                class="w-full border rounded-xl px-4 py-3">

            <div class="pt-2">

    <p class="text-sm font-semibold text-slate-700 mb-3">
        IN CASE OF EMERGENCY PLEASE CONTACT THIS PERSON
    </p>

    <input
        id="emergencyName"
        type="text"
        placeholder="Emergency Contact Name *"
        class="w-full border rounded-xl px-4 py-3 mb-3">

    <input
        id="emergencyContact"
        type="text"
        placeholder="Emergency Contact Number *"
        class="w-full border rounded-xl px-4 py-3">

</div>

        </div>

        <div class="space-y-2 mt-5">

    <label class="block text-sm font-semibold text-slate-700">
        Branch <span class="text-red-500">*</span>
    </label>

    <select
        id="branch"
        class="w-full border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#024746] focus:border-[#024746]"
        required>

        <option value="">Select Branch</option>
        <option value="East Branch">East Branch</option>
        <option value="North Branch">North Branch</option>
        <option value="South Branch">South Branch</option>
        <option value="Southwest Branch">Southwest Branch</option>

    </select>

</div>

<!-- =========================================
     VALID ID UPLOAD — NEW AGENT ONLY
     ========================================= -->

<div
    id="validIdUploadSection"
    class="hidden mt-5">

    <div
        class="border-2 border-dashed
               border-slate-300
               rounded-2xl
               p-5
               bg-slate-50">

        <div class="flex items-start gap-3">

            <div
                class="w-10 h-10 rounded-xl
                       bg-[#024746]/10
                       flex items-center justify-center
                       flex-shrink-0">

                <span class="text-xl">🪪</span>

            </div>

            <div>

                <h4 class="font-bold text-[#024746]">
                    Upload Valid ID
                </h4>

                <p class="text-sm text-slate-500 mt-1">
                    Required for New Agent only.
                </p>

            </div>

        </div>

        <input
            id="validIdInput"
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            class="hidden">

        <button
            id="chooseValidIdBtn"
            type="button"
            class="w-full mt-4
                   bg-white
                   border border-[#024746]
                   text-[#024746]
                   hover:bg-[#024746]
                   hover:text-white
                   px-5 py-3
                   rounded-xl
                   font-semibold">

            📎 Choose Valid ID

        </button>

        <div
            id="validIdPreview"
            class="hidden mt-4">
        </div>

        <p
            class="text-xs text-slate-400
                   mt-3 text-center">

            JPG, JPEG, PNG or PDF · Maximum 5MB

        </p>

    </div>

</div>

        <div class="flex justify-between mt-8">

            <button id="backDetails"
                class="px-6 py-3 border rounded-xl">

                ← Back

            </button>

            <button id="nextPhoto"
                class="bg-[#024746] text-white px-8 py-3 rounded-xl">

                Next →

            </button>

        </div>

    `;

    document
        .getElementById("backDetails")
        .addEventListener("click", () => showDetailsStep(true));

    document
        .getElementById("nextPhoto")
        .addEventListener("click", savePersonalInformation);



    /* =============================================
   VALID ID — NEW AGENT ONLY
   ============================================= */

    const validIdSection =
        document.getElementById(
            "validIdUploadSection"
        );

    const validIdInput =
        document.getElementById(
            "validIdInput"
        );

    const chooseValidIdBtn =
        document.getElementById(
            "chooseValidIdBtn"
        );

    const validIdPreview =
        document.getElementById(
            "validIdPreview"
        );


    /* =============================================
       SHOW / HIDE VALID ID
       ============================================= */

    if (
        applicationData.classification === "new"
    ) {

        validIdSection?.classList.remove(
            "hidden"
        );

    } else {

        validIdSection?.classList.add(
            "hidden"
        );

    }


    /* =============================================
       CHOOSE FILE BUTTON
       ============================================= */

    chooseValidIdBtn?.addEventListener(
        "click",
        () => {

            validIdInput?.click();

        }
    );


    /* =============================================
       FILE SELECT
       ============================================= */

    validIdInput?.addEventListener(
        "change",
        function () {

            const file =
                this.files?.[0];

            if (!file) return;


            /* -----------------------------------------
               ALLOWED FILE TYPES
               ----------------------------------------- */

            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "application/pdf"
            ];


            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {

                alert(
                    "Please upload a JPG, PNG, or PDF file only."
                );

                this.value = "";

                applicationData.validId = "";

                return;

            }


            /* -----------------------------------------
               MAXIMUM FILE SIZE — 5MB
               ----------------------------------------- */

            if (
                file.size >
                5 * 1024 * 1024
            ) {

                alert(
                    "The Valid ID file must not exceed 5MB."
                );

                this.value = "";

                applicationData.validId = "";

                return;

            }


            /* -----------------------------------------
               READ FILE
               ----------------------------------------- */

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    applicationData.validId =
                        event.target.result;


                    /* ---------------------------------
                       PREVIEW
                       --------------------------------- */

                    if (!validIdPreview) return;


                    validIdPreview.classList.remove(
                        "hidden"
                    );


                    if (
                        file.type ===
                        "application/pdf"
                    ) {

                        validIdPreview.innerHTML = `

                            <div
                                class="flex items-center gap-3
                                       bg-white
                                       border
                                       rounded-xl
                                       p-4">

                                <span class="text-2xl">
                                    📄
                                </span>

                                <div class="min-w-0">

                                    <p
                                        class="font-semibold
                                               text-slate-700
                                               truncate">

                                        ${escapeHTML(
                            file.name
                        )}

                                    </p>

                                    <p
                                        class="text-xs
                                               text-green-600
                                               mt-1">

                                        ✓ Valid ID selected

                                    </p>

                                </div>

                            </div>

                        `;

                    } else {

                        validIdPreview.innerHTML = `

                            <div class="text-center">

                                <img
                                    src="${event.target.result}"
                                    class="max-h-48
                                           max-w-full
                                           mx-auto
                                           rounded-xl
                                           border
                                           object-contain">

                                <p
                                    class="text-xs
                                           text-green-600
                                           mt-2">

                                    ✓ Valid ID selected

                                </p>

                            </div>

                        `;

                    }

                };


            reader.readAsDataURL(file);

        }
    );

}

function savePersonalInformation() {

    const fullName = document.getElementById("fullName").value.trim();
    const address = document.getElementById("address").value.trim();
    const birthdateInput = document.getElementById("idSystemBirthdate");

    birthdateInput.addEventListener("change", () => {
        console.log("CHANGE:", birthdateInput.value);
    });

    birthdateInput.addEventListener("input", () => {
        console.log("INPUT:", birthdateInput.value);
    });

    const birthdate = birthdateInput.value;
    const contactNumber = document.getElementById("contactNumber").value.trim();
    const email = document.getElementById("idSystemEmail").value.trim();
    const teamSalesHead = document.getElementById("teamSalesHead").value.trim();
    const emergencyName = document.getElementById("emergencyName").value.trim();
    const emergencyContact = document.getElementById("emergencyContact").value.trim();
    const branch = document.getElementById("branch").value;

    if (!fullName) {
        alert("Please enter your Full Name.");
        return;
    }

    if (!address) {
        alert("Please enter your Address.");
        return;
    }

    if (!birthdate) {
        alert("Please select your Birthdate.");
        return;
    }

    if (!contactNumber) {
        alert("Please enter your Contact Number.");
        return;
    }

    if (!email) {
        alert("Please enter your Email Address.");
        return;
    }

    if (!teamSalesHead) {
        alert("Please enter your Team Name / Sales Head.");
        return;
    }

    if (!emergencyName) {
        alert("Please enter the Emergency Contact Name.");
        return;
    }

    if (!emergencyContact) {
        alert("Please enter the Emergency Contact Number.");
        return;
    }

    if (!branch) {
        alert("Please select your Branch.");
        return;
    }

    applicationData.fullName =
        document.getElementById("fullName").value;

    applicationData.address =
        document.getElementById("address").value;

    applicationData.birthdate =
        document.getElementById("idSystemBirthdate").value;

    applicationData.contactNumber =
        document.getElementById("contactNumber").value;

    applicationData.email =
        document.getElementById("idSystemEmail").value;

    applicationData.sss =
        document.getElementById("sss").value;

    applicationData.tin =
        document.getElementById("tin").value;

    applicationData.pagibig =
        document.getElementById("pagibig").value;

    applicationData.philhealth =
        document.getElementById("philhealth").value;

    applicationData.teamSalesHead =
        document.getElementById("teamSalesHead").value;

    applicationData.emergencyName =
        document.getElementById("emergencyName").value;

    applicationData.emergencyContact =
        document.getElementById("emergencyContact").value;

    applicationData.branch =
        document.getElementById("branch").value;

    console.log(applicationData);

    showPhotoUpload();

}

function showPhotoUpload() {

    const modalContent = document.querySelector("#idModal .p-8");

    modalContent.innerHTML = `

        <div class="mb-6">

            <div class="flex justify-between text-sm text-slate-500 mb-2">
                <span>Step 6 of 8</span>
                <span>75%</span>
            </div>

            <div class="w-full bg-slate-200 rounded-full h-2">
                <div class="bg-[#024746] h-2 rounded-full"
                     style="width:75%">
                </div>
            </div>

        </div>

        <h3 class="text-2xl font-bold text-[#024746] mb-2">
            Upload 2x2 Photo
        </h3>

        <p class="text-slate-500 mb-6">
            Upload a clear photo with a white background.
        </p>

        <div class="flex flex-col items-center">

            <img id="photoPreview"
                 src="https://placehold.co/180x180?text=Photo"
                 class="w-44 h-44 rounded-xl object-cover border mb-4">

            <input
                id="photoInput"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                class="hidden">

            <button
                id="choosePhotoBtn"
                class="bg-[#024746] text-white px-6 py-3 rounded-xl">

                Choose Photo

            </button>

            <p class="text-xs text-slate-500 mt-4">

                JPG, JPEG or PNG only (Maximum 5MB)

            </p>

        </div>

        <div class="flex justify-between mt-8">

            <button
                id="backPersonal"
                class="px-6 py-3 border rounded-xl">

                ← Back

            </button>

            <button
                id="nextSignature"
                class="bg-[#024746] text-white px-8 py-3 rounded-xl">

                Next →

            </button>

        </div>

    `;

    document.getElementById("choosePhotoBtn")
        .addEventListener("click", () => {

            document.getElementById("photoInput").click();

        });

    document.getElementById("photoInput")
        .addEventListener("change", handlePhotoUpload);

    document.getElementById("backPersonal")
        .addEventListener("click", showPersonalInformation);

    document.getElementById("nextSignature")
        .addEventListener("click", showSignatureUpload);

}

function handlePhotoUpload(event) {

    const file = event.target.files[0];

    if (!file) return;

    // =============================================
    // VALIDATE FILE TYPE
    // =============================================

    if (!file.type.startsWith("image/")) {

        alert("Please upload JPG, JPEG or PNG.");

        return;

    }

    // =============================================
    // VALIDATE FILE SIZE
    // =============================================

    if (file.size > 5 * 1024 * 1024) {

        alert("Maximum photo size is 5MB.");

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        const img = new Image();

        img.onload = function () {

            // =============================================
            // CREATE SQUARE CANVAS
            // =============================================

            const size = 800;

            const canvas =
                document.createElement("canvas");

            canvas.width = size;
            canvas.height = size;

            const ctx =
                canvas.getContext("2d");

            // =============================================
            // TRANSPARENT BACKGROUND
            // =============================================

            ctx.clearRect(
                0,
                0,
                size,
                size
            );

            // =============================================
            // CREATE PERFECT CIRCLE CLIP
            // =============================================

            ctx.beginPath();

            ctx.arc(
                size / 2,
                size / 2,
                size / 2,
                0,
                Math.PI * 2
            );

            ctx.closePath();

            ctx.clip();

            // =============================================
            // CENTER-CROP IMAGE TO SQUARE
            // WITHOUT DISTORTION
            // =============================================

            const originalWidth =
                img.naturalWidth;

            const originalHeight =
                img.naturalHeight;

            const sourceSize =
                Math.min(
                    originalWidth,
                    originalHeight
                );

            const sourceX =
                (originalWidth - sourceSize) / 2;

            const sourceY =
                (originalHeight - sourceSize) / 2;

            ctx.drawImage(
                img,

                sourceX,
                sourceY,
                sourceSize,
                sourceSize,

                0,
                0,
                size,
                size
            );

            // =============================================
            // EXPORT AS PNG
            // PNG KEEPS TRANSPARENT CORNERS
            // =============================================

            const circularPhoto =
                canvas.toDataURL(
                    "image/png"
                );

            // =============================================
            // SAVE TO APPLICATION DATA
            // =============================================

            applicationData.photo =
                circularPhoto;

            // =============================================
            // UPDATE PREVIEW
            // =============================================

            document.getElementById(
                "photoPreview"
            ).src = circularPhoto;

        };

        img.src = e.target.result;

    };

    reader.readAsDataURL(file);

}

function showSignatureUpload() {

    const modalContent = document.querySelector("#idModal .p-8");

    modalContent.innerHTML = `

        <div class="mb-6">

            <div class="flex justify-between text-sm text-gray-500 mb-2">
                <span>Step 7 of 8</span>
                <span>87%</span>
            </div>

            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-[#024746] h-2 rounded-full" style="width:87%"></div>
            </div>

        </div>

        <h3 class="text-2xl font-bold text-[#024746] mb-2">
            Upload Signature
        </h3>

        <p class="text-gray-600 mb-6">
            Draw your signature or upload an existing one.
        </p>

        <div class="border rounded-xl overflow-hidden">

            <canvas
    id="signatureCanvas"
    class="w-full h-56 bg-white">
</canvas>

        </div>

        <div class="mt-3 flex gap-3">

            <button
                id="clearSignature"
                class="border rounded-lg px-4 py-2">

                Clear Signature

            </button>

        </div>

        <div class="my-6 flex items-center">

            <div class="flex-1 border-t"></div>

            <span class="mx-4 text-gray-500 text-sm">
                OR
            </span>

            <div class="flex-1 border-t"></div>

        </div>

        <input
            type="file"
            id="signatureUpload"
            accept="image/png,image/jpeg,image/jpg">

        <div class="mt-6">

            <h4 class="font-semibold mb-2">
                Preview
            </h4>

            <img
id="signaturePreview"
class="border rounded-lg w-64 h-24 bg-white object-contain">

        </div>

        <div class="flex justify-between mt-8">

            <button
                id="backBtn"
                class="border rounded-lg px-6 py-3">

                ← Back

            </button>

            <button
                id="idSystemNextBtn"
                class="bg-[#024746] text-white rounded-lg px-6 py-3">

                Next →

            </button>

        </div>

    `;

    initializeSignaturePad();

}

function initializeSignaturePad() {

    const canvas = document.getElementById("signatureCanvas");

    // Resize canvas to match displayed size
    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    const ctx = canvas.getContext("2d");

    ctx.scale(ratio, ratio);

    signaturePad = new SignaturePad(canvas, {

        backgroundColor: "white",

        penColor: "#000"

    });

    signaturePad.addEventListener("endStroke", function () {

        signatureSource = "draw";

        uploadedSignature = null;

        document.getElementById("signaturePreview").src =
            signaturePad.toDataURL();

    });

    document
        .getElementById("clearSignature")
        .addEventListener("click", clearSignature);

    document
        .getElementById("signatureUpload")
        .addEventListener("change", uploadSignature);

    document
        .getElementById("backBtn")
        .addEventListener("click", showPhotoUpload);

    document
        .getElementById("idSystemNextBtn")
        .addEventListener("click", saveSignature);

}

function uploadSignature(event) {

    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {

        alert("Please upload JPG, JPEG or PNG.");

        return;

    }

    if (file.size > 5 * 1024 * 1024) {

        alert("Maximum file size is 5MB.");

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        uploadedSignature = e.target.result;

        signatureSource = "upload";

        document.getElementById("signaturePreview").src =
            uploadedSignature;

        signaturePad.clear();

    };

    reader.readAsDataURL(file);

}

function clearSignature() {

    signaturePad.clear();

    uploadedSignature = null;

    signatureSource = null;

    applicationData.signature = null;

    document.getElementById("signaturePreview").src = "";

    document.getElementById("signatureUpload").value = "";

}

function saveSignature() {

    if (signatureSource === "draw") {

        if (signaturePad.isEmpty()) {

            alert("Please draw your signature.");

            return;

        }

        applicationData.signature =
            signaturePad.toDataURL();

    }

    else if (signatureSource === "upload") {

        applicationData.signature =
            uploadedSignature;

    }

    else {

        alert("Please provide your signature.");

        return;

    }

    function showReviewStep() {

        const modalContent = document.querySelector("#idModal .p-8");

        modalContent.innerHTML = `

    <div class="mb-6">

        <div class="flex justify-between text-sm text-slate-500 mb-2">
            <span>Step 8 of 8</span>
            <span>100%</span>
        </div>

        <div class="w-full bg-slate-200 rounded-full h-2">
            <div class="bg-[#024746] h-2 rounded-full" style="width:100%"></div>
        </div>

    </div>

    <h3 class="text-2xl font-bold text-[#024746] mb-2">
        Review Your Application
    </h3>

    <p class="text-slate-500 mb-6">
        Please review your information before submitting.
    </p>

    <div class="space-y-6 max-h-[420px] overflow-y-auto pr-2">

        <div class="border rounded-xl p-4">
            <h4 class="font-bold text-[#024746] mb-3">Classification</h4>

            <p><strong>Classification:</strong> ${applicationData.classification}</p>

            ${applicationData.classification === "renewal"
                ? `<p><strong>Existing ID Number:</strong> ${applicationData.existingIdNumber}</p>`
                : ""
            }
        </div>

        <div class="border rounded-xl p-4">

            <h4 class="font-bold text-[#024746] mb-3">
                Professional Information
            </h4>

            <p><strong>License:</strong> ${applicationData.license}</p>

<p><strong>Position:</strong> ${applicationData.position}</p>

<p><strong>Date Started:</strong> ${applicationData.dateStarted}</p>

<p><strong>Valid Until:</strong> ${applicationData.validUntil}</p>  

${applicationData.license === "none"
                ? `<p><strong>Under Supervision of:</strong> ${applicationData.underSupervision}</p>`
                : ""
            }

<p><strong>PRC Number:</strong> ${applicationData.prcNo || "-"}</p>

<p><strong>DHSUD Number:</strong> ${applicationData.dhsudNo || "-"}</p>

        </div>

        <div class="border rounded-xl p-4">

            <h4 class="font-bold text-[#024746] mb-3">
                Personal Information
            </h4>

            <p><strong>Full Name:</strong> ${applicationData.fullName}</p>

            <p><strong>Address:</strong> ${applicationData.address}</p>

            <p><strong>Birthdate:</strong> ${applicationData.birthdate}</p>

            <p><strong>Contact Number:</strong> ${applicationData.contactNumber}</p>

            <p><strong>Email:</strong> ${applicationData.email}</p>

            <p><strong>Branch:</strong> ${applicationData.branch}</p>

            <p><strong>Team / Sales Head:</strong> ${applicationData.teamSalesHead}</p>

            <div class="mt-4 pt-4 border-t">

</div>

            <p><strong>SSS:</strong> ${applicationData.sss || "-"}</p>

            <p><strong>TIN:</strong> ${applicationData.tin || "-"}</p>

            <p><strong>Pag-IBIG:</strong> ${applicationData.pagibig || "-"}</p>

            <p><strong>PhilHealth:</strong> ${applicationData.philhealth || "-"}</p>

            <div class="mt-4 pt-4 border-t">

    <p class="font-semibold text-[#024746] mb-2">
        IN CASE OF EMERGENCY PLEASE CONTACT THIS PERSON
    </p>

    <p>
        <strong>Name:</strong>
        ${applicationData.emergencyName}
    </p>

    <p>
        <strong>Contact Number:</strong>
        ${applicationData.emergencyContact}
    </p>

</div>

        </div>

        <div class="border rounded-xl p-4">

            <h4 class="font-bold text-[#024746] mb-3">
                Uploaded Files
            </h4>

            <div class="flex gap-8">

                <div>
                    <p class="font-semibold mb-2">Photo</p>

                    <img
                        src="${applicationData.photo}"
                        class="w-32 h-32 rounded-full border object-cover">
                </div>

                <div>
                    <p class="font-semibold mb-2">Signature</p>

                    <img
                        src="${applicationData.signature}"
                        class="w-40 h-20 border rounded bg-white object-contain">
                </div>

            </div>

        </div>

    </div>

    <div class="flex justify-between mt-8">

        <button
            id="backSignature"
            class="border rounded-xl px-6 py-3">

            ← Back

        </button>

        <button
            id="submitApplication"
            class="bg-[#024746] hover:bg-[#03635f] text-white rounded-xl px-8 py-3 font-semibold">

            Submit Application

        </button>

    </div>

    `;

        document
            .getElementById("backSignature")
            .addEventListener("click", showSignatureUpload);

        document
            .getElementById("submitApplication")
            .addEventListener("click", submitApplication);

    }

    showReviewStep();

}

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzzkerqDke1dbAqcLGD8WkrHLUY7eUOCGJXBaExiKc26hXCUPxu0UQ9Ejpi4kUgkng/exec";

async function submitApplication() {

    try {

        const submitBtn =
            document.getElementById("submitApplication");

        if (submitBtn) {
            submitBtn.disabled = true;
        }

        /*************************************************
         * SHOW PREMIUM LOADING
         *************************************************/

        showIDSubmissionLoading();

        const payload = {

            action: "id_submit_application",

            classification:
                applicationData.classification,

            existingIdNo:
                applicationData.existingIdNumber,

            licenseStatus:
                applicationData.license,

            position:
                applicationData.position,

            dateStarted:
                applicationData.dateStarted,

            validUntil:
                applicationData.validUntil,

            underSupervision:
                applicationData.underSupervision,

            prcNumber:
                applicationData.prcNo,

            dhsudNumber:
                applicationData.dhsudNo,

            fullName:
                applicationData.fullName,

            address:
                applicationData.address,

            birthdate:
                applicationData.birthdate,

            contactNumber:
                applicationData.contactNumber,

            email:
                applicationData.email,

            sss:
                applicationData.sss,

            tin:
                applicationData.tin,

            pagibig:
                applicationData.pagibig,

            philhealth:
                applicationData.philhealth,

            branch:
                applicationData.branch,

            team:
                applicationData.teamSalesHead,

            emergencyName:
                applicationData.emergencyName,

            emergencyContact:
                applicationData.emergencyContact,

            photo:
                applicationData.photo,

            signature:
                applicationData.signature,

            validId:
                applicationData.validId

        };

        const response = await fetch(
            WEB_APP_URL,
            {
                method: "POST",
                body: JSON.stringify(payload)
            }
        );

        const result = await response.json();

        console.log(
            "HSRC ID SUBMISSION RESULT:",
            result
        );

        /*************************************************
         * SUCCESS
         *************************************************/

        if (result.ok) {

            showIDSubmissionSuccess(
                result.idNumber
            );

            return;

        }

        /*************************************************
         * SERVER ERROR
         *************************************************/

        showIDSubmissionError(
            result.error ||
            "Submission failed. Please try again."
        );

    } catch (err) {

        console.error(
            "HSRC ID SUBMISSION ERROR:",
            err
        );

        showIDSubmissionError(
            "Unable to connect to the server. Please check your internet connection and try again."
        );

    }

}

/*************************************************
 * PREMIUM ID SUBMISSION LOADING
 *************************************************/

function showIDSubmissionLoading() {

    removeIDSubmissionOverlay();

    const overlay = document.createElement("div");

    overlay.id = "idSubmissionOverlay";

    overlay.className =
        "fixed inset-0 z-[100000] flex items-center justify-center bg-[#024746]/95 backdrop-blur-md p-6";

    overlay.innerHTML = `

        <div class="w-full max-w-md text-center text-white">

            <!-- HSRC LOGO -->

            <div class="flex justify-center mb-7">

                <div
    class="w-64 h-32 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl">

    <img
        src="logo10.png"
        class="w-52 h-auto object-contain"
        alt="Human Shelter Realty">

</div>      

            </div>

            <!-- PREMIUM LOADER -->

            <div class="relative w-20 h-20 mx-auto mb-7">

                <div
                    class="absolute inset-0 rounded-full border-4 border-white/20">
                </div>

                <div
                    class="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white animate-spin">
                </div>

                <div
                    class="absolute inset-4 rounded-full bg-white/10 flex items-center justify-center">

                    <span class="text-xl">
                        ✓
                    </span>

                </div>

            </div>

            <!-- TITLE -->

            <h2
                class="text-2xl md:text-3xl font-bold tracking-tight">

                Processing Your Application

            </h2>

            <!-- DESCRIPTION -->

            <p
                class="mt-3 text-white/70 text-sm md:text-base leading-6">

                Please wait while we securely save your
                information and uploaded documents.

            </p>

            <!-- PROGRESS BAR -->

            <div class="mt-7 mx-auto max-w-xs">

                <div
                    class="h-1.5 bg-white/15 rounded-full overflow-hidden">

                    <div
                        class="h-full bg-white rounded-full animate-pulse"
                        style="width:65%">
                    </div>

                </div>

            </div>

            <!-- FOOTER MESSAGE -->

            <p
                class="mt-5 text-xs text-white/50">

                Please do not close this window.

            </p>

        </div>

    `;

    document.body.appendChild(overlay);

}

/*************************************************
 * PREMIUM ID SUBMISSION SUCCESS
 *************************************************/

function showIDSubmissionSuccess(idNumber) {

    const overlay =
        document.getElementById("idSubmissionOverlay");

    if (!overlay) return;

    overlay.innerHTML = `

        <div class="w-full max-w-md text-center text-white">

            <!-- SUCCESS ICON -->

            <div class="relative w-24 h-24 mx-auto mb-7">

                <div
                    class="absolute inset-0 rounded-full bg-white/10 animate-ping">
                </div>

                <div
                    class="relative w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-2xl">

                    <span
                        class="text-5xl text-[#024746] font-bold">

                        ✓

                    </span>

                </div>

            </div>

            <!-- TITLE -->

            <h2
                class="text-3xl md:text-4xl font-extrabold">

                Application Submitted

            </h2>

            <!-- DESCRIPTION -->

            <p
                class="mt-3 text-white/75 leading-6">

                Your HSRC ID application has been
                successfully recorded.

            </p>

            <!-- ID NUMBER CARD -->

            <div
                class="mt-7 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">

                <p
                    class="text-xs uppercase tracking-[0.25em] text-white/50 font-semibold">

                    Your ID Number

                </p>

                <div
                    class="mt-2 text-4xl font-extrabold tracking-wider">

                    ${idNumber || "—"}

                </div>

            </div>

            <!-- REMINDER -->

            <p
                class="mt-5 text-sm text-white/60 leading-6">

                Please keep your ID Number for future
                reference, especially for renewal.

            </p>

            <!-- DONE BUTTON -->

            <button
                id="idSubmissionDoneBtn"
                type="button"
                class="mt-8 w-full rounded-2xl bg-white text-[#024746] py-4 font-bold text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200">

                Done

            </button>

        </div>

    `;

    document
        .getElementById("idSubmissionDoneBtn")
        .addEventListener(
            "click",
            completeIDSubmission
        );

}

/*************************************************
 * COMPLETE ID SUBMISSION
 *************************************************/

function completeIDSubmission() {

    /*************************************************
     * REMOVE SUCCESS / LOADING SCREEN
     *************************************************/

    removeIDSubmissionOverlay();

    /*************************************************
     * RESET APPLICATION DATA
     *************************************************/

    applicationData = {

        classification: "",
        existingIdNumber: "",

        license: "",
        position: "",

        dateStarted: "",
        validUntil: "",
        underSupervision: "",

        prcNo: "",
        dhsudNo: "",

        fullName: "",
        address: "",
        birthdate: "",

        contactNumber: "",
        email: "",

        sss: "",
        tin: "",
        pagibig: "",
        philhealth: "",

        branch: "",
        teamSalesHead: "",

        emergencyName: "",
        emergencyContact: "",

        photo: "",
        signature: ""

    };

    showIDWelcomeScreen();

    /*************************************************
     * SHOW MODAL
     *************************************************/

    const modal =
        document.getElementById("idModal");

    if (modal) {
        modal.classList.remove("hidden");
    }

}

/*************************************************
 * REMOVE SUBMISSION OVERLAY
 *************************************************/

function removeIDSubmissionOverlay() {

    const overlay =
        document.getElementById("idSubmissionOverlay");

    if (overlay) {
        overlay.remove();
    }

}

/*************************************************
 * SHOW ORIGINAL ID SYSTEM WELCOME SCREEN
 *************************************************/

function showIDWelcomeScreen() {

    const modal =
        document.getElementById("idModal");

    if (!modal) return;

    const modalContent =
        document.querySelector("#idModal .p-8");

    if (!modalContent) return;

    modalContent.innerHTML = `

        <p class="text-slate-600 leading-7">

            Welcome to the Human Shelter Realty Corporation
            Official ID System.

            <br><br>

            This portal is intended for:

        </p>

        <ul class="mt-5 space-y-2">

            <li>✅ New Agent</li>

            <li>✅ Old Agent</li>

            <li>✅ For Renewal</li>

        </ul>

        <div class="flex gap-3 mt-8">

            <button
                id="idStartBtn"
                type="button"
                class="flex-1 bg-[#024746] hover:bg-[#03635f] text-white py-3 rounded-xl font-semibold">

                Start Application

            </button>

            <button
                id="idCloseBtn"
                type="button"
                class="px-6 border rounded-xl">

                Close

            </button>

        </div>

    `;

    /*************************************************
     * RESTORE BUTTON EVENTS
     *************************************************/

    document
        .getElementById("idStartBtn")
        .addEventListener(
            "click",
            showClassificationStep
        );

    document
        .getElementById("idCloseBtn")
        .addEventListener(
            "click",
            closeIDModal
        );

    /*************************************************
     * SHOW MODAL
     *************************************************/

    modal.classList.remove("hidden");

}