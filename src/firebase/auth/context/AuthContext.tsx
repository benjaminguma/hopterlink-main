import { UserInfo } from "firebase-admin/lib/auth/user-record";
import { User, UserCredential } from "firebase/auth";
import { createContext, useContext } from "react";

export enum AuthStatus {
	AUTHENTICATED = "AUTHENTICATED",
	UNAUTHENTICATED = "UNAUTHENTICATED",
	LOADING = "LOADING",
}

export const AuthContext = createContext<{
	login: (email: string, password: string) => Promise<void>;
	user?: User;
	logOut: () => Promise<void>;
	authStatus: AuthStatus;
	getIdToken: () => Promise<void>;
	idToken: string | undefined;
}>({
	async login(email, password) {},
	authStatus: AuthStatus.LOADING,
	async logOut() {},
	async getIdToken() {},
	idToken: "",
});

export const useAuth = () => useContext(AuthContext);
