import { useNavigate } from "react-router-dom";
import { atom, useAtom } from "jotai";
import { AuthUserInfo } from "../Api.ts";
import { http } from "../http";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

// Storage key for JWT
export const TOKEN_KEY = "token";
export const tokenStorage = createJSONStorage<string | null>(
    () => sessionStorage,
);

const jwtAtom = atomWithStorage<string | null>(TOKEN_KEY, null, tokenStorage);

const userInfoAtom = atom(async (get) => {
    // Create a dependency on 'token' atom
    const token = get(jwtAtom);
    if (!token) return null;
    // Fetch user-info
    const response = await http.authUserinfoList();
    return response.data;
});

export type Credentials = { email: string; password: string };

type AuthHook = {
    user: AuthUserInfo | null;
    login: (credentials: Credentials) => Promise<void>;
    logout: () => void;
};

export const useAuth = () => {
    const [_, setJwt] = useAtom(jwtAtom);
    const [user] = useAtom(userInfoAtom);
    const navigate = useNavigate();

    const login = async (credentials: Credentials) => {
        const response = await http.authLoginCreate(credentials);
        const data = response.data;
        setJwt(data.jwt!);

        const userInfoResponse = await http.authUserinfoList();
        const userInfo = userInfoResponse.data;

        if (userInfo.isAdmin) {
            navigate("/admin");
        } else {
            navigate("/player");
        }
    };

    const logout = async () => {
        setJwt(null);
        navigate("/");
    };

    return {
        user,
        login,
        logout,
    } as AuthHook;
};