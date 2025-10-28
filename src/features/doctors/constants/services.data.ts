import { Service } from "../types/service.types";

export const SERVICES: Service[] = [
  // Dr. Álvaro Medina - Medicina General
  {
    id: "service-1",
    doctorId: "1",
    doctorName: "Dr. Álvaro Medina",
    title: "Consulta General",
    description: "Consulta médica general completa con revisión integral y diagnóstico",
    duration: "30 min",
    price: "$5,000",
    icon: "medical-services",
  },
  {
    id: "service-2",
    doctorId: "1",
    doctorName: "Dr. Álvaro Medina",
    title: "Control Preventivo",
    description: "Chequeo preventivo con análisis de signos vitales y recomendaciones",
    duration: "45 min",
    price: "$6,500",
    icon: "health-and-safety",
  },

  // Dra. María Hookerman - Cardiología
  {
    id: "service-3",
    doctorId: "2",
    doctorName: "Dra. María Hookerman",
    title: "Consulta Cardiológica",
    description: "Evaluación cardiovascular completa con electrocardiograma",
    duration: "45 min",
    price: "$8,000",
    icon: "favorite",
  },
  {
    id: "service-4",
    doctorId: "2",
    doctorName: "Dra. María Hookerman",
    title: "Ecocardiograma",
    description: "Estudio de imagen del corazón con informe detallado",
    duration: "60 min",
    price: "$12,000",
    icon: "monitor-heart",
  },
];
