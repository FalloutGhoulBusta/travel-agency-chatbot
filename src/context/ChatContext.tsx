import React, { createContext, useContext, useState, useEffect } from 'react';
import { LRUCache } from 'lru-cache';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  type?: 'text' | 'packageCards';
  packageData?: PackageData[];
}

interface PackageData {
  id: string;
  title: string;
  description: string;
  price: number;
  destination: string;
}

interface ChatContextProps {
  messages: Message[];
  sendMessage: (text: string) => void;
  loading: boolean;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

const MAX_REQUESTS_PER_MINUTE = 10;
const requestTimestamps: number[] = [];

const responseCache = new LRUCache<string, string>({
  max: 100,
  ttl: 1000 * 60 * 60,
});

const checkRateLimit = () => {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  while (requestTimestamps.length > 0 && requestTimestamps[0] < oneMinuteAgo) {
    requestTimestamps.shift();
  }

  return requestTimestamps.length < MAX_REQUESTS_PER_MINUTE;
};

const destinations = [
  'Paris', 'Tokyo', 'New York City', 'Rome', 'Bali',
  'Dubai', 'Sydney', 'Barcelona', 'Cape Town', 'Maldives'
];

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<Record<string, PackageData[]>>({});

  useEffect(() => {
    const welcomeMessage: Message = {
      text: "Hello! I'm your travel booking assistant. How can I help you plan your next adventure? You can ask me about our destinations or available packages.",
      sender: 'bot' as const,
      type: 'text',
    };
    setMessages([welcomeMessage]);

    // Fetch packages from the API
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost:5173/travel-agency/php/api_get_packages.php', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setPackages(data);
        } else {
          console.error('Failed to fetch packages:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  const detectDestination = (message: string): string | null => {
    const lowercaseMessage = message.toLowerCase();
    return destinations.find(dest => lowercaseMessage.includes(dest.toLowerCase())) || null;
  };

  const detectPackageQuery = (message: string): boolean => {
    const packageKeywords = [
      'package', 'packages', 'tour', 'tours', 'deal', 'deals',
      'offer', 'offers', 'show me', 'what', 'available'
    ];

    return packageKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );
  };

  const handlePackageQuery = (destination?: string): Message => {
    if (destination && packages[destination]) {
      return {
        text: `Here are our available packages for ${destination}:`,
        sender: 'bot',
        type: 'packageCards',
        packageData: packages[destination].slice(0, 3)
      };
    }

    // Show random packages from different destinations if no specific destination
    const randomPackages: PackageData[] = [];
    const destinations = Object.keys(packages);

    while (randomPackages.length < 3 && destinations.length > 0) {
      const randomDestIndex = Math.floor(Math.random() * destinations.length);
      const destination = destinations[randomDestIndex];
      const destinationPackages = packages[destination];

      if (destinationPackages && destinationPackages.length > 0) {
        const randomPackageIndex = Math.floor(Math.random() * destinationPackages.length);
        randomPackages.push(destinationPackages[randomPackageIndex]);
      }

      destinations.splice(randomDestIndex, 1);
    }

    return {
      text: "Here are some of our popular packages:",
      sender: 'bot',
      type: 'packageCards',
      packageData: randomPackages
    };
  };

  const getAIResponse = async (message: string): Promise<Message> => {
    const destination = detectDestination(message);
    const isPackageQuery = detectPackageQuery(message);

    if (isPackageQuery) {
      return handlePackageQuery(destination || undefined);
    }

    if (destination) {
      return handlePackageQuery(destination);
    }

    const cachedResponse = responseCache.get(message);
    if (cachedResponse) {
      return { text: cachedResponse, sender: 'bot', type: 'text' };
    }

    if (!checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again in a minute.');
    }

    requestTimestamps.push(Date.now());

    try {
      const response = await fetch(import.meta.env.VITE_HF_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a helpful travel assistant. You help users plan travel packages and answer their questions about travel options, pricing, and policies."
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 512,
          model: "Qwen/Qwen2.5-1.5B-Instruct",
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      responseCache.set(message, aiResponse);
      return { text: aiResponse, sender: 'bot', type: 'text' };
    } catch (error) {
      console.error('Error calling Qwen API:', error);
      throw error;
    }
  };

  const sendMessage = async (text: string) => {
    const userMessage: Message = { text, sender: 'user', type: 'text' };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await getAIResponse(text);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error getting response:', error);

      const errorMessage: Message = {
        text: error instanceof Error ? error.message : "I'm sorry, I'm having trouble processing your request. Please try again later.",
        sender: 'bot',
        type: 'text',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        loading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};


