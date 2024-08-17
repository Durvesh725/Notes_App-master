import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";
import logo from "../assets/logo_white.png";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert("Invalid credentials...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <header className="header">
        <h2>Welcome to </h2>
        <img src={logo} alt="Organized Logo" className="logo2" />
      </header>
      <form onSubmit={handleSubmit} className="form-container">
        <h2>{method === "login" ? "Login" : "Register"}</h2>
        <input
          className="form-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {loading && <LoadingIndicator />}
        <button className="form-button" type="submit">
          {method === "login" ? "Login" : "Register"}
        </button>
        <p className="toggle-form">
          {method === "login" ? (
            <span>
              New user?{" "}
              <button type="button" onClick={() => navigate("/register")}>
                Register here
              </button>
            </span>
          ) : (
            <span>
              Already a user?{" "}
              <button type="button" onClick={() => navigate("/login")}>
                Login here
              </button>
            </span>
          )}
        </p>
      </form>
    </div>
  );
}

export default Form;
