import { useNavigate } from "react-router-dom";
import { useApiMutation } from "../../hooks/useApi";

// Custom hook for login
export const useLogin = () => {
  const navigate = useNavigate();
  return useApiMutation<{ token: string }>("user/login", {
    onSuccess: (data) => {
      // You can save the token or perform other actions here
      localStorage.setItem("authToken", data.token);
      navigate("/home");
    },
  });
};
