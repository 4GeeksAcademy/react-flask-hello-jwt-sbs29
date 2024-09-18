const apiUrl = process.env.BACKEND_URL + "/api"
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			token: null,
			userInfo: null,
			isAuthenticated: false,
			errorMessage: null,
			loading: false,
			dataUserDb: null,
		},
		actions: {
			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			loadSession: async () => {
				let storageToken = localStorage.getItem("token")
				if (!storageToken) return
				setStore({token:storageToken})
				let resp = await fetch(apiUrl+"/userinfo",{
					headers:{"Authorization":"Bearer " + storageToken}
				})
				if(!resp.ok) {
					setStore({token:null})
					return false
				}
				let data = await resp.json()
				setStore({ userInfo: data})
			},
			login: async (email, password) => {
				setStore({ loading: true });
				try {
					const response = await fetch(apiUrl + "/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email, password })
					});
					if (response.ok) {
						const data = await response.json();
						if (data.token && data.user) {
							setStore({
								token: data.token,
								isAuthenticated: true,
								userInfo: data.user,
								loading: false,
								errorMessage: null
							});
							sessionStorage.setItem("token", data.token);
							sessionStorage.setItem("userInfo", JSON.stringify(data.user));
							return true;
						} else {
							setStore({
								errorMessage: "Login successful but user data is missing.",
								loading: false,
								isAuthenticated: false,
							});
							return false;
						}
					} else {
						const errorData = await response.json();
						setStore({
							errorMessage: errorData.msg || "Login failed",
							loading: false,
							isAuthenticated: false,
						});
						return false;
					}
				} catch (error) {
					console.error("There was an error logging in:", error);
					setStore({
						errorMessage: "An error occurred during login.",
						loading: false,
						isAuthenticated: false,
					});
					return false;
				}
			},
			signup: async (first_name, last_name, email, password) => {
				setStore({ loading: true });
				try {
					const response = await fetch(apiUrl + "/signup", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ first_name, last_name, email, password })
					});
					if (response.ok) {
						const data = await response.json();
						setStore({
							token: data.token,
							isAuthenticated: true,
							loading: false,
							errorMessage: null
						});
						if (data.token) {
							localStorage.setItem("token", data.token);
						}
						return true;
					} else {
						const errorData = await response.json();
						setStore({
							errorMessage: errorData.msg || "Signup failed",
							loading: false
						});
						return false;
					}
				} catch (error) {
					console.error("There was an error signing up:", error);
					setStore({
						errorMessage: "An error occurred during signup.",
						loading: false
					});
					return false;
				}
			},
			logout: async () => {
				let {token} = getStore()
				let resp = await fetch(apiUrl+"/logout",{
					method:"POST", 
					headers:{"Authorization":"Bearer " + token}
				})
				if(!resp.ok) return false
				setStore({token:null, userInfo: null})
				sessionStorage.removeItem("token")
				return true
			},
			getUserInfo: async () => {
				const store = getStore()
				try {
					const response = await fetch(`${apiUrl}/user`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${store.token}`,
							'Content-Type': 'application/json'
						}
					})
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.error || 'Error al obtener los datos del usuario');
					}
					const data = await response.json();
					setStore({ dataUserDb: data.user });
					return data;
				} catch (error) {
					console.error("Error fetching single usuario:", error);
					setStore({ errorMessage: error.message || "Error en el fetching al obtener los datos del usuario" });
				}
			},
			checkAuthentication: () => {
				const token = sessionStorage.getItem("token");
				const userInfo = sessionStorage.getItem("userInfo");

				if (token && userInfo) {
					setStore({
						token: token,
						userInfo: JSON.parse(userInfo),  // Carga la información del usuario desde el localStorage
						isAuthenticated: true,
					});
				} else {
					setStore({
						isAuthenticated: false,
					});
				}
			},
		}
	};
};

export default getState;
