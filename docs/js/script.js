/* Aprimoramento progressivo: o conteúdo principal permanece legível sem JavaScript. */
document.documentElement.classList.add("js-ready");

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");
const mobileMenu = window.matchMedia("(max-width: 760px)");

if (menuButton && navigation) {
  const focusableInMenu = () => Array.from(navigation.querySelectorAll('a[href]'))
    .filter((element) => !element.hasAttribute("disabled"));

  const closeMenu = ({ returnFocus = false } = {}) => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
    navigation.classList.remove("is-open");
    if (returnFocus) menuButton.focus();
  };

  menuButton.addEventListener("click", () => {
    const opening = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(opening));
    menuButton.setAttribute("aria-label", opening ? "Fechar menu" : "Abrir menu");
    navigation.classList.toggle("is-open", opening);
    if (opening && mobileMenu.matches) {
      const firstLink = focusableInMenu()[0];
      if (firstLink) firstLink.focus();
    }
  });

  navigation.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      const target = document.querySelector(link.getAttribute("href"));
      closeMenu();
      if (target) {
        target.setAttribute("tabindex", "-1");
        window.setTimeout(() => target.focus({ preventScroll: true }), 0);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    if (!isOpen || !mobileMenu.matches) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu({ returnFocus: true });
      return;
    }
    if (event.key === "Tab") {
      const links = focusableInMenu();
      if (!links.length) return;
      const first = links[0];
      const last = links[links.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === menuButton)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        menuButton.focus();
      }
    }
  });

  document.addEventListener("click", (event) => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });

  mobileMenu.addEventListener?.("change", () => closeMenu());
}

/* Revelação única ao entrar no ecrã; sem animação se o utilizador reduzir movimento. */
const revealItems = document.querySelectorAll(".reveal");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -20px 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

/* Destaque de seção ativa na navegação. */
const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-28% 0px -60% 0px", threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));
}

/* Mostrar copiar apenas se existir API de área de transferência ou fallback. */
const copyButton = document.querySelector("#copy-email");
const copyFeedback = document.querySelector("#copy-feedback");
const canCopy = Boolean(navigator.clipboard && navigator.clipboard.writeText) || Boolean(document.queryCommandSupported?.("copy"));
if (copyButton && copyFeedback && canCopy) {
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    const email = copyButton.dataset.email;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const temporary = document.createElement("textarea");
        temporary.value = email;
        temporary.setAttribute("readonly", "");
        temporary.setAttribute("aria-hidden", "true");
        temporary.style.position = "fixed";
        temporary.style.opacity = "0";
        temporary.style.pointerEvents = "none";
        document.body.appendChild(temporary);
        temporary.select();
        const copied = document.execCommand("copy");
        temporary.remove();
        if (!copied) throw new Error("Cópia indisponível");
      }
      copyFeedback.textContent = `E-mail copiado: ${email}`;
      copyButton.replaceChildren(document.createTextNode("Copiado"));
    } catch {
      copyFeedback.textContent = `Não foi possível copiar automaticamente. Use: ${email}`;
    }
  });
}
