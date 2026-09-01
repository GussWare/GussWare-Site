import { ValuePoint, SpecialistRole } from '../types';

export const communityValuePoints: ValuePoint[] = [
  {
    id: 'flexible-teams',
    title: 'Equipos Flexibles',
    description: 'Adaptamos el talento a la necesidad exacta.',
    icon: 'flex_direction',
  },
  {
    id: 'specialized-skills',
    title: 'Habilidades Especializadas',
    description: 'Acceso directo a expertos en cada tecnología.',
    icon: 'workspace_premium',
  },
  {
    id: 'direct-collab',
    title: 'Colaboración Directa',
    description: 'Foco absoluto en el éxito del proyecto.',
    icon: 'handshake',
  },
  {
    id: 'agile-structure',
    title: 'Estructura Ágil',
    description: 'Menos burocracia, más ejecución.',
    icon: 'speed',
  },
];

export const specialistRoles: SpecialistRole[] = [
  {
    role: 'Frontend Architects',
    category: 'Engineering',
    icon: 'code',
    count: 42,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Astro', 'Next.js', 'Web Vitals'],
  },
  {
    role: 'Backend & Systems Engineers',
    category: 'Engineering',
    icon: 'database',
    count: 38,
    skills: ['Node.js', 'Go', 'Python', 'PostgreSQL', 'Redis', 'Kafka'],
  },
  {
    role: 'Mobile Specialists',
    category: 'Mobile',
    icon: 'smartphone',
    count: 24,
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Offline Sync'],
  },
  {
    role: 'Constructivist UI/UX Designers',
    category: 'Design',
    icon: 'design_services',
    count: 19,
    skills: ['Design Systems', 'Figma', 'Prototyping', 'Accessibility (WCAG)', 'Information Architecture'],
  },
  {
    role: 'Cloud & DevOps Practitioners',
    category: 'Infrastructure',
    icon: 'cloud',
    count: 16,
    skills: ['AWS', 'GCP', 'Kubernetes', 'Terraform', 'CI/CD Pipelines', 'Security Audits'],
  },
  {
    role: 'Product & Tech Leads',
    category: 'Strategy',
    icon: 'hub',
    count: 12,
    skills: ['Agile Sprints', 'Scope Definition', 'Quality Assurance', 'Technical Roadmaps'],
  },
];
