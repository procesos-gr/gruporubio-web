"""
Test flujo completo: detalle -> variante -> carrito -> checkout -> Stripe
"""
import os
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000/es"
SHOTS = "C:/Users/Ayoub/Proyectos/gruporubio-web/scripts/screenshots"
os.makedirs(SHOTS, exist_ok=True)

def shot(page, name):
    page.screenshot(path=f"{SHOTS}/{name}.png", full_page=True)
    print(f"  [shot] {name}.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})

    # Aceptar cookies
    page.goto(BASE, wait_until="networkidle")
    try:
        accept = page.locator("button").filter(has_text="Aceptar").first
        if accept.count():
            accept.click()
            page.wait_for_timeout(500)
            print("OK cookies aceptadas")
    except Exception:
        pass

    # PASO 1: Detalle del Desengrasante
    print("\n=== PASO 1: Detalle producto ===")
    page.goto(f"{BASE}/tienda/desengrasante-industrial-gr500", wait_until="networkidle")
    shot(page, "10_detalle")
    print(f"  URL: {page.url}")
    title = page.locator("h1").first.inner_text() if page.locator("h1").count() else "N/A"
    print(f"  H1: {title}")

    # PASO 2: Seleccionar variante
    print("\n=== PASO 2: Seleccionar variante ===")
    sel = page.locator("select").first
    if sel.count():
        options = sel.locator("option").all()
        print(f"  Opciones disponibles: {[o.inner_text() for o in options]}")
        sel.select_option(index=1)
        page.wait_for_timeout(600)
        shot(page, "11_variante_ok")
        print("  OK variante seleccionada")

    # PASO 3: Añadir al carrito
    print("\n=== PASO 3: Añadir al carrito ===")
    add_btn = page.locator("button").filter(has_text="Carrito").first
    if add_btn.count() == 0:
        all_btns = page.locator("button").all()
        for b in all_btns:
            try:
                if "arrito" in b.inner_text() or "Comprar" in b.inner_text():
                    add_btn = b
                    break
            except Exception:
                pass
    if add_btn and add_btn.count():
        disabled = add_btn.is_disabled()
        print(f"  Boton: '{add_btn.inner_text().strip()}' | disabled={disabled}")
        if not disabled:
            add_btn.click()
            page.wait_for_timeout(2000)
            shot(page, "12_carrito_abierto")
            print("  OK anadido al carrito")

    # PASO 4: Clickar "Ir al checkout" desde el sidebar
    print("\n=== PASO 4: Ir al checkout ===")
    checkout_btn = page.locator("a, button").filter(has_text="checkout").first
    if checkout_btn.count() == 0:
        checkout_btn = page.locator("a[href*='checkout'], button").filter(has_text="Checkout").first
    if checkout_btn.count() == 0:
        # Buscar el boton de checkout en el carrito
        all_links = page.locator("a").all()
        for link in all_links:
            try:
                href = link.get_attribute("href") or ""
                if "checkout" in href:
                    checkout_btn = link
                    break
            except Exception:
                pass

    if checkout_btn and checkout_btn.count():
        print(f"  Boton checkout: '{checkout_btn.inner_text().strip()}'")
        checkout_btn.click()
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(3000)  # Esperar a que Stripe cargue
        shot(page, "13_checkout_stripe")
        print(f"  URL final: {page.url}")

        if "checkout" in page.url:
            print("  OK en pagina de checkout")
            # Contar frames (Stripe Elements usa iframes)
            frames = page.frames
            inputs = page.locator("input").all()
            print(f"  Inputs: {len(inputs)} | Frames (Stripe iframes): {len(frames)}")
            if len(frames) > 1:
                print("  OK Stripe Elements cargado (hay iframes)")
            shot(page, "14_checkout_detalle")
        else:
            print(f"  WARN redirigido a {page.url}")
    else:
        print("  WARN no se encontro boton de checkout")
        shot(page, "12b_debug_carrito")
        # Debug: mostrar todos los links
        all_links = page.locator("a").all()
        print(f"  Links en pagina: {[(l.get_attribute('href'), l.inner_text()[:20]) for l in all_links[:10]]}")

    browser.close()
    print(f"\nScreenshots en: {SHOTS}")
