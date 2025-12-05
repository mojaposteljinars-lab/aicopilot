"use client";

import { useState, useEffect, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  
  // Store initialValue in a ref to avoid dependency cycles if it's an unstable reference (object/array)
  const initialValueRef = useRef(initialValue);
  
  // Update ref whenever initialValue changes
  useEffect(() => {
    initialValueRef.current = initialValue;
  }, [initialValue]);

  // useEffect only runs on the client, so we can safely access localStorage here.
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
         // If key changes and no value in storage, reset to initialValue
         setStoredValue(initialValueRef.current);
      }
    } catch (error) {
      console.log(error);
      setStoredValue(initialValueRef.current);
    }
  }, [key]);


  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
