import { AppSettingsServerType, } from "types";
import {
    changeNameTags,
    changeNewTagsByEdit,
    createCategory,
    throwError
} from "../../utils"
import { AppSettings, Review } from "../../models";
import { AppSettingsEnum } from "../../enums";

export const getAppSetting = async (): Promise<AppSettingsServerType> => {
    try {
        const appSettings = await AppSettings.findOne({ name: AppSettingsEnum.AppSettings });
        if (appSettings) {

            return await appSettings
        } else {
            const startAppSettings = new AppSettings();

            return await startAppSettings.save()
        }
    } catch (error) {
        throwError()
    }
}

export const addCategoryAppSettings = async (category: string): Promise<AppSettingsServerType> => {
    try {
        const appSettings = await AppSettings.findOne({ name: AppSettingsEnum.AppSettings });
        const categoryByType = createCategory(category)
        appSettings.category = Array.from(new Set([...appSettings.category, categoryByType]))

        return await appSettings.save()
    } catch (error) {
        throwError()
    }
}

export const addTagsAppSettings = async (tags: string[]): Promise<AppSettingsServerType> => {
    try {
        const tagsForBase = changeNameTags(tags)
        const appSettings = await AppSettings.findOne({ name: AppSettingsEnum.AppSettings });
        appSettings.tags = [...appSettings.tags, ...tagsForBase]

        return await appSettings.save()
    } catch (error) {
        throwError()
    }
}

export const addTagsAppSettingsEdit = async (tags: string[], idReview): Promise<AppSettingsServerType> => {
    try {
        const tagsForBase = changeNameTags(tags)
        const appSettings = await AppSettings.findOne({ name: AppSettingsEnum.AppSettings });
        const reviewBase = await Review.findById({ _id: idReview });
        appSettings.tags = [...tagsForBase, ...changeNewTagsByEdit(appSettings.tags, reviewBase.tags)]

        return await appSettings.save()
    } catch (error) {
        throwError()
    }
}

export const addAppSettings = async (category: string, tags: string[]): Promise<AppSettingsServerType> => {
    try {
        await addCategoryAppSettings(category)
        await addTagsAppSettings(tags)

        return await getAppSetting()
    } catch (error) {
        throwError()
    }
}

