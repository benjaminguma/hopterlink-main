import * as yup from "yup";

export const AuthSchema = yup.object().shape({
	email: yup.string().email().required(),
	password: yup.string().required().min(6),
});
