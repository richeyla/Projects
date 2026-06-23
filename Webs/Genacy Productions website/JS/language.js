/* ===========================================
   LANGUAGE SWITCHER – Carga JSON y traduce
   =========================================== */

let currentLang = localStorage.getItem("site-lang") || "en";
let allTranslations = null;

/* Aplica las traducciones al DOM */
function applyTranslations() {
  if (!allTranslations) return;

  const dict = allTranslations[currentLang] || allTranslations["en"];

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const text = dict[key];
    if (text) {
      el.innerHTML = text;
    }
  });
}

/* Cambia de idioma y guarda en localStorage */
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("site-lang", lang);
  applyTranslations();
}

/* Hacemos setLanguage accesible desde otros scripts (botón después) */
window.setLanguage = setLanguage;

document.addEventListener("DOMContentLoaded", () => {
  fetch("lang/translations.json")
    .then(res => res.json())
    .then(json => {
      allTranslations = json;
      applyTranslations();
    })
    .catch(err => {
      console.error("Error cargando traducciones:", err);
    });
});
