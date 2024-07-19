import api from "../../api";

const AuthButton = () => {
  const handleLogin = async () => {
    try {
      const response = await api.post("auth/42/login/");

      // Redirect user to the OAuth provider (42) login page
      window.location.href = response.data.authorization_url;
    } catch (error) {
      console.error("Error initiating authentication:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with 42</button>
    </div>
  );
};

export default AuthButton;
