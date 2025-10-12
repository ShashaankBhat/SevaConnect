// Simple test component to verify app loads
import React from "react";

export function TestPage() {
  return (
    <div style={{ padding: '20px', background: 'green', color: 'white' }}>
      <h1>✅ React is working!</h1>
      <p>If you can see this, your React app is loading correctly.</p>
      <p>The issue is with page exports or routing.</p>
    </div>
  );
}
