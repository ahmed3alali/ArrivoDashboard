import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

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
    const token = localStorage.getItem("authToken");

    const checkToken = () => {
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("authToken");
        setIsValid(false);
      }
    };

    checkToken(); // check on mount

    const interval = setInterval(checkToken, 30 * 1000); // every 30s

    return () => clearInterval(interval);
  }, []);

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
