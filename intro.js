/* ======================================================
   HUMAN SHELTER PREMIUM INTRO
   Version 1.0
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const overlay = document.getElementById("hs-intro-overlay");

    if (!overlay) return;

    document.body.style.overflow = "hidden";

    const loadingText = document.querySelector(".hs-loading-text");

    const cards = document.querySelectorAll(".hs-card");

    const messages = [

        "Preparing Your Experience...",

        "Connecting to Human Shelter...",

        "Loading Recruitment Portal...",

        "Building Your Future...",

        "Welcome to Human Shelter Realty Corporation"

    ];

    let current = 0;

    loadingText.textContent = messages[0];

    const loadingInterval = setInterval(() => {

        current++;

        if (current < messages.length) {

            loadingText.textContent = messages[current];

        }

    }, 800);

    /* ==========================
       Mouse Parallax
    ========================== */

    if (window.innerWidth > 768) {

        document.addEventListener("mousemove", (e) => {

            const x = (e.clientX / window.innerWidth - .5);

            const y = (e.clientY / window.innerHeight - .5);

            cards.forEach((card, index) => {

                const speed = (index + 1) * 3;

                card.style.transform =

                    `translate(${x * speed}px,${y * speed}px)`;

            });

        });

    }

    /* ==========================
       Remove Intro
    ========================== */

    setTimeout(() => {

        overlay.classList.add("hide");

        clearInterval(loadingInterval);

        setTimeout(() => {

            overlay.remove();

            document.body.style.overflow = "";

        }, 1300);

    }, 7000);

});