import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "./styles/loader.css";
import { RouterApp } from "./routes";
import { RouterProvider } from "react-router-dom";
import { RouteAuth } from "./routes/authRoute";
import { auth } from "./config/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";
import { AuthProvider } from "./context/authContext";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("IsLoged");

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (token && user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className=" justify-center items-center flex h-full">
        <div className="loader" />
      </div>
    );
  }

  return (
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={isAuthenticated ? RouterApp : RouteAuth} />
      </AuthProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
