import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Register = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await api.register(formData);
        navigate("/login");
      } catch (error) {
        setErrors({ submit: error.message || "Registration failed" });
      }
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
                <h3 className="text-center text-uppercase">Register</h3>
                {errors.submit && (
                  <div className="alert alert-danger">{errors.submit}</div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      value={formData.username}
                      onChange={handleChange}
                    />
                    {errors.username && (
                      <div className="invalid-feedback d-block">
                        {errors.username}
                      </div>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    {errors.password && (
                      <div className="invalid-feedback d-block">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary text-uppercase"
                    >
                      Register
                    </button>
                  </div>
                  <div className="text-center mt-3">
                    Already have an account?{" "}
                    <a href="/login" className="text-primary">
                      Login here
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

export default Register;
