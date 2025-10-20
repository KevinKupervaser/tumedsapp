import { useAppSelector } from "@core/store/hooks";
import { AppointmentFormData } from "@shared/types/common.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
  selectedTimeSlotPeriod: TimeSlotPeriod;
  setSelectedTimeSlotPeriod: (period: TimeSlotPeriod) => void;

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

const MORNING_TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
];

const AFTERNOON_TIME_SLOTS = [
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

type TimeSlotPeriod = "morning" | "afternoon" | null;

export function useAppointmentMultiStepForm(): UseAppointmentMultiStepFormResult {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const params = useLocalSearchParams();
  const { createAppointment, updateAppointment, isCreating, isUpdating } = useAppointments();

  // Check if we're in edit mode
  const isEditMode = !!params.id;
  const appointmentId = params.id as string;

  const [currentStep, setCurrentStep] = useState<FormStep>("datetime");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedTimeSlotPeriod, setSelectedTimeSlotPeriod] = useState<TimeSlotPeriod>(null);

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

  // Helper function to get current time in GMT-3 (Argentina)
  const getCurrentTimeInGMT3 = useCallback((): Date => {
    const now = new Date();
    // Get UTC time
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    // Convert to GMT-3 (subtract 3 hours from UTC)
    const gmt3Time = new Date(utcTime - (3 * 60 * 60 * 1000));
    return gmt3Time;
  }, []);

  // Helper function to check if a date is today in GMT-3
  const isToday = useCallback((date: Date): boolean => {
    const now = getCurrentTimeInGMT3();
    const dateToCheck = new Date(date);

    return dateToCheck.getDate() === now.getDate() &&
           dateToCheck.getMonth() === now.getMonth() &&
           dateToCheck.getFullYear() === now.getFullYear();
  }, [getCurrentTimeInGMT3]);

  // Filter time slots to remove past times when today is selected
  const filterExpiredTimeSlots = useCallback((slots: string[]): string[] => {
    // If no date is selected or it's not today, return all slots
    if (!selectedDate || !isToday(selectedDate)) {
      return slots;
    }

    const now = getCurrentTimeInGMT3();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return slots.filter(slot => {
      const [slotHour, slotMinute] = slot.split(':').map(Number);

      // Compare time: slot time should be in the future
      if (slotHour > currentHour) {
        return true;
      } else if (slotHour === currentHour && slotMinute > currentMinute) {
        return true;
      }
      return false;
    });
  }, [selectedDate, getCurrentTimeInGMT3, isToday]);

  // Set email from user
  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email);
    }
  }, [user?.email, setValue]);

  // Track if we're initializing from edit mode to prevent clearing time
  const [isInitialized, setIsInitialized] = useState(false);

  // Populate form when in edit mode
  useEffect(() => {
    if (isEditMode && params && !isInitialized) {
      // Set form values
      if (params.patient) setValue("patient", params.patient as string);
      if (params.doctor) {
        setValue("doctor", params.doctor as string);
        setSelectedDoctor(params.doctor as string);
      }
      if (params.date) setValue("date", params.date as string);
      if (params.phone) setValue("phone", params.phone as string);
      if (params.email) setValue("email", params.email as string);
      if (params.observations) setValue("observations", params.observations as string);
      if (params.status) setValue("status", params.status as any);

      // Parse and set date
      if (params.date) {
        const dateStr = params.date as string;
        let parsedDate: Date;

        if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
          // DD/MM/YYYY format
          const [day, month, year] = dateStr.split('/').map(Number);
          parsedDate = new Date(year, month - 1, day);
        } else if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // YYYY-MM-DD format
          parsedDate = new Date(dateStr);
        } else {
          parsedDate = new Date(dateStr);
        }

        if (!isNaN(parsedDate.getTime())) {
          setSelectedDate(parsedDate);
        }
      }

      // Set time and period together to avoid clearing
      if (params.time) {
        const time = params.time as string;
        const hour = parseInt(time.split(':')[0]);

        // Set period first
        if (hour >= 9 && hour < 17) {
          setSelectedTimeSlotPeriod("morning");
        } else if (hour >= 17 && hour <= 21) {
          setSelectedTimeSlotPeriod("afternoon");
        }

        // Then set time
        setValue("time", time);
      }

      setIsInitialized(true);
    }
  }, [isEditMode, params, isInitialized, setValue]);

  // Clear time selection when period changes (but not during initialization)
  useEffect(() => {
    if (isInitialized) {
      setValue("time", "");
    }
  }, [selectedTimeSlotPeriod, isInitialized, setValue]);


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

      const appointmentData = {
        ...data,
        patient: fullName,
        doctor: selectedDoctor,
      };

      if (isEditMode) {
        // Update existing appointment
        await updateAppointment({
          id: appointmentId,
          data: appointmentData,
        });
      } else {
        // Create new appointment
        await createAppointment(appointmentData);
      }

      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", isEditMode ? "No se pudo actualizar el turno" : "No se pudo agendar el turno");
    }
  };

  const goBack = () => {
    if (isFirstStep) {
      router.back();
    } else {
      goToPreviousStep();
    }
  };

  // Get time slots based on selected period and filter expired ones
  const getAvailableTimeSlots = (): string[] => {
    let slots: string[] = [];

    if (selectedTimeSlotPeriod === "morning") {
      slots = MORNING_TIME_SLOTS;
    } else if (selectedTimeSlotPeriod === "afternoon") {
      slots = AFTERNOON_TIME_SLOTS;
    }

    return filterExpiredTimeSlots(slots);
  };

  const availableTimeSlots = getAvailableTimeSlots();

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
    availableTimeSlots,
    selectedTimeSlotPeriod,
    setSelectedTimeSlotPeriod,
    availableDoctors: AVAILABLE_DOCTORS,
    selectedDoctor,
    setSelectedDoctor,
    onSubmit,
    isLoading: isCreating || isUpdating,
    goBack,
  };
}
