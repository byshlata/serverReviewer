import { StatusType, RightsType } from "types";

export type AdminTableType = {
    idUser: string;
    login: string;
    rating: number;
    status: StatusType,
    rights: RightsType,
};
