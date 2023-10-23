import { useState, useEffect } from "react";

// custom hook
export function useLocalStorageState(initialState, key) {
    const [value, setValue] = useState(function() {
        // get the values from localStorage with the saved key name
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialState;
    });

    useEffect(function() {
        // localStorage (key->value pairs available on the browser)
        localStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    return [value, setValue];
}