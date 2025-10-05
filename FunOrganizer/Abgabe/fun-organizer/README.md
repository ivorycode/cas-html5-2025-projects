# Fun Organizer

A modern event planning and organization platform built with React and Supabase.

## Features

- **Event Management**: Create, organize and manage events with dates, locations and participants
- **Real-time Updates**: Live notifications for event changes and invitations
- **User Authentication**: Secure login system with Supabase Auth

## Tech Stack

- **Frontend**: React 19, TypeScript, TanStack Router
- **Styling**: Tailwind CSS, Radix UI, shadcn/ui
- **Backend**: Supabase (Database, Auth, Real-time)
- **Build Tool**: Vite

## Getting Started

1. **Install dependencies**

    ```bash
    npm install
    ```

2. **Setup environment variables**

    Create a `.env.local` file in the project root:

    ```bash
    VITE_SUPABASE_URL=https://your-project-ref.supabase.co
    VITE_SUPABASE_ANON_KEY=your-anon-key
    VITE_DEV_USER_PW=your-dev-user-password
    ```

3. **Run the development server**

    ```bash
    npm run dev
    ```

    The app will be available at `http://localhost:3000`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run serve` - Preview production build

## Project Structure

```
src/
├── components/     # Reusable UI components
├── routes/         # File-based routing
├── lib/            # Utilities and services
└── assets/         # Static assets
```
