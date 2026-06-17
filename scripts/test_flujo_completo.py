"""
Test del flujo completo: home -> tienda -> carrito -> checkout Stripe
Servidores ya en marcha: web :3000, medusa :9000
"""
import os
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000/es"
SCREENSHOTS = "C:/Users/Ayoub/Proyectos/gruporubio-web/scripts/screenshots"
os.makedirs(SCREENSHOTS, exist_ok=True)

def shot(page, name):
    path = f"{SCREENSHOTS}/{name}.png"
    page.screenshot(path=path, full_page=True)
    print(f"  [shot] {name}.png")

def test_home(page):
    print("\n=== HOME ===")
    page.goto(BASE, wait_until="networkidle")
    title = page.title()
    print(f"  Titulo: {title}")
    shot(page, "01_home")
    assert "Grupo Rubio" in title
    print("  OK home carga")

def test_hero_search(page):
    print("\n=== BUSCADOR DEL HERO ===")
    page.goto(BASE, wait_until="networkidle")
    inp = page.locator("input").first
    inp.fill("limpieza")
    page.wait_for_timeout(1000)
    shot(page, "02_hero_search")
    print("  OK buscador acepta input")

def test_tienda(page):
    print("\n=== TIENDA ===")
    page.goto(f"{BASE}/tienda", wait_until="networkidle")
    shot(page, "03_tienda")
    body = page.content()
    if "Desengrasante" in body or "Desinfectante" in body or "Gel" in body:
        print("  OK productos visibles")
    else:
        print("  WARN no se ven productos del seed")

def test_detalle_producto(page):
    print("\n=== DETALLE PRODUCTO ===")
    page.goto(f"{BASE}/tienda", wait_until="networkidle")
    links = page.locator("a[href*='/tienda/']").all()
    if not links:
        print("  WARN sin links de producto")
        return None
    href = links[0].get_attribute("href")
    print(f"  Abriendo: {href}")
    page.goto(f"http://localhost:3000{href}", wait_until="networkidle")
    shot(page, "04_detalle_producto")
    body = page.content()
    if "anadir" in body.lower() or "carrito" in body.lower() or "comprar" in body.lower() or "Formato" in body:
        print("  OK detalle producto carga con variantes/boton")
    else:
        print("  WARN no se ve boton de compra")
    return href

def test_add_to_cart(page):
    print("\n=== AÑADIR AL CARRITO ===")
    page.goto(f"{BASE}/tienda", wait_until="networkidle")
    links = page.locator("a[href*='/tienda/']").all()
    if not links:
        print("  WARN sin productos en tienda")
        return
    links[0].click()
    page.wait_for_load_state("networkidle")
    # Buscar boton de anadir
    all_btns = page.locator("button").all()
    add_btn = None
    for btn in all_btns:
        try:
            txt = btn.inner_text().strip().lower()
            if "a" in txt and ("carrito" in txt or "adir" in txt or "comprar" in txt):
                add_btn = btn
                break
        except Exception:
            pass
    if add_btn:
        add_btn.click()
        page.wait_for_timeout(1500)
        shot(page, "05_tras_anadir")
        print("  OK click en anadir al carrito")
    else:
        shot(page, "05_sin_boton_anadir")
        print("  WARN no se encontro boton de anadir")

def test_checkout(page):
    print("\n=== CHECKOUT ===")
    page.goto(f"{BASE}/tienda/checkout", wait_until="networkidle")
    shot(page, "06_checkout")
    url = page.url
    body = page.content()
    if "checkout" in url:
        print("  OK pagina de checkout carga")
        if "Stripe" in body or "tarjeta" in body.lower() or "PaymentElement" in body or "pago" in body.lower():
            print("  OK formulario de pago visible")
        else:
            print("  WARN formulario de pago no visible (puede ser carrito vacio)")
    else:
        print(f"  INFO redirigido a: {url} (carrito vacio)")

def test_contacto(page):
    print("\n=== CONTACTO ===")
    page.goto(f"{BASE}/contacto", wait_until="networkidle")
    shot(page, "07_contacto")
    inputs = page.locator("input").all()
    print(f"  Inputs encontrados: {len(inputs)}")
    if len(inputs) >= 2:
        print("  OK formulario de contacto tiene campos")
    else:
        print("  WARN pocos inputs en contacto")

def test_chatbot(page):
    print("\n=== CHATBOT ===")
    page.goto(BASE, wait_until="networkidle")
    page.wait_for_timeout(3000)
    shot(page, "08_home_chatbot")
    # Buscar FAB por posicion (esquina inferior derecha)
    all_btns = page.locator("button").all()
    fab = None
    for btn in all_btns:
        try:
            box = btn.bounding_box()
            if box and box["x"] > 1100 and box["y"] > 650:
                fab = btn
                break
        except Exception:
            pass
    if fab:
        fab.click()
        page.wait_for_timeout(1500)
        shot(page, "08b_chatbot_abierto")
        print("  OK FAB del chatbot clickado")
    else:
        print("  WARN FAB no encontrado en esquina inferior derecha")

def test_legales(page):
    print("\n=== PAGINAS LEGALES ===")
    for ruta in ["privacidad", "aviso-legal", "cookies"]:
        page.goto(f"{BASE}/{ruta}", wait_until="networkidle")
        ok = "Grupo Rubio" in page.title() or ruta.replace("-", " ") in page.content().lower()
        print(f"  {'OK' if ok else 'WARN'} /{ruta}")
    shot(page, "09_legal")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    try:
        test_home(page)
        test_hero_search(page)
        test_tienda(page)
        test_detalle_producto(page)
        test_add_to_cart(page)
        test_checkout(page)
        test_contacto(page)
        test_chatbot(page)
        test_legales(page)
        print("\n=== TESTS COMPLETADOS ===")
        print(f"Screenshots en: {SCREENSHOTS}")
    except Exception as e:
        shot(page, "ERROR")
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()
    finally:
        browser.close()
