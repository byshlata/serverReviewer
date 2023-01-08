import { AppSettingsSendType } from "types";

export type AppSettingsServerType = AppSettingsSendType & {
    _id: string;
    name: 'appSettings'
    createdAt: string;
    updatedAt: string;
    __v: number;
};
