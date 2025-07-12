import { useNavigate } from "react-router-dom";

export function useSignOut() {
  const navigate = useNavigate();

  function signOut() {
    // Clear token(s)
    localStorage.removeItem("authToken");
    // You can clear other stored data if any, e.g. refreshToken, user info
// Assuming you have access to Apollo Client instance 'client'


    // Redirect to login page
    navigate("/login", { replace: true });
  }

  return signOut;
}
