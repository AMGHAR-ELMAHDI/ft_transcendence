import { useRef } from "react";
import api from "../../api";

function TestSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  let obj = {
    id: "1",
    email: "dawdaw@gmail.com",
    first_name: "dawdaw",
    last_name: "zdawdaw",
    username: "dawdawZ",
    image: null,
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("id", obj.id);
      formData.append("email", obj.email);
      formData.append("first_name", obj.first_name);
      formData.append("last_name", obj.last_name);
      formData.append("username", obj.username);

      if (fileInputRef.current?.files?.[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }

      const response = await api.put("player/setting/", formData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="BOX-DIV">
      <input id="BOX" type="file" ref={fileInputRef} />
      <button id="BOX-BUTTON" type="submit" onClick={handleSubmit}>
        SUBMIT
      </button>
    </div>
  );
}

export default TestSettings;
