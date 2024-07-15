import { useEffect, useState } from "react";
import api from "../../api";
import QRCode from "react-qr-code";
import AuthCode from "react-auth-code-input";
import toast from "react-hot-toast";

function GetSecurity() {
  const [data, setData] = useState<any>();
  const [has2FA, setHas2FA] = useState(false);
  const [result, setResult] = useState("");

  const handleOnChange = (res: string) => {
    setResult(res);
  };

  const obj = {
    code: result,
  };

  const SetupTwoFa = async () => {
    try {
      const response = await api.post("setup-2fa/", obj);
      toast.success("2FA has been enabled");
    } catch (error) {
      toast.error("2FA Code is incorrect");
      console.log(error);
    }
  };

  const getData = async () => {
    try {
      const response = await api.get("setup-2fa/");
      setHas2FA(true);
      setData(response.data?.secret);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const show2FA: boolean = result.length === 6 ? true : false;

  return (
    <>
      <div className="twofaContainer">
        <div className="twofaContainerFirst">
          <h1>Turn on 2-Step Verification</h1>
          {has2FA && data && <QRCode value={data} />}
        </div>
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
    </>
  );
}

export default GetSecurity;
