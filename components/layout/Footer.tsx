import { useTranslations } from "next-intl";
import Link from "next/link";

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");

  return (
    <footer className="w-full bg-[#111827] pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Columna 1 */}
          <div className="space-y-4">
            <div className="font-bold text-2xl tracking-tight text-white">GRUPORUBIO</div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {t("desc")}
            </p>
          </div>

          {/* Columna 2 */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t("services")}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/servicios#limpieza" className="hover:text-white transition-colors">Limpieza Profesional</Link></li>
              <li><Link href="/servicios#plagas" className="hover:text-white transition-colors">Control de Plagas</Link></li>
              <li><Link href="/servicios#ozonizacion" className="hover:text-white transition-colors">Ozonización</Link></li>
              <li><Link href="/servicios#especiales" className="hover:text-white transition-colors">Limpiezas Especiales</Link></li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t("store")}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/tienda/quimicos" className="hover:text-white transition-colors">Productos Químicos</Link></li>
              <li><Link href="/tienda/celulosa" className="hover:text-white transition-colors">Celulosa e Higiene</Link></li>
              <li><Link href="/tienda/maquinaria" className="hover:text-white transition-colors">Maquinaria</Link></li>
              <li><Link href="/tienda/desechables" className="hover:text-white transition-colors">Artículos Desechables</Link></li>
            </ul>
          </div>

          {/* Columna 4 */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t("contact")}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>info@gruporubio.net</li>
              <li>948 82 50 25</li>
              <li className="pt-2">
                <Link href="/contacto" className="text-primary hover:text-blue-400 transition-colors font-medium">
                  {tNav("quote")} &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Grupo Rubio. {t("rights")}.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-500">
            <Link href="/privacidad" className="hover:text-white transition-colors">Aviso Legal</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
