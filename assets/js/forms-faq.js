// =====================================================
// MANEJADOR DE FORMULARIO FAQ (preguntas_frecuentes.html)
// =====================================================

console.log("📝 Inicializando script forms-faq.js...");

function initFAQForm() {
  console.log("🔍 Buscando elemento #questionForm...");
  
  const questionForm = document.getElementById("questionForm");

  if (!questionForm) {
    console.error("❌ ERROR CRÍTICO: Formulario FAQ no encontrado. Verifica que exista en el HTML con id='questionForm'");
    return;
  }
  console.log("✅ Formulario FAQ encontrado", questionForm);

  // Esperar a que submitFormToSupabase esté disponible
  let attempts = 0;
  const waitForFunction = setInterval(() => {
    attempts++;
    if (window.submitFormToSupabase && typeof window.submitFormToSupabase === 'function') {
      clearInterval(waitForFunction);
      console.log("✅ submitFormToSupabase está disponible");

      questionForm.addEventListener("submit", async (e) => {
        console.log("🎯 Formulario submit detectado!");
        e.preventDefault();
        console.log("📤 Llamando a submitFormToSupabase...");
        await window.submitFormToSupabase(questionForm, "faq_questions");
      });

      console.log("✅ Evento submit registrado para FAQ");
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
    initFAQForm();
  });
} else {
  console.log("✅ DOM ya está cargado, inicializando ahora...");
  initFAQForm();
}

