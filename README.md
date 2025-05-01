# Booking Chatbot

![Chatbot Interface](https://img.shields.io/badge/Interface-Modern-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178c6)
![Vite](https://img.shields.io/badge/Vite-5.4.2-646cff)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38bdf8)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/FalloutGhoulBusta/travel-agency)

## Overview

A modern, interactive chatbot built with React and TypeScript that integrates with the Travel Agency website. This chatbot helps users find and book travel packages, answer questions, and enhance the overall user experience.

## Features

- 💬 **Interactive Chat Interface**: Natural conversation flow with animated responses
- 🔍 **Package Search**: Find travel packages based on user preferences
- 📅 **Date Selection**: Built-in date picker for booking travel dates
- 🔒 **Authentication**: Seamless integration with the main website's authentication system
- 🛒 **Cart Integration**: Add packages directly to the shopping cart
- 🎨 **Modern UI**: Built with TailwindCSS for a responsive and attractive design
- 🔄 **Context Awareness**: Maintains conversation context for natural interactions

## Tech Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.2
- **Styling**: TailwindCSS 3.4.1
- **UI Components**: Custom components with Framer Motion animations
- **Date Handling**: date-fns and react-datepicker
- **Icons**: Lucide React
- **State Management**: React Context API
- **Authentication**: JS-Cookie for token management
- **AI Integration**: HuggingFace Inference API

## Project Structure

```
src/
├── components/
│   ├── ChatInterface.tsx    # Main chat interface component
│   └── PackageCard.tsx      # Card component for displaying travel packages
├── context/
│   ├── AuthContext.tsx      # Authentication context provider
│   └── ChatContext.tsx      # Chat state management context
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css                # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Navigate to the chatbot directory
cd chatbot

# Install dependencies
npm install
# or
yarn
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev
```

The development server will start at http://localhost:5173

### Building for Production

```bash
# Build the application
npm run build
# or
yarn build
```

## Integration with Travel Agency Website

The chatbot is designed to be embedded in the main Travel Agency website. It communicates with the PHP backend through API endpoints for:

- User authentication
- Package information retrieval
- Cart operations

## Using with ngrok

For testing the chatbot with external access, you can use the provided ngrok URL updater script:

```bash
# From the travel-agency root directory
./run-ngrok-updater.bat
```

This will automatically update all URLs in the codebase to use ngrok-generated URLs.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is proprietary and confidential.

## Contact

For any inquiries, please contact the Travel Agency team.
