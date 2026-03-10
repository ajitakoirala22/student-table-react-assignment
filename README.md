# Student Table - React Assignment

A simple student management application built with React for managing student records.

## Features

- **View Students** - Display all students in a table with Name, Email, and Age
- **Add Student** - Form with validation (all fields required, email format check)
- **Edit Student** - Pre-filled form to update existing student details
- **Delete Student** - Confirmation dialog before deletion with success message
- **Search** - Filter students by name, email, or age
- **Excel Export** - Download student data as Excel file (filtered or full list)
- **Loading States** - Simulated loading indicators

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Tech Stack

- React
- Vite
- xlsx (for Excel export)

