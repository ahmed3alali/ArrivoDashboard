import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

// Helper to get cookie by name
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    const exp = decoded.exp * 1000; // convert to ms
    return Date.now() > exp;
  } catch {
    return true; // invalid token
  }
}

export function Protection({ children }: { children: React.ReactElement }) {
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const checkToken = () => {
      const token = getCookie("authToken");
      if (!token || isTokenExpired(token)) {
        // Clear cookie on invalid token
        document.cookie = "authToken=; path=/; max-age=0";
        setIsValid(false);
      }
    };

    checkToken(); // check on mount

    const interval = setInterval(checkToken, 30 * 1000); // check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
