"""
Screenshot detallado de la tienda rediseñada
"""
import os
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000/es"
SHOTS = "C:/Users/Ayoub/Proyectos/gruporubio-web/scripts/screenshots"
os.makedirs(SHOTS, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})

    # Aceptar cookies primero desde home
    page.goto(BASE, wait_until="networkidle")
    try:
        btn = page.locator("button").filter(has_text="Aceptar").first
        if btn.count(): btn.click(); page.wait_for_timeout(400)
    except Exception: pass

    # Ir a tienda
    page.goto(f"{BASE}/tienda", wait_until="networkidle")
    page.wait_for_timeout(1500)

    # 1. Vista completa de la tienda
    page.screenshot(path=f"{SHOTS}/tienda_full.png", full_page=True)
    print("tienda_full.png")

    # 2. Zoom: Hero + Trust bar
    page.set_viewport_size({"width": 1440, "height": 500})
    page.goto(f"{BASE}/tienda", wait_until="networkidle")
    page.wait_for_timeout(800)
    page.screenshot(path=f"{SHOTS}/tienda_hero.png")
    print("tienda_hero.png")

    # 3. Zoom: Filter bar + primeras tarjetas
    page.set_viewport_size({"width": 1440, "height": 900})
    page.evaluate("window.scrollTo(0, 400)")
    page.wait_for_timeout(400)
    page.screenshot(path=f"{SHOTS}/tienda_grid.png")
    print("tienda_grid.png")

    # 4. Zoom: Cards de productos Grupo Rubio
    page.evaluate("window.scrollTo(0, 800)")
    page.wait_for_timeout(400)
    page.screenshot(path=f"{SHOTS}/tienda_cards.png")
    print("tienda_cards.png")

    # 5. Zoom: Banner B2B
    page.evaluate("window.scrollTo(0, 99999)")
    page.wait_for_timeout(400)
    page.screenshot(path=f"{SHOTS}/tienda_b2b.png")
    print("tienda_b2b.png")

    # 6. Mobile view
    page.set_viewport_size({"width": 390, "height": 844})
    page.goto(f"{BASE}/tienda", wait_until="networkidle")
    page.wait_for_timeout(1000)
    page.screenshot(path=f"{SHOTS}/tienda_mobile.png", full_page=True)
    print("tienda_mobile.png")

    browser.close()
    print(f"\nScreenshots en: {SHOTS}")
