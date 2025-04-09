import React, { useEffect, useState } from "react";
import { AuthContext, AuthStatus } from "./AuthContext";
import { AuthService } from "../services/auth.service";

import {
	User,
	UserCredential,
	getAuth,
	getIdToken,
	getIdTokenResult,
	onAuthStateChanged,
	signInWithCustomToken,
	signInWithEmailAndPassword,
	signOut,
	createUserWithEmailAndPassword,
} from "firebase/auth";

import useToggle from "@/hooks/useToggle";
import { FirebaseClientApp } from "@/firebase.config";
import { useCategories } from "@/contexts/ReUsableData";

function FirebaseAuthProvider({ children }: React.PropsWithChildren) {
	const [idToken, setIdToken] = useState<string>();
	const { userInfo } = useCategories();
	const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.LOADING);
	const [user, setUser] = useState<User>();
	const toog = useToggle();
	//
	//

	async function authenticate(email: string, password: string) {
		try {
			const auth = getAuth(FirebaseClientApp);
			await createUserWithEmailAndPassword(auth, email, password);
			console.log("created FIREBASE acc");
		} catch (error) {
			console.log(error);
			await login(email, password);
			console.log("login to FIREBASE");
		}
	}

	async function login(email: string, password: string) {
		toog.open();

		try {
			const auth = getAuth(FirebaseClientApp);
			const userCred = await signInWithEmailAndPassword(auth, email, password);
			// ! TODO check for custom claims
			setUser(userCred.user);
			const claims = await userCred.user.getIdTokenResult();

			setAuthStatus(AuthStatus.AUTHENTICATED);
		} catch (error) {
			toog.close();
			console.log("failed to login");
		}
	}
	const logOut = async () => {
		const auth = getAuth(FirebaseClientApp);
		await signOut(auth);
	};
	const getIdToken = async () => {
		const token = await getAuth(FirebaseClientApp).currentUser?.getIdToken();
		if (token) {
			setIdToken(token);
		}
	};
	useEffect(() => {
		const auth = getAuth(FirebaseClientApp);
		const unsubScribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setAuthStatus(AuthStatus.AUTHENTICATED);
				setUser(user);
			} else {
				setAuthStatus(AuthStatus.UNAUTHENTICATED);
			}
		});

		return unsubScribe;
	}, []);

	useEffect(() => {
		if (userInfo) {
			authenticate(userInfo.email, userInfo.email);
		}
	}, [userInfo]);

	useEffect(() => {
		if (authStatus === AuthStatus.AUTHENTICATED) {
			getIdToken();
		}
		if (authStatus === AuthStatus.UNAUTHENTICATED) {
			// addToast({
			// 	text: "logged out...",
			// 	type: toastType.error,
			// });
		}
	}, [authStatus]);
	return (
		<AuthContext.Provider
			value={{
				login,
				user,
				authStatus,
				logOut,
				getIdToken,
				idToken,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export default FirebaseAuthProvider;
