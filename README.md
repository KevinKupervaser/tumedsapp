# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

```
turnosmedicos
├─ app
│  ├─ (protected)
│  │  ├─ (tabs)
│  │  │  ├─ index.tsx
│  │  │  ├─ profile.tsx
│  │  │  ├─ settings.tsx
│  │  │  └─ _layout.tsx
│  │  ├─ appointment-form.tsx
│  │  └─ _layout.tsx
│  ├─ login.tsx
│  ├─ modal.tsx
│  └─ _layout.tsx
├─ app.json
├─ assets
│  └─ images
│     ├─ favicon.png
│     ├─ icon.png
│     ├─ partial-react-logo.png
│     ├─ react-logo.png
│     ├─ react-logo@2x.png
│     ├─ react-logo@3x.png
│     └─ splash-icon.png
├─ components
│  ├─ AppointmentCard.tsx
│  ├─ auth
│  │  ├─ FormInput.tsx
│  │  └─ index.ts
│  ├─ DatePickerField.tsx
│  ├─ DoctorSelector.tsx
│  ├─ external-link.tsx
│  ├─ FilterChips.tsx
│  ├─ FormField.tsx
│  ├─ haptic-tab.tsx
│  ├─ hello-wave.tsx
│  ├─ LogoutButton.tsx
│  ├─ parallax-scroll-view.tsx
│  ├─ StatusSelector.tsx
│  ├─ themed-text.tsx
│  ├─ themed-view.tsx
│  ├─ TimePickerField.tsx
│  └─ ui
│     ├─ collapsible.tsx
│     ├─ icon-symbol.ios.tsx
│     └─ icon-symbol.tsx
├─ constants
│  └─ theme.ts
├─ eslint.config.js
├─ hooks
│  ├─ appointments
│  │  ├─ index.ts
│  │  ├─ useAppointmentActions.ts
│  │  ├─ useAppointmentMultiStepForm.ts
│  │  ├─ useAppointments.ts
│  │  └─ useAppointmentsFilter.ts
│  ├─ auth
│  │  ├─ index.ts
│  │  └─ useLogin.ts
│  ├─ profile
│  │  ├─ index.ts
│  │  ├─ useImageOptions.ts
│  │  ├─ useImagePicker.ts
│  │  └─ useProfilePicture.ts
│  ├─ reduxHooks.ts
│  ├─ theme
│  │  ├─ index.ts
│  │  └─ useTheme.ts
│  ├─ use-color-scheme.ts
│  ├─ use-color-scheme.web.ts
│  └─ use-theme-color.ts
├─ package-lock.json
├─ package.json
├─ README.md
├─ scripts
│  └─ reset-project.js
├─ services
│  ├─ api.ts
│  └─ appointments.ts
├─ store
│  ├─ index.ts
│  └─ slices
│     ├─ authSlice.ts
│     └─ themeSlice.ts
├─ tsconfig.json
└─ types
   └─ index.ts

```
```
turnosapp
├─ app.json
├─ assets
│  └─ images
│     ├─ favicon.png
│     ├─ icon.png
│     ├─ partial-react-logo.png
│     ├─ react-logo.png
│     ├─ react-logo@2x.png
│     ├─ react-logo@3x.png
│     └─ splash-icon.png
├─ components
│  ├─ external-link.tsx
│  ├─ hello-wave.tsx
│  ├─ parallax-scroll-view.tsx
│  └─ ui
│     ├─ collapsible.tsx
│     └─ icon-symbol.ios.tsx
├─ eslint.config.js
├─ hooks
│  ├─ use-color-scheme.ts
│  ├─ use-color-scheme.web.ts
│  └─ use-theme-color.ts
├─ package-lock.json
├─ package.json
├─ README.md
├─ scripts
│  └─ reset-project.js
├─ services
├─ src
│  ├─ app
│  │  ├─ (protected)
│  │  │  ├─ (tabs)
│  │  │  │  ├─ index.tsx
│  │  │  │  ├─ profile.tsx
│  │  │  │  ├─ settings.tsx
│  │  │  │  └─ _layout.tsx
│  │  │  ├─ appointment-form.tsx
│  │  │  └─ _layout.tsx
│  │  ├─ login.tsx
│  │  ├─ modal.tsx
│  │  └─ _layout.tsx
│  ├─ core
│  │  ├─ api
│  │  │  ├─ client.ts
│  │  │  └─ index.ts
│  │  ├─ config
│  │  │  ├─ index.ts
│  │  │  └─ queryClient.ts
│  │  ├─ index.ts
│  │  └─ store
│  │     ├─ hooks.ts
│  │     └─ index.ts
│  ├─ features
│  │  ├─ appointments
│  │  │  ├─ components
│  │  │  │  ├─ AppointmentCard.tsx
│  │  │  │  ├─ DatePickerField.tsx
│  │  │  │  ├─ DoctorSelector.tsx
│  │  │  │  ├─ FilterChips.tsx
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ StatusSelector.tsx
│  │  │  │  └─ TimePickerField.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ useAppointmentActions.ts
│  │  │  │  ├─ useAppointmentMultiStepForm.ts
│  │  │  │  ├─ useAppointments.ts
│  │  │  │  └─ useAppointmentsFilter.ts
│  │  │  ├─ index.ts
│  │  │  ├─ services
│  │  │  │  ├─ appointmentsService.ts
│  │  │  │  └─ index.ts
│  │  │  └─ types
│  │  │     ├─ appointment.types.ts
│  │  │     └─ index.ts
│  │  ├─ auth
│  │  │  ├─ components
│  │  │  │  ├─ FormInput.tsx
│  │  │  │  └─ index.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  └─ useLogin.ts
│  │  │  ├─ index.ts
│  │  │  ├─ services
│  │  │  ├─ store
│  │  │  │  ├─ authSlice.ts
│  │  │  │  └─ index.ts
│  │  │  └─ types
│  │  ├─ profile
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ useImageOptions.ts
│  │  │  │  ├─ useImagePicker.ts
│  │  │  │  └─ useProfilePicture.ts
│  │  │  └─ index.ts
│  │  └─ settings
│  │     ├─ hooks
│  │     │  ├─ index.ts
│  │     │  └─ useTheme.ts
│  │     ├─ index.ts
│  │     └─ store
│  │        ├─ index.ts
│  │        └─ themeSlice.ts
│  └─ shared
│     ├─ components
│     │  ├─ form
│     │  │  ├─ FormField.tsx
│     │  │  └─ index.ts
│     │  ├─ index.ts
│     │  ├─ layout
│     │  │  ├─ index.ts
│     │  │  └─ LogoutButton.tsx
│     │  ├─ themed
│     │  │  ├─ index.ts
│     │  │  ├─ ThemedText.tsx
│     │  │  └─ ThemedView.tsx
│     │  └─ ui
│     │     ├─ HapticTab.tsx
│     │     ├─ IconSymbol.tsx
│     │     ├─ index.ts
│     │     └─ SlideUpScreen.tsx
│     ├─ constants
│     │  ├─ index.ts
│     │  └─ theme.ts
│     ├─ index.ts
│     └─ types
│        ├─ common.types.ts
│        └─ index.ts
├─ tsconfig.json
└─ types

```