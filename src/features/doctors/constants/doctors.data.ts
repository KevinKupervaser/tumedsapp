import { Doctor } from "../types";

export const DOCTORS: Doctor[] = [
  {
    id: "1",
    name: "Dr. Álvaro Medina",
    specialty: "Medicina General",
    experience: "15 años de experiencia",
    education: "Universidad Nacional de Rosario - Medicina (2009)",
    languages: ["Español", "Inglés"],
    schedule: "Lunes a Viernes: 9:00 - 13:00 y 17:00 - 21:00",
    bio: "Especialista en medicina general con amplia experiencia en atención primaria. Enfocado en medicina preventiva y tratamiento integral del paciente. Certificado en urgencias médicas y primeros auxilios.",
    photo: require("./../../../../assets/doctors/medina.jpg"),
  },
  {
    id: "2",
    name: "Dra. María Hookerman",
    specialty: "Cardiología",
    experience: "12 años de experiencia",
    education:
      "Universidad de Buenos Aires - Medicina (2012), Especialización en Cardiología (2016)",
    languages: ["Español", "Inglés", "Portugués"],
    schedule: "Martes a Sábado: 9:00 - 13:00 y 17:00 - 21:00",
    bio: "Cardióloga especializada en prevención y tratamiento de enfermedades cardiovasculares. Miembro activo de la Sociedad Argentina de Cardiología. Experiencia en ecocardiografía y rehabilitación cardíaca.",
    photo: require("./../../../../assets/doctors/hookerman.jpg"),
  },
];
