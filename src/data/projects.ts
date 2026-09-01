import { ProjectItem } from '../types';
import { ASSETS } from './assets';

export const projectsData: ProjectItem[] = [
  {
    id: 'erp-system',
    title: 'Enterprise Resource Planner',
    subtitle: 'High-Impact Industrial Supply Chain Solution',
    category: 'Enterprise',
    description:
      'A comprehensive, modular ERP system designed to streamline complex supply chain operations. Built with a focus on real-time data visibility and automated compliance reporting.',
    fullDescription:
      'Enterprise Resource Planner was built to replace fragmented spreadsheet workflows across 14 international supply warehouses. By leveraging a distributed microservice architecture with real-time WebSocket telemetry, the platform reduced manual inventory check cycles by 68% and delivered automated regulatory compliance reporting directly to enterprise auditors.',
    capabilities: ['React', 'Node.js', 'PostgreSQL', 'AWS Cloud', 'Docker', 'Redis'],
    imageUrl: ASSETS.erpProject,
    featured: true,
    client: 'Global Logistics Guild',
    year: '2024',
    metrics: [
      { label: 'Latency Reduction', value: '68%' },
      { label: 'Active Warehouses', value: '14 Hubs' },
      { label: 'Daily Transactions', value: '1.2M+' },
    ],
    liveUrl: 'https://gussware.com/projects/erp-system',
  },
  {
    id: 'modular-ui-system',
    title: 'Constructivist Design System',
    subtitle: 'Unified Front-End Component Library',
    category: 'Design Systems',
    description:
      'A modular, zero-dependency front-end component framework built with architectural precision and high-contrast accessibility standards.',
    fullDescription:
      'Engineered for large-scale enterprise deployments requiring WCAG AAA accessibility, strict type-safety, and minimal bundle sizes. The framework features custom design tokens, layout primitives, and headless state hooks.',
    capabilities: ['TypeScript', 'Tailwind CSS', 'Astro', 'Storybook', 'Figma Tokens'],
    imageUrl: ASSETS.uiWireframe,
    featured: false,
    client: 'Fintech Innovations Inc',
    year: '2024',
    metrics: [
      { label: 'Bundle Size', value: '< 18kb' },
      { label: 'Accessibility Score', value: '100/100' },
      { label: 'Components', value: '60+ Primitives' },
    ],
  },
  {
    id: 'distributed-iot-telemetry',
    title: 'Distributed Telemetry Mesh',
    subtitle: 'Real-time Edge Device Analytics',
    category: 'Custom Software',
    description:
      'High-throughput telemetry ingestion platform processing real-time sensor packets with sub-second dashboard updates.',
    fullDescription:
      'Designed to ingest and process telemetry from over 50,000 active smart nodes simultaneously. Features time-series anomaly detection, automated fault routing, and responsive control canvases.',
    capabilities: ['Go', 'Kafka', 'TimescaleDB', 'React', 'WebSockets', 'Kubernetes'],
    imageUrl: ASSETS.systemArchitecture,
    featured: false,
    client: 'AeroGrid Technologies',
    year: '2023',
    metrics: [
      { label: 'Throughput', value: '50k msg/sec' },
      { label: 'Dashboard Latency', value: '< 80ms' },
      { label: 'Uptime', value: '99.99%' },
    ],
  },
  {
    id: 'fintech-mobile-wallet',
    title: 'Cross-Platform Financial Wallet',
    subtitle: 'Secure Multi-Currency Transaction Engine',
    category: 'Mobile Apps',
    description:
      'Native-feel mobile banking application with biometric authorization, instant FX currency conversion, and encrypted ledger storage.',
    fullDescription:
      'Delivered for an emerging market fintech startup. Features zero-trust biometric authentication, instant push-to-card settlements, and an intuitive tactile transaction visualizer.',
    capabilities: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'Biometrics API'],
    imageUrl: ASSETS.mobileDevelopment,
    featured: false,
    client: 'NovaPay Global',
    year: '2024',
    metrics: [
      { label: 'Active Users', value: '250k+' },
      { label: 'App Store Rating', value: '4.9 ★' },
      { label: 'Avg Tx Time', value: '1.4s' },
    ],
  },
];
