import { LoginType } from "types";

export type RegistrationType = LoginType & {
    login: string,
    avatar?: string
}
