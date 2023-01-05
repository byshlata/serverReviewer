import {
    AppSettingsResponseType,
    DataReviewType,
    Empty,
    ErrorResponseType,
    ResponseAppType
} from "types";
import express, { Request } from "express";
import { ErrorMessage, Path } from '../../enums'
import { checkAuth, } from "../../utils";
import { addTagsAppSettings, editReview, getAppSetting } from "../repository";

require("dotenv").config();

const UploadFileAmazonCloud = require('../../server/amazonCloud/uploadFileAmazonCloud')

const router = express.Router();

const singleUpload = UploadFileAmazonCloud(process.env.AWS_PUBLIC_BUCKET_ARTICLE_IMG).single('file')

router.post<Empty, AppSettingsResponseType | ErrorResponseType, Empty>(`${Path.Root}`, singleUpload, checkAuth, async (req: Request<Empty, Empty, DataReviewType & { idReview: string }, Empty> & { file: any }, res) => {
        try {
            const payload = req.body
            await addTagsAppSettings(payload.tags.split(','))
            if (req.file) {
                await singleUpload(req, res, async function (err) {
                    if (req.file?.location) {
                        payload.image = req.file.location
                        await editReview(payload)
                    } else {

                        return res.status(422).send({ message: err.message });
                    }
                });
            } else {
                await editReview(payload)
            }
            const appSettings = await getAppSetting()

            return res.status(200).send({ appSettings });
        } catch
            (error) {
            console.log(error.message)
            console.log(error)
            return res.status(401).send({ message: ErrorMessage.ServerError })
        }
    }
);

module.exports = router
