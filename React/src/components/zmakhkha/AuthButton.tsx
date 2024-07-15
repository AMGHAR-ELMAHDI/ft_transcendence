import axios from "axios";

const AuthButton = () => {
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://localhost:2500/auth/42/login/"
      );

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
