import { useState } from "react";
import api from "../../api";

interface Props {
  image?: string;
}

function SettingsGeneralInfo({ image }: Props) {
  const [data, setData] = useState<any>([]);

  const [email, setEmail] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [username, setUsername] = useState("");

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
      const response = await api.put("player/me/", obj);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="GeneralInfoContainer">
      <form onSubmit={handleSubmit}>
        <input
          className="GeneralInfoInput"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="GeneralInfoInput"
          name="username"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className="GeneralInfoInput"
          name="first_name"
          type="text"
          required
          value={first_name}
          onChange={(e) => setFirst_name(e.target.value)}
          placeholder="First Name"
        />
        <input
          className="GeneralInfoInput"
          name="last_name"
          type="text"
          required
          value={last_name}
          onChange={(e) => setLast_name(e.target.value)}
          placeholder="last name"
        />

        <div className="ButtonContainer">
          <button className="SetButton SetCancel" type="reset">
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
