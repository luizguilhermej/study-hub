// Menu do celular, destaque da seção ativa, botão de copiar e-mail e ano do rodapé.
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
  menu.addEventListener("click", function (e) { if (e.target.tagName === "A") alternarMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") alternarMenu(false); });

  document.getElementById("ano").textContent = new Date().getFullYear();

  // Seção ativa no menu
  if ("IntersectionObserver" in window) {
    var links = menu.querySelectorAll("a");
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute("href") === "#" + en.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { obs.observe(s); });
  }

  // Copiar e-mail (o link mailto continua funcionando sem JavaScript)
  var copiar = document.querySelector(".copy-btn");
  var aviso = document.querySelector(".copy-status");
  if (copiar && navigator.clipboard) {
    copiar.hidden = false;
    copiar.addEventListener("click", function () {
      navigator.clipboard.writeText(copiar.dataset.copy).then(function () {
        aviso.textContent = "E-mail copiado.";
      }, function () {
        aviso.textContent = "Não foi possível copiar. Selecione o e-mail e copie manualmente.";
      });
      setTimeout(function () { aviso.textContent = ""; }, 3000);
    });
  }
})();
