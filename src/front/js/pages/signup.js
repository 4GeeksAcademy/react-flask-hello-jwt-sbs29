import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const { store, actions } = useContext(Context);

    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const navigate = useNavigate();

    const handleCancelButton = () => {
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }
        const success = await actions.signup( first_name, last_name, email, password );

        if (success) {
            navigate("/login");
        }
    };

    return (
        <div className="card d-flex justify-content-center my-5 p-5 mx-auto" style={{ maxWidth: '600px', width: '100%' }}>
            <h3>Register</h3>
            <hr />
            <form onSubmit={handleSubmit}>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="registerFirstName">First Name</label>
                    <input
                        onChange={(e) => setFirstName(e.target.value)}
                        type="text"
                        id="registerFirstName"
                        className="form-control"
                        required
                    />
                </div>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="registerLastName">Last Name</label>
                    <input
                        onChange={(e) => setLastName(e.target.value)}
                        type="text"
                        id="registerLastName"
                        className="form-control"
                        required
                    />
                </div>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="registerEmail">Email</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        id="registerEmail"
                        className="form-control"
                        required
                    />
                </div>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="registerPassword">Password</label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        id="registerPassword"
                        className="form-control"
                        required
                    />
                </div>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="registerRepeatPassword">Repeat Password</label>
                    <input
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        id="registerRepeatPassword"
                        className="form-control"
                        required
                    />
                </div>

                <div className="d-grid gap-2 col-6 mx-auto">
                    <button type="submit" className="btn btn-success btn-block mb-3">
                        {store.loading ? "Signing up..." : "Sign up"}
                    </button>
                    <button type="submit" className="btn btn-outline-danger" onClick={handleCancelButton}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};