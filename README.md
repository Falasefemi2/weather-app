# Weather App

This is a functional weather application that allows users to search for cities and view current weather information. The application is built using modern web technologies with a strong focus on functional programming principles and type safety.

## Overview

The application uses the Open-Meteo API for both geocoding (finding cities by name) and fetching real-time weather data. It features a debounced search input to provide city suggestions as the user types.

## Key Technologies

### TypeScript

The entire project is written in TypeScript, ensuring robust type safety across the application. It uses advanced TypeScript features to provide a predictable and developer-friendly codebase.

### Effect-TS

The core logic of the application is implemented using Effect-TS (specifically in `src/effect.ts`). This library brings high-level functional programming concepts to TypeScript, including:

- Effect: For managing synchronous and asynchronous operations.
- Stream: For handling the debounced search input as a stream of events.
- Schema: For type-safe data validation of API responses.
- HttpClient: For robust and composable network requests via @effect/platform.
- Option: For safe handling of nullable values and DOM elements.

### Additional Tools

- Zod: Used for schema validation in the alternative implementation (`src/index.ts`).
- Parcel: A zero-configuration build tool used for bundling the application.
- Open-Meteo API: Provides free geocoding and weather data without the need for an API key.
- Vanilla CSS: Custom styles with CSS variables for a modern, responsive design.

## Project Structure

- `src/index.html`: The main entry point of the web application.
- `src/effect.ts`: The primary logic implemented using Effect-TS.
- `src/index.ts`: An alternative implementation using standard async/await and Zod.
- `src/index.css`: Application styling.

## Getting Started

### Prerequisites

Ensure you have Node.js and npm installed on your machine.

### Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### Development

To start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at http://localhost:1234.

### Production Build

To create an optimized production build:

```bash
npm run build
```

The output will be generated in the `dist` directory.
