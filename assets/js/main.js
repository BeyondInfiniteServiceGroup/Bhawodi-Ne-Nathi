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

    const consultationForm = document.getElementById("consultation-form");
    const formStatus = document.getElementById("form-status");

    if (consultationForm) {
        consultationForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Clear previous status
            formStatus.textContent = "";
            formStatus.className = "form-status";

            // Get fields
            const name = document.getElementById("name");
            const company = document.getElementById("company");
            const email = document.getElementById("email");
            const service = document.getElementById("service");
            const project = document.getElementById("project");

            let valid = true;

            // Clear previous errors
            consultationForm.querySelectorAll(".form-error").forEach(error => {
                error.textContent = "";
            });

            // Validation
            if (!name.value.trim()) {
                name.nextElementSibling.textContent = "Please enter your name.";
                valid = false;
            }

            if (!company.value.trim()) {
                company.nextElementSibling.textContent = "Please enter your company.";
                valid = false;
            }

            if (!email.value.trim()) {
                email.nextElementSibling.textContent = "Please enter your email address.";
                valid = false;
            } else if (!email.validity.valid) {
                email.nextElementSibling.textContent = "Please enter a valid email address.";
                valid = false;
            }

            if (!service.value) {
                service.nextElementSibling.textContent = "Please select an area of support.";
                valid = false;
            }

            if (!project.value.trim()) {
                project.nextElementSibling.textContent = "Please tell us about the project.";
                valid = false;
            }

            // Stop if validation failed
            if (!valid) {
                formStatus.textContent = "Please correct the highlighted fields.";
                formStatus.classList.add("error");
                return;
            }

            // Disable button while submitting
            const submitButton = consultationForm.querySelector(".form-submit");
            const originalButtonText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = "Sending...";

            try {
                const response = await fetch(consultationForm.action, {
                    method: "POST",
                    body: new FormData(consultationForm),
                    headers: {
                        Accept: "application/json"
                    }
                });

                if (response.ok) {

                    // GA4 lead event
                    if (typeof gtag === "function") {
                        gtag("event", "generate_lead", {
                            form_name: "consultation_form",
                            page_path: window.location.pathname
                        });
                    }

                    formStatus.textContent =
                        "Thank you. Your enquiry has been received. We will be in touch shortly.";

                    formStatus.classList.add("success");

                    consultationForm.reset();

                } else {
                    throw new Error("Form submission failed.");
                }

            } catch (error) {

                console.error("Formspree submission error:", error);

                formStatus.textContent =
                    "Something went wrong while sending your enquiry. Please try again.";

                formStatus.classList.add("error");

            } finally {

                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;

            }
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