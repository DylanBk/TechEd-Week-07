import { useEffect, useState } from "react";
import Header from "../../layout/Header";

import checkLoggedIn from "../../../utils/checkLoggedIn";
import { useNavigate } from "react-router-dom";

const Settings = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const nav = useNavigate();

    useEffect(() => {
    document.title = 'Echo | Settings';

        const authCheck = async () => {
            if (await checkLoggedIn()) {
                setIsLoggedIn(true);
            } else {
                nav('/login');
            };
        };

        authCheck();
    }, [nav]);

    return (
        <>
            <Header
                page="settings"
                isLoggedIn={isLoggedIn}
            />
        </>
    );
};

export default Settings;