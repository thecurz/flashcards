import Navbar from "@/components/navbar";
import { useState } from "react";
//TODO: validate data with server
function submitSignIn(username: string, password: string) {
  localStorage.setItem("user_name", username);
  localStorage.setItem("password", password);
}
export default function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
      <Navbar />
      <main>
        <h1>Sign-in</h1>
        <div>
          <span>username:</span>
          <input
            type="text"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div>
          <span>password:</span>
          <input
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button
          onClick={() => {
            submitSignIn(username, password);
          }}
        >
          Sign-in
        </button>
      </main>
    </>
  );
}
