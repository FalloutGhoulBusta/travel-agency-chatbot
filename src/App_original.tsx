import React from 'react';
import ChatInterface from './components/ChatInterface';
import { ChatProvider } from './context/ChatContext';
import { BookingProvider } from './context/BookingContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <BookingProvider>
          <ChatProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <header className="bg-white shadow-sm py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h1 className="text-xl font-semibold text-gray-800">Travel Booking Assistant</h1>
                </div>
              </header>
              <main className="flex-1 flex flex-col">
                <ChatInterface />
              </main>
            </div>
          </ChatProvider>
        </BookingProvider>
      </DatabaseProvider>
    </AuthProvider>
  );
}

export default App;