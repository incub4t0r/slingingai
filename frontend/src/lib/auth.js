// auth.js
import { writable } from 'svelte/store';

// Check if a cookie is already set to determine initial authentication state
const initialAuthState = () => {
    if (typeof document !== 'undefined') {
        return document.cookie.includes('loggedIn=true');
    }
    return false;
};

export const isAuthenticated = writable(initialAuthState());

// Function to set isAuthenticated and create a cookie
/**
 * @param {boolean} value
 */
export function setAuthenticated(value) {
    isAuthenticated.set(value);

    if (typeof document !== 'undefined') {
        if (value) {
            const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Expires in 30 days
            document.cookie = 'loggedIn=true; expires=' + expirationDate.toUTCString() + '; path=/';
        } else {
            document.cookie = 'loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
    }
}