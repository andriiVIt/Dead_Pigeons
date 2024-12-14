import React, {FC} from 'react';
import {Link} from "react-router-dom";
import {useAuth} from "/src/atoms/auth.ts";

const NavBarPlayer: FC = () => {
    const { logout } = useAuth(); // Get the logout function from your atom
    return (
        <div className="navbar bg-base-100 w-full">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-black lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-black"
                    >

                        <li>
                            <Link to="/games" className="hover:text-blue-500 transition-colors">
                                Games
                            </Link>
                        </li>
                        <li>
                            <Link to="/transactions" className="hover:text-blue-500 transition-colors">
                                Transactions
                            </Link>
                        </li>
                        <li>
                            <Link to="/boards" className="hover:text-blue-500 transition-colors">
                                Boards
                            </Link>
                        </li>
                        {/*<li>*/}
                        {/*    <Link to=" /history" className="hover:text-blue-500 transition-colors">*/}
                        {/*        History*/}
                        {/*    </Link>*/}
                        {/*</li>*/}
                    </ul>
                </div>
                <Link to="/player" className="btn btn-black text-xl">
                    Dead Pigeons Lottery!
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul
                    className="menu menu-horizontal px-1 text-black"
                    style={{gap: "250px"}}
                >
                    <li>
                        <Link to="/games" className="text-lg font-medium hover:text-blue-500 transition-colors">
                            Games
                        </Link>
                    </li>
                    <li>
                        <Link to="/transactions"
                              className="text-lg font-medium hover:text-blue-500 transition-colors">
                            Transactions
                        </Link>
                    </li>
                    <li>
                        <Link to="/boards" className="text-lg font-medium hover:text-blue-500 transition-colors">
                            Boards
                        </Link>
                    </li>
                    {/*<li>*/}
                    {/*    <Link to="/history" className="text-lg font-medium hover:text-blue-500 transition-colors">*/}
                    {/*        History*/}
                    {/*    </Link>*/}
                    {/*</li>*/}
                </ul>
            </div>
            <div className="navbar-end">
                <button
                    className="btn"
                    onClick={logout}
                >
                    Log out
                </button>
            </div>
        </div>
    );
};

export default NavBarPlayer;