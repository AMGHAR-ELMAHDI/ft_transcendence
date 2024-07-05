import { useState } from "react";
import api from "../../api";
import toast from "react-hot-toast";
import AuthCode from "react-auth-code-input";

function Verify2FA() {
  const [result, setResult] = useState("");

  const handleOnChange = (res: string) => {
    setResult(res);
  };

  const obj = {
    code: result,
  };

  const SetupTwoFa = async () => {
    try {
      console.log(result);
      
      const response = await api.post("verify-2fa/", obj);
      console.log("response login: " + response);
      toast.success("2FA has been enabled");
    } catch (error) {
      toast.error("2FA Code is incorrect");
      console.log(error);
    }
  };
  const show2FA: boolean = result.length === 6 ? true : false;

  return (
    <div className="AppClass">
      <div className="main">
        <div className="login">
          <AuthCode
            onChange={handleOnChange}
            allowedCharacters="numeric"
            containerClassName={"twofaInput"}
          />
          {show2FA && (
            <button className="twofaButton" onClick={SetupTwoFa}>
              Verify 2FA Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Verify2FA;
