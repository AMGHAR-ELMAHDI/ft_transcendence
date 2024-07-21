import { useState } from "react";
import api from "../../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Props {
  image?: string;
}

function SettingsGeneralInfo({ image }: Props) {
  const [email, setEmail] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const obj = {
    id: 1,
    email: email,
    first_name: first_name,
    last_name: last_name,
    username: username,
    image: image,
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await api.put("player/setting/", obj);
      toast.success("Settings updated successfully");
      navigate('/');
    } catch (error) {
      console.log(error);
      toast.error("Bad input, change your input and try again");
    }
  };

  const handleReset = () => {
    setEmail("");
    setFirst_name("");
    setLast_name("");
    setUsername("");
  };

  return (
    <div className="GeneralInfoContainer">
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <input
          className="GeneralInfoInput"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <input
          className="GeneralInfoInput"
          name="username"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <input
          className="GeneralInfoInput"
          name="first_name"
          type="text"
          required
          value={first_name}
          onChange={(e) => setFirst_name(e.target.value)}
          placeholder="First Name"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <input
          className="GeneralInfoInput"
          name="last_name"
          type="text"
          required
          value={last_name}
          onChange={(e) => setLast_name(e.target.value)}
          placeholder="last name"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        <div className="ButtonContainer">
          <button className="SetButton" type="reset">
            Cancel
          </button>
          <button className="SetButton SetSubmit" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default SettingsGeneralInfo;
