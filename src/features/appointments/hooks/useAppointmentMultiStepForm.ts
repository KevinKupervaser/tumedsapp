import { useAppSelector } from "@/src/core/";
import { AppointmentFormData } from "@/src/shared/types/common.types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Platform } from "react-native";
import { useAppointments } from "./useAppointments";

type FormStep = "datetime" | "doctor" | "patient";

interface UseAppointmentMultiStepFormResult {
  // Form
  control: any;
  errors: any;
  handleSubmit: any;

  // Steps
  currentStep: FormStep;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // Date & Time
  showDatePicker: boolean;
  showTimePicker: boolean;
  selectedDate: Date;
  selectedTime: Date;
  setShowDatePicker: (show: boolean) => void;
  setShowTimePicker: (show: boolean) => void;
  onDateChange: (event: any, date?: Date) => void;
  onTimeChange: (event: any, time?: Date) => void;
  availableTimeSlots: string[];

  // Doctors
  availableDoctors: { id: string; name: string }[];
  selectedDoctor: string;
  setSelectedDoctor: (doctor: string) => void;

  // Submit
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  isLoading: boolean;

  // Navigation
  goBack: () => void;
}

const AVAILABLE_DOCTORS = [
  { id: "1", name: "Dr. Álvaro Medina" },
  { id: "2", name: "Dra. María Hookerman" },
];

const TIME_SLOTS = [
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

export function useAppointmentMultiStepForm(): UseAppointmentMultiStepFormResult {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { createAppointment, isCreating } = useAppointments();

  const [currentStep, setCurrentStep] = useState<FormStep>("datetime");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    defaultValues: {
      patient: "",
      doctor: "",
      date: "",
      time: "",
      phone: "",
      email: user?.email || "",
      observations: "",
      status: "scheduled",
    },
  });

  // Set email from user
  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email);
    }
  }, [user?.email, setValue]);

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const onDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedDateMidnight = new Date(date);
      selectedDateMidnight.setHours(0, 0, 0, 0);

      if (selectedDateMidnight >= today) {
        setSelectedDate(date);
        setValue("date", formatDate(date));
      } else {
        Alert.alert(
          "Fecha inválida",
          "No puedes seleccionar una fecha anterior a hoy",
          [{ text: "OK" }]
        );
      }
    }
  };

  const onTimeChange = (event: any, time?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }

    if (time) {
      setSelectedTime(time);
      setValue("time", formatTime(time));
    }
  };

  const steps: FormStep[] = ["datetime", "doctor", "patient"];
  const currentStepIndex = steps.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const goToNextStep = () => {
    const dateValue = watch("date");
    const timeValue = watch("time");

    // Validate current step before proceeding
    if (currentStep === "datetime") {
      if (!dateValue || !timeValue) {
        Alert.alert("Error", "Por favor selecciona fecha y horario");
        return;
      }
      setCurrentStep("doctor");
    } else if (currentStep === "doctor") {
      if (!selectedDoctor) {
        Alert.alert("Error", "Por favor selecciona un profesional");
        return;
      }
      setValue("doctor", selectedDoctor);
      setCurrentStep("patient");
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === "doctor") {
      setCurrentStep("datetime");
    } else if (currentStep === "patient") {
      setCurrentStep("doctor");
    }
  };

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      // Concatenate first and last name for patient field
      const fullName = `${data.patient}`.trim();

      await createAppointment({
        ...data,
        patient: fullName,
        doctor: selectedDoctor,
      });

      Alert.alert("Éxito", "Turno agendado correctamente", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo agendar el turno");
    }
  };

  const goBack = () => {
    if (isFirstStep) {
      router.back();
    } else {
      goToPreviousStep();
    }
  };

  return {
    control,
    errors,
    handleSubmit,
    currentStep,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    showDatePicker,
    showTimePicker,
    selectedDate,
    selectedTime,
    setShowDatePicker,
    setShowTimePicker,
    onDateChange,
    onTimeChange,
    availableTimeSlots: TIME_SLOTS,
    availableDoctors: AVAILABLE_DOCTORS,
    selectedDoctor,
    setSelectedDoctor,
    onSubmit,
    isLoading: isCreating,
    goBack,
  };
}
