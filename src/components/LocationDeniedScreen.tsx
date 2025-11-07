import { motion } from 'motion/react';
import { MapPin, X, AlertTriangle, Info } from 'lucide-react';
import { Button } from './ui/button';
import logo from 'figma:asset/140c39be02623ac8ea55ecdd5766cc44703fdb24.png';

interface LocationDeniedScreenProps {
  onRetry: () => void;
  onContinueWithout?: () => void;
}

export default function LocationDeniedScreen({ onRetry, onContinueWithout }: LocationDeniedScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Illustration Section */}
        <div className="relative h-48 mb-8 flex items-center justify-center">
          {/* Background Circle with Pulse Animation */}
          <motion.div
            className="absolute w-32 h-32 rounded-full bg-green-100 opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Map Pin Icon */}
          <motion.div
            className="relative"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="relative">
              {/* Location Pin */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <MapPin className="w-12 h-12 text-white" strokeWidth={2} />
              </div>
              
              {/* Cross Icon Overlay */}
              <motion.div
                className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg border-4 border-white"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
              >
                <X className="w-6 h-6 text-white" strokeWidth={3} />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Message Section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Headline */}
          <h1 className="text-gray-900 mb-3">
            We can't find shops without your location.
          </h1>
          
          {/* Subtext */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Location access denied. Please enable location permissions in your browser settings to discover nearby vendors.
          </p>
          
          {/* Tip Box */}
          <motion.div
            className="bg-gradient-to-r from-green-50 to-orange-50 border border-green-200 rounded-xl p-4 text-left"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Info className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">💡 Tip:</span> Check your browser settings to enable location permissions for this site. Look for the lock icon 🔒 in your address bar.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Action Section */}
        <motion.div
          className="space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {/* Retry Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onRetry}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-6 rounded-xl shadow-lg relative overflow-hidden group"
            >
              {/* Pulse effect on hover */}
              <motion.div
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="relative flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5" />
                Retry Location Access
              </span>
            </Button>
          </motion.div>

          {/* Continue Without Location Link */}
          {onContinueWithout && (
            <button
              onClick={onContinueWithout}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
            >
              Continue browsing without location
            </button>
          )}
        </motion.div>

        {/* Additional Help Section */}
        <motion.div
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            How to enable location access:
          </h3>
          <ul className="space-y-2 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">1.</span>
              <span>Click the lock icon 🔒 next to the website address</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">2.</span>
              <span>Find "Location" in the permissions list</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">3.</span>
              <span>Change it from "Block" to "Allow"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">4.</span>
              <span>Refresh the page and try again</span>
            </li>
          </ul>
        </motion.div>

        {/* Branding Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <img 
            src={logo} 
            alt="GharTak" 
            className="h-12 w-auto mx-auto mb-3 opacity-80"
          />
          <p className="text-xs text-gray-500 italic">
            From your local market… to your doorstep — <span className="text-green-600 font-semibold">GharTak</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
