// Menu do celular, ano do rodapé e destaque da seção ativa.
(function () {
  "use strict";

  var botao = document.querySelector(".menu-btn");
  var menu = document.getElementById("menu");

  function alternarMenu(aberto) {
    menu.classList.toggle("open", aberto);
    botao.setAttribute("aria-expanded", String(aberto));
  }

  botao.addEventListener("click", function () {
    alternarMenu(botao.getAttribute("aria-expanded") !== "true");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") alternarMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") alternarMenu(false);
  });

  document.getElementById("ano").textContent = new Date().getFullYear();

  // Marca no menu a seção que está na tela.
  if ("IntersectionObserver" in window) {
    var links = menu.querySelectorAll("a");
    var observer = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute("href") === "#" + entrada.target.id) {
            a.setAttribute("aria-current", "true");
          } else {
            a.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { observer.observe(s); });
  }
})();
