export type ServiceCategory =
  | "limpieza"
  | "plagas"
  | "alimentaria"
  | "maquinaria"
  | "formacion";

export interface ServiceData {
  slug: string;
  category: ServiceCategory;
  categoryLabel: string;
  title: string;
  shortDesc: string;
  includes: string[];
  forWho: string;
  howItWorks: string;
  whyUs: string;
  extraFact: string;
  pexelsQuery: string;
  image?: string;
  image2?: string;
  imagePos?: string;   // object-position de la imagen 1 (encuadre)
  noImage2?: boolean;  // si true, la sección "Cómo funciona" va a texto completo sin 2ª imagen
  noImages?: boolean;  // si true, la página del servicio no muestra ninguna imagen
  relatedSlugs: string[];
}

export const SERVICES: ServiceData[] = [
  {
    slug: "limpiezas-industriales",
    category: "limpieza",
    categoryLabel: "Limpieza Especializada",
    title: "Limpiezas Industriales",
    shortDesc:
      "Protocolos de sanitización intensiva para cadenas de producción y entornos fabriles. Limpieza = Seguridad.",
    includes: [
      "Erradicación de vertidos oleosos y control de derrames que provocan deslizamientos",
      "Eliminación de polvo combustible para reducir carga térmica e incendios",
      "Sanitización de infraestructuras aéreas y maquinaria de línea de producción",
      "Sinergia con control de plagas e higiene alimentaria",
    ],
    forWho:
      "Complejos industriales de manufactura, plantas agroalimentarias, almacenes logísticos y cualquier entorno fabril donde la suciedad suponga un riesgo para la cadena de montaje.",
    howItWorks:
      "Nuestro equipo realiza una evaluación de riesgos laborales inherentes a la suciedad del recinto. Se despliega maquinaria pesada (barredoras y fregadoras de conductor sentado, equipos hidrolimpiadores trifásicos) para barrer y decapar los pavimentos. Se implementan rutinas químicas de desengrase para las áreas de producción, y se ejecutan trabajos verticales para eliminar polvo suspendido en las vigas del techo.",
    whyUs:
      "A diferencia del aseo convencional, la limpieza industrial exige conocimientos de prevención de riesgos laborales avanzados. Grupo Rubio capacita a sus operarios en su propio Centro de Formación, asegurando que su interacción con la maquinaria de la planta del cliente sea segura y alineada con los protocolos industriales.",
    extraFact:
      "Un plan de limpieza industrial profesional no solo previene accidentes, sino que reduce el desgaste abrasivo en la propia maquinaria de producción del cliente, incrementando el tiempo de actividad y mejorando la salud respiratoria del personal.",
    pexelsQuery: "industrial cleaning factory floor professional",
    image: "/images/servicios/limpiezas-industriales/1.webp",
    image2: "/images/servicios/limpiezas-industriales/2.webp",
    relatedSlugs: [
      "servicios-globales-de-higiene",
      "tratamientos-de-suelos",
      "limpieza-de-parkings-y-garajes",
    ],
  },
  {
    slug: "ddd-desratizacion-desinsectacion-desinfeccion",
    category: "plagas",
    categoryLabel: "Control de Plagas",
    title: "DDD — Desratización, Desinsectación y Desinfección",
    shortDesc:
      "Despliegue integral de sanidad ambiental bajo las más estrictas homologaciones europeas de bioseguridad.",
    includes: [
      "Desinsectación química y de barrera contra artrópodos nocivos (avispas, cucarachas, hormigas, mosquitos...)",
      "Desratización con rodenticidas y exclusión mecánica para anular poblaciones de roedores",
      "Desinfección virológica con metodologías físicas (UV) y químicas (agentes virucidas UNE-EN 14476)",
    ],
    forWho:
      "Imperativo legal para la industria alimentaria, almacenes logísticos, establecimientos HORECA, instituciones públicas y domicilios privados con colonizaciones biológicas invasivas.",
    howItWorks:
      "Biólogos y entomólogos identifican el agente patógeno y su densidad poblacional. A partir del diagnóstico, se planifica una estrategia: choque químico sistémico, trampas mecánicas, nebulización de IGRs o gasificación. El ciclo concluye con monitoreo para verificar la interrupción del ciclo reproductivo del vector.",
    whyUs:
      "Entidad homologada con número de registro S B – 04 – 08 – NA en el Registro de Establecimientos y Servicios Plaguicidas del Gobierno de Navarra. Acreditados para operar en entornos críticos de manipulación alimentaria.",
    extraFact:
      "La desratización urbana evita brotes epidemiológicos; los roedores e insectos tratados son vectores de zoonosis como el tifus, la fiebre aftosa, la rabia y el cólera.",
    pexelsQuery: "pest control professional disinfection spray",
    image: "/images/servicios/ddd-desratizacion-desinsectacion-desinfeccion/1-hq.webp",
    image2: "/images/servicios/ddd-desratizacion-desinsectacion-desinfeccion/2.webp",
    relatedSlugs: [
      "eliminar-plagas-de-cucarachas",
      "retirada-de-nidos-de-avispas",
      "tratamiento-anti-termitas",
    ],
  },
  {
    slug: "ozonizacion",
    category: "limpieza",
    categoryLabel: "Limpieza Especializada",
    title: "Ozonización",
    shortDesc:
      "Purificación del aire y erradicación de patógenos mediante gas ozono (O₃). Sin residuos químicos.",
    includes: [
      "Destrucción de bacterias, gérmenes, hongos y virus suspendidos en el aire y textiles",
      "Oxidación de partículas olorosas: tabaco, humedad, mascotas, disolventes",
      "Eliminación de monóxido de carbono inherente al humo del tabaco",
      "Erradicación de toxinas como las asociadas a la difteria y el tétanos",
    ],
    forWho:
      "Oficinas, clínicas, hoteles, vehículos y viviendas con síndrome del edificio enfermo, e instalaciones que requieren asepsia absoluta tras incidentes sanitarios o siniestros.",
    howItWorks:
      "Los equipos generadores someten el O₂ ambiente a descargas eléctricas, formando ozono (O₃). Este gas de poder oxidante extremo difunde por la estancia penetrando las paredes celulares de los microorganismos, provocando su lisis. Una vez completada la reacción, el gas inestable revierte naturalmente a oxígeno respirable.",
    whyUs:
      "Empleamos metodologías científicamente respaldadas que reconocen al ozono como el agente virucida y germicida más poderoso disponible a nivel comercial, sin dejar residuos químicos.",
    extraFact:
      "La ozonización preventiva reduce la incidencia de conjuntivitis, cefaleas, faringitis y procesos alérgicos respiratorios en las plantillas laborales.",
    pexelsQuery: "air purification ozone clean environment office",
    image: "/images/servicios/ozonizacion/1-hq.webp",
    image2: "/images/servicios/ozonizacion/2.webp",
    relatedSlugs: [
      "limpiezas-de-siniestros",
      "mantenimiento-y-conservacion",
      "ddd-desratizacion-desinsectacion-desinfeccion",
    ],
  },
  {
    slug: "limpiezas-de-fin-de-obra",
    category: "limpieza",
    categoryLabel: "Limpieza Especializada",
    title: "Limpiezas de Fin de Obra",
    shortDesc:
      "Saneamiento de choque tras obras de construcción. El inmueble listo para uso o comercialización inmediata.",
    includes: [
      "Retirada y gestión segregada de mermas de obra, embalajes y escombros pesados",
      "Eliminación de polvo microscópico de sílice en paramentos verticales y horizontales",
      "Disolución química de manchas de cemento, lechada, yeso, pinturas y siliconas",
      "Acondicionamiento estético y desinfección general de mobiliario y cristaleras",
    ],
    forWho:
      "Promotoras inmobiliarias, empresas de construcción y estudios de arquitectura que precisan entregas de llaves impecables, y particulares que han afrontado reformas integrales.",
    howItWorks:
      "El equipo aborda el espacio en barrido descendente: evacuación de elementos voluminosos, aspiración industrial de polvo fino, y desincrustación química con disolventes calibrados y limpiadores de pH ácido para romper los enlaces de calcita del cemento y yeso sin dañar griferías o pavimentos nobles.",
    whyUs:
      "Asumir la limpieza post-reforma de manera amateur conlleva alto riesgo de rayar superficies nuevas con polvo abrasivo residual. Nuestros técnicos dominan la interacción química de los productos, garantizando la preservación de los acabados arquitectónicos.",
    extraFact:
      "La agilidad operativa, soportada por nuestro propio parque de maquinaria, asegura una reducción drástica en los tiempos de espera entre la finalización de albañilería y la habitabilidad real del espacio.",
    pexelsQuery: "construction cleaning post renovation apartment",
    image: "/images/servicios/limpiezas-de-fin-de-obra/1.webp",
    image2: "/images/servicios/limpiezas-de-fin-de-obra/2.webp",
    relatedSlugs: [
      "limpiezas-de-siniestros",
      "tratamientos-de-suelos",
      "servicios-globales-de-higiene",
    ],
  },
  {
    slug: "tratamiento-anti-termitas",
    category: "plagas",
    categoryLabel: "Control de Plagas",
    title: "Tratamiento Anti-Termitas",
    shortDesc:
      "Rastreo por radar de microondas y aniquilación biológica con sistema SentriTech. Sin inyectar venenos en el suelo.",
    includes: [
      "Inspección no destructiva con detectores de humedad, sensores acústicos y radar Termatrac",
      "Perforación de soleras con coronas de diamante para estaciones de monitoreo perimetral (Sentri-Sol)",
      "Balizas cebadoras interiores (Sentri-Box) con inhibidor de quitina Hexaflumurón",
      "Contrato de erradicación con monitoreo de 5 años y Seguro Anti-Termitas renovable",
    ],
    forWho:
      "Iglesias, museos, Bienes de Interés Cultural (BIC) y propiedades unifamiliares con forjados, escaleras y carpintería estructural de celulosa.",
    howItWorks:
      "Las termitas construyen tubos de barro hacia la casa. Localizamos la actividad acústicamente con el Termatrac sin romper paredes. Instalamos estaciones Sentri-Box interiores y Sentri-Sol exteriores con Hexaflumurón. Las obreras comen el cebo y lo comparten con la reina mediante trofalaxia, colapsando toda la colonia en semanas.",
    whyUs:
      "Más de 20 años de experiencia específica en esta plaga. Operadores acreditados del sistema SentriTech, reconocido como el estándar mundial en eliminación biológica de colonias sin inyectar litros de venenos en el suelo.",
    extraFact:
      "La eficiencia del sistema radica en su invisibilidad tóxica: la termita obrera no detecta que el cebo es un biocida de acción lenta, y continúa reclutando compañeras hacia la estación hasta que ya es demasiado tarde para la colonia.",
    pexelsQuery: "termite wood damage pest inspection house",
    image: "/images/servicios/tratamiento-anti-termitas/1-hq.webp",
    image2: "/images/servicios/tratamiento-anti-termitas/2.webp",
    relatedSlugs: [
      "desinsectacion-de-carcoma",
      "tratamiento-anti-xilofagos",
      "ddd-desratizacion-desinsectacion-desinfeccion",
    ],
  },
  {
    slug: "retirada-de-nidos-de-avispas",
    category: "plagas",
    categoryLabel: "Control de Plagas",
    title: "Retirada de Nidos de Avispas",
    shortDesc:
      "Localización pericial y destrucción química segura de enjambres. Resuelto en una única visita.",
    includes: [
      "Diagnóstico estructural para rastrear nidos subterráneos o en cámaras de aire, tejados y cornisas",
      "Choque biocida paralizante enfocado en castas defensivas (obreras) y la reina",
      "Supresión mecánica del panal para evitar reincidencia colonizadora",
      "Evaluación de factores de atracción en el perímetro (piscinas, fuentes, zonas azucaradas)",
    ],
    forWho:
      "Propietarios de viviendas unifamiliares, responsables de piscinas comunitarias, explotaciones agrarias y centros educativos con patios al aire libre.",
    howItWorks:
      "El técnico se equipa con vestuario anticorte y antijeringa de alta densidad. La intervención se realiza al amanecer o atardecer, cuando el enjambre descansa en el interior del panal. Se inyectan aerosoles o polvos insecticidas a presión directamente en la apertura, provocando colapso neurotóxico inmediato en la colonia.",
    whyUs:
      "Abordar un avispero de forma doméstica frecuentemente resulta en hospitalizaciones. Grupo Rubio aporta la destreza química y el equipamiento EPI adecuado para resolver la amenaza en una única visita, garantizando la seguridad del perímetro.",
    extraFact:
      "El umbral de riesgo alcanza su pico al final del verano. Las obreras se vuelven extremadamente agresivas en las inmediaciones de fuentes azucaradas y presencia humana.",
    pexelsQuery: "wasp nest removal pest control exterminator",
    image: "/images/servicios/retirada-de-nidos-de-avispas/1.webp",
    image2: "/images/servicios/retirada-de-nidos-de-avispas/2.webp",
    imagePos: "center 22%",
    relatedSlugs: [
      "ddd-desratizacion-desinsectacion-desinfeccion",
      "eliminar-plagas-de-cucarachas",
      "desinsectacion-de-mosquitos",
    ],
  },
  {
    slug: "eliminar-plagas-de-cucarachas",
    category: "plagas",
    categoryLabel: "Control de Plagas",
    title: "Eliminar Plagas de Cucarachas",
    shortDesc:
      "Erradicación biológica con cebos ecológicos focalizados. Trunca el ciclo reproductivo completo.",
    includes: [
      "Identificación taxonómica de la especie invasora para seleccionar el principio activo adecuado",
      "Despliegue de geles biocidas naturales y atrayentes alimenticios que no alteran el ambiente",
      "Tratamiento de las tres fases biológicas: ootecas (huevos), estado ninfal y adultos reproductores",
      "Sellado e intervención en sumideros, redes de saneamiento y cocinas industriales",
    ],
    forWho:
      "Plantas agroalimentarias, supermercados, hostelería y domicilios particulares con infestaciones originadas en bajantes.",
    howItWorks:
      "Las cucarachas son lucífugas y de hábitos nocturnos, anidando en grietas térmicas inaccesibles. Los técnicos aplican gotas de gel alimenticio biocida cerca de los refugios. Al ser omnívoras, ingieren el cebo y regresan al nido. Debido a la necrofagia y coprofagia propias de la especie, el principio activo se transfiere letalmente aniquilando a las ninfas que nunca abandonaron el nido.",
    whyUs:
      "A diferencia de los aerosoles comerciales que solo logran mortalidad temporal, nuestra metodología es ecológica, no invasiva y ataca el corazón de la colonia garantizando resultados permanentes.",
    extraFact:
      "Las patas espinosas de las cucarachas son excelentes vectores mecánicos que arrastran microorganismos desde el alcantarillado, provocando contaminación cruzada sobre alimentos.",
    pexelsQuery: "cockroach pest control kitchen hygiene",
    image: "/images/servicios/eliminar-plagas-de-cucarachas/1.webp",
    image2: "/images/servicios/eliminar-plagas-de-cucarachas/2.webp",
    relatedSlugs: [
      "ddd-desratizacion-desinsectacion-desinfeccion",
      "eliminar-plagas-de-hormigas",
      "desinsectacion-de-moscas",
    ],
  },
  {
    slug: "limpiezas-en-altura",
    category: "limpieza",
    categoryLabel: "Limpieza Especializada",
    title: "Limpiezas en Altura",
    shortDesc:
      "Limpieza de fachadas y cristaleras elevadas con pértigas hidrodifusoras y agua osmotizada. Sin andamios.",
    includes: [
      "Lavado de grandes ventanales y muros cortina con pértigas extensibles",
      "Tratamiento de conservación específico para fachadas de edificios históricos",
      "Generación y proyección in situ de agua químicamente pura (osmotizada)",
      "Cepillado suave y secado natural sin tensoactivos agresivos",
    ],
    forWho:
      "Comunidades de propietarios, sedes corporativas y administraciones responsables de edificios acristalados o construcciones históricas con desafíos de accesibilidad.",
    howItWorks:
      "El agua se somete a filtrado de ósmosis inversa para despojarla de minerales. Los técnicos bombean este fluido purificado con pértigas hidrodifusoras hasta la superficie elevada. El cepillado delicado desprende la contaminación, y al evaporarse el agua pura, la ausencia de minerales garantiza un acabado sin cercos calcáreos.",
    whyUs:
      "Al prescindir de andamiajes o grúas elevadoras, se mitigan los riesgos de siniestralidad laboral vinculados a trabajos en suspensión, reduciendo simultáneamente los costes operativos.",
    extraFact:
      "El servicio tiene flexibilidad total: puede activarse como intervención de choque puntual o estructurarse como plan de mantenimiento periódico para conservación a largo plazo.",
    pexelsQuery: "window cleaning highrise building facade professional",
    image: "/images/servicios/limpiezas-en-altura/1.webp",
    image2: "/images/servicios/limpiezas-en-altura/2.webp",
    relatedSlugs: [
      "limpiezas-de-fachadas-y-grafitis",
      "mantenimiento-y-conservacion",
      "limpiezas-industriales",
    ],
  },
  {
    slug: "tratamientos-de-suelos",
    category: "limpieza",
    categoryLabel: "Limpieza Especializada",
    title: "Tratamientos de Suelos",
    shortDesc:
      "Rehabilitación mecánica y química de pavimentos. Resistencia, alto brillo e impermeabilización.",
    includes: [
      "Intervenciones mecánicas abrasivas (pulidos y diamantados) para corrección de planimetría",
      "Cristalización y abrillantados termoquímicos para pavimentos calcáreos",
      "Decapados profundos para extracción de polímeros antiguos",
      "Sellado técnico con encerados, emulsiones acrílicas metalizadas, tapaporos y resinas hidro-óleo repelentes",
    ],
    forWho:
      "Naves logísticas, superficies comerciales de alto tránsito, hospitales y residencias que precisan suelos con aislamiento acústico, resistencia antideslizante y estética superior.",
    howItWorks:
      "Se caracteriza el material de la base. En pavimentos calcáreos, se usan rotativas con discos de diamante para nivelar la piedra, seguido de cristalización donde el ácido interactúa con el carbonato cálcico creando una capa vitrificada duradera. En suelos porosos se aplican imprimaciones selladoras y emulsiones poliméricas que cierran la capilaridad del material.",
    whyUs:
      "Adaptamos nuestras formulaciones químicas a los nuevos pavimentos termoplásticos y de resinas epoxi, asegurando una conservación a largo plazo que abarata los costes de la limpieza ordinaria.",
    extraFact:
      "Los tratamientos hidro-óleo repelentes son imperativos en talleres mecánicos e industria alimentaria, ya que bloquean el filtrado de aceites y biofluidos hacia el subsuelo, previniendo focos de contaminación bacteriana.",
    pexelsQuery: "floor polishing industrial cleaning marble treatment",
    relatedSlugs: [
      "limpiezas-industriales",
      "mantenimiento-y-conservacion",
      "limpieza-de-parkings-y-garajes",
    ],
  },
  {
    slug: "mantenimiento-y-conservacion",
    category: "limpieza",
    categoryLabel: "Limpieza Especializada",
    title: "Mantenimiento y Conservación",
    shortDesc:
      "Servicio sostenido de higienización para instalaciones de uso intensivo. Cobertura ininterrumpida.",
    includes: [
      "Saneamiento periódico de superficies arquitectónicas y mobiliario interno",
      "Mantenimiento higiénico de conductos HVAC y piscinas",
      "Integración de purificación ambiental (ozono) e intervenciones en altura",
      "Convergencia con control vectorial (DDD) y prevención de Legionela",
    ],
    forWho:
      "Hoteles, restaurantes, centros educativos, residencias geriátricas, gimnasios, cocinas colectivas, oficinas y naves industriales que precisan cobertura de limpieza ininterrumpida.",
    howItWorks:
      "Tras la auditoría de espacios, seleccionamos técnicas e implementos idóneos. Se establece un plan sincronizado con los horarios de afluencia para evitar interrupciones. Las tareas diarias se complementan con intervenciones técnicas periódicas (cristalización trimestral, limpieza de fachadas semestral).",
    whyUs:
      "La externalización en una única corporación permite al cliente unificar la responsabilidad civil y sanitaria. El servicio técnico Kärcher propio garantiza que ninguna falla de maquinaria interrumpa la limpieza.",
    extraFact:
      "Enlazamos directamente el mantenimiento diario con el control de auditorías de sanidad, la formación de manipuladores de alimentos y el diseño de planes APPCC.",
    pexelsQuery: "professional cleaning service building maintenance",
    relatedSlugs: [
      "servicios-globales-de-higiene",
      "limpiezas-industriales",
      "ozonizacion",
    ],
  },
  {
    slug: "servicios-globales-de-higiene",
    category: "limpieza",
    categoryLabel: "Limpieza Especializada",
    title: "Servicios Globales de Higiene",
    shortDesc:
      "Soluciones higiénicas integrales y personalizadas. Externalización total y segura de la gestión higiénica.",
    includes: [
      "Análisis técnico y diseño de protocolos de sanitización específicos para las instalaciones",
      "Servicios de mantenimiento estructural: tratamientos de pavimentos, purificación del aire",
      "Integración con control de plagas y mantenimiento electromecánico",
      "Suministro de maquinaria industrial y productos químicos certificados",
    ],
    forWho:
      "Corporaciones industriales, comunidades de vecinos, centros sanitarios, establecimientos hoteleros y plantas de la industria alimentaria.",
    howItWorks:
      "El proceso comienza con una auditoría técnica in situ para mapear vulnerabilidades higiénicas. Se estructura un presupuesto personalizado sin compromiso. Equipos multidisciplinares con maquinaria de última generación asumen la ejecución periódica del saneamiento, sometida a supervisión continua.",
    whyUs:
      "Más de 50 años en el sector (desde 1971), con un modelo basado en formación continua y compromiso innegociable con la seguridad, salud ocupacional y respeto al medio ambiente.",
    extraFact:
      "La tienda especializada en Tudela provee más de 135 referencias de productos químicos y 241 útiles de limpieza profesionales para apoyar la logística de estos servicios.",
    pexelsQuery: "hygiene services professional cleaning team commercial",
    image: "/images/servicios/servicios-globales-de-higiene/1.webp",
    image2: "/images/servicios/servicios-globales-de-higiene/2.webp",
    relatedSlugs: [
      "mantenimiento-y-conservacion",
      "limpiezas-industriales",
      "ddd-desratizacion-desinsectacion-desinfeccion",
    ],
  },
  {
    slug: "limpieza-de-conductos-de-climatizacion",
    category: "limpieza",
    categoryLabel: "Limpieza Especializada",
    title: "Limpieza de Conductos de Climatización",
    shortDesc:
      "Desinfección térmica y cavitación ultrasónica para sistemas HVAC. Prevención crítica de incendios.",
    includes: [
      "Hidrolimpieza a alta presión con tecnología Kärcher e inyección de agua hirviendo para disolver grasas",
      "Aspiración mecánica de fluidos residuales en tramos verticales con bombas especializadas",
      "Desengrase por inmersión en tanques ultrasónicos para filtros y campanas",
      "Sellado y protección plástica del entorno con recogida integral de residuos líquidos",
    ],
    forWho:
      "Cocinas industriales, redes de restauración, hospitales y edificios corporativos con infraestructuras complejas de extracción de humos y ventilación forzada.",
    howItWorks:
      "La tecnología ultrasónica genera ondas a 20 kHz creando cavitación: implosión de moléculas de agua 40.000 veces por segundo, creando un microcepillado que fractura enlaces iónicos en áreas inaccesibles. Paralelamente, los conductos fijos reciben impactos de agua hirviendo a alta presión que barren la grasa hacia puntos de succión controlados.",
    whyUs:
      "La combinación de tecnología ultrasónica y térmica asegura limpieza de nivel microscópico, reduciendo exponencialmente el consumo de agua, tiempo y detergentes en comparación con el restregado manual.",
    extraFact:
      "La ausencia de mantenimiento en conductos representa uno de los mayores riesgos de incendio estructural, y su correcta higienización proporciona un drástico ahorro en el consumo eléctrico de los motores.",
    pexelsQuery: "HVAC duct cleaning ventilation system industrial",
    image: "/images/servicios/limpieza-de-conductos-de-climatizacion/1.webp",
    image2: "/images/servicios/limpieza-de-conductos-de-climatizacion/2.webp",
    relatedSlugs: [
      "mantenimiento-y-conservacion",
      "limpiezas-industriales",
      "ozonizacion",
    ],
  },
  {
    slug: "limpiezas-de-fachadas-y-grafitis",
    category: "limpieza",
    categoryLabel: "Limpieza Especializada",
    title: "Limpiezas de Fachadas y Grafitis",
    shortDesc:
      "Restauración arquitectónica exterior. Disolución química de polución, óxido y pintadas vandálicas.",
    includes: [
      "Eliminación no destructiva de eflorescencias de salitre y sedimentos por contaminación",
      "Disolución especializada de aerosoles y pigmentos vandálicos",
      "Aplicación técnica de barnices y pinturas repelentes transpirables",
      "Programas de conservación estética permanente para paramentos",
    ],
    forWho:
      "Administración pública, comunidades de vecinos, entidades bancarias y locales comerciales que sufren degradación por vandalismo urbano y lluvia ácida.",
    howItWorks:
      "Lejos del arenado abrasivo, el proceso se basa en diagnóstico del tipo de revestimiento y aplicación de reactivos químicos específicos que disuelven los polímeros de la pintura sin atacar piedra o mortero. Finalmente, la fachada se sella con protectores sacrificiales (temporales) o permanentes que repelen aerosoles.",
    whyUs:
      "Diseñamos planes de mantenimiento singularizados, entendiendo que el tratamiento de un paramento histórico de sillería difiere radicalmente de la limpieza de un cerramiento de panel sándwich industrial.",
    extraFact:
      "Los tratamientos protectores permanentes actúan como agentes hidro-repelentes, impidiendo la filtración capilar de aguas pluviales y previniendo patologías estructurales y proliferación de mohos.",
    pexelsQuery: "building facade cleaning graffiti removal exterior",
    image: "/images/servicios/limpiezas-de-fachadas-y-grafitis/1.webp",
    image2: "/images/servicios/limpiezas-de-fachadas-y-grafitis/2.webp",
    relatedSlugs: [
      "limpiezas-en-altura",
      "mantenimiento-y-conservacion",
      "tratamientos-de-suelos",
    ],
  },
  {
    slug: "limpiezas-de-siniestros",
    category: "limpieza",
    categoryLabel: "Limpieza Especializada",
    title: "Limpiezas de Siniestros",
    shortDesc:
      "Mitigación urgente y recuperación estructural tras incendios e inundaciones. Servicio exprés.",
    includes: [
      "Tratamiento de choque para desodorización y eliminación química de hollín en superficies",
      "Recuperación de equipamiento electrónico mediante tecnología ultrasónica",
      "Evacuación de caudales con bombas de achique y aspiradores de lixiviados",
      "Secado técnico de pavimentos con fregadoras automáticas y esterilización por ozono",
    ],
    forWho:
      "Compañías aseguradoras, peritos tasadores, complejos industriales y domicilios privados que requieren contención inmediata de daños tras catástrofes.",
    howItWorks:
      "Bajo la modalidad exprés, la movilización es inmediata. En inundaciones, se despliegan bombas de gran caudal para extraer el agua. En incendios, se frena la acción corrosiva del hollín trasladando piezas delicadas a tanques ultrasónicos. Posteriormente, el ambiente se sobresatura con ozono para neutralizar el olor a combustión.",
    whyUs:
      "Más de 40 años colaborando activamente con consorcios y compañías aseguradoras, con flexibilidad para absorber intervenciones críticas en cualquier momento.",
    extraFact:
      "La premura no es estética, sino química: la mezcla de cloruros del hollín con la humedad forma ácido clorhídrico, que oxida irreversiblemente los metales del inmueble en días si no se neutraliza.",
    pexelsQuery: "fire damage restoration water damage cleanup emergency",
    relatedSlugs: [
      "limpiezas-de-fin-de-obra",
      "ozonizacion",
      "mantenimiento-y-conservacion",
    ],
  },
  {
    slug: "limpieza-de-parkings-y-garajes",
    category: "limpieza",
    categoryLabel: "Limpieza Especializada",
    title: "Limpieza de Parkings y Garajes",
    shortDesc:
      "Saneamiento mecánico de grandes superficies de estacionamiento. Supresión de hidrocarburos y hollín.",
    includes: [
      "Mantenimientos rutinarios con barrido de succión y fregado mecánico",
      "Operaciones de choque ante inundaciones pluviales o vertidos de fluidos mecánicos",
      "Eliminación química de manchas de aceites, anticongelantes y marcas de neumáticos",
    ],
    forWho:
      "Administradores de fincas y comunidades vecinales, gestores de grandes superficies comerciales, centros corporativos y parkings públicos subterráneos.",
    howItWorks:
      "La operación está fuertemente mecanizada. Tras sectorizar el espacio, barredoras industriales recorren las rampas aspirando partículas sólidas. Posteriormente, fregadoras automáticas inyectan desengrasantes para disolver derivados del petróleo, restregando el pavimento y aspirando las aguas negras simultáneamente.",
    whyUs:
      "Disponibilidad constante de equipos de gran formato permite procesar miles de metros cuadrados en tiempos reducidos. El soporte mecatrónico garantiza que las barredoras operen a máxima eficiencia.",
    extraFact:
      "El polvo en garajes subterráneos actúa como aerosol abrasivo que deteriora la pintura de vehículos, y las micropartículas de metales pesados son succionadas por fosos de ascensores hacia áreas residenciales.",
    pexelsQuery: "parking garage cleaning sweeper industrial floor",
    relatedSlugs: [
      "limpiezas-industriales",
      "tratamientos-de-suelos",
      "mantenimiento-y-conservacion",
    ],
  },
  {
    slug: "tratamientos-contra-la-procesionaria",
    category: "plagas",
    categoryLabel: "Control de Plagas",
    title: "Tratamientos contra la Procesionaria",
    shortDesc:
      "Control de la oruga del pino (Thaumetopoea pityocampa). Protege la masa forestal y previene episodios anafilácticos.",
    includes: [
      "Monitoreo forestal para detección de oviposiciones estivales y bolsones de seda",
      "Aplicación de larvicidas e endoterapia arbórea antes de la fase crítica",
      "Acciones de interceptación mecánica para evitar hileras de descenso",
    ],
    forWho:
      "Entidades municipales con parques públicos, directores de centros escolares con arbolado y propietarios de parcelas rústicas con coníferas.",
    howItWorks:
      "El tratamiento disrumpe el ciclo fenológico. En verano, el lepidóptero deposita huevos en las ramas altas. Los técnicos aplican biocidas biológicos o inhibidores de quitina en el follaje. Si el invierno ha pasado, se instalan anillos interceptores en los troncos para capturar orugas durante el descenso primaveral.",
    whyUs:
      "Alcance logístico para despliegues masivos en Navarra, Zaragoza, La Rioja, Guipúzcoa y Álava, asesorando a ayuntamientos en campañas preventivas anuales.",
    extraFact:
      "Los tricomas (pelos urticantes) cargados de taumetopoeína causan urticarias extremas en humanos y son célebres por causar necrosis de la lengua en perros.",
    pexelsQuery: "pine processionary caterpillar pine forest pest",
    image: "/images/servicios/tratamientos-contra-la-procesionaria/1.webp",
    image2: "/images/servicios/tratamientos-contra-la-procesionaria/2.webp",
    relatedSlugs: [
      "ddd-desratizacion-desinsectacion-desinfeccion",
      "control-de-aves",
      "retirada-de-nidos-de-avispas",
    ],
  },
  {
    slug: "eliminar-plagas-de-hormigas",
    category: "plagas",
    categoryLabel: "Control de Plagas",
    title: "Eliminar Plagas de Hormigas",
    shortDesc:
      "Supresión biológica de colonias mediante cebos naturales que provocan el colapso del hormiguero central.",
    includes: [
      "Evaluación entomológica para distinguir especies azucareras de las proteicas",
      "Empleo de formulaciones en gel y cebos naturales cien por cien biodegradables",
      "Protección perimetral para jardines, sustratos vegetales y viviendas",
      "Prevención de contaminación cruzada en la industria alimentaria",
    ],
    forWho:
      "Chalets, viviendas unifamiliares con zonas ajardinadas, industria alimentaria e invernaderos con invasión de formícidos en zonas de producción.",
    howItWorks:
      "Los técnicos aplican cebos naturales en las rutas de feromonas de las obreras. Estas recogen el biocida creyendo que es alimento y lo introducen en el nido, suministrándoselo a larvas y a la reina. La muerte de la casta reproductiva desencadena la muerte total de la colonia.",
    whyUs:
      "Los insecticidas de contacto comunes provocan que la colonia se fragmente (gemación), creando múltiples hormigueros nuevos. Nuestras tácticas ecológicas engañan a la colonia para que se autodestruya desde su núcleo.",
    extraFact:
      "Ciertas especies de hormigas crían pulgones en plantas de jardín para cosechar su melaza; eliminar las hormigas frecuentemente rescata también la flora circundante.",
    pexelsQuery: "ant colony pest control garden natural treatment",
    relatedSlugs: [
      "eliminar-plagas-de-cucarachas",
      "ddd-desratizacion-desinsectacion-desinfeccion",
      "desinsectacion-de-pulgas",
    ],
  },
  {
    slug: "desinsectacion-de-carcoma",
    category: "plagas",
    categoryLabel: "Control de Plagas",
    title: "Desinsectación de Carcoma",
    shortDesc:
      "Erradicación del escarabajo xilófago con ecología profunda. Protege vigas, muebles de época y parqués.",
    includes: [
      "Identificación morfológica: Carcoma común (Anobium Punctatum) o Carcoma grande (Hylotrupes bajulus)",
      "Inyección a presión de formulaciones biocidas ecológicas en el interior del duramen de las vigas",
      "Tratamientos de impregnación superficial para mobiliario noble y parqué",
      "Prevención mediante saturación tóxica de la celulosa",
    ],
    forWho:
      "Entidades de preservación patrimonial, restauradores, ebanistas, propietarios de caseríos con armazones de cubierta en madera y poseedores de antigüedades.",
    howItWorks:
      "Las larvas ciegas pasan años excavando galerías en el interior de la madera. El técnico rastrea la actividad acústica y la expulsión de serrín fino. Se emplean inyectores con válvulas de retención para introducir productos naturales a presión, saturando la madera e interrumpiendo el sistema nervioso de la larva.",
    whyUs:
      "Red de oficinas que permite llevar tecnologías anti-xilófagas a los rincones más rústicos del norte de España, aplicando soluciones profesionales respetuosas con la salud de habitantes y mascotas.",
    extraFact:
      "Anobium Punctatum es el agente detrás del 75% de los daños en maderas estructurales y ornamentales, devorando tanto coníferas blandas como frondosas duras.",
    pexelsQuery: "woodworm beetle wood damage antique furniture treatment",
    image: "/images/servicios/desinsectacion-de-carcoma/1-hq.webp",
    image2: "/images/servicios/desinsectacion-de-carcoma/2.webp",
    relatedSlugs: [
      "tratamiento-anti-termitas",
      "tratamiento-anti-xilofagos",
      "ddd-desratizacion-desinsectacion-desinfeccion",
    ],
  },
  {
    slug: "desinsectacion-de-chinches-de-cama",
    category: "plagas",
    categoryLabel: "Control de Plagas",
    title: "Desinsectación de Chinches de Cama",
    shortDesc:
      "Choque térmico y barreras físicas MicronOne® para aniquilar infestaciones. Efectivo desde la primera aplicación.",
    includes: [
      "Diagnóstico diferencial de la picadura para confirmar la presencia del hematófago",
      "Choque térmico sobrepasando el umbral de supervivencia del insecto (55°C)",
      "Saneamiento de colchones, tapicerías, rodapiés y somieres",
      "Colocación de fundas de bloqueo total certificadas con tecnología MicronOne®",
    ],
    forWho:
      "Hoteles, pensiones, albergues, transportistas logísticos y domicilios particulares con problemas alérgicos e insomnio derivado de las picaduras.",
    howItWorks:
      "Las chinches detectan el CO₂ humano e inyectan saliva anestésica al picar. Por su alta resistencia a los piretroides, los técnicos aplican vapor sobrecalentado a +55°C en costuras y grietas del mueble, coagulando las proteínas del insecto y de sus huevos al instante. Finalmente, se sella el colchón con fundas transpirables MicronOne®.",
    whyUs:
      "El protocolo térmico demuestra efectividad radical en la primera aplicación, evitando que el cliente tenga que deshacerse de costosos colchones y minimizando el uso de insecticidas en entornos de descanso directo.",
    extraFact:
      "Las fundas MicronOne® no solo asfixian biológicamente a los especímenes atrapados, sino que sus poros microscópicos actúan como barrera impermeable para ácaros y alérgenos, mejorando la higiene respiratoria.",
    pexelsQuery: "bed bug pest control mattress hotel room treatment",
    relatedSlugs: [
      "ddd-desratizacion-desinsectacion-desinfeccion",
      "desinsectacion-de-pulgas",
      "eliminar-plagas-de-cucarachas",
    ],
  },
  {
    slug: "desinsectacion-de-moscas",
    category: "plagas",
    categoryLabel: "Control de Plagas",
    title: "Desinsectación de Moscas",
    shortDesc:
      "Planes de contención sanitaria con biocidas focalizados e insectocaptores lumínicos. Tolerancia cero.",
    includes: [
      "Evaluaciones de saneamiento para detección de focos de cría con materia orgánica",
      "Aplicación dual: larvicidas en sustratos de anidación y adulticidas espaciales ecológicos",
      "Instalación de insectocaptores electromecánicos (trampas de luz ultravioleta)",
      "Asesoría medioambiental para el manejo de basuras en la industria alimentaria",
    ],
    forWho:
      "Mataderos, granjas, conserveras, plantas de procesamiento lácteo y restaurantes bajo normativas APPCC de tolerancia cero.",
    howItWorks:
      "En lugar de aerosoles al aire, los técnicos aplican insecticidas en las masas de residuos que las hembras utilizan para ovipositar. Paralelamente, se instalan trampas de luz ultravioleta que atraen a los adultos voladores hacia láminas adhesivas o rejillas electrificadas.",
    whyUs:
      "El enfoque se alinea con los requerimientos del Reglamento 852/2004 de Seguridad Alimentaria, previniendo cierres administrativos por insalubridad.",
    extraFact:
      "Las moscas transmiten gérmenes causantes de cólera, disentería, tifus y tuberculosis mediante el contacto de sus patas contaminadas con los alimentos.",
    pexelsQuery: "fly control insect trap food safety commercial kitchen",
    relatedSlugs: [
      "ddd-desratizacion-desinsectacion-desinfeccion",
      "desinsectacion-de-mosquitos",
      "eliminar-plagas-de-cucarachas",
    ],
  },
  {
    slug: "desinsectacion-de-mosquitos",
    category: "plagas",
    categoryLabel: "Control de Plagas",
    title: "Desinsectación de Mosquitos",
    shortDesc:
      "Control larvario biológico y abatimiento de poblaciones adultas. Protección de la fauna acuática.",
    includes: [
      "Tratamiento larvicida ecológico en focos de agua estancada, fuentes e imbornales",
      "Desinsectación perimetral termonebulizada para enjambres adultos en vegetación densa",
      "Campañas intensivas previas y durante la temporada estival",
      "Control específico de hembras hematófagas",
    ],
    forWho:
      "Campings, hoteles con piscinas, campos de golf, ayuntamientos de la ribera del Ebro y particulares con jardines.",
    howItWorks:
      "Se mapea el terreno y se aplican formulaciones larvicidas biorracionales (Bacillus thuringiensis) en espejos de agua, impidiendo que la larva alcance el estadio volador. Para la plaga ya presente, se abaten adultos mediante nebulizaciones de bajo impacto ecológico en zonas de umbría.",
    whyUs:
      "Al centrarnos en el control larvario biológico, garantizamos un descenso radical en la densidad poblacional sin impacto tóxico sobre la fauna piscícola o los anfibios del ecosistema local.",
    extraFact:
      "Los mosquitos son vectores primarios de enfermedades graves como la fiebre amarilla y el paludismo (malaria) a nivel sanitario global.",
    pexelsQuery: "mosquito pest control outdoor garden treatment spray",
    relatedSlugs: [
      "ddd-desratizacion-desinsectacion-desinfeccion",
      "desinsectacion-de-moscas",
      "retirada-de-nidos-de-avispas",
    ],
  },
  {
    slug: "desinsectacion-de-pulgas",
    category: "plagas",
    categoryLabel: "Control de Plagas",
    title: "Desinsectación de Pulgas",
    shortDesc:
      "Supresión radical con reguladores químicos que interceptan la metamorfosis. Protección de personas y mascotas.",
    includes: [
      "Identificación en el paciente (perros, gatos, humanos) de rastros del hematófago",
      "Tratamiento espacial sobre alfombras, moquetas, zócalos y zonas de pernocta de animales",
      "Aplicación de microencapsulados e IGRs para cortar el paso evolutivo a pupa",
      "Desinsectación de locales abandonados o colonizados",
    ],
    forWho:
      "Clínicas veterinarias, refugios de animales, explotaciones hípicas y familias con animales de compañía con reinfestaciones crónicas.",
    howItWorks:
      "El adulto se hospeda en el animal o humano. Los huevos y larvas se ocultan en la profundidad de alfombras o tierra. Los técnicos aplican insecticidas residuales que destruyen la población activa, combinados con IGRs de efecto prolongado que impiden hormonalmente que las larvas completen su capullo.",
    whyUs:
      "Las bombas de humo domésticas no penetran el escudo protector de las pupas. Nuestras formulaciones de larga persistencia permanecen activas a la espera de que los huevos remanentes eclosionen, eliminando definitivamente la plaga.",
    extraFact:
      "Cuando las mascotas ingieren accidentalmente pulgas al lamerse, se infectan frecuentemente con tenias (parásitos intestinales graves) que la pulga alberga en su interior.",
    pexelsQuery: "flea pest control pet dog cat treatment home",
    relatedSlugs: [
      "desinsectacion-de-chinches-de-cama",
      "ddd-desratizacion-desinsectacion-desinfeccion",
      "eliminar-plagas-de-hormigas",
    ],
  },
  {
    slug: "tratamiento-anti-xilofagos",
    category: "plagas",
    categoryLabel: "Control de Plagas",
    title: "Tratamiento Anti-Xilófagos",
    shortDesc:
      "Protección integral de la madera con inyección a presión, modificación ambiental y Kill-Box Bubble.",
    includes: [
      "Inyección a alta presión de fluidos biocidas en vigas y pontones estructurales",
      "Revestimiento preventivo con pulverización de resinas y geles protectores",
      "Consultoría de Sistemas Constructivos para alterar variables termodinámicas de la edificación",
      "Servicio especializado de aniquilación anóxica con cámara neumática Kill-Box Bubble",
    ],
    forWho:
      "Arquitectos rehabilitadores de patrimonio, ebanistas, propietarios de edificios tradicionales con forjados de cubierta y carpintería estructural.",
    howItWorks:
      "Para elementos fijos, se practican perforaciones y se inyecta biocida a presión hasta que la madera rezuma. Para bienes artísticos móviles (retablos, muebles), se introduce la pieza en la burbuja de PVC Kill-Box (300×200×200 cm) donde se modifica artificialmente la temperatura y la atmósfera hasta erradicar cualquier fase biológica.",
    whyUs:
      "El sistema Kill-Box Bubble ofrece garantía de eliminación del 100% sobre obras de arte invaluables sin alterar sus pigmentos, sin inyectar químicos corrosivos y sin generar olores tóxicos.",
    extraFact:
      "Los hongos de pudrición actúan en simbiosis con las carcomas. La modificación de la humedad a través de la arquitectura preventiva detiene mecánicamente la digestión enzimática, paralizando la pudrición de la celulosa.",
    pexelsQuery: "wood preservation treatment heritage building restoration",
    relatedSlugs: [
      "desinsectacion-de-carcoma",
      "tratamiento-anti-termitas",
      "ddd-desratizacion-desinsectacion-desinfeccion",
    ],
  },
  {
    slug: "tratamientos-de-legionela",
    category: "plagas",
    categoryLabel: "Control de Plagas",
    title: "Tratamientos de Legionela",
    shortDesc:
      "Hipercloración y control termodinámico de redes hídricas. Cumplimiento estricto del RD 861/2003.",
    includes: [
      "Mantenimiento químico y térmico en circuitos de Agua Caliente Sanitaria (ACS) y Agua Fría",
      "Tratamiento profiláctico en instalaciones complejas (spas, piscinas, jacuzzis)",
      "Sanitización de acumuladores, intercambiadores y torres de refrigeración industriales",
      "Emisión de certificaciones técnicas y libros de registro (RD 861/2003)",
    ],
    forWho:
      "Hospitales, residencias de ancianos, polideportivos, redes hoteleras y naves industriales con condensadores evaporativos.",
    howItWorks:
      "La Legionella prolifera en biofilm a 35–37°C. Los técnicos inyectan biocidas a través de la red y realizan choque térmico elevando la temperatura por encima de 70°C, umbral que destruye la bacteria. Se supervisan y purgan todos los grifos, duchas y aspersores para evitar la formación de biocapas.",
    whyUs:
      "Los protocolos siguen rigurosamente el RD 861/2003, dotando al cliente del amparo legal requerido ante inspecciones gubernamentales y protegiendo la reputación de la marca.",
    extraFact:
      "Beber agua infectada no causa la enfermedad. El contagio se produce cuando la bacteria viaja en aerosol de una ducha o torre de enfriamiento e inhala directamente hasta los alvéolos pulmonares.",
    pexelsQuery: "water treatment legionella plumbing system hotel",
    image: "/images/servicios/tratamientos-de-legionela/1-hq.webp",
    image2: "/images/servicios/tratamientos-de-legionela/2-hq.webp",
    relatedSlugs: [
      "ddd-desratizacion-desinsectacion-desinfeccion",
      "mantenimiento-y-conservacion",
      "appcc-implantacion-y-verificacion",
    ],
  },
  {
    slug: "control-de-aves",
    category: "plagas",
    categoryLabel: "Control de Plagas",
    title: "Control de Aves",
    shortDesc:
      "Barreras de exclusión mecánica y repelentes químicos frente a palomas y estorninos. Saneamiento total.",
    includes: [
      "Cerramiento con mallas antipájaros termosoldadas en lucernarios, campanarios y patios",
      "Sistemas antiposamiento (varillas y púas disuasorias) en cornisas y alféizares",
      "Campañas de captura autorizadas con trampas de cebo mecánico",
      "Geles disuasorios, extracción de nidos y desinfección del área",
    ],
    forWho:
      "Inmuebles del casco histórico, silos agrícolas, administraciones locales y comunidades con ruidos y atascos pluviales.",
    howItWorks:
      "Análisis ornitológico determina si las cornisas son áreas de anidamiento, dormideros o puntos de alimentación. El equipo sella permanentemente las zonas de acceso con mallas invisibles desde la vía pública e instala líneas de pinchos. En colonización extrema, se sitúan jaulas de captura o cordones de geles repelentes.",
    whyUs:
      "Al ser proveedor integral, Grupo Rubio complementa la exclusión física del ave con la limpieza y desinfección profunda (DDD) del guano corrosivo remanente, garantizando saneamiento total.",
    extraFact:
      "Las palomas transportan patógenos respiratorios causantes de histoplasmosis y clamidia, e infestan interiores con ácaros, arácnidos, pulgas y garrapatas asociados.",
    pexelsQuery: "pigeon control bird exclusion building urban pest",
    image: "/images/servicios/control-de-aves/1.webp",
    image2: "/images/servicios/control-de-aves/2.webp",
    relatedSlugs: [
      "ddd-desratizacion-desinsectacion-desinfeccion",
      "tratamientos-contra-la-procesionaria",
      "limpiezas-de-fachadas-y-grafitis",
    ],
  },
  {
    slug: "identificacion-de-insectos",
    category: "plagas",
    categoryLabel: "Control de Plagas",
    title: "Identificación de Insectos",
    shortDesc:
      "Laboratorio pericial de clasificación taxonómica y diagnosis forense por biólogos y entomólogos.",
    includes: [
      "Análisis bajo microscopía óptica para catalogar familia, género y especie exacta",
      "Informe Biológico Técnico con pautas reproductivas, nutricionales y migratorias",
      "Dictamen científico para rastrear el origen primario de las contaminaciones",
      "Asesoría sobre repelentes, biocidas e IGRs específicos para la plaga identificada",
    ],
    forWho:
      "Departamentos de trazabilidad de la industria alimentaria, inspectores agrónomos y particulares con daños materiales severos o patologías cutáneas de origen desconocido.",
    howItWorks:
      "El cliente captura 2–3 especímenes sin mezclar especies en el mismo vial, sin ahogarlos en alcohol (deforma estructuras quitinosas clave para el diagnóstico). Los frascos se procesan en el laboratorio, donde entomólogos cruzan datos morfológicos para emitir su veredicto científico.",
    whyUs:
      "Afrontar el control de plagas mediante especulación visual resulta inútil y ambientalmente irresponsable. Aplicamos el biocida exacto al insecto exacto, apoyándonos en las ciencias biológicas de precisión.",
    extraFact:
      "Saber si una carcoma pertenece a Anobiidae o Cerambycidae cambia completamente el enfoque del tratamiento (químico vs. atmosférico), demostrando que esta inteligencia previa es la inversión más rentable en bioseguridad.",
    pexelsQuery: "entomology insect identification laboratory microscope",
    relatedSlugs: [
      "desinsectacion-de-carcoma",
      "ddd-desratizacion-desinsectacion-desinfeccion",
      "tratamiento-anti-termitas",
    ],
  },
  {
    slug: "formacion-de-manipulador-de-alimentos",
    category: "alimentaria",
    categoryLabel: "Seguridad Alimentaria",
    title: "Formación de Manipulador de Alimentos",
    shortDesc:
      "Capacitación oficial y certificada para el carné de manipulación de alimentos. Marco legal Reglamento 852/2004.",
    includes: [
      "Temario regulado según el Reglamento Comunitario 852/2004",
      "Módulos de microbiología práctica, prevención de toxiinfecciones y contaminación cruzada",
      "Emisión y validación del Certificado Nominal de Manipulador de Alimentos",
      "Infraestructura del Centro de Formación propio",
    ],
    forWho:
      "Cualquier profesional con contacto directo o indirecto con alimentos: sector HORECA, supermercados, comedores escolares, guarderías y ayuda a domicilio.",
    howItWorks:
      "Las entidades o ciudadanos solicitan vía telefónica o correo un presupuesto. Las clases se imparten en las instalaciones de Grupo Rubio por técnicos experimentados en sanidad ambiental, ilustrando riesgos reales con casuística de auditoría. Tras aprobar la evaluación, el alumno recibe la acreditación oficial.",
    whyUs:
      "Al formarse con la misma empresa que realiza las auditorías APPCC y desinfecta las fábricas, el contenido lectivo está conectado con la realidad microbiológica del mercado, convirtiendo al operario en un auténtico escudo sanitario.",
    extraFact:
      "El mayor vector de alteración biológica en plantas de procesado es la falta de praxis higiénica personal. Esta capacitación formal es la primera línea defensiva contra brotes epidemiológicos.",
    pexelsQuery: "food safety training hygiene food handler certificate",
    image: "/images/servicios/formacion-de-manipulador-de-alimentos/1-hq-v2.webp",
    image2: "/images/servicios/formacion-de-manipulador-de-alimentos/2.webp",
    relatedSlugs: [
      "appcc-implantacion-y-verificacion",
      "centro-de-formacion",
      "ddd-desratizacion-desinsectacion-desinfeccion",
    ],
  },
  {
    slug: "appcc-implantacion-y-verificacion",
    category: "alimentaria",
    categoryLabel: "Seguridad Alimentaria",
    title: "APPCC — Implantación y Verificación",
    shortDesc:
      "Diseño, validación y sostenimiento documental del sistema APPCC. Cumplimiento normativo integral.",
    includes: [
      "Auditoría microbiológica inicial y evaluación de riesgos en cadenas de procesado",
      "Desarrollo de 10 Planes de Prerrequisitos: Agua, L+D, Formación, Temperaturas, Proveedores, Plagas, Residuos, Mantenimiento, Alérgenos y Trazabilidad",
      "Implantación de Guías de Correctas Prácticas de Higiene (GCPH) bajo Reglamento 852/2004",
      "Tomas de muestras analíticas para respaldar la eficacia del sistema ante Sanidad",
    ],
    forWho:
      "Industria agroalimentaria, cadenas de restaurantes, empresas de cátering, fábricas de conservas y almacenes frigoríficos.",
    howItWorks:
      "Se inicia con incursión técnica in situ documentando flujos de materia prima y focos de alteración. Se formalizan los Cuadernos de Registro que el cliente completa diariamente. Durante la verificación constante, el laboratorio recoge muestras sobre tablas de corte y productos procesados para certificar que los umbrales de peligrosidad se mantienen bajos.",
    whyUs:
      "Al actuar como solución integral, no subcontratamos a terceros. El equipo que redacta el plan APPCC cuenta con nuestros propios fumigadores, equipos de ozonización y centro formativo, garantizando coherencia técnica imbatible.",
    extraFact:
      "El Plan de Trazabilidad permite ordenar retiradas quirúrgicas y ultrarrápidas de lotes intoxicados, mitigando el colapso financiero de la marca y las imputaciones de responsabilidad penal.",
    pexelsQuery: "food safety HACCP quality control food industry audit",
    image: "/images/servicios/appcc-implantacion-y-verificacion/1.webp",
    image2: "/images/servicios/appcc-implantacion-y-verificacion/2.webp",
    relatedSlugs: [
      "formacion-de-manipulador-de-alimentos",
      "ddd-desratizacion-desinsectacion-desinfeccion",
      "mantenimiento-y-conservacion",
    ],
  },
  {
    slug: "alquiler-de-maquinaria",
    category: "maquinaria",
    categoryLabel: "Servicio Técnico y Maquinaria",
    title: "Alquiler de Maquinaria",
    shortDesc:
      "Alquiler flexible de equipamiento pesado Kärcher para operaciones de higienización industrial intensiva.",
    includes: [
      "Fregadoras automáticas y barredoras de conductor sentado y a pie (batería o motor térmico)",
      "Hidrolimpiadoras de alta presión para agua fría y caliente",
      "Generadores de ozono industriales y deshumidificadores de alta capacidad",
      "Limpiadoras técnicas: aspiradores HEPA, lavamoquetas Puzzi, rotativas y generadores de vapor",
    ],
    forWho:
      "Subcontratas multiservicio con picos de demanda, industrias en modelos de externalización (renting) y constructores que precisan herramientas para el desescombro.",
    howItWorks:
      "Se eleva una solicitud definiendo necesidades de tracción, metraje y severidad de la suciedad. Los asesores técnicos recomiendan el equipo idóneo. Los equipos se entregan listos tras revisión en los talleres electromecánicos, con instrucción en el manejo seguro.",
    whyUs:
      "A diferencia de alquiladores de ferretería convencionales, todos los aparatos están custodiados por el Servicio Técnico Oficial Kärcher de la propia firma. Si un equipo falla durante el alquiler, se envía repuesto o se repara in situ.",
    extraFact:
      "Alquilar la maquinaria de ozono es altamente rentable para concesionarios y el mercado inmobiliario: permite neutralizar hedores a humo sin asumir costes salariales externos.",
    pexelsQuery: "industrial cleaning equipment floor scrubber rental",
    image: "/images/servicios/alquiler-de-maquinaria/1-hq.webp",
    image2: "/images/servicios/alquiler-de-maquinaria/2.webp",
    relatedSlugs: [
      "servicio-tecnico-oficial-karcher",
      "reparaciones-y-mantenimientos",
      "limpiezas-industriales",
    ],
  },
  {
    slug: "servicio-tecnico-oficial-karcher",
    category: "maquinaria",
    categoryLabel: "Servicio Técnico y Maquinaria",
    title: "Servicio Técnico Oficial Kärcher",
    shortDesc:
      "Representación oficial de Kärcher. Distribución, mantenimiento preventivo y reparación electromecánica certificada.",
    includes: [
      "Reparación electrónica y recambios para Gama Profesional: sistemas de alta presión, barredoras, equipos de aspiración",
      "Soporte a tecnologías Kärcher: purificadores HEPA, generadores de vapor y plataformas de hielo seco (Dry Ice)",
      "Atención a Division Home & Garden: hidrolimpiadoras compactas, escobas de litio, fregonas eléctricas",
      "Consumibles oficiales: boquillas, mangueras blindadas, detergentes y rascadores",
    ],
    forWho:
      "Empresas agrologísticas a tres turnos, administraciones de mantenimiento urbano y consumidores exigentes que requieren fiabilidad absoluta.",
    howItWorks:
      "Tras la entrada del equipo defectuoso, el equipo de mecatrónica realiza diagnóstico oficial con telemetría. Determinado el problema (válvula obstruida, pérdida de vacío, placa base sulfatada), se procede al desmontaje y reposición con componentes genuinos, devolviendo el equipo bajo garantía de operatividad.",
    whyUs:
      "Los requisitos de Kärcher para certificar a un proveedor requieren reciclaje formativo continuo en fluidomecánica, hidráulica presurizada e ingeniería eléctrica, aspectos dominados por nuestro equipo.",
    extraFact:
      "La proyección de hielo seco (Dry Ice) permite limpiar cuadros eléctricos conectados y motores en funcionamiento sin peligro de electrocución ni corrosión galvánica.",
    pexelsQuery: "Karcher pressure washer repair technical service professional",
    image: "/images/servicios/servicio-tecnico-oficial-karcher/1-hq.webp",
    noImage2: true,
    relatedSlugs: [
      "alquiler-de-maquinaria",
      "reparaciones-y-mantenimientos",
      "limpiezas-industriales",
    ],
  },
  {
    slug: "reparaciones-y-mantenimientos",
    category: "maquinaria",
    categoryLabel: "Servicio Técnico y Maquinaria",
    title: "Reparaciones y Mantenimientos",
    shortDesc:
      "Taller electromecánico multimarca para conservación preventiva y reparación correctiva de maquinaria de higiene.",
    includes: [
      "Reparaciones mecatrónicas: turbinas de succión, cuadros electrónicos y motores de tracción",
      "Intervenciones en hidrolimpiadoras, lavamoquetas, aspiradoras HEPA, pulidoras y barredoras",
      "Mantenimientos preventivos: escobillas de carbono, labios de succión y correas de transmisión",
      "Presupuestos sin compromiso para evaluar la viabilidad de la reparación",
    ],
    forWho:
      "Operadores logísticos, cadenas de automoción, Facility Management y corporaciones hoteleras con grandes parques de maquinaria de diversas marcas.",
    howItWorks:
      "El cliente contacta por línea directa o plataforma web. Los mecánicos aíslan la causa (corrosión de placas por agua, acumulación de químicos) y reponen bobinas, baterías de gel y fusibles térmicos, realineando y recalibrando la base de cepillos.",
    whyUs:
      "Si una pulidora requiere un motor que tardará diez días en enviarse, la planta del cliente no se detiene: proporcionamos una máquina de sustitución de nuestra flota de alquiler, anulando cualquier impacto en la facturación.",
    extraFact:
      "Un aspirador con filtros rotos devuelve continuamente una nube letal de partículas finas (PM10 y sílice respirable) al entorno de trabajo, comprometiendo la salud del personal.",
    pexelsQuery: "machine repair workshop cleaning equipment maintenance",
    image: "/images/servicios/reparaciones-y-mantenimientos/1.webp",
    noImages: true,
    relatedSlugs: [
      "servicio-tecnico-oficial-karcher",
      "alquiler-de-maquinaria",
      "limpiezas-industriales",
    ],
  },
  {
    slug: "centro-de-formacion",
    category: "formacion",
    categoryLabel: "Formación Profesional",
    title: "Centro de Formación",
    shortDesc:
      "Institución pedagógica homologada en bioseguridad, limpieza especializada y protocolos sanitarios. Formación subvencionada disponible.",
    includes: [
      "Cursos oficiales de Manipulador de Alimentos y fundamentos APPCC",
      "Curso de Acreditación de Conocimientos Técnicos de Limpieza",
      "Módulos extensivos de +100 horas en Logística de Almacén con prácticas",
      "Opciones 100% subvencionadas para reciclaje de trabajadores en activo",
    ],
    forWho:
      "Grandes corporaciones que centralizan el adiestramiento de personal, sector logístico y operarios en activo que deseen mejorar competencias de seguridad laboral.",
    howItWorks:
      "Para formaciones de grupo corporativo, se solicita presupuesto sin compromiso y se customiza el plan de estudios. El alumnado asiste en horarios establecidos (9:00–13:30 o 16:00–19:30) conducidos por técnicos en prevención, ingenieros y biólogos. También disponible en modalidad a distancia mediante la plataforma digital informateate.com.",
    whyUs:
      "Las lecciones se nutren de la experiencia fáctica diaria de nuestras divisiones operativas de control de plagas y mecánica Kärcher, asegurando que las técnicas enseñadas representan el umbral tecnológico más avanzado.",
    extraFact:
      "La formación propia permite someter a nuestros operativos a programas de reciclaje técnico exigente, garantizando que las operaciones con maquinaria pesada o biocidas mantengan índices de siniestralidad excepcionalmente reducidos.",
    pexelsQuery: "professional training course certification hygiene safety",
    image: "/images/servicios/formacion-de-manipulador-de-alimentos/1-hq-v2.webp",
    noImage2: true,
    relatedSlugs: [
      "formacion-de-manipulador-de-alimentos",
      "appcc-implantacion-y-verificacion",
      "ddd-desratizacion-desinsectacion-desinfeccion",
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getRelatedServices(slugs: string[]): ServiceData[] {
  return slugs.map((s) => SERVICES.find((sv) => sv.slug === s)).filter(Boolean) as ServiceData[];
}

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  limpieza: "Limpieza Especializada",
  plagas: "Control de Plagas",
  alimentaria: "Seguridad Alimentaria",
  maquinaria: "Servicio Técnico y Maquinaria",
  formacion: "Formación Profesional",
};
