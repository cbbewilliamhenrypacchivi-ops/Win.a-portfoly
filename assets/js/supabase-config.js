
console.log("🚀 Inicializando Supabase Config...");

const SUPABASE_URL = "https://ayuzzqaemxxdepvzyvyq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5dXp6cWFlbXh4ZGVwdnp5dnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NDE3MTksImV4cCI6MjA5NTIxNzcxOX0.iOglz9jc7O08ScJPGNjY9dJeM6VY1Bw_shzpxUwBmYc";

// Importar Supabase desde CDN (agregar en HTML)
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

// Inicializar cliente de Supabase (evitar redeclaración)
let supabase;

// Pequeño delay para asegurar que el CDN cargó
setTimeout(() => {
  if (!window.supabase) {
    console.error("❌ CRÍTICO: Supabase CDN no cargó. Verifica que esté en el HTML antes de este script.");
  } else {
    if (typeof window.supabaseClient === 'undefined') {
      try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabaseClient = supabase;
        console.log("✅ Supabase inicializado correctamente");
      } catch (err) {
        console.error("❌ Error al crear cliente Supabase:", err);
      }
    } else {
      supabase = window.supabaseClient;
      console.log("✅ Usando cliente Supabase existente");
    }
  }
}, 100);

// =====================================================
// FUNCIÓN AUXILIAR: Mostrar feedback visual mejorado
// =====================================================

function showFeedback(element, message, type = "info", duration = 4000) {
  // Crear contenedor flotante si no existe
  let feedback = element.querySelector(".form-feedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.className = "form-feedback";
    element.insertBefore(feedback, element.firstChild);
  }

  // Estilos según tipo
  const styles = {
    success: {
      background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
      color: "white",
      border: "2px solid #2e7d32",
      fontSize: "1.1rem"
    },
    error: {
      background: "linear-gradient(135deg, #f44336 0%, #da190b 100%)",
      color: "white",
      border: "2px solid #c62828",
      fontSize: "1rem"
    },
    info: {
      background: "linear-gradient(135deg, #2196F3 0%, #1976d2 100%)",
      color: "white",
      border: "2px solid #1565c0",
      fontSize: "0.95rem"
    },
    loading: {
      background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
      color: "white",
      border: "2px solid #e65100",
      fontSize: "0.95rem"
    }
  };

  const style = styles[type] || styles.info;

  feedback.style.cssText = `
    padding: 16px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: ${style.fontSize};
    font-weight: 600;
    background: ${style.background};
    color: ${style.color};
    border: ${style.border};
    animation: slideDown 0.4s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;

  // Agregar ícono o emoji
  let emoji = "ℹ️";
  if (type === "success") emoji = "✅";
  if (type === "error") emoji = "❌";
  if (type === "loading") emoji = "⏳";
  if (type === "info") emoji = "ℹ️";

  feedback.innerHTML = `${emoji} ${message}`;

  // Auto-ocultar después de cierto tiempo (excepto loading)
  if (type !== "loading") {
    setTimeout(() => {
      feedback.style.animation = "slideUp 0.3s ease";
      setTimeout(() => {
        if (feedback && feedback.parentNode) {
          feedback.remove();
        }
      }, 300);
    }, duration);
  }
}

// Agregar animaciones CSS dinámicamente
if (!document.querySelector("#form-feedback-styles")) {
  const style = document.createElement("style");
  style.id = "form-feedback-styles";
  style.textContent = `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-15px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideUp {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-15px);
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .form-feedback {
      text-align: center;
      letter-spacing: 0.3px;
    }

    .form-feedback.success-animation {
      animation: pulse 0.5s ease 2;
    }
  `;
  document.head.appendChild(style);
}

// =====================================================
// FUNCIÓN: Enviar formulario a Supabase
// =====================================================

async function submitFormToSupabase(formElement, tableName) {
  const submitBtn = formElement.querySelector('button[type="submit"]');
  let originalText = submitBtn ? submitBtn.textContent : "Enviar";

  try {
    // Validar que Supabase esté disponible
    if (!window.supabaseClient) {
      console.warn("⚠️ supabaseClient no existe aún, esperando...");
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    if (!window.supabaseClient) {
      throw new Error("Supabase no ha sido inicializado correctamente. Recarga la página.");
    }

    // Mostrar estado "Enviando..."
    if (!submitBtn) {
      console.error("❌ No se encontró botón de envío en el formulario");
      return false;
    }

    showFeedback(formElement, "⏳ Enviando tu formulario...", "loading");
    submitBtn.disabled = true;

    // Capturar datos del formulario
    const formData = new FormData(formElement);
    const data = Object.fromEntries(formData);

    if (!data || Object.keys(data).length === 0) {
      throw new Error("No se detectaron campos del formulario (revisa atributos name=...).");
    }

    console.log("📤 Enviando datos a tabla:", tableName);
    console.log("📋 Datos del formulario:", data);

    // Enviar a Supabase
    const { error } = await window.supabaseClient
      .from(tableName)
      .insert([data]);

    if (error) {
      console.error("❌ Error de Supabase:", error);
      throw new Error(error.message || "Error al guardar en la base de datos");
    }

    // Éxito - mostrar feedback prominente
    console.log("✅ Datos guardados correctamente");
    
    showFeedback(
      formElement,
      "¡Excelente! Tu formulario fue enviado correctamente. Nos pondremos en contacto pronto.",
      "success",
      6000
    );

    // También mostrar con alert como respaldo
    setTimeout(() => {
      alert("✅ ¡Formulario enviado con éxito!\n\nNos pondremos en contacto pronto.");
    }, 500);

    // Limpiar formulario después de 1 segundo
    setTimeout(() => {
      formElement.reset();
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }, 1000);

    return true;

  } catch (error) {
    console.error("❌ Error completo:", error);
    console.error("Stack:", error.stack);
    
    const errorMessage = error.message || "No se pudo enviar el formulario. Intenta de nuevo.";
    
    showFeedback(
      formElement,
      `Error: ${errorMessage}`,
      "error",
      7000
    );

    // También mostrar con alert como respaldo
    alert(`❌ Error al enviar el formulario:\n\n${errorMessage}\n\nPor favor, intenta de nuevo.`);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
    return false;
  }
}

// Hacer la función globalmente accesible
window.submitFormToSupabase = submitFormToSupabase;

console.log("✅ submitFormToSupabase está disponible globalmente");
