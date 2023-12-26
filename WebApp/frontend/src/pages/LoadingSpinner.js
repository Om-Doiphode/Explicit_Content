import React from "react";
import "./spinner.css";

// LoadingSpinner component definition
export default function LoadingSpinner() {
  return (
    // Container for the loading spinner with a specific class
    <div className="spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
}