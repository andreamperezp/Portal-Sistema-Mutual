(function () {
  "use strict";

  var modalBackdrop = document.getElementById("modal-backdrop");
  var modalPanel = document.getElementById("modal-panel");
  var formView = document.getElementById("form-view");
  var formSuccess = document.getElementById("form-success");
  var mobileMenu = document.getElementById("mobile-menu");
  var scrollTopBtn = document.getElementById("btn-scroll-top");

  var state = { segmento: null, files: { dniFrente: null, dniDorso: null, recibo: null } };

  function openModal(segmento) {
    if (segmento) state.segmento = segmento;
    modalBackdrop.classList.add("open");
    modalPanel.classList.add("open");
    mobileMenu.classList.remove("open");
    updateSegmentoUI();
  }
  function closeModal() {
    modalBackdrop.classList.remove("open");
    modalPanel.classList.remove("open");
    formView.classList.remove("hidden");
    formSuccess.classList.add("hidden");
  }

  document.querySelectorAll(".js-open-modal").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openModal(btn.getAttribute("data-segmento"));
    });
  });
  modalBackdrop.addEventListener("click", closeModal);
  document.getElementById("btn-close-modal").addEventListener("click", closeModal);

  // Menú mobile
  document.getElementById("btn-toggle-mobile").addEventListener("click", function () {
    mobileMenu.classList.toggle("open");
  });
  document.getElementById("btn-close-mobile").addEventListener("click", function () {
    mobileMenu.classList.remove("open");
  });
  document.querySelectorAll(".js-close-mobile").forEach(function (a) {
    a.addEventListener("click", function () {
      mobileMenu.classList.remove("open");
    });
  });

  // Segmento (pills)
  function updateSegmentoUI() {
    ["policia", "salud", "caja"].forEach(function (k) {
      var el = document.getElementById("seg-" + k);
      if (state.segmento === k) el.classList.add("active");
      else el.classList.remove("active");
    });
    document.getElementById("field-segmento").classList.remove("error");
  }
  ["policia", "salud", "caja"].forEach(function (k) {
    document.getElementById("seg-" + k).addEventListener("click", function () {
      state.segmento = k;
      updateSegmentoUI();
    });
  });

  // Validación de campos de texto
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var phoneRe = /^[0-9+()\s-]{8,20}$/;
  function checkField(field, value) {
    var v = (value || "").trim();
    if (field === "nombre" || field === "apellido") return v.length >= 2;
    if (field === "correo") return emailRe.test(v);
    if (field === "telefono") return phoneRe.test(v);
    return true;
  }
  ["nombre", "apellido", "correo", "telefono"].forEach(function (f) {
    var input = document.getElementById("afi-" + f);
    var wrap = document.getElementById("field-" + f);
    input.addEventListener("input", function () {
      wrap.classList.remove("error");
    });
    input.addEventListener("blur", function () {
      if (!checkField(f, input.value)) wrap.classList.add("error");
      else wrap.classList.remove("error");
    });
  });

  // Adjuntos
  function fileLabel(name, defaultText) {
    var val = state.files[name];
    if (!val) return defaultText;
    return "✓ " + (val.length > 22 ? val.slice(0, 19) + "…" : val);
  }
  [
    ["dniFrente", "Subir foto"],
    ["dniDorso", "Subir foto"],
    ["recibo", "Subir archivo"],
  ].forEach(function (pair) {
    var name = pair[0],
      defaultText = pair[1];
    var input = document.getElementById("input-" + name);
    var drop = document.getElementById("drop-" + name);
    var labelSpan = document.getElementById("label-" + name + "-text");
    var wrap = document.getElementById("field-" + name);
    input.addEventListener("change", function () {
      var f = input.files && input.files[0];
      state.files[name] = f ? f.name : null;
      labelSpan.textContent = fileLabel(name, defaultText);
      drop.classList.toggle("has-file", !!f);
      drop.classList.remove("error");
      wrap.classList.remove("error");
    });
  });

  // Envío del formulario
  //
  // Este portal no tiene backend propio: al enviar, solo se valida en el
  // navegador y se muestra la pantalla de éxito (igual que el prototipo
  // original). Cuando quieras conectarlo a un sistema real, este es el
  // lugar: reemplazá el bloque de abajo por un fetch() a tu API (por
  // ejemplo, al endpoint de "solicitudes" del sistema de gestión de MAS).
  document.getElementById("btn-submit").addEventListener("click", function () {
    var textFields = ["nombre", "apellido", "correo", "telefono"];
    var fileFields = ["dniFrente", "dniDorso", "recibo"];
    var allOk = true;

    textFields.forEach(function (f) {
      var input = document.getElementById("afi-" + f);
      var wrap = document.getElementById("field-" + f);
      var ok = checkField(f, input.value);
      wrap.classList.toggle("error", !ok);
      if (!ok) allOk = false;
    });

    fileFields.forEach(function (f) {
      var wrap = document.getElementById("field-" + f);
      var drop = document.getElementById("drop-" + f);
      var ok = !!state.files[f];
      wrap.classList.toggle("error", !ok);
      drop.classList.toggle("error", !ok);
      if (!ok) allOk = false;
    });

    var segOk = !!state.segmento;
    document.getElementById("field-segmento").classList.toggle("error", !segOk);
    if (!segOk) allOk = false;

    if (!allOk) return;

    // Acá es donde iría el fetch() real a tu backend, si lo conectás.
    formView.classList.add("hidden");
    formSuccess.classList.remove("hidden");
  });

  // Volver arriba
  window.addEventListener(
    "scroll",
    function () {
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      scrollTopBtn.classList.toggle("visible", y > 600);
    },
    { passive: true }
  );
  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
