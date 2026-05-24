// =====================================================
// MANEJADOR DE FORMULARIOS DE CONTACTO (contacto.html)
// =====================================================

console.log("🎨 Inicializando script forms-contacto.js...");

// Mapeo de formularios a tablas Supabase
const contactFormsMap = {
  threeDForm: "service_3d",
  brandingForm: "service_branding",
  conceptForm: "service_concept_art",
  fotoForm: "service_fotografia",
  audiovisualForm: "service_audiovisual",
  campanasForm: "service_campanas"
};

// Función para inicializar los formularios
function initContactForms() {
  console.log("🔍 Buscando formularios de contacto...");

  // Esperar a que submitFormToSupabase esté disponible
  let attempts = 0;
  const waitForFunction = setInterval(() => {
    attempts++;
    
    if (window.submitFormToSupabase && typeof window.submitFormToSupabase === 'function') {
      clearInterval(waitForFunction);
      console.log("✅ submitFormToSupabase está disponible");

      // Agregar event listeners a todos los formularios de contacto
      let formsRegistered = 0;
      Object.entries(contactFormsMap).forEach(([formId, tableName]) => {
        const form = document.getElementById(formId);
        if (form) {
          form.addEventListener("submit", async (e) => {
            console.log(`🎯 Submit detectado en ${formId}`);
            e.preventDefault();
            console.log(`📤 Enviando a tabla: ${tableName}`);
            await window.submitFormToSupabase(form, tableName);
          });
          console.log(`✅ Formulario registrado: ${formId} → ${tableName}`);
          formsRegistered++;
        } else {
          console.warn(`⚠️ Formulario no encontrado: ${formId}`);
        }
      });

      console.log(`✅ Total de formularios registrados: ${formsRegistered}`);
    } else if (attempts > 50) {
      clearInterval(waitForFunction);
      console.error("❌ TIMEOUT: submitFormToSupabase no está disponible después de 5 segundos");
    }
  }, 100);
}

// Esperar a que el DOM esté completamente cargado
console.log("📋 document.readyState =", document.readyState);

if (document.readyState === "loading") {
  console.log("📍 Esperando DOMContentLoaded...");
  document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOMContentLoaded disparado");
    initContactForms();
  });
} else {
  console.log("✅ DOM ya está cargado, inicializando ahora...");
  initContactForms();
}
