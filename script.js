const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

if (menuBtn && nav) {
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  };

  menuBtn.addEventListener("click", () => {
    setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuBtn.focus();
    }
  });

  window.matchMedia("(min-width: 861px)").addEventListener("change", (event) => {
    if (event.matches) {
      setMenu(false);
    }
  });
}

document.querySelectorAll(".year").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

document.querySelectorAll(".plan [data-part]").forEach((el) => {
  const part = el.dataset.part;
  const toggle = (on) => {
    document
      .querySelectorAll('.plan [data-part="' + part + '"]')
      .forEach((target) => target.classList.toggle("is-hot", on));
  };
  el.addEventListener("mouseenter", () => toggle(true));
  el.addEventListener("mouseleave", () => toggle(false));
  el.addEventListener("focus", () => toggle(true));
  el.addEventListener("blur", () => toggle(false));
});

const form = document.getElementById("contactForm");

if (form) {
  const status = document.getElementById("formStatus");
  const button = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (form.querySelector("[name='_honey']").value) {
      return;
    }

    status.className = "form-status";
    status.textContent = "Envoi en cours...";
    button.disabled = true;

    try {
      const response = await fetch(form.dataset.ajax, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      });

      if (!response.ok) {
        throw new Error("Envoi impossible");
      }

      form.reset();
      status.classList.add("success");
      status.textContent = "Merci, votre message a bien été envoyé. Je vous réponds sous 72h.";
    } catch (error) {
      status.classList.add("error");
      status.textContent = "L'envoi a échoué. Merci de m'appeler au 06 44 06 00 20.";
    } finally {
      button.disabled = false;
    }
  });
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealTargets = document.querySelectorAll(
  ".cards > li, .rows li, .facts > div, .service, .sec-head, .split-head, .notice-grid, .contact-grid > div, .cta-card"
);

const drawFigure = (svg) => {
  svg.querySelectorAll("path, rect").forEach((el) => {
    if (typeof el.getTotalLength !== "function") return;
    const len = el.getTotalLength();
    if (!len) return;
    el.style.transition = "none";
    el.style.strokeDasharray = len;
    el.style.strokeDashoffset = len;
  });
};

const playFigure = (svg) => {
  svg.getBoundingClientRect();
  svg.querySelectorAll("path, rect").forEach((el, i) => {
    if (!el.style.strokeDasharray) return;
    el.style.transition = "stroke-dashoffset 1.3s cubic-bezier(0.5, 0, 0.2, 1) " + Math.min(i * 40, 400) + "ms, stroke 0.25s";
    el.style.strokeDashoffset = 0;
  });
};

if (!reduceMotion && "IntersectionObserver" in window) {
  revealTargets.forEach((el) => {
    el.classList.add("reveal");
    const siblings = Array.from(el.parentElement.children);
    el.style.transitionDelay = (siblings.indexOf(el) % 4) * 90 + "ms";
  });

  const figures = document.querySelectorAll(".card .svc-svg, .service-fig .svc-svg, .cta-art");
  figures.forEach(drawFigure);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("in");
        el.querySelectorAll(".svc-svg, .cta-art").forEach(playFigure);
        io.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );

  revealTargets.forEach((el) => io.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
}
