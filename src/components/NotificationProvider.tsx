import { createContext, useContext, useState, useEffect } from 'react';
  import { Notification } from '../types';

  const NotificationContext = createContext<{
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
  } | undefined>(undefined);

  export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (notification: Omit<Notification, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 11);
      const newNotification = { ...notification, id };
      
      setNotifications(prev => [...prev, newNotification]);
      
      if (newNotification.duration !== 0) {
        setTimeout(() => {
          removeNotification(id);
        }, notification.duration || 5000);
      }
    };

    const removeNotification = (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
      <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
        {children}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map(notification => (
            <div 
              key={notification.id}
              className={`notification ${notification.type} animate-fade-in-down`}
            >
              <div className="flex items-center justify-between">
                <span>{notification.message}</span>
                <button 
                  onClick={() => removeNotification(notification.id)}
                  className="ml-4 text-current hover:text-opacity-70"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </NotificationContext.Provider>
    );
  };

  export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
      throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
  };
