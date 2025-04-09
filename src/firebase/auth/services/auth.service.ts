import axios, { AxiosResponse } from "axios";

interface loginRes {
	token: string;
}

export class AuthService {
	static async getAdminToken(email: string, password: string) {
		const res = await axios.post<{ email: string; password: string }, AxiosResponse<loginRes>>(
			"http://localhost:3000/api/admin_login",
			{
				email,
				password,
			},
		);
		return res.data.token;
	}
}
