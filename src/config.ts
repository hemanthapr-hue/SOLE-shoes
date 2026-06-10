/**
 * Google Apps Script Web App Endpoint Settings
 * 
 * Replace 'YOUR_GOOGLE_APPS_SCRIPT_URL' with the Web App URL generated 
 * when you deploy your Code.gs script as a 'Web App' in Google Apps Script.
 * 
 * Example:
 * const API_URL = "https://script.google.com/macros/s/AKfycbz..._mXp/exec";
 */
export const API_URL: string = "YOUR_GOOGLE_APPS_SCRIPT_URL";

// Derived state helper to determine if the application is running in fully-functional Demo Mode
export function isUsingDemo() {
  return !API_URL || API_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL" || API_URL.trim() === "";
}
