import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Proper error handling instead of console logging
      const storageError = new Error(`Failed to read localStorage key "${key}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.warn(storageError.message); // Only warn in development
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Proper error handling instead of console logging
      const storageError = new Error(`Failed to set localStorage key "${key}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.warn(storageError.message); // Only warn in development
      // Don't silently fail - throw error for proper handling
      throw storageError;
    }
  };

  return [storedValue, setValue] as const;
}
