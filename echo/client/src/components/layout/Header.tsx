import { Link } from "react-router-dom";
import { /*House,*/ Settings } from "lucide-react";


type Props = {
    page: string,
    isLoggedIn: boolean
};

const Header = (props: Props) => {
    return (
        <header className="h-20 w-full fixed inset-0 z-10 flex flex-row items-center justify-between p-4 border-b border-border bg-background">
            <h1 className="text-4xl sm:text-5xl">
                <Link to='/'>Echo</Link>
            </h1>

            <nav className="flex flex-row items-center gap-8">
                {/* <Link
                    to='/'
                    aria-label="Home page">
                    <House
                        className="icon"
                        size={24}
                    />
                </Link> */}

                { props.isLoggedIn ? (
                    props.page !== 'settings' && (
                        <Link
                            className="hover:rotate-180 duration-500"
                            to='/settings'
                            aria-label="Settings page">
                            <Settings
                                className="icon"
                                size={32}
                            />
                        </Link>
                    )
                ) : props.page !== 'auth' && (
                    <Link to='/login'>
                        <button className="primary">Login</button>
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;