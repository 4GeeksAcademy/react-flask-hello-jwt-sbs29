import React, { useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Signup } from "./pages/signup";
import { Private } from "./pages/private";

import injectContext, { Context } from "./store/appContext";

import { Footer } from "./component/footer";
import { Navbar } from "./component/navbar";

//create your first component
const Layout = () => {
    const { actions } = useContext(Context);


    useEffect(() => {
        actions.checkAuthentication();
    }, []);

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") {
        return <BackendURL />;
    }

    const basename = process.env.BASENAME || "";

    return (
        <BrowserRouter basename={basename}>
            <Content />
        </BrowserRouter>
    );
};

const Content = () => {
    const location = useLocation();
    const hideNavbarAndFooter = ["/*"];
    const shouldHideNavbarAndFooter = hideNavbarAndFooter.includes(location.pathname);

    return (
        <>
            {!shouldHideNavbarAndFooter && <Navbar />}
            <ScrollToTop>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/private" element={<Private />} />
                </Routes>
            </ScrollToTop>
            {!shouldHideNavbarAndFooter && <Footer />}
        </>
    );

};

export default injectContext(Layout);