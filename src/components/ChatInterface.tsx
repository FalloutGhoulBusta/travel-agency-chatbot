import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatContext } from '../context/ChatContext';
import PackageCard from './PackageCard';

const ChatInterface: React.FC = () => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    sendMessage,
    loading
  } = useChatContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessage = (text: string) => {
    return text.split(/(\*\*.*?\*\*|###.*?\n)/).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('###')) {
        const headingText = part.slice(3).trim();
        return <h3 key={index} className="text-xl font-semibold mb-2">{headingText}</h3>;
      }
      return part;
    });
  };

  const handleAddToCart = async (packageId: string) => {
    try {
      const response = await fetch(`http://localhost:5173/travel-agency/php/api_add_to_cart.php?add=${packageId}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        alert('Item added to cart!');
      } else {
        alert('Failed to add item to cart.');
        console.error('Failed to add to cart:', response.statusText);
      }
    } catch (error) {
      alert('An error occurred while adding to cart.');
      console.error('Error adding to cart:', error);
    }
  };

  const renderMessageContent = (msg: any) => {
    if (msg.type === 'packageCards' && msg.packageData) {
      return (
        <div className="grid grid-cols-1 gap-4 mt-2">
          {msg.packageData.map((pkg: any, index: number) => (
            <PackageCard
              key={pkg.id}
              title={pkg.title}
              description={pkg.description}
              price={pkg.price}
              destination={pkg.destination}
              onAddToCart={() => handleAddToCart(pkg.id)}
            />
          ))}
        </div>
      );
    }
    return <div className="whitespace-pre-wrap">{formatMessage(msg.text)}</div>;
  };

  return (
    <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-sm mb-4 p-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-2 ${
                  msg.sender === 'user' ? 'bg-blue-500 ml-2' : 'bg-gray-200'
                }`}>
                  {msg.sender === 'user' ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-gray-700" />
                  )}
                </div>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {renderMessageContent(msg)}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex mb-4 justify-start"
          >
            <div className="flex items-start max-w-[80%]">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                <Bot size={16} className="text-gray-700" />
              </div>
              <div className="rounded-lg px-4 py-2 bg-gray-100 text-gray-800">
                <div className="flex items-center">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  <p>Thinking...</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center space-x-2 mb-6">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!message.trim() || loading}
          className={`p-3 rounded-lg ${
            !message.trim() || loading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors duration-200`}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;


