import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from '../store/appContext.js';

export const Navbar = () => {
	
	const {store, actions} = useContext(Context);
	const navigate = useNavigate();

	useEffect(() => {
		actions.checkAuthentication();
	  }, [store.token]);
	
	  const handleLogout = async () => {
		const success = await actions.logout();
		if (success) {
		  navigate("/");
		}
	  };
	
	  const handleLogoClick = () => {
		if (store.isAuthenticated) {
		  navigate("/private");  // Redirige a HomeUser si está autenticado
		} else {
		  navigate("/");  // Redirige a la página de login si no está autenticado
		}
	  };



	return (
		<nav className="navbar navbar-light bg-dark">
			<div className="container">
				<div onClick={handleLogoClick} className="navbar-brand d-flex align-items-center me-auto" style={{ cursor: "pointer", width: "300px" }}>
					<span className="text-white">Authentication JWT</span>
				</div>
				{store.token == null ? 
					<div className="ml-auto">
						<Link to="/login">
							<button className="btn btn-primary">Login</button>
						</Link>
						<Link to="/signup">
							<button className="btn btn-primary">Sign Up</button>
						</Link>
					</div>
				:
					<div className="ml-auto">
						<button onClick={handleLogout} className="btn btn-primary">Logout</button>
					</div>
				}
			</div>
		</nav>
	);
};
