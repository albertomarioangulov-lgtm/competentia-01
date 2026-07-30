// ============================================================
// Definiciones de Evaluación de Desempeño
// ============================================================

export type Puntaje = number | null // null = "No aplica"

export interface Habilidad {
  id: string
  nombre: string
  descripcion: string
}

export interface EvaluacionHabilidad {
  habilidad: string
  puntaje: Puntaje
}

export interface EvaluacionDesempeno {
  criterio: string
  puntaje: Puntaje
}

// ============================================================
// DEFINICIONES DE HABILIDADES (IV. HABILIDADES - 20%)
// ============================================================

export const METAHABILIDADES: Habilidad[] = [
  {
    id: 'adaptabilidad',
    nombre: 'Adaptabilidad',
    descripcion: 'Modificar la propia conducta para alcanzar determinados objetivos cuando surgen dificultades, nuevos datos o cambios en el entorno.',
  },
  {
    id: 'analisis_problemas',
    nombre: 'Análisis de problemas',
    descripcion: 'Identificar problemas, reconocer información significativa; buscar y coordinar datos relevantes; diagnosticar posibles causas.',
  },
  {
    id: 'aprendizaje',
    nombre: 'Aprendizaje',
    descripcion: 'Asimilar nueva información y aplicarla eficazmente.',
  },
  {
    id: 'decision',
    nombre: 'Decisión',
    descripcion: 'Toma de decisiones activa, eligiendo entre varias alternativas de solución a un problema. Comprometerse con opiniones concretas y acciones consecuentes con éstas, aceptando la responsabilidad que implican.',
  },
  {
    id: 'energia',
    nombre: 'Energía',
    descripcion: 'Habilidad para crear y mantener un nivel de actividad apropiadamente dirigido, capacidad para trabajar duro. Impulso.',
  },
  {
    id: 'flexibilidad',
    nombre: 'Flexibilidad',
    descripcion: 'Facilidad para cambiar de criterios y orientación de la propia forma de pensar y enjuiciar situaciones, personas y cosas cuando cambian las premisas básicas, las condiciones del entorno o se recibe nueva información.',
  },
  {
    id: 'independencia',
    nombre: 'Independencia',
    descripcion: 'Actuar sobre la base de las propias convicciones más que intentar satisfacer las expectativas de los demás. Mantener el mismo punto de vista mientras se puede (razonablemente).',
  },
  {
    id: 'integridad',
    nombre: 'Integridad',
    descripcion: 'Actuar conforme a las normas éticas y sociales en las actividades relacionadas con el trabajo.',
  },
  {
    id: 'juicio',
    nombre: 'Juicio',
    descripcion: 'Considerar factores y posibles desarrollos de la acción a la luz de criterios relevantes y llegar a juicios realistas.',
  },
  {
    id: 'resolucion',
    nombre: 'Resolución',
    descripcion: 'Eficacia y agilidad para dar soluciones a problemas detectados, emprendiendo las acciones correctoras necesarias con sentido común, sentido del costo e iniciativa.',
  },
  {
    id: 'sensibilidad_interpersonal',
    nombre: 'Sensibilidad interpersonal',
    descripcion: 'Mostrar que se es consciente de los demás y del entorno así como de la influencia que se ejerce sobre ambos. Desarrollar una conducta que refleje el reconocimiento de los sentimientos de los demás.',
  },
  {
    id: 'tolerancia_estres',
    nombre: 'Tolerancia al estrés',
    descripcion: 'Seguir actuando con eficacia bajo la presión del tiempo y haciendo frente al desacuerdo, la oposición y la adversidad.',
  },
]

export const BETAHABILIDADES: Habilidad[] = [
  {
    id: 'ambicion_profesional',
    nombre: 'Ambición profesional',
    descripcion: 'Intentar alcanzar posiciones más altas en la organización, mostrando conductas orientadas al desarrollo de carrera y al éxito. Esforzarse por el propio desarrollo profesional.',
  },
  {
    id: 'conocimiento_entorno',
    nombre: 'Conocimiento del entorno',
    descripcion: 'Tener conciencia de las condiciones específicas del entorno de trabajo. Dominar información actualizada sobre el entorno del negocio, de la actividad profesional.',
  },
  {
    id: 'gama_intereses',
    nombre: 'Gama de intereses amplia',
    descripcion: 'Mostrar un amplio rango de intereses personales y profesionales. Manifestar interés y motivación por muy diversos aspectos de la vida profesional y de los conocimientos sociales, científicos, artísticos, técnicos, etcétera.',
  },
  {
    id: 'innovacion_creatividad',
    nombre: 'Innovación / creatividad',
    descripcion: 'Descubrir soluciones imaginativas de problemas relacionados con el trabajo y con alternativas a sus soluciones, métodos y formas clásicas de resolución.',
  },
  {
    id: 'impacto',
    nombre: 'Impacto',
    descripcion: 'Generar y mantener una primera impresión favorable en los demás.',
  },
  {
    id: 'orientacion_logro',
    nombre: 'Orientación al logro',
    descripcion: 'Determinación para fijar las propias metas de forma ambiciosa, por encima de los estándares y de las expectativas, mostrando insatisfacción con el desempeño medio.',
  },
  {
    id: 'tenacidad',
    nombre: 'Tenacidad',
    descripcion: 'Mantener el punto de vista o plan de acción hasta conseguir el objetivo perseguido o hasta que no resulte razonable insistir en él.',
  },
  {
    id: 'toma_riesgos',
    nombre: 'Toma de riesgos',
    descripcion: 'Tomar riesgos calculados para obtener ventajas específicas.',
  },
]

export const HABILIDADES_OPERATIVAS: Habilidad[] = [
  {
    id: 'analisis_numerico',
    nombre: 'Análisis numérico',
    descripcion: 'Habilidad para analizar, organizar y presentar datos numéricos, por ejemplo, datos financieros y estadísticos.',
  },
  {
    id: 'atencion_detalle',
    nombre: 'Atención al detalle',
    descripcion: 'Manejo eficaz y prolongado de información detallada. Se relaciona con la minuciosidad de análisis y manejo de conjuntos complejos y amplios de información.',
  },
  {
    id: 'autoorganizacion',
    nombre: 'Autoorganización',
    descripcion: 'Organizar eficazmente la propia agenda de actividades, estableciendo las prioridades necesarias y utilizando el tiempo personal de la forma más eficiente posible.',
  },
  {
    id: 'comunicacion_oral',
    nombre: 'Comunicación oral',
    descripcion: 'Canalizar clara y comprensiblemente ideas y opiniones hacia los demás a través del discurso hablado.',
  },
  {
    id: 'comunicacion_escrita',
    nombre: 'Comunicación escrita',
    descripcion: 'Expresar ideas y opiniones de forma clara y correcta a través del lenguaje escrito.',
  },
  {
    id: 'disciplina',
    nombre: 'Disciplina',
    descripcion: 'Adaptarse a las políticas y procedimientos organizacionales. Buscar información de los cambios en la autoridad competente.',
  },
  {
    id: 'comunicacion_no_verbal',
    nombre: 'Dominio de la comunicación no verbal',
    descripcion: 'Conocer y utilizar adecuadamente el lenguaje corporal en las situaciones de comunicación interpersonal.',
  },
  {
    id: 'facilitar_reuniones',
    nombre: 'Facilitar / participar en reuniones',
    descripcion: 'Actuar eficazmente como presidente de reuniones, desarrollando su agenda, efectuando la convocatoria y canalizando la participación ordenada de todos los asistentes.',
  },
  {
    id: 'orientacion_ambiental',
    nombre: 'Orientación ambiental',
    descripcion: 'Demostrar sensibilidad hacia los desarrollos sociales, económicos y políticos y otros factores ambientales que puedan afectar al trabajo o a la organización.',
  },
  {
    id: 'sentido_urgencia',
    nombre: 'Sentido de la urgencia',
    descripcion: 'Percibir la urgencia real de determinadas tareas y actuar de manera consecuente para alcanzar su realización en plazos muy breves de tiempo.',
  },
]

export const HABILIDADES_INTERPERSONALES: Habilidad[] = [
  {
    id: 'atencion_cliente',
    nombre: 'Atención al cliente',
    descripcion: 'Percibir las necesidades y demandas del cliente frente a la organización y ser capaz de darles satisfacción razonable con el menor costo posible.',
  },
  {
    id: 'capacidad_negociacion',
    nombre: 'Capacidad de negociación',
    descripcion: 'Identificar las posiciones propia y ajena de una negociación, intercambiando concesiones y alcanzando acuerdos satisfactorios basados en una filosofía ganar-ganar.',
  },
  {
    id: 'escucha_activa',
    nombre: 'Escucha activa',
    descripcion: 'Escucha activa, demostrada tomando notas durante la comunicación oral de los aspectos importantes, preguntando hasta que los mensajes del emisor estén totalmente claros y estando alerta a las reacciones y analizándolas.',
  },
  {
    id: 'medios_audiovisuales',
    nombre: 'Dominio de los medios audiovisuales',
    descripcion: 'Utilizar de manera fluida y eficaz, las diversas técnicas de comunicación audiovisual como soporte a la comunicación interpersonal en cualquier situación.',
  },
  {
    id: 'orientacion_cliente',
    nombre: 'Orientación al cliente',
    descripcion: 'Demostrar sensibilidad hacia las necesidades o demandas que un conjunto de clientes potenciales de la organización pueden requerir en el presente o en el futuro.',
  },
  {
    id: 'persuasion',
    nombre: 'Persuasión',
    descripcion: 'Tener habilidad para persuadir a otros con argumentos relevantes sobre la base de un estilo positivo, para adaptarse a ciertos puntos de vista o ponerse de acuerdo sobre ciertos planes.',
  },
  {
    id: 'presentacion',
    nombre: 'Presentación',
    descripcion: 'Presentar ideas y hechos de una forma clara, usando los medios adecuados.',
  },
  {
    id: 'sociabilidad',
    nombre: 'Sociabilidad',
    descripcion: 'Interactuar sin esfuerzo con otras personas. Tener facilidad para hacer contactos con otros y desarrollar actividades sociales.',
  },
  {
    id: 'trabajo_equipo',
    nombre: 'Trabajo en equipo / cooperación',
    descripcion: 'Participar activamente en la consecución de una meta común, incluso cuando la colaboración conduce a una meta que no está directamente relacionada con el interés propio.',
  },
]

export const HABILIDADES_DIRECTIVAS: Habilidad[] = [
  {
    id: 'control_directivo',
    nombre: 'Control directivo',
    descripcion: 'Establecer y aplicar procedimientos para el seguimiento y la regulación de procesos y políticas internos y/o externos.',
  },
  {
    id: 'delegacion',
    nombre: 'Delegación',
    descripcion: 'Asignar las propias responsabilidades y autoridad al miembro del equipo adecuado, de forma inequívoca.',
  },
  {
    id: 'desarrollo_colaboradores',
    nombre: 'Desarrollo / apoyo de colaboradores',
    descripcion: 'Analizar las necesidades de desarrollo de los colaboradores e iniciar actividades de desarrollo relacionadas con los puestos de trabajo actuales o futuros.',
  },
  {
    id: 'espiritu_emprendedor',
    nombre: 'Espíritu emprendedor',
    descripcion: 'Buscar activamente oportunidades en el mercado, sacando el máximo de ellas y comprendiendo el riesgo que comportan.',
  },
  {
    id: 'evaluacion_colaboradores',
    nombre: 'Evaluación de los colaboradores',
    descripcion: 'Demostrar habilidad y perspicacia en la evaluación de los aspectos profesionales del desempeño de los colaboradores utilizando adecuadamente las técnicas de entrevista, apreciación del desempeño, proyección del potencial, etcétera.',
  },
  {
    id: 'identificacion_directiva',
    nombre: 'Identificación directiva',
    descripcion: 'Explorar y anticiparse a los problemas de dirección, así como difundir las decisiones de la línea de mando.',
  },
  {
    id: 'liderazgo_grupos',
    nombre: 'Liderazgo de grupos',
    descripcion: 'Guiar y dirigir un grupo y establecer y mantener el espíritu de grupo necesario para alcanzar los objetivos del mismo.',
  },
  {
    id: 'liderazgo_personas',
    nombre: 'Liderazgo de personas',
    descripcion: 'Dirigir y aconsejar a los miembros de su equipo en el desempeño de su trabajo.',
  },
  {
    id: 'planificacion_organizacion',
    nombre: 'Planificación y organización',
    descripcion: 'Determinar eficazmente las metas y prioridades estipulando la acción, los plazos y los recursos requeridos para alcanzarlas.',
  },
  {
    id: 'sensibilidad_organizacional',
    nombre: 'Sensibilidad organizacional',
    descripcion: 'Tener conciencia de la repercusión que tienen en el medio plazo las propias acciones y decisiones sobre el conjunto de organizaciones complejas y grandes.',
  },
  {
    id: 'vision',
    nombre: 'Visión',
    descripcion: 'Pensar sobre la base de la estrategia de la empresa y convertirla en objetivos concretos para el propio campo de responsabilidad.',
  },
]

// ============================================================
// CRITERIOS DE DESEMPEÑO (V. DESEMPEÑO - 50%)
// ============================================================

export const CRITERIOS_DESEMPENO: Habilidad[] = [
  {
    id: 'procedimientos',
    nombre: 'Conocimiento de los procedimientos, registros y controles y su adecuada aplicación',
    descripcion: '',
  },
  {
    id: 'normas_politicas',
    nombre: 'Conocimiento de las normas y políticas internas',
    descripcion: '',
  },
  {
    id: 'planificacion_trabajo',
    nombre: 'Planificación del trabajo',
    descripcion: '',
  },
  {
    id: 'planificacion_tiempo',
    nombre: 'Planificación del tiempo',
    descripcion: '',
  },
  {
    id: 'archivo_documentacion',
    nombre: 'Archivo de la documentación',
    descripcion: '',
  },
  {
    id: 'orden_aseo',
    nombre: 'Orden y aseo en el puesto de trabajo',
    descripcion: '',
  },
  {
    id: 'atencion_clientes',
    nombre: 'Atención y manejo de clientes internos y externos',
    descripcion: '',
  },
  {
    id: 'seguridad_equipos',
    nombre: 'Uso adecuado de los implementos de seguridad y equipos a cargo',
    descripcion: '',
  },
  {
    id: 'actitud_trabajo',
    nombre: 'Actitud frente al trabajo',
    descripcion: '',
  },
  {
    id: 'rendimiento_productividad',
    nombre: 'Rendimiento en el trabajo / Productividad',
    descripcion: '',
  },
]

// ============================================================
// ESCALA DE CALIFICACIÓN 1-5 (sin N/A)
// ============================================================

export const NIVELES = [
  { valor: 1, label: '1', color: 'red', descripcion: 'Deficiente', icono: 'mdi-star-outline' },
  { valor: 2, label: '2', color: 'orange', descripcion: 'Regular', icono: 'mdi-star-half-full' },
  { valor: 3, label: '3', color: 'warning', descripcion: 'Bueno', icono: 'mdi-star' },
  { valor: 4, label: '4', color: 'light-blue', descripcion: 'Muy bueno', icono: 'mdi-star' },
  { valor: 5, label: '5', color: 'green', descripcion: 'Excelente', icono: 'mdi-star' },
] as const

export const PUNTAJE_MAXIMO = 5

// ============================================================
// AGRUPACIÓN COMPLETA DE HABILIDADES
// ============================================================

export const GRUPOS_HABILIDADES = [
  { id: 'metahabilidades', nombre: 'Metahabilidades', habilidades: METAHABILIDADES },
  { id: 'betahabilidades', nombre: 'Betahabilidades', habilidades: BETAHABILIDADES },
  { id: 'habilidades_operativas', nombre: 'Habilidades Operativas', habilidades: HABILIDADES_OPERATIVAS },
  { id: 'habilidades_interpersonales', nombre: 'Habilidades Interpersonales', habilidades: HABILIDADES_INTERPERSONALES },
  { id: 'habilidades_directivas', nombre: 'Habilidades Directivas', habilidades: HABILIDADES_DIRECTIVAS },
] as const

export type GrupoHabilidadId = (typeof GRUPOS_HABILIDADES)[number]['id']

// ============================================================
// FUNCIONES DE CÁLCULO
// ============================================================

function calcularPuntajePromedio(puntajes: { puntaje: number | null }[]): number {
  const validos = puntajes.filter((p) => p.puntaje !== null)
  if (validos.length === 0) return 0
  const obtenido = validos.reduce((sum, p) => sum + (p.puntaje ?? 0), 0)
  return obtenido / validos.length
}

export function calcularPuntajeHabilidades(puntajes: EvaluacionHabilidad[]): number {
  const promedio = calcularPuntajePromedio(puntajes)
  return (promedio / PUNTAJE_MAXIMO) * 20 // 20% del total
}

export function calcularPuntajeDesempeno(puntajes: EvaluacionDesempeno[]): number {
  const promedio = calcularPuntajePromedio(puntajes)
  return (promedio / PUNTAJE_MAXIMO) * 50 // 50% del total
}

export function calcularPuntajeTotal(
  habilidades: EvaluacionHabilidad[],
  desempeno: EvaluacionDesempeno[]
): number {
  return calcularPuntajeHabilidades(habilidades) + calcularPuntajeDesempeno(desempeno)
}