import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Login = () => {
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.login(credentials);
      navigate("/");
    } catch (err) {
      setError(err.error || "Login failed");
    }
  };

  return (
    <div className="bg-primary w-100 vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <div className="text-center mb-4">
                  <img
                    src="/logo.jpg"
                    alt="logo"
                    width="100"
                    className="rounded-4"
                  />
                </div>
                <h3 className="text-center text-uppercase">Login</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={credentials.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary text-uppercase"
                    >
                      Login
                    </button>
                  </div>
                  <div className="text-center mt-3">
                    Don't have an account?{" "}
                    <a href="/register" className="text-primary">
                      Register here
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
