# -*- coding: utf-8 -*-
"""
Verificación completa de todo lo implementado hoy en gruporubio-web.
Corre contra http://localhost:3001
"""
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from playwright.sync_api import sync_playwright

BASE = "http://localhost:3001/es"
PASS = "[OK]"
FAIL = "[FAIL]"
WARN = "[WARN]"
results = []

def check(label, ok, detail=""):
    icon = PASS if ok else FAIL
    results.append((icon, label, detail))
    print(f"{icon} {label}" + (f" — {detail}" if detail else ""))

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # ── 1. Tienda: listado de productos ─────────────────────────────────────
    print("\n── TIENDA ──────────────────────────────────────────────")
    page.goto(f"{BASE}/tienda", timeout=15000)
    page.wait_for_load_state("networkidle")
    page.screenshot(path="/tmp/tienda_listing.png", full_page=True)

    # Productos visibles
    products = page.locator("[data-testid='product-card'], .product-card, article, [class*='product']").all()
    product_count = len(products)
    check("Tienda carga", product_count > 0, f"{product_count} productos visibles")

    # Título de la página
    h1 = page.locator("h1").first.inner_text() if page.locator("h1").count() > 0 else ""
    check("Hero tienda tiene título", len(h1) > 0, h1[:50])

    # ── 2. Navbar: enlace Mi cuenta ─────────────────────────────────────────
    print("\n── NAVBAR ──────────────────────────────────────────────")
    cuenta_link = page.locator("a[href*='/cuenta']")
    has_cuenta = cuenta_link.count() > 0
    check("Navbar tiene enlace 'Mi cuenta'", has_cuenta,
          cuenta_link.first.inner_text().strip() if has_cuenta else "no encontrado")

    # ── 3. Página Mi cuenta ─────────────────────────────────────────────────
    print("\n── MI CUENTA ───────────────────────────────────────────")
    page.goto(f"{BASE}/cuenta", timeout=10000)
    page.wait_for_load_state("networkidle")
    page.screenshot(path="/tmp/cuenta_page.png", full_page=True)

    cuenta_h1 = page.locator("h1").first.inner_text() if page.locator("h1").count() > 0 else ""
    check("Página /cuenta carga", len(cuenta_h1) > 0, cuenta_h1[:40])

    google_btn = page.locator("button:has-text('Google'), button:has-text('Entrar con Google')")
    has_google = google_btn.count() > 0
    check("Botón 'Entrar con Google' visible", has_google)

    google_svg = page.locator("button svg, button img").count()
    check("Icono Google en el botón", google_svg > 0, f"{google_svg} svg/img en botones")

    # ── 4. Producto detalle ──────────────────────────────────────────────────
    print("\n── DETALLE DE PRODUCTO ─────────────────────────────────")
    # Volver a tienda y hacer clic en primer producto
    page.goto(f"{BASE}/tienda", timeout=10000)
    page.wait_for_load_state("networkidle")

    first_link = page.locator("a[href*='/tienda/']").first
    if first_link.count() > 0:
        href = first_link.get_attribute("href") or ""
        page.goto(f"http://localhost:3001{href}", timeout=10000)
        page.wait_for_load_state("networkidle")
        page.screenshot(path="/tmp/producto_detalle.png", full_page=True)

        prod_title = page.locator("h1").first.inner_text() if page.locator("h1").count() > 0 else ""
        check("Página detalle producto carga", len(prod_title) > 0, prod_title[:50])

        add_btn = page.locator("button:has-text('Añadir'), button:has-text('carrito'), button:has-text('Add')")
        check("Botón añadir al carrito visible", add_btn.count() > 0)
    else:
        check("Enlace a producto encontrado", False, "no hay links /tienda/* en la tienda")

    # ── 5. Checkout: selector de pago Stripe/PayPal ─────────────────────────
    print("\n── CHECKOUT (selector de pago) ─────────────────────────")
    # El checkout redirige a /tienda si no hay carrito — lo verificamos directamente en el HTML
    # del componente CheckoutForm mirando si PayPalButtons está importado
    # En su lugar comprobamos que la página no rompe (da 200 o redirecciona a tienda)
    page.goto(f"{BASE}/tienda/checkout", timeout=10000)
    page.wait_for_load_state("networkidle")
    page.screenshot(path="/tmp/checkout.png")

    checkout_url = page.url
    if "/tienda/checkout" in checkout_url:
        # Llegó al checkout (tiene carrito) — buscar selector
        tarjeta_btn = page.locator("button:has-text('Tarjeta'), button:has-text('tarjeta')")
        paypal_btn = page.locator("button:has-text('PayPal')")
        check("Selector Tarjeta visible en checkout", tarjeta_btn.count() > 0)
        check("Selector PayPal visible en checkout", paypal_btn.count() > 0)
    else:
        # Redirigió a tienda (carrito vacío) — comportamiento correcto
        check("Checkout redirige a /tienda con carrito vacío", "/tienda" in checkout_url,
              f"→ {checkout_url}")
        # Verificamos el código fuente del componente en vez de runtime
        import os
        form_path = r"C:\Users\Ayoub\Proyectos\gruporubio-web\components\tienda\CheckoutForm.tsx"
        if os.path.exists(form_path):
            with open(form_path, encoding="utf-8") as f:
                src = f.read()
            check("CheckoutForm importa PayPalButtons", "PayPalButtons" in src)
            check("CheckoutForm tiene estado paymentMethod", "paymentMethod" in src)
            check("CheckoutForm muestra selector Tarjeta/PayPal", "Tarjeta" in src and "PayPal" in src)

    browser.close()

# ── ARCHIVOS DE INFRAESTRUCTURA ─────────────────────────────────────────────
print("\n── ARCHIVOS DEPLOY / INFRAESTRUCTURA ───────────────────")
import os

checks_files = [
    (r"C:\Users\Ayoub\Proyectos\gruporubio-web\Dockerfile", "Dockerfile Next.js"),
    (r"C:\Users\Ayoub\Proyectos\gruporubio-web\deploy\docker-compose.yml", "docker-compose.yml"),
    (r"C:\Users\Ayoub\Proyectos\gruporubio-web\deploy\nginx\gruporubio.conf", "Nginx config"),
    (r"C:\Users\Ayoub\Proyectos\gruporubio-web\deploy\.env.web.template", ".env.web.template"),
    (r"C:\Users\Ayoub\Proyectos\gruporubio-web\deploy\.env.medusa.template", ".env.medusa.template"),
    (r"C:\Users\Ayoub\Proyectos\gruporubio-medusa\Dockerfile", "Dockerfile Medusa"),
]
for path, label in checks_files:
    exists = os.path.isfile(path)
    check(label, exists, "existe" if exists else "NO encontrado")

# .ai-variants/ eliminada
ai_dir = r"C:\Users\Ayoub\Proyectos\gruporubio-web\.ai-variants"
check(".ai-variants/ eliminada", not os.path.isdir(ai_dir))

# .gitignore tiene .ai-variants
gi_path = r"C:\Users\Ayoub\Proyectos\gruporubio-web\.gitignore"
if os.path.isfile(gi_path):
    with open(gi_path, encoding="utf-8") as f:
        gi = f.read()
    check(".gitignore incluye .ai-variants/", ".ai-variants" in gi)

# ── MEDUSA CONFIG: módulos registrados ─────────────────────────────────────
print("\n── MEDUSA CONFIG (módulos) ─────────────────────────────")
config_path = r"C:\Users\Ayoub\Proyectos\gruporubio-medusa\medusa-config.ts"
with open(config_path, encoding="utf-8") as f:
    config = f.read()

modulos = {
    "event-bus-redis": "EVENT_BUS",
    "cache-redis": "CACHE",
    "file-s3": "S3 / archivo",
    "notification": "Resend / notificaciones",
    "meilisearch": "MeiliSearch",
    "paypal": "PayPal",
    "auth-google": "Google OAuth",
}
for keyword, label in modulos.items():
    check(f"medusa-config: {label}", keyword in config)

# ── SEED: datos de Grupo Rubio ──────────────────────────────────────────────
print("\n── SEED (datos Grupo Rubio) ────────────────────────────")
seed_path = r"C:\Users\Ayoub\Proyectos\gruporubio-medusa\src\scripts\seed.ts"
with open(seed_path, encoding="utf-8") as f:
    seed = f.read()

seed_checks = [
    ("Tienda Online Grupo Rubio", "Sales channel renombrado"),
    ("España", "Región España"),
    ("Tudela", "Almacén en Tudela"),
    ("Limpieza Profesional", "Categoría limpieza"),
    ("Control de Plagas", "Categoría plagas"),
    ("Desengrasante", "Producto desengrasante"),
    ("GR-DESENG", "SKU desengrasante"),
    ("Desinfectante", "Producto desinfectante"),
    ("Insecticida", "Producto insecticida"),
    ("Hidroalcohólico", "Producto gel hidroalcohólico"),
    ("6.99", "Precio envío estándar"),
]
for keyword, label in seed_checks:
    check(f"Seed: {label}", keyword in seed)

# ── RESUMEN ─────────────────────────────────────────────────────────────────
print("\n── RESUMEN ─────────────────────────────────────────────")
total = len(results)
passed = sum(1 for r in results if r[0] == PASS)
failed = sum(1 for r in results if r[0] == FAIL)
print(f"{passed}/{total} verificaciones OK")
if failed:
    print(f"\nFallaron:")
    for icon, label, detail in results:
        if icon == FAIL:
            print(f"  {icon} {label}" + (f" — {detail}" if detail else ""))
sys.exit(0 if failed == 0 else 1)
