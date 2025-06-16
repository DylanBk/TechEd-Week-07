const isLoggedIn = async (): Promise<boolean> => {
    try {
        const req = await fetch('/api/user/get', {
            method: 'POST'
        });
        const res = await req.json();

        return res.ok;
    } catch (e) {
        console.error("Error checking login status:", e);

        return false;
    };
};

export default isLoggedIn;