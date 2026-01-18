import { useState, useEffect } from 'react';
import './Toast.css';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'success', duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '🎉';
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      default: return '✓';
    }
  };

  return (
    <div className={`toast toast-${type} ${isVisible ? 'visible' : 'hidden'}`}>
      <span className="toast-icon">{getIcon()}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={() => { setIsVisible(false); onClose(); }}>×</button>
    </div>
  );
}

export default Toast;
