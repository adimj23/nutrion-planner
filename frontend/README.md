# Nutrition Planner Frontend

A React-based frontend for the Nutrition Planner application, built with TypeScript, Vite, and Tailwind CSS.

## Features

- **User Management**: Create and manage user accounts
- **Profile Setup**: Configure user profiles with calorie and macro targets
- **Meal Plan Generation**: Generate personalized meal plans based on user profiles and constraints
- **Grocery Lists**: View consolidated grocery lists from meal plans
- **Dietary Constraints**: Manage dietary preferences, allergies, and food dislikes
- **Food Database**: Browse and search the foods database

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend server running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component with routing
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── package.json        # Dependencies and scripts
└── vite.config.ts      # Vite configuration
```

## API Integration

The frontend communicates with the Django REST Framework backend through the API service layer in `src/services/api.ts`. The Vite dev server is configured to proxy API requests to `http://localhost:8000`.

## Technologies

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS framework

