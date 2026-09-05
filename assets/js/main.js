document.addEventListener("DOMContentLoaded", () => {

    /*
    =========================================
    MOBILE NAVIGATION
    =========================================
    */

    const menuToggle = document.querySelector(".mobile-menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            mainNav.classList.toggle("is-open");

            document.body.classList.toggle(
                "menu-open",
                !isOpen
            );

        });


        // Close menu when a navigation link is clicked

        const navLinks = mainNav.querySelectorAll("a");

        navLinks.forEach(link => {

            link.addEventListener("click", () => {

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                mainNav.classList.remove("is-open");

                document.body.classList.remove(
                    "menu-open"
                );

            });

        });

    }


    /*
    =========================================
    ACTIVE NAVIGATION
    =========================================
    */

    const currentPath =
        window.location.pathname.replace(/\/+$/, "");

    const navLinks =
        document.querySelectorAll(".main-nav a");

    navLinks.forEach(link => {

        const linkUrl =
            new URL(link.href);

        const linkPath =
            linkUrl.pathname.replace(/\/+$/, "");

        if (linkPath === currentPath) {

            link.classList.add("active");

            link.setAttribute(
                "aria-current",
                "page"
            );

        }

    });


    /*
    =========================================
    SCROLL REVEAL
    =========================================
    */

    const revealElements =
        document.querySelectorAll(
            ".service-card, .project-card, .credential-card, .tool-item, .consultation-points div"
        );

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach(element => {

            element.classList.add(
                "reveal"
            );

            observer.observe(element);

        });

    }


    /*
    =========================================
    CONSULTATION FORM
    =========================================
    */

    const form =
        document.querySelector("#consultation-form");

    if (form) {

        form.addEventListener("submit", event => {

            event.preventDefault();

            clearFormErrors();

            const name =
                document.querySelector("#name");

            const company =
                document.querySelector("#company");

            const email =
                document.querySelector("#email");

            const service =
                document.querySelector("#service");

            const project =
                document.querySelector("#project");

            let isValid = true;


            /*
            NAME
            */

            if (name.value.trim() === "") {

                showFieldError(
                    name,
                    "Please enter your name."
                );

                isValid = false;

            }


            /*
            COMPANY
            */

            if (company.value.trim() === "") {

                showFieldError(
                    company,
                    "Please enter your company name."
                );

                isValid = false;

            }


            /*
            EMAIL
            */

            if (
                email.value.trim() === "" ||
                !isValidEmail(email.value.trim())
            ) {

                showFieldError(
                    email,
                    "Please enter a valid email address."
                );

                isValid = false;

            }


            /*
            SERVICE
            */

            if (service.value === "") {

                showFieldError(
                    service,
                    "Please select an area of support."
                );

                isValid = false;

            }


            /*
            PROJECT
            */

            if (project.value.trim() === "") {

                showFieldError(
                    project,
                    "Please tell us a little about your project."
                );

                isValid = false;

            }


            if (!isValid) {

                showFormStatus(
                    "Please review the highlighted fields.",
                    "error"
                );

                return;

            }


            /*
            TEMPORARY SUCCESS STATE
            */

            showFormStatus(
                "Thank you. Your enquiry has been captured and we'll be in touch.",
                "success"
            );

            form.reset();

        });

    }


    /*
    =========================================
    FORM HELPERS
    =========================================
    */

    function showFieldError(field, message) {

        const group =
            field.closest(".form-group");

        if (!group) {
            return;
        }

        group.classList.add("has-error");

        const error =
            group.querySelector(".form-error");

        if (error) {
            error.textContent = message;
        }

    }


    function clearFormErrors() {

        const groups =
            document.querySelectorAll(
                ".form-group.has-error"
            );

        groups.forEach(group => {

            group.classList.remove(
                "has-error"
            );

            const error =
                group.querySelector(".form-error");

            if (error) {
                error.textContent = "";
            }

        });

        const status =
            document.querySelector("#form-status");

        if (status) {

            status.className =
                "form-status";

            status.textContent = "";

        }

    }


    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
        );

    }


    function showFormStatus(message, type) {

        const status =
            document.querySelector("#form-status");

        if (!status) {
            return;
        }

        status.textContent = message;

        status.className =
            `form-status ${type}`;

    }
});

document.querySelectorAll('[data-track="developer_referral"]').forEach(link => {
    link.addEventListener('click', () => {
        if (typeof gtag === 'function') {
            gtag('event', 'developer_referral_click', {
                source_site: 'bhawodi_ne_nathi',
                destination: 'bisg.co.za'
            });
        }
    });
});