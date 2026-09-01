import { ServiceItem } from '../types';

export const servicesData: ServiceItem[] = [
  {
    id: 'apis',
    number: '01',
    title: 'APIs & Integrations',
    description:
      'Diseño e implementación de interfaces de programación de aplicaciones robustas, seguras y escalables para conectar sus sistemas y datos.',
    icon: 'api',
    fullDetails: {
      overview:
        'Connect enterprise databases, third-party SaaS tools, payment gateways, and custom microservices with clean, authenticated REST and GraphQL endpoints.',
      deliverables: [
        'RESTful & GraphQL API Architecture',
        'Authentication & Token Management (OAuth2, JWT)',
        'Webhook Management & Event-Driven Systems',
        'API Gateway & Rate Limiting Infrastructure',
      ],
      techStack: ['Node.js', 'Go', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
    },
  },
  {
    id: 'consulting',
    number: '02',
    title: 'Consulting',
    description:
      'Asesoramiento experto para alinear su estrategia tecnológica con sus objetivos comerciales, optimizando procesos y arquitecturas.',
    icon: 'lightbulb',
    fullDetails: {
      overview:
        'Strategic roadmapping and technical audits to modernize legacy stacks, choose optimal tooling, and establish agile engineering standards.',
      deliverables: [
        'Architecture & Codebase Health Audits',
        'Cloud Infrastructure Cost Optimization',
        'Team Technical Upskilling & Sprints Planning',
        'Security & Compliance Review',
      ],
      techStack: ['AWS', 'GCP', 'Kubernetes', 'Terraform', 'System Design'],
    },
  },
  {
    id: 'web-ecommerce',
    number: '03',
    title: 'Web / E-commerce',
    description:
      'Desarrollo de plataformas web de alto rendimiento y soluciones de comercio electrónico diseñadas para la conversión y la experiencia del usuario.',
    icon: 'web',
    fullDetails: {
      overview:
        'Modern, ultra-fast web platforms with headless architectures, tailored checkouts, dynamic inventory syncing, and high conversion UX.',
      deliverables: [
        'High-Performance Web Applications (React, Astro, Next.js)',
        'Headless E-commerce (Shopify Storefront, Medusa, Stripe)',
        'Custom CMS & Editorial Dashboards',
        'Core Web Vitals & Technical SEO Optimization',
      ],
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Stripe', 'GraphQL'],
    },
  },
  {
    id: 'mobile-apps',
    number: '04',
    title: 'Mobile Apps',
    description:
      'Creación de aplicaciones móviles nativas y multiplataforma intuitivas, aprovechando las últimas tecnologías para iOS y Android.',
    icon: 'smartphone',
    fullDetails: {
      overview:
        'Responsive mobile experiences with fluid gestures, offline support, push notifications, and frictionless hardware integration.',
      deliverables: [
        'Cross-Platform iOS & Android Apps (React Native, Flutter)',
        'Offline-First Local Caching & Sync Engine',
        'Biometrics, Camera, Geolocation & Bluetooth Integrations',
        'App Store & Play Store Deployment Pipelines',
      ],
      techStack: ['React Native', 'TypeScript', 'Expo', 'Swift', 'Kotlin', 'Firebase'],
    },
  },
  {
    id: 'custom-software',
    number: '05',
    title: 'Custom Software',
    description:
      'Desarrollo de software a medida para resolver desafíos específicos de su industria, construido desde cero para adaptarse a sus flujos de trabajo únicos.',
    icon: 'terminal',
    fullDetails: {
      overview:
        'Tailor-made software engines, internal operational tools, ERPs, CRMs, and algorithmic data processors built with industrial reliability.',
      deliverables: [
        'Bespoke Business Process Automation',
        'Custom Admin Portals & Role-Based Access Controls',
        'Data Ingestion & Analytics Engines',
        'Legacy Software Modernization',
      ],
      techStack: ['TypeScript', 'Python', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    },
  },
  {
    id: 'devops',
    number: '06',
    title: 'DevOps & Infrastructure',
    description:
      'Implementación de prácticas de integración y despliegue continuo (CI/CD), infraestructura como código y automatización para acelerar la entrega de valor.',
    icon: 'cloud',
    fullDetails: {
      overview:
        'Resilient cloud architectures with automated deployment pipelines, continuous monitoring, auto-scaling, and disaster recovery.',
      deliverables: [
        'Automated CI/CD Pipelines (GitHub Actions, GitLab CI)',
        'Infrastructure as Code (Terraform, Ansible)',
        'Container Orchestration (Kubernetes, Docker Swarm, Cloud Run)',
        'Observability, Telemetry & 24/7 Uptime Alerts',
      ],
      techStack: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'GCP', 'Prometheus'],
    },
  },
];
