/**
 * RGW-313 — Datos estáticos de referencia para la maquetación del
 * detalle de Proyecto.
 *
 * Contenido verbatim de las dos pantallas Stitch indicadas en la tarea
 * (`GussWare Project Detail - Sistema de Nóminas y Outsorcing` y
 * `GussWare Project Detail - Multiples proyectos`), que representan dos
 * ejemplos del mismo template. RGW-323 sustituirá este mock por la
 * lectura del CPT Proyectos de WordPress sin cambiar el componente.
 */

export interface ProjectDescriptionBlock {
  title?: string;
  paragraphs: string[];
  items?: string[];
}

export interface ProjectScopeNode {
  index: string;
  title: string;
  count: string;
  description?: string;
}

export interface ProjectDetailGroup {
  index: string;
  title: string;
  count: string;
  description?: string;
  items: string[];
}

export interface ProjectTool {
  category: string;
  value: string;
}

export interface ProjectToolNote {
  title: string;
  description: string;
}

export interface ProjectDetailData {
  slug: string;
  title: string;
  employer: string;
  assignee: string;
  role: string;
  descriptionBlocks: ProjectDescriptionBlock[];
  scopeEyebrow: string;
  scopeCentralNode: string;
  scopeCount: string;
  scopeNodes: ProjectScopeNode[];
  detailEyebrow: string;
  detailTitle: string;
  detailDescription: string;
  groups: ProjectDetailGroup[];
  tools: ProjectTool[];
  toolNotes: ProjectToolNote[];
  closingTitle: string;
}

const nominas: ProjectDetailData = {
  slug: 'sistema-nominas-outsourcing',
  title:
    'Desarrollo de un sistema de nóminas tradicionales y con estrategia en la nube bajo el modelo de Outsorcing.',
  employer: 'Workforce',
  assignee: 'Interno',
  role: 'Líder de proyecto',
  descriptionBlocks: [
    {
      paragraphs: [
        'Desarrollo de un sistema de nóminas bajo el modelo de Ountsorcing (asignación de personal a clientes).',
        'El sistema debe de funcionar con nominas grabadas al 100 y nóminas con estrategia',
      ],
    },
  ],
  scopeEyebrow: 'ARQUITECTURA DE MÓDULOS',
  scopeCentralNode: 'NÚCLEO DEL SISTEMA',
  scopeCount: '7 MÓDULOS REGISTRADOS',
  scopeNodes: [
    { index: '01', title: 'CATÁLOGOS', count: '26 items' },
    { index: '02', title: 'RECURSOS HUMANOS', count: '5 items' },
    { index: '03', title: 'PRE - NOMINA', count: '7 items' },
    { index: '04', title: 'NOMINA', count: '6 items' },
    { index: '05', title: 'PROCESOS ANUALES', count: '6 items' },
    { index: '06', title: 'IMSS / INFONAVIT', count: '5 items' },
    { index: '07', title: 'REPORTES', count: 'Módulo general' },
  ],
  detailEyebrow: 'INVENTARIO DEL SISTEMA',
  detailTitle: 'DETALLE DE FUNCIONALIDADES',
  detailDescription:
    'Desglose completo de módulos y componentes funcionales integrados en el proyecto.',
  groups: [
    {
      index: '01',
      title: 'CATÁLOGOS',
      count: '26 Funcionalidades',
      description:
        'Gestión centralizada y parametrización de catálogos maestros de la organización, tablas regulatorias oficiales (ISR, IMSS, salarios mínimos), políticas laborales y esquemas de prestaciones.',
      items: [
        'Catálogo de empresas',
        'Series folios fiscales',
        'Registros patronales',
        'Primas de riesgo',
        'Tipos de nomina',
        'Factor de integración',
        'Ubicación',
        'Áreas',
        'Departamentos',
        'Puestos',
        'Contratos',
        'Tabla de prestaciones',
        'Tipos de ahorros y prestamos',
        'Prestaciones',
        'Paquete de prestaciones',
        'Configuración de conceptos',
        'Motivos de kardex',
        'Horarios',
        'Turnos',
        'Calendario de festivos',
        'Ritmo de turno',
        'Tablas ISR',
        'Tablas Numéricas',
        'Tablas de salarios mínimos',
        'Cuotas IMSS',
        'Clientes representantes',
      ],
    },
    {
      index: '02',
      title: 'RECURSOS HUMANOS',
      count: '5 Funcionalidades',
      description:
        'Gestión centralizada del expediente de colaboradores, seguimiento de kardex laboral, administración de incidencias de ahorro y préstamos, estados de cuenta y amortización de créditos institucionales (Infonavit).',
      items: [
        'Kardex',
        'Empleados',
        'Ahorros y prestamos',
        'Estado de cuenta',
        'Crédito Infonavit',
      ],
    },
    {
      index: '03',
      title: 'PRE - NOMINA',
      count: '7 Funcionalidades',
      items: [
        'Faltas y extras',
        'Vacaciones',
        'Incapacidades',
        'Permisos',
        'Días ajuste',
        'Excepción días y horas',
        'Excepción de montos',
      ],
    },
    {
      index: '04',
      title: 'NOMINA',
      count: '6 Funcionalidades',
      items: [
        'Resumen de nomina',
        'Periodos',
        'Afectar nomina',
        'Recibo de empleado',
        'Totales de conceptos',
        'Historial de nominas',
      ],
    },
    {
      index: '05',
      title: 'PROCESOS ANUALES',
      count: '6 Funcionalidades',
      items: [
        'Pago de aguinaldos',
        'Inscribir en fondo de ahorro',
        'Cancelar fondo de ahorro',
        'Repartir fondo de ahorro',
        'Reparto de PTU',
        'Calculo de ISR Anual',
      ],
    },
    {
      index: '06',
      title: 'IMSS / INFONAVIT',
      count: '5 Funcionalidades',
      items: [
        'Detalle Mensual',
        'Detalle Bimestral',
        'Constancias de IDSE',
        'Movimientos de IMSS',
        'Conciliación',
      ],
    },
    {
      index: '07',
      title: 'REPORTES',
      count: 'Módulo consolidado',
      items: ['Reportes'],
    },
  ],
  tools: [
    { category: 'LENGUAJE', value: 'PHP' },
    { category: 'FRAMEWORK', value: 'Framework Codeigniter' },
    { category: 'SERVIDOR', value: 'Servidor Apache' },
    { category: 'BASE DE DATOS', value: 'Mysql' },
    { category: 'LIBRERÍA JS', value: 'JQuery' },
    { category: 'ESTRUCTURA WEB', value: 'HTML5' },
    { category: 'ESTILOS WEB', value: 'CSS3' },
    { category: 'SISTEMA OPERATIVO', value: 'SO Windows' },
  ],
  toolNotes: [
    {
      title: 'Tortoise SVN',
      description: 'Sistema de control de versiones',
    },
    {
      title: 'NetBeans',
      description: 'Entorno de desarrollo integrado IDE',
    },
  ],
  closingTitle:
    'DESARROLLO DE UN SISTEMA DE NÓMINAS BAJO EL MODELO DE OUTSORCING',
};

const multiples: ProjectDetailData = {
  slug: 'multiples-proyectos',
  title: 'Multiples proyectos',
  employer: 'FreeLancer',
  assignee: 'GilaSoftware',
  role: 'PROGRAMADOR PHP',
  descriptionBlocks: [
    {
      title: 'Proyecto Legatum',
      paragraphs: [],
      items: [
        'Integración con servicio de crisko',
        'Creación de sincronizador de empresas, customers, suppliers ingresos y egresos',
        'Creación de graficas del dashboard de ingresos y egresos',
        'Importador de empresas penalizadas',
        'Creación de módulos de papelería',
        'Cronjob para eliminar archivos de papelería',
        'Integración con twilio para envió de alertas para subir archivos',
      ],
    },
    {
      title: 'Proyecto Matco',
      paragraphs: [],
      items: [
        'Desarrollo de sincronizador de precios y productos',
        'Creación de módulo de login',
        'Creación de módulo de roles/permisos de laravel',
        'Creación de módulo sliders',
        'Creación de módulo de especificaciones de producto',
        'Creación de módulo de soluciones tecnologicas',
        'Creación de módulo de productos usados',
        'Creación de módulo de promociones',
        'Nextjs creación de pantalla de promociones',
        'Nextjs creación de producto familias',
        'Netjs creación soluciones tecnologicas',
      ],
    },
    {
      title: 'Proyecto Filmin Sonora',
      paragraphs: [],
      items: [
        'Creación de estructura de bolierlplate para plugin de locaciones filmicas',
        'Integración con api de googlemaps para la visualización de locaciones',
        'Creación de template de locaciones filmicas',
        'Creación de custom films de locaciones',
        'Creacion de custom films de zonas',
        'Creación de busqueda por url de locaciones',
      ],
    },
  ],
  scopeEyebrow: 'ARQUITECTURA DE ALCANCE',
  scopeCentralNode: 'DESARROLLO MULTIPROYECTO',
  scopeCount: '3 PROYECTOS REGISTRADOS',
  scopeNodes: [
    {
      index: '01',
      title: 'LEGATUM',
      count: '7 ACTIVIDADES',
      description: 'Sincronización, Dashboard Crisko & Twilio',
    },
    {
      index: '02',
      title: 'MATCO',
      count: '11 ACTIVIDADES',
      description: 'Sincronizador, Laravel & Next.js',
    },
    {
      index: '03',
      title: 'FILMIN SONORA',
      count: '6 ACTIVIDADES',
      description: 'Plataforma & Plugin de Locaciones',
    },
  ],
  detailEyebrow: 'INVENTARIO DEL SISTEMA',
  detailTitle: 'DETALLE DE FUNCIONALIDADES',
  detailDescription:
    'Desglose completo de proyectos y componentes funcionales integrados en el proyecto.',
  groups: [
    {
      index: '01',
      title: 'PROYECTO LEGATUM',
      count: '7 ACTIVIDADES',
      items: [
        'Integración con servicio de crisko',
        'Creación de sincronizador de empresas, customers, suppliers ingresos y egresos',
        'Creación de graficas del dashboard de ingresos y egresos',
        'Importador de empresas penalizadas',
        'Creación de módulos de papelería',
        'Cronjob para eliminar archivos de papelería',
        'Integración con twilio para envió de alertas para subir archivos',
      ],
    },
    {
      index: '02',
      title: 'PROYECTO MATCO',
      count: '11 ACTIVIDADES',
      items: [
        'Desarrollo de sincronizador de precios y productos',
        'Creación de módulo de login',
        'Creación de módulo de roles/permisos de laravel',
        'Creación de módulo sliders',
        'Creación de módulo de especificaciones de producto',
        'Creación de módulo de soluciones tecnologicas',
        'Creación de módulo de productos usados',
        'Creación de módulo de promociones',
        'Nextjs creación de pantalla de promociones',
        'Nextjs creación de producto familias',
        'Netjs creación soluciones tecnologicas',
      ],
    },
    {
      index: '03',
      title: 'PROYECTO FILMIN SONORA',
      count: '6 ACTIVIDADES',
      items: [
        'Creación de estructura de bolierlplate para plugin de locaciones filmicas',
        'Integración con api de googlemaps para la visualización de locaciones',
        'Creación de template de locaciones filmicas',
        'Creación de custom films de locaciones',
        'Creacion de custom films de zonas',
        'Creación de busqueda por url de locaciones',
      ],
    },
  ],
  tools: [
    { category: 'CONTROL DE VERSIONES', value: 'Git' },
    { category: 'BACKEND FRAMEWORK', value: 'Laravel(PHP)' },
    { category: 'ESTILOS & UI', value: 'Bootstrap' },
    { category: 'FRONTEND FRAMEWORK', value: 'Nextjs' },
    { category: 'LIBRERÍA JS', value: 'JQUERY' },
    { category: 'BASE DE DATOS', value: 'Mysql' },
    { category: 'ENTORNO IDE', value: 'Visual Studio Code' },
    { category: 'SISTEMA OPERATIVO', value: 'Windows(Desarrollo)' },
    { category: 'PLATAFORMA CMS', value: 'Wordpress' },
  ],
  toolNotes: [
    { title: 'Git', description: 'Sistema de control de versiones' },
    { title: 'Visual Studio Code', description: 'Editor' },
  ],
  closingTitle: 'MULTIPLES PROYECTOS',
};

export const projectMocks: ProjectDetailData[] = [nominas, multiples];

export function getProjectMock(slug: string): ProjectDetailData | null {
  return projectMocks.find((project) => project.slug === slug) ?? null;
}
