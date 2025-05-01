import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PackageCardProps {
  title: string;
  description: string;
  price: number;
  destination?: string;
  onAddToCart: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({
  title,
  description,
  price,
  destination,
  onAddToCart,
}) => {
  const { isLoggedIn, redirectToLogin } = useAuth();

  const handleClick = () => {
    if (!isLoggedIn) {
      redirectToLogin();
    } else {
      onAddToCart();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
    >
      <div className="p-6">
        {destination && (
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin size={16} className="mr-1" />
            <span>{destination}</span>
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <div className="text-blue-600 text-lg font-semibold">
            From ₹ {price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <button
            onClick={handleClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            {isLoggedIn ? 'Book Now' : 'Login to Book'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard;
