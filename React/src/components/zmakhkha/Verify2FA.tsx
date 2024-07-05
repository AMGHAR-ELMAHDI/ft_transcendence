// import React, { useState } from "react";
// import { useRecoilState } from "recoil";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import AcessToken from "../../Atoms/AccessToken";
// import { setAuthToken } from "../Utils/setAuthToken";

// function Verify2FA() {
//   const [code, setCode] = useState("");
//   const [error, setError] = useState("");
//   const [tokenValue, setTokenValue] = useRecoilState(AcessToken);
//   const navigate = useNavigate();

//   const handleVerifyCode = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(url + "verify-2fa/", { code });
//       const { data } = response;
//       if (response.status === 200) {
//         handleLoginSuccess(data);
//       }
//     } catch (error) {
//       console.log(error);
//       setError("Invalid code");
//     }
//   };

//   const handleLoginSuccess = (data) => {
//     setTokenValue(data.access);
//     setAuthToken();
//     localStorage.setItem("token", data.access);
//     navigate("/");
//   };

//   return (
//     <div className="content">
//       <div className="verify-2fa">
//         <h1>Enter 2FA Code</h1>
//         <form onSubmit={handleVerifyCode}>
//           <input
//             type="text"
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             placeholder="Enter your 2FA code"
//             required
//           />
//           <button type="submit">Verify Code</button>
//           {error && <div className="statusError">{error}</div>}
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Verify2FA;
