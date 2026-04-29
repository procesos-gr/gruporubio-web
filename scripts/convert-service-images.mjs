import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SOURCE_BASE = 'D:/IMAGENES PAGINA WEB';
const DEST_BASE = 'C:/Users/Ayoub/Proyectos/gruporubio-web/public/images/servicios';

// Folder name → service slug
const MAP = {
  'APPCC — Implantación y Verificación':          'appcc-implantacion-y-verificacion',
  'Alquiler de Maquinaria':                        'alquiler-de-maquinaria',
  'Control de Aves':                               'control-de-aves',
  'DDD — Desratización, Desinsectación y Desinfección': 'ddd-desratizacion-desinsectacion-desinfeccion',
  'Desinsectación de Carcoma':                     'desinsectacion-de-carcoma',
  'Eliminar Plagas de Cucarachas':                 'eliminar-plagas-de-cucarachas',
  'Formación de Manipulador de Alimentos':         'formacion-de-manipulador-de-alimentos',
  'Limpieza de Conductos de Climatización':        'limpieza-de-conductos-de-climatizacion',
  'Limpieza de fin de obras':                      'limpiezas-de-fin-de-obra',
  'Limpiezas de Fachadas y Grafitis':              'limpiezas-de-fachadas-y-grafitis',
  'Limpiezas en altura':                           'limpiezas-en-altura',
  'Limpiezas industriales':                        'limpiezas-industriales',
  'Reparaciones y Mantenimientos':                 'reparaciones-y-mantenimientos',
  'Retirada de Nidos de Avispas':                  'retirada-de-nidos-de-avispas',
  'Servicio Técnico Oficial Kärcher':              'servicio-tecnico-oficial-karcher',
  'Servicios Globales de Higiene':                 'servicios-globales-de-higiene',
  'Tratamiento Anti-Termitas':                     'tratamiento-anti-termitas',
  'Tratamiento profiláctico':                      'tratamientos-contra-la-procesionaria',
  'ozonización':                                   'ozonizacion',
};

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

fs.mkdirSync(DEST_BASE, { recursive: true });

const converted = [];
const failed = [];

for (const [folder, slug] of Object.entries(MAP)) {
  const folderPath = path.join(SOURCE_BASE, folder);
  if (!fs.existsSync(folderPath)) {
    failed.push({ slug, reason: `Carpeta no encontrada: ${folder}` });
    continue;
  }

  const files = fs.readdirSync(folderPath)
    .filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    failed.push({ slug, reason: `Sin imágenes en carpeta: ${folder}` });
    continue;
  }

  for (let i = 0; i < Math.min(files.length, 2); i++) {
    const src = path.join(folderPath, files[i]);
    const suffix = i === 0 ? '' : '-2';
    const dest = path.join(DEST_BASE, `${slug}${suffix}.webp`);

    try {
      await sharp(src)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(dest);
      converted.push({ slug, file: `${slug}${suffix}.webp`, src: files[i] });
      console.log(`✓ ${slug}${suffix}.webp`);
    } catch (err) {
      failed.push({ slug, reason: err.message });
      console.error(`✗ ${slug}${suffix}: ${err.message}`);
    }
  }
}

console.log(`\n=== RESULTADO ===`);
console.log(`Convertidos: ${converted.length}`);
console.log(`Fallidos/sin carpeta: ${failed.length}`);
if (failed.length) {
  console.log('\nSin imagen:');
  failed.forEach(f => console.log(`  - ${f.slug}: ${f.reason}`));
}
