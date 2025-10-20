import { AppointmentSummaryCard, DatePickerField, DoctorSelector, TimePickerField, TimeSlotPeriodSelector, useAppointmentMultiStepForm } from "@features/appointments";
import { useTheme } from "@features/settings";
import { FormField, SlideUpScreen, ThemedText, ThemedView } from "@shared";
import { MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWatch } from "react-hook-form";

export default function AppointmentFormScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    control,
    errors,
    handleSubmit,
    currentStep,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    showDatePicker,
    selectedDate,
    setShowDatePicker,
    onDateChange,
    availableTimeSlots,
    selectedTimeSlotPeriod,
    setSelectedTimeSlotPeriod,
    availableDoctors,
    selectedDoctor,
    setSelectedDoctor,
    onSubmit,
    isLoading,
    goBack,
  } = useAppointmentMultiStepForm();

  // Watch form values to show in summary - this will trigger re-render on changes
  const selectedDateValue = useWatch({ control, name: "date" });
  const selectedTimeValue = useWatch({ control, name: "time" });

  // Step progress indicator
  const stepTitles = {
    datetime: "Fecha y Horario",
    doctor: "Seleccionar Profesional",
    patient: "Datos del Paciente",
  };

  const steps = ["datetime", "doctor", "patient"];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <SlideUpScreen>
      <ThemedView style={styles.container}>
        {/* Header */}
        <ThemedView style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity onPress={goBack}>
            <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
          </TouchableOpacity>
          <ThemedText type="title">Agendar Turno</ThemedText>
          <ThemedView style={{ width: 24 }} />
        </ThemedView>

        {/* Progress Bar */}
        <ThemedView style={styles.progressContainer}>
          <ThemedView
            style={[styles.progressBar, { backgroundColor: theme.border }]}
          >
            <ThemedView
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: theme.primary },
              ]}
            />
          </ThemedView>
          <ThemedText style={styles.stepTitle}>
            {stepTitles[currentStep]}
          </ThemedText>
        </ThemedView>

        {/* Form Content */}
        <ScrollView
          style={styles.form}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.formContent,
            { paddingBottom: insets.bottom + 100 }, // Extra space for buttons
          ]}
        >
          {/* Step 1: Date & Time */}
          {currentStep === "datetime" && (
            <>
              <DatePickerField
                name="date"
                control={control}
                label="Fecha *"
                showPicker={showDatePicker}
                selectedDate={selectedDate}
                onDateChange={onDateChange}
                onShowPicker={() => setShowDatePicker(true)}
                onHidePicker={() => setShowDatePicker(false)}
                error={errors.date}
                rules={{
                  required: "La fecha es requerida",
                }}
              />

              <TimeSlotPeriodSelector
                selectedPeriod={selectedTimeSlotPeriod}
                onSelectPeriod={setSelectedTimeSlotPeriod}
              />

              {selectedTimeSlotPeriod && (
                <TimePickerField
                  name="time"
                  control={control}
                  label={selectedTimeSlotPeriod === "morning" ? "Horarios Disponibles (Mañana)" : "Horarios Disponibles (Tarde)"}
                  timeSlots={availableTimeSlots}
                  error={errors.time}
                />
              )}

              {/* Show Summary Card when both date and time are selected */}
              {selectedDateValue && selectedTimeValue && selectedTimeSlotPeriod && (
                <AppointmentSummaryCard
                  date={selectedDateValue}
                  time={selectedTimeValue}
                  period={selectedTimeSlotPeriod}
                />
              )}
            </>
          )}

          {/* Step 2: Doctor Selection */}
          {currentStep === "doctor" && (
            <DoctorSelector
              doctors={availableDoctors}
              selectedDoctor={selectedDoctor}
              onSelect={setSelectedDoctor}
            />
          )}

          {/* Step 3: Patient Information */}
          {currentStep === "patient" && (
            <>
              <FormField
                name="patient"
                control={control}
                label="Nombre y Apellido *"
                placeholder="Ej: Juan Pérez"
                error={errors.patient}
                rules={{ required: "El nombre es requerido" }}
              />

              <FormField
                name="email"
                control={control}
                label="Email *"
                placeholder="ejemplo@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                rules={{
                  required: "El email es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                }}
              />

              <FormField
                name="phone"
                control={control}
                label="Teléfono *"
                placeholder="Ej: +54 341 123 4567"
                keyboardType="phone-pad"
                error={errors.phone}
                rules={{ required: "El teléfono es requerido" }}
              />

              <ThemedView style={styles.field}>
                <ThemedText style={styles.label}>Observaciones</ThemedText>
                <FormField
                  name="observations"
                  control={control}
                  label=""
                  placeholder="Información adicional (opcional)"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={styles.textArea}
                />
              </ThemedView>
            </>
          )}
        </ScrollView>

        {/* Navigation Buttons */}
        <ThemedView
          style={[
            styles.buttonContainer,
            {
              paddingBottom: Math.max(insets.bottom, 16) + 16,
              backgroundColor: theme.background,
            },
          ]}
        >
          <View style={styles.buttonRow}>
            {!isFirstStep && (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.secondaryButton,
                  { borderColor: theme.border },
                ]}
                onPress={goToPreviousStep}
              >
                <MaterialIcons name="arrow-back" size={20} color={theme.text} />
                <ThemedText style={[styles.buttonText, { color: theme.text }]}>
                  Anterior
                </ThemedText>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                { backgroundColor: theme.primary },
                isLoading && styles.buttonDisabled,
                !isFirstStep && styles.flexButton,
              ]}
              onPress={isLastStep ? handleSubmit(onSubmit) : goToNextStep}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <ThemedText style={styles.primaryButtonText}>
                    {isLastStep ? "Confirmar Turno" : "Siguiente"}
                  </ThemedText>
                  {!isLastStep && (
                    <MaterialIcons
                      name="arrow-forward"
                      size={20}
                      color="#FFF"
                    />
                  )}
                </>
              )}
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ThemedView>
    </SlideUpScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formContent: {
    paddingTop: 8,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  flexButton: {
    flex: 1,
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    borderWidth: 2,
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
