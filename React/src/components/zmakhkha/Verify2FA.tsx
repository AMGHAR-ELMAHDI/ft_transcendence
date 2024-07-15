import { useState } from "react";
import toast from "react-hot-toast";
import AuthCode from "react-auth-code-input";
import axios from "axios";
import { useRecoilValue } from "recoil";
import Url from "../../Atoms/Url";
import { setAuthToken } from "../Utils/setAuthToken";
import { useNavigate } from "react-router-dom";

function Verify2FA() {
  const [result, setResult] = useState("");
  const url = useRecoilValue(Url);
  const navigate = useNavigate();

  const handleOnChange = (res: string) => {
    setResult(res);
  };

  const obj = {
    code: result,
  };

  const CheckTwoFa = () => {
    axios
      .post(url + "verify-2fa/", obj)
      .then((response) => {
        var str = response.data;
        if (response.status === 200) {
          toast.success("Logged in successfully");
          localStorage.setItem("token", str.access);
          setAuthToken();
          navigate("/");
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.error);
        if (error.response.data?.error == "No user in session")
          navigate("/login");
        navigate("/login");
      });
  };

  const show2FA: boolean = result.length === 6 ? true : false;

  return (
    <div className="twoFaContainer">
      <div className="twoFa">
        <h1 className="twoFaLg">Two Step Authentication</h1>
        <h1 className="twoFaSm">
          Enter the 6-digit authentication code generated by your app
        </h1>
        <AuthCode
          onChange={handleOnChange}
          allowedCharacters="numeric"
          containerClassName={"twofaInput"}
        />
        {show2FA && (
          <button className="twofaButton" onClick={CheckTwoFa}>
            Verify 2FA Code
          </button>
        )}
      </div>
      <h1 className="GoLogin2FA" onClick={() => navigate("/login")}>
        Go Back To Login
      </h1>
    </div>
  );
}

export default Verify2FA;
