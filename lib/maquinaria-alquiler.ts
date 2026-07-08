export type EspecMaquina = {
  label: string
  valor: string
}

export type MaquinaAlquiler = {
  handle: string
  titulo: string
  marca: string
  categoria: string
  categoriaSlug: string
  descripcion: string
  descripcionCorta: string
  precioDesde: string
  disponible: boolean
  destacado?: boolean
  tension?: string
  uso: 'interior' | 'exterior' | 'ambos'
  perfilCliente: 'B2B' | 'B2C' | 'ambos'
  advertencia?: string
  imagen: string
  usos: string[]
  specs: EspecMaquina[]
  specsDestacadas: [string, string][]
}

export const MAQUINARIA: MaquinaAlquiler[] = [
  // ── FREGADORAS ─────────────────────────────────────────────────────────────
  {
    handle: 'fregadora-conductor-pie',
    titulo: 'Fregadora Industrial Conductor a Pie',
    marca: 'Kärcher',
    categoria: 'Fregadoras',
    categoriaSlug: 'fregadoras',
    descripcionCorta: 'Fregadora automática walk-behind para superficies de 500 a 2.000 m². Cero emisiones, uso interior.',
    descripcion:
      'Fregadora industrial de conducción manual (walk-behind) con tracción a batería de ciclo profundo. Combina barrido y fregado simultáneo en una sola pasada, reduciendo el tiempo de limpieza hasta un 70% frente a métodos manuales. Ideal para naves con estanterías, pasillos de supermercados y zonas de producción con alta densidad de obstáculos. Cero emisiones de gases, nivel sonoro reducido: obligatoria para interiores cerrados.',
    precioDesde: 'Consultar precio',
    disponible: true,
    destacado: true,
    imagen: 'https://images.pexels.com/photos/27580125/pexels-photo-27580125.jpeg?auto=compress&cs=tinysrgb&w=640&h=420&dpr=1',
    tension: 'Batería (ciclo profundo)',
    uso: 'interior',
    perfilCliente: 'B2B',
    usos: ['Naves industriales', 'Supermercados', 'Almacenes con estanterías', 'Zonas de producción', 'Hospitales'],
    specsDestacadas: [
      ['Rendimiento', '≈ 2.200 m²/h'],
      ['Alimentación', 'Batería'],
    ],
    specs: [
      { label: 'Ancho de trabajo', valor: '380–550 mm' },
      { label: 'Capacidad depósito', valor: '40 / 45 L' },
      { label: 'Rendimiento teórico', valor: 'hasta 2.200 m²/h' },
      { label: 'Alimentación', valor: 'Batería de ciclo profundo' },
      { label: 'Autonomía', valor: '2–3 horas' },
      { label: 'Uso', valor: 'Interior exclusivo' },
    ],
  },
  {
    handle: 'fregadora-conductor-sentado',
    titulo: 'Fregadora Industrial Conductor Sentado',
    marca: 'Kärcher',
    categoria: 'Fregadoras',
    categoriaSlug: 'fregadoras',
    descripcionCorta: 'Fregadora ride-on para grandes superficies logísticas. Alto rendimiento en centros comerciales, aeropuertos y naves.',
    descripcion:
      'Fregadora ride-on destinada a la cobertura rápida de grandes extensiones: centros logísticos, centros comerciales, aeropuertos y recintos feriales. El rendimiento de superficie es el KPI primordial en estas aplicaciones. Tracción hidrostática y depósito de gran capacidad para trabajo continuo sin interrupciones. El operario trabaja sentado, reduciendo la fatiga en jornadas largas.',
    precioDesde: 'Consultar precio',
    disponible: true,
    destacado: true,
    imagen: 'https://images.pexels.com/photos/6196694/pexels-photo-6196694.jpeg?auto=compress&cs=tinysrgb&w=640&h=420&dpr=1',
    tension: 'Batería (ciclo profundo)',
    uso: 'interior',
    perfilCliente: 'B2B',
    usos: ['Centros logísticos', 'Centros comerciales', 'Aeropuertos', 'Recintos feriales', 'Grandes naves'],
    specsDestacadas: [
      ['Rendimiento', 'hasta 5.500 m²/h'],
      ['Depósito', '85 / 100 L'],
    ],
    specs: [
      { label: 'Ancho de trabajo', valor: '550–750 mm' },
      { label: 'Capacidad depósito', valor: '85 / 100 L' },
      { label: 'Rendimiento teórico', valor: 'hasta 5.500 m²/h' },
      { label: 'Tracción', valor: 'Hidrostática' },
      { label: 'Alimentación', valor: 'Batería de ciclo profundo' },
      { label: 'Autonomía', valor: '3–4 horas' },
    ],
  },

  // ── BARREDORAS ─────────────────────────────────────────────────────────────
  {
    handle: 'barredora-bateria-interior',
    titulo: 'Barredora Industrial a Batería (Interior)',
    marca: 'Kärcher',
    categoria: 'Barredoras',
    categoriaSlug: 'barredoras',
    descripcionCorta: 'Barredora conductor a pie con batería para interiores. Cero emisiones, nivel sonoro reducido.',
    descripcion:
      'Barredora walk-behind con motorización a baterías para uso en interiores: naves industriales, almacenes de distribución, zonas de fabricación y entornos con normativa de calidad de aire interior estricta. Gran depósito de residuos para trabajo continuado. Cero emisiones de gases y bajo nivel sonoro, cumpla normativa en áreas de trabajo.',
    precioDesde: 'Consultar precio',
    disponible: true,
    imagen: 'https://images.pexels.com/photos/6196579/pexels-photo-6196579.jpeg?auto=compress&cs=tinysrgb&w=640&h=420&dpr=1',
    tension: 'Batería',
    uso: 'interior',
    perfilCliente: 'B2B',
    usos: ['Naves industriales', 'Almacenes', 'Parking interior', 'Zonas de fabricación', 'Hospitales'],
    specsDestacadas: [
      ['Rendimiento', '≈ 3.000 m²/h'],
      ['Alimentación', 'Batería'],
    ],
    specs: [
      { label: 'Ancho de barrido', valor: '750–900 mm' },
      { label: 'Capacidad depósito residuos', valor: '70–100 L' },
      { label: 'Rendimiento teórico', valor: 'hasta 3.000 m²/h' },
      { label: 'Alimentación', valor: 'Batería' },
      { label: 'Filtro antipolvo', valor: 'Incluido' },
      { label: 'Uso', valor: 'Interior exclusivo' },
    ],
  },
  {
    handle: 'barredora-gasolina-exterior',
    titulo: 'Barredora Industrial a Gasolina (Exterior)',
    marca: 'Kärcher',
    categoria: 'Barredoras',
    categoriaSlug: 'barredoras',
    imagen: 'https://images.pexels.com/photos/209271/pexels-photo-209271.jpeg?auto=compress&cs=tinysrgb&w=640&h=420&dpr=1',
    descripcionCorta: 'Barredora a motor de gasolina para aparcamientos, viales privados y zonas industriales al aire libre.',
    descripcion:
      'Barredora walk-behind con motor de gasolina, reservada para uso exclusivo en exteriores: viales privados, aparcamientos abiertos, muelles de carga, naves con ventilación masiva y zonas industriales. La autonomía continua del motor de combustión elimina los tiempos de recarga, ideal para operaciones de larga duración en zonas remotas sin suministro eléctrico.',
    precioDesde: 'Consultar precio',
    disponible: true,
    advertencia: 'Uso exclusivo en exteriores o naves con ventilación industrial masiva.',
    tension: 'Motor de gasolina',
    uso: 'exterior',
    perfilCliente: 'B2B',
    usos: ['Aparcamientos exteriores', 'Viales privados', 'Muelles de carga', 'Naves ventiladas', 'Fincas'],
    specsDestacadas: [
      ['Rendimiento', '≈ 5.000 m²/h'],
      ['Motor', 'Gasolina'],
    ],
    specs: [
      { label: 'Ancho de barrido', valor: '900 mm' },
      { label: 'Capacidad depósito residuos', valor: '100 L' },
      { label: 'Rendimiento teórico', valor: 'hasta 5.000 m²/h' },
      { label: 'Motor', valor: 'Gasolina' },
      { label: 'Uso obligatorio', valor: 'Exteriores únicamente' },
      { label: 'Accesorios', valor: 'Rociador anti-polvo' },
    ],
  },

  // ── ASPIRACIÓN ─────────────────────────────────────────────────────────────
  {
    handle: 'aspirador-seco-humedo',
    titulo: 'Aspirador Industrial Seco/Húmedo',
    marca: 'Kärcher',
    categoria: 'Aspiración industrial',
    categoriaSlug: 'aspiracion',
    imagen: 'https://images.pexels.com/photos/3616735/pexels-photo-3616735.jpeg?auto=compress&cs=tinysrgb&w=640&h=420&dpr=1',
    descripcionCorta: 'Aspirador trifásico para sólidos, líquidos y polvo fino. Ideal en siniestros por inundación y fin de obra.',
    descripcion:
      'Aspirador industrial combinado seco/húmedo con motorización reforzada para gestión simultánea de derrames líquidos y residuos sólidos. Filtro de alta eficiencia. Herramienta fundamental en intervenciones de siniestros por inundación, limpiezas de fin de obra (polvo de cemento + agua) y mantenimiento correctivo de parkings. Capacidad de depósito industrial para trabajo continuo sin vaciados frecuentes.',
    precioDesde: 'Consultar precio',
    disponible: true,
    tension: '400V trifásico',
    uso: 'ambos',
    perfilCliente: 'B2B',
    usos: ['Siniestros por inundación', 'Fin de obra', 'Parking subterráneo', 'Talleres', 'Industria'],
    specsDestacadas: [
      ['Capacidad', '70 L'],
      ['Tensión', '400V (trifásico)'],
    ],
    specs: [
      { label: 'Capacidad depósito', valor: '70 L' },
      { label: 'Potencia aspiración', valor: '3.000 W' },
      { label: 'Tensión', valor: '400V / 50Hz (trifásico)' },
      { label: 'Filtración', valor: 'Alta eficiencia (polvo fino)' },
      { label: 'Diámetro boca', valor: '50 mm' },
      { label: 'Aplicación', valor: 'Sólidos + líquidos' },
    ],
  },
  {
    handle: 'aspirador-bateria',
    titulo: 'Aspirador Profesional a Batería',
    marca: 'Kärcher',
    categoria: 'Aspiración industrial',
    categoriaSlug: 'aspiracion',
    imagen: 'https://images.pexels.com/photos/6196223/pexels-photo-6196223.jpeg?auto=compress&cs=tinysrgb&w=640&h=420&dpr=1',
    descripcionCorta: 'Aspirador inalámbrico de litio para entornos corporativos. Sin cables, máxima movilidad.',
    descripcion:
      'Aspirador seco inalámbrico con batería de litio. Elimina el riesgo de tropiezos con cables y proporciona movilidad espacial absoluta. Predilecto para intervenciones diurnas en entornos corporativos ocupados: oficinas en producción, salas de cine, teatros, interior de aeronaves y transporte público.',
    precioDesde: 'Consultar precio',
    disponible: true,
    tension: 'Batería de litio',
    uso: 'interior',
    perfilCliente: 'ambos',
    usos: ['Oficinas en producción', 'Cines y teatros', 'Transporte público', 'Hoteles', 'Hospitales'],
    specsDestacadas: [
      ['Autonomía', '≈ 60 min'],
      ['Alimentación', 'Batería de litio'],
    ],
    specs: [
      { label: 'Tensión batería', valor: '36V Li-Ion' },
      { label: 'Autonomía', valor: '≈ 60 minutos' },
      { label: 'Tipo', valor: 'Seco' },
      { label: 'Filtro', valor: 'Multiétapa' },
      { label: 'Ventaja clave', valor: 'Cero cables' },
      { label: 'Uso', valor: 'Interior / corporativo' },
    ],
  },

  // ── ALTA PRESIÓN ────────────────────────────────────────────────────────────
  {
    handle: 'hidrolimpiadora-fria-monofasica',
    titulo: 'Hidrolimpiadora Agua Fría Monofásica (230V)',
    marca: 'Kärcher',
    categoria: 'Alta presión',
    categoriaSlug: 'alta-presion',
    imagen: 'https://images.pexels.com/photos/4876669/pexels-photo-4876669.jpeg?auto=compress&cs=tinysrgb&w=640&h=420&dpr=1',
    descripcionCorta: 'Compatible con enchufes domésticos (230V). Para fachadas, vehículos y suelos exteriores.',
    descripcion:
      'Hidrolimpiadora de agua fría con alimentación monofásica estándar (230V), compatible con cualquier toma doméstica o de oficina. Idónea para limpieza de fachadas, vehículos, maquinaria ligera y suelos exteriores. La opción más accesible para clientes particulares y PYME sin instalación trifásica.',
    precioDesde: 'Consultar precio',
    disponible: true,
    tension: '230V monofásico',
    uso: 'exterior',
    perfilCliente: 'ambos',
    usos: ['Fachadas', 'Vehículos', 'Terrazas y patios', 'Suelos exteriores', 'Eliminación de grafitis'],
    specsDestacadas: [
      ['Presión', 'hasta 160 bar'],
      ['Tensión', '230V (doméstico)'],
    ],
    specs: [
      { label: 'Presión máxima', valor: 'hasta 160 bar' },
      { label: 'Caudal', valor: '11 L/min' },
      { label: 'Alimentación', valor: '230V monofásico' },
      { label: 'Temperatura', valor: 'Agua fría' },
      { label: 'Longitud manguera', valor: '8 m' },
      { label: 'Compatible hogar', valor: 'Sí (enchufe estándar)' },
    ],
  },
  {
    handle: 'hidrolimpiadora-fria-trifasica',
    titulo: 'Hidrolimpiadora Agua Fría Trifásica (400V)',
    marca: 'Kärcher',
    categoria: 'Alta presión',
    categoriaSlug: 'alta-presion',
    imagen: 'https://images.pexels.com/photos/6873098/pexels-photo-6873098.jpeg?auto=compress&cs=tinysrgb&w=640&h=420&dpr=1',
    descripcionCorta: 'Alta presión profesional para uso industrial intensivo. Requiere toma trifásica industrial (400V).',
    descripcion:
      'Hidrolimpiadora industrial de agua fría con alimentación trifásica (400V). Potencia superior para aplicaciones industriales intensivas: limpieza de maquinaria pesada, estructuras metálicas, naves de producción y obras civiles. Requiere toma de corriente industrial de 400V (clavija IEC 309 roja). No compatible con instalaciones domésticas.',
    precioDesde: 'Consultar precio',
    disponible: true,
    advertencia: 'Requiere toma trifásica industrial 400V. No compatible con instalación doméstica.',
    tension: '400V trifásico',
    uso: 'exterior',
    perfilCliente: 'B2B',
    usos: ['Maquinaria pesada', 'Estructuras metálicas', 'Naves industriales', 'Obras civiles', 'Industria pesada'],
    specsDestacadas: [
      ['Presión', 'hasta 200 bar'],
      ['Tensión', '400V (industrial)'],
    ],
    specs: [
      { label: 'Presión máxima', valor: 'hasta 200 bar' },
      { label: 'Caudal', valor: '15 L/min' },
      { label: 'Alimentación', valor: '400V trifásico (IEC 309)' },
      { label: 'Temperatura', valor: 'Agua fría' },
      { label: 'Longitud manguera', valor: '10 m' },
      { label: 'Uso', valor: 'Industrial intensivo' },
    ],
  },
  {
    handle: 'hidrolimpiadora-agua-caliente',
    titulo: 'Hidrolimpiadora Agua Caliente',
    marca: 'Kärcher',
    categoria: 'Alta presión',
    categoriaSlug: 'alta-presion',
    imagen: 'https://images.pexels.com/photos/6873132/pexels-photo-6873132.jpeg?auto=compress&cs=tinysrgb&w=640&h=420&dpr=1',
    descripcionCorta: 'Vapor y alta presión para desengrase industrial profundo. Obligatoria en industria alimentaria.',
    descripcion:
      'Hidrolimpiadora con calderín de gasoil que eleva la temperatura del chorro hasta temperaturas próximas a la ebullición. El choque térmico maximiza el efecto de los agentes tensoactivos, siendo imperativa en la industria alimentaria (protocolos HACCP), desengrase de motores de combustión y eliminación de resinas industriales. También disponible en variante vapor húmedo a baja presión para superficies delicadas.',
    precioDesde: 'Consultar precio',
    disponible: true,
    destacado: true,
    tension: 'Motor gasoil + eléctrico',
    uso: 'exterior',
    perfilCliente: 'B2B',
    usos: ['Industria alimentaria', 'Desengrase de motores', 'Industria pesada', 'Cocinas industriales', 'Ganadería'],
    specsDestacadas: [
      ['Temperatura', 'hasta 155 °C'],
      ['Presión', 'hasta 200 bar'],
    ],
    specs: [
      { label: 'Presión máxima', valor: 'hasta 200 bar' },
      { label: 'Temperatura máxima', valor: 'hasta 155 °C' },
      { label: 'Combustible caldera', valor: 'Gasoil' },
      { label: 'Caudal', valor: '15 L/min' },
      { label: 'Longitud manguera', valor: '10 m' },
      { label: 'Certificación', valor: 'Apta HACCP' },
    ],
  },

  // ── TRATAMIENTO ESPECIAL ────────────────────────────────────────────────────
  {
    handle: 'lavamoquetas-inyeccion-extraccion',
    titulo: 'Lavamoquetas Inyección-Extracción',
    marca: 'Kärcher',
    categoria: 'Limpieza textil',
    categoriaSlug: 'textil',
    imagen: 'https://images.pexels.com/photos/9462139/pexels-photo-9462139.jpeg?auto=compress&cs=tinysrgb&w=640&h=420&dpr=1',
    descripcionCorta: 'Kärcher Puzzi — limpieza profunda de moquetas, tapicería y asientos. Secado rápido.',
    descripcion:
      'Sistema Kärcher Puzzi de inyección-extracción para limpieza en profundidad de moquetas, alfombras, tapizados, asientos y superficies textiles. Elimina manchas incrustadas, olores y ácaros. Alta potencia de extracción para secado rápido. Potencia nominal 1.200 W, alimentación 220-240V (compatible con toma estándar). Compatible con detergentes textiles y pastillas antiespumantes de la tienda Grupo Rubio.',
    precioDesde: 'Consultar precio',
    disponible: true,
    tension: '220–240V (estándar)',
    uso: 'interior',
    perfilCliente: 'ambos',
    usos: ['Hoteles y hostelerías', 'Cines y teatros', 'Oficinas moquetadas', 'Automóviles', 'Residencias'],
    specsDestacadas: [
      ['Potencia', '1.200 W'],
      ['Tensión', '220–240V'],
    ],
    specs: [
      { label: 'Modelo de referencia', valor: 'Kärcher Puzzi' },
      { label: 'Potencia', valor: '1.200 W' },
      { label: 'Tensión', valor: '220–240V monofásico' },
      { label: 'Depósito agua limpia', valor: '8 L' },
      { label: 'Depósito residuos', valor: '8 L' },
      { label: 'Temperatura inyección', valor: '60 °C' },
    ],
  },
  {
    handle: 'generador-ozono',
    titulo: 'Generador de Ozono Industrial',
    marca: 'Industrial',
    categoria: 'Desinfección ambiental',
    categoriaSlug: 'desinfeccion',
    imagen: 'https://images.pexels.com/photos/6195951/pexels-photo-6195951.jpeg?auto=compress&cs=tinysrgb&w=640&h=420&dpr=1',
    descripcionCorta: 'Neutralización de olores severos y desinfección total sin químicos. Protocolo de bioseguridad obligatorio.',
    descripcion:
      'Generador de ozono (O₃) para neutralización de olores persistentes (humo de incendios, humedad, materia orgánica) y desinfección total de superficies y volúmenes de aire en espacios cerrados. Tecnología de oxidación avanzada sin residuos químicos. Uso complementario recomendado tras intervenciones de control de plagas DDD para eliminar la persistencia odorífera de biocidas. AVISO: el espacio tratado no puede estar ocupado por personas, animales ni plantas durante el proceso y el período de carencia posterior.',
    precioDesde: 'Consultar precio',
    disponible: true,
    advertencia: 'El espacio NO puede estar ocupado durante el tratamiento. Se entrega protocolo de bioseguridad obligatorio.',
    tension: '220V monofásico',
    uso: 'interior',
    perfilCliente: 'ambos',
    usos: ['Desodorización post-siniestro', 'Post-desinsectación DDD', 'Hoteles', 'Almacenes frigoríficos', 'Vehículos'],
    specsDestacadas: [
      ['Producción O₃', 'hasta 20 g/h'],
      ['Cobertura', 'hasta 400 m³'],
    ],
    specs: [
      { label: 'Producción de ozono', valor: 'hasta 20 g/h' },
      { label: 'Cobertura', valor: 'hasta 400 m³' },
      { label: 'Alimentación', valor: '220V monofásico' },
      { label: 'Temporizador', valor: 'Sí (programable)' },
      { label: 'Seguridad', valor: 'Manual bioseguridad incluido' },
      { label: 'Uso', valor: 'Interior sin ocupantes' },
    ],
  },
  {
    handle: 'deshumidificadora-industrial',
    titulo: 'Deshumidificadora Industrial',
    marca: 'Industrial',
    categoria: 'Desinfección ambiental',
    categoriaSlug: 'desinfeccion',
    imagen: 'https://images.pexels.com/photos/9900030/pexels-photo-9900030.jpeg?auto=compress&cs=tinysrgb&w=640&h=420&dpr=1',
    descripcionCorta: 'Secado acelerado de obras nuevas y mitigación de daños por inundación. Fraguado rápido.',
    descripcion:
      'Deshumidificadora industrial para secado acelerado de obras nuevas, fraguado de materiales de construcción, mitigación de daños estructurales por inundaciones y siniestros de agua, y control preventivo de humedad relativa en archivos documentales, bibliotecas o almacenes de materias primas higroscópicas. Extracción continua de condensados con drenaje por gravedad o bomba incluida.',
    precioDesde: 'Consultar precio',
    disponible: true,
    tension: '230V monofásico',
    uso: 'interior',
    perfilCliente: 'ambos',
    usos: ['Obras nuevas', 'Siniestros por inundación', 'Archivos documentales', 'Bodegas', 'Almacenes'],
    specsDestacadas: [
      ['Extracción', '50–90 L/día'],
      ['Alimentación', '230V'],
    ],
    specs: [
      { label: 'Capacidad extracción', valor: '50–90 L/día' },
      { label: 'Alimentación', valor: '230V monofásico' },
      { label: 'Depósito condensados', valor: 'Drenaje continuo' },
      { label: 'Humedad relativa mín.', valor: 'hasta 40% HR' },
      { label: 'Cobertura', valor: 'hasta 200 m²' },
      { label: 'Nivel sonoro', valor: '< 50 dB' },
    ],
  },
  {
    handle: 'rotativa-abrillantadora',
    titulo: 'Rotativa Abrillantadora Monodisco',
    marca: 'Kärcher',
    categoria: 'Tratamiento de suelos',
    categoriaSlug: 'suelos',
    imagen: 'https://images.pexels.com/photos/6196690/pexels-photo-6196690.jpeg?auto=compress&cs=tinysrgb&w=640&h=420&dpr=1',
    descripcionCorta: 'Decapado, cristalizado y abrillantado de mármol, terrazo y parquet. Se incluyen pads y discos.',
    descripcion:
      'Rotativa monodisco de velocidad variable para tratamiento integral de pavimentos nobles: decapado de ceras antiguas, diamantado, cristalizado y abrillantado de mantenimiento en mármol, terrazo, granito y parquet. Requiere precisión en la selección de discos abrasivos según el tipo de tarea y el sustrato. Se entrega con kit de pads y discos de diferente granulometría incluidos. Grupo Rubio dispone de líquidos cristalizadores y consumibles en su tienda.',
    precioDesde: 'Consultar precio',
    disponible: true,
    tension: '220V monofásico',
    uso: 'interior',
    perfilCliente: 'ambos',
    usos: ['Mármol y granito', 'Terrazo', 'Parquet industrial', 'Hoteles', 'Centros comerciales'],
    specsDestacadas: [
      ['Velocidad', '175 rpm'],
      ['Diámetro disco', '430 mm'],
    ],
    specs: [
      { label: 'Velocidad de trabajo', valor: '175 rpm' },
      { label: 'Diámetro de disco', valor: '430 mm' },
      { label: 'Potencia', valor: '1.100 W' },
      { label: 'Alimentación', valor: '220V monofásico' },
      { label: 'Suelos compatibles', valor: 'Mármol, terrazo, parquet, gres' },
      { label: 'Accesorios incluidos', valor: 'Kit pads y discos' },
    ],
  },
]

export function getMaquina(handle: string): MaquinaAlquiler | undefined {
  return MAQUINARIA.find((m) => m.handle === handle)
}

export const CATEGORIAS = [...new Set(MAQUINARIA.map((m) => m.categoria))]

// Título enriquecido con la spec destacada principal (ej. "Fregadora Industrial Conductor a Pie — ≈ 2.200 m²/h")
// para capturar búsquedas long-tail por especificación, siguiendo el patrón de Kiloutou/Loxam.
export function getTituloConSpec(maquina: MaquinaAlquiler): string {
  const specPrincipal = maquina.specsDestacadas?.[0]?.[1]
  return specPrincipal ? `${maquina.titulo} — ${specPrincipal}` : maquina.titulo
}

export type ConsejoMaquina = { q: string; a: string }

const USO_LABEL: Record<MaquinaAlquiler['uso'], string> = {
  interior: 'Está pensada para uso en interior (naves, almacenes, locales cerrados).',
  exterior: 'Está pensada para uso en exterior (obra, fachadas, espacios abiertos).',
  ambos: 'Puede usarse tanto en interior como en exterior.',
}

const PERFIL_LABEL: Record<MaquinaAlquiler['perfilCliente'], string> = {
  B2B: 'Pensada para uso profesional/empresarial (naves, comunidades, empresas de servicios).',
  B2C: 'Apta también para particulares, sin necesidad de formación previa.',
  ambos: 'La alquilan tanto particulares como empresas, según el proyecto.',
}

// Deriva "consejos de uso" a partir de campos ya existentes (usos, uso, tensión, perfilCliente,
// advertencia) en vez de inventar contenido técnico nuevo sin verificar.
export function getMaquinaConsejos(maquina: MaquinaAlquiler): ConsejoMaquina[] {
  const consejos: ConsejoMaquina[] = [
    {
      q: `¿Para qué se usa el/la ${maquina.titulo}?`,
      a: `${maquina.descripcionCorta} Casos de uso habituales: ${maquina.usos.join(', ')}.`,
    },
    {
      q: '¿Se puede usar en interior o en exterior?',
      a: USO_LABEL[maquina.uso],
    },
    {
      q: '¿Es para particulares o para empresas?',
      a: PERFIL_LABEL[maquina.perfilCliente],
    },
  ]

  if (maquina.tension) {
    consejos.push({
      q: '¿Qué alimentación necesita?',
      a: `Funciona con ${maquina.tension.toLowerCase()}. Comprueba que tu instalación es compatible antes de reservar, o consúltanos y te asesoramos.`,
    })
  }

  if (maquina.advertencia) {
    consejos.push({ q: 'Antes de alquilarla, ten en cuenta:', a: maquina.advertencia })
  }

  return consejos
}
