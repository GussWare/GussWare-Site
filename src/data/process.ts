import { ProcessStep } from '../types';
import { ASSETS } from './assets';

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    description:
      'Comprender necesidades, objetivos, contexto del negocio, problemas, requerimientos y restricciones.',
    imageUrl: ASSETS.processDiscover,
    phaseLabel: 'Idea',
  },
  {
    number: '02',
    title: 'Define',
    description:
      'Definir alcance, prioridades, arquitectura, tecnologías, funcionalidades y planificación estratégica para asegurar el éxito del proyecto.',
    imageUrl: ASSETS.processDefine,
    phaseLabel: 'Estrategia',
  },
  {
    number: '03',
    title: 'Build',
    description:
      'Desarrollar, integrar, probar, revisar e iterar la solución con feedback continuo, asegurando estándares de calidad y rendimiento.',
    imageUrl: ASSETS.processDiscover,
    phaseLabel: 'Desarrollo',
  },
  {
    number: '04',
    title: 'Launch',
    description:
      'Realizar deployment, configuración final, validación, entrega al cliente y establecer canales de soporte o mantenimiento continuo.',
    imageUrl: ASSETS.processDefine,
    phaseLabel: 'Solución',
  },
];
