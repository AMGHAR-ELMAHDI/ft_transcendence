import React, { useEffect, useState } from "react";
import api from "../../api";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";

function GetSecurity() {
  const [data, setData] = useState<any>();

  const getData = async () => {
    try {
      const response = await api.get("setup-2fa/");
      setData(response.data?.secret);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  console.log(data);

  return (
    <>
       {data &&  <QRCode value={data} />}
      <h1>Security</h1>
    </>
  );
}

export default GetSecurity;
