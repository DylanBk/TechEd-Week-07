import { useState } from "react";

import Header from "../../layout/Header";
import Signup from "../../layout/Signup";
import Login from "../../layout/Login";
import './Auth.css';
import { useEffect } from "react";

const Auth = () => {
    const [isLogin, setIsLogin] = useState<boolean>(false);

    useEffect(() => {
        if (window.location.href.includes('login')) {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        };
    });

    return (
        <>
            <Header
                page="auth"
                isLoggedIn={false}
            />

            <main>
                {isLogin ? (
                    <Login />
                ) : (
                    <Signup />
                )}
            </main>
        </>
    );
};

export default Auth;