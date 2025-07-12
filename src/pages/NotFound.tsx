import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="ml-16 md:ml-64 min-h-screen bg-muted/50 py-10 px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
      </div>
    </>
  );
};

export default NotFound;
