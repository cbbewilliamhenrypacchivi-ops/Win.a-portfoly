from pathlib import Path
import re

path = Path('servicios.html')
text = path.read_text(encoding='utf-8')

style_match = re.search(r'<style>(.*?)</style>', text, re.S)
if not style_match:
    raise SystemExit('style block not found')
style_content = style_match.group(1)

new_root = """    :root {
      --moon-black: #1d1d1b;
      --ivory: #ebe4da;
      --dark-gray: #2d2d2b;
      --soft-shadow: 0 18px 45px rgba(0, 0, 0, 0.08);
      --surface: rgba(255, 255, 255, 0.9);
      --surface-strong: rgba(255, 255, 255, 0.95);
      --line: rgba(29, 29, 27, 0.12);
      --text: #111111;
      --muted: rgba(0, 0, 0, 0.65);
      --accent: var(--moon-black);
      --accent-deep: #000000;
      --accent-soft: rgba(235, 228, 218, 0.92);
      --shadow: 0 18px 45px rgba(0, 0, 0, 0.08);
      --shadow-hover: 0 24px 60px rgba(0, 0, 0, 0.14);
      --radius-xl: 30px;
      --radius-lg: 24px;
      --radius-md: 18px;
      --max-width: 1180px;
    }"""

new_body_css = """    body {
      margin: 0;
      font-family: \"Bricolage Grotesque\", \"Inter\", \"Helvetica Neue\", Arial, sans-serif;
      color: var(--moon-black);
      background:
        linear-gradient(180deg, #f8f4ee 0%, #f2eee6 54%, var(--ivory) 100%);
      min-height: 100vh;
    }"""

style_content = re.sub(r':root\s*{[^}]*}', new_root, style_content, count=1, flags=re.S)
style_content = re.sub(r'body\s*{[^}]*}', new_body_css, style_content, count=1, flags=re.S)
style_content = style_content.replace('font-family: "Manrope", sans-serif;', 'font-family: inherit;')
style_content = style_content.replace('background: rgba(255, 255, 255, 0.62);', 'background: rgba(235, 228, 218, 0.75);', 1)
style_content = style_content.replace('color: #1d1d1d;', 'color: var(--moon-black);', 1)
style_content = style_content.replace('background: linear-gradient(135deg, #000000, #6b6b6b);', 'background: linear-gradient(135deg, rgba(29, 29, 27, 0.95), rgba(45, 45, 43, 0.5));', 1)
style_content = style_content.replace('box-shadow: 0 0 0 6px rgba(0, 0, 0, 0.08);', 'box-shadow: 0 0 0 6px rgba(29, 29, 27, 0.08);', 1)
style_content = style_content.replace('linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(243, 243, 243, 0.9)),', 'linear-gradient(180deg, rgba(235, 228, 218, 0.98), rgba(235, 228, 218, 0.75)),', 1)
style_content = style_content.replace('border-color: rgba(0, 0, 0, 0.18);', 'border-color: rgba(29, 29, 27, 0.18);', 2)
style_content = style_content.replace('rgba(255, 255, 255, 1), rgba(245, 245, 245, 0.96)),', 'rgba(255, 255, 255, 1), rgba(235, 228, 218, 0.96)),', 1)

old_button_block = """    .service-card button {
      width: fit-content;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 18px;
      border-radius: 999px;
      background: var(--surface-strong);
      border: 1px solid rgba(0, 0, 0, 0.12);
      color: var(--accent-deep);
      font-size: 0.95rem;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      transition: gap 0.28s ease, background 0.28s ease, color 0.28s ease;
    }

    .service-card button:hover {
      gap: 14px;
      background: linear-gradient(135deg, #111111, #3d3d3d);
      color: #ffffff;
    }"""

new_button_block = """    .service-card button {
      width: fit-content;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 18px;
      border-radius: 999px;
      background: rgba(235, 228, 218, 0.95);
      border: 1px solid var(--line);
      color: var(--moon-black);
      font-size: 0.95rem;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      transition: gap 0.28s ease, background 0.28s ease, color 0.28s ease;
    }

    .service-card button:hover {
      gap: 14px;
      background: linear-gradient(135deg, var(--moon-black), rgba(45, 45, 43, 0.9));
      color: var(--ivory);
    }"""

style_content = style_content.replace(old_button_block, new_button_block, 1)

old_panel_tag = """    .panel-tag {
      display: inline-flex;
      align-items: center;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.05);
      color: #212121;
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 14px;
    }"""

new_panel_tag = """    .panel-tag {
      display: inline-flex;
      align-items: center;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(29, 29, 27, 0.08);
      color: var(--moon-black);
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 14px;
    }"""

style_content = style_content.replace(old_panel_tag, new_panel_tag, 1)

old_cta_primary = """    .cta-primary {
      background: linear-gradient(135deg, #111111, #343434);
      color: #ffffff;
      flex: 1 1 190px;
    }"""

new_cta_primary = """    .cta-primary {
      background: linear-gradient(135deg, var(--moon-black), rgba(45, 45, 43, 0.9));
      color: var(--ivory);
      border: 0;
      flex: 1 1 190px;
    }"""

style_content = style_content.replace(old_cta_primary, new_cta_primary, 1)

old_cta_secondary = """    .cta-secondary {
      color: #111111;
      border: 1px solid rgba(0, 0, 0, 0.12);
      background: rgba(255, 255, 255, 0.9);
      flex: 1 1 150px;
    }"""

new_cta_secondary = """    .cta-secondary {
      color: var(--moon-black);
      border: 1px solid var(--moon-black);
      background: rgba(235, 228, 218, 0.94);
      flex: 1 1 150px;
    }"""

style_content = style_content.replace(old_cta_secondary, new_cta_secondary, 1)

new_head = f"""<head>
  <meta charset=\"UTF-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
  <title>WIN.A | Servicios</title>
  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">
  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>
  <link href=\"https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap\" rel=\"stylesheet\">
  <link rel=\"stylesheet\" href=\"assets/css/styles.css\">
  <style>
{style_content}
  </style>
</head>"""

text = re.sub(r'<head>.*?</head>', new_head, text, flags=re.S)

section_match = re.search(r'<section class="services-section".*?</section>', text, re.S)
if not section_match:
    raise SystemExit('section not found')
section_html = section_match.group(0)

script_match = re.search(r'<script>.*?</script>', text, re.S)
if not script_match:
    raise SystemExit('script not found')
script_html = script_match.group(0)

header_html = """    <header>
      <div class=\"navbar\">
        <a class=\"navbar__logo\" href=\"index.html\" aria-label=\"Logo placeholder\">LOGO</a>
        <nav class=\"navbar__links\" aria-label=\"Navegación principal\">
          <a class=\"navbar__link\" href=\"index.html\">INICIO</a>
          <a class=\"navbar__link\" href=\"#\">SOBRE NOSOTROS</a>
          <a class=\"navbar__link\" href=\"nuestros-trabajos.html\">NUESTROS TRABAJOS</a>
          <a class=\"navbar__link is-active\" href=\"#servicios\">SERVICIOS</a>
          <a class=\"navbar__link\" href=\"#\">PREGUNTAS FRECUENTES</a>
          <a class=\"navbar__link\" href=\"#\">CONTÁCTANOS</a>
        </nav>
        <button
          class=\"navbar__toggle\"
          type=\"button\"
          aria-label=\"Abrir menú\"
          aria-expanded=\"false\"
          aria-controls=\"navbarDropdown\"
        >
          <img src=\"img/menu.svg\" alt=\"Menú\" />
        </button>
      </div>
      <div id=\"navbarDropdown\" class=\"navbar__dropdown\" aria-hidden=\"true\">
        <a href=\"index.html\">INICIO</a>
        <a href=\"#\">SOBRE NOSOTROS</a>
        <a href=\"nuestros-trabajos.html\">NUESTROS TRABAJOS</a>
        <a href=\"#servicios\">SERVICIOS</a>
        <a href=\"#\">PREGUNTAS FRECUENTES</a>
        <a href=\"#\">CONTÁCTANOS</a>
      </div>
    </header>"""

footer_html = """    <footer class=\"footer\">
      <div class=\"footer__inner\">
        <div class=\"footer__logo\" aria-label=\"Logo placeholder\">LOGO</div>
        <div class=\"footer__links\">
          <a href=\"index.html\">INICIO</a>
          <a href=\"#\">SOBRE NOSOTROS</a>
          <a href=\"nuestros-trabajos.html\">NUESTROS TRABAJOS</a>
          <a href=\"#servicios\">SERVICIOS</a>
          <a href=\"#\">PREGUNTAS FRECUENTES</a>
          <a href=\"#\">CONTÁCTANOS</a>
        </div>
        <div class=\"footer__socials\">
          <span>Redes</span>
          <div class=\"footer__socials-row\">
            <span class=\"footer__social\">insta</span>
            <span class=\"footer__social\">face</span>
            <span class=\"footer__social\">linkdin</span>
            <span class=\"footer__social\">wtspp</span>
          </div>
        </div>
      </div>
    </footer>"""

new_body = f"""<body>
{header_html}

    <main class=\"page-shell\">
{section_html}
    </main>

{footer_html}

{script_html}
    <script src=\"assets/js/main.js\" defer></script>
</body>"""

text = re.sub(r'<body>.*?</body>', new_body, text, flags=re.S)

text = re.sub(r'href=\"TU_LINK_CONTRATAR_[^\"]+\"', 'href=\"#contacto\"', text)
text = re.sub(r'href=\"TU_LINK_TRABAJOS_[^\"]+\"', 'href=\"nuestros-trabajos.html\"', text)

path.write_text(text, encoding='utf-8')
