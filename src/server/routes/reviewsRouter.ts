import {
    AppSettingsResponseType,
    Empty, ErrorResponseType,
    IdType,
    ResponseAppType,
    ReviewSendShortType,
    ReviewsSomeSendType,
    SortQueryParamsType
} from "../../types";
import express, { Request } from "express";
import { ErrorMessage, Path, QueryAPI } from '../../enums'
import { getAppSetting, searchByTag, sortByData, sortByRating } from "../repository";
import { createReviewSendShort } from "../../utils";
import { ReviewsGetType } from "types/ReviewsGetType";

const router = express.Router();

router.get<Empty, ReviewsGetType<ReviewSendShortType[]> & AppSettingsResponseType | ErrorResponseType, IdType, Empty>(`${Path.Root}`, async (req: Request<Empty, Empty, IdType, SortQueryParamsType>, res) => {
        try {
            const { query } = req
            let reviewsSortDataBase = [];
            let reviewsSortRatingBase = [];
            let reviewsTagBase = [];
            if (query[QueryAPI.Data]) {
                reviewsSortDataBase = await sortByData({
                    count: query[QueryAPI.Count],
                    sort: query[QueryAPI.Data]
                })
            }

            if (query[QueryAPI.Rating]) {
                reviewsSortRatingBase = await sortByRating({
                    count: query[QueryAPI.Count],
                    sort: query[QueryAPI.Rating]
                })
            }

            if (query[QueryAPI.Tag]) {
                reviewsTagBase = await searchByTag(query[QueryAPI.Tag])
            }

            const reviewsSortData = reviewsSortDataBase.map(review => createReviewSendShort(review))
            const reviewsSortRating = reviewsSortRatingBase.map(review => createReviewSendShort(review))
            const reviewsTag = reviewsTagBase.map(review => createReviewSendShort(review))
            const appSettings = await getAppSetting()

            return res.send({
                appSettings,
                reviewsSortData,
                reviewsSortRating,
                reviewsTag
            });
        } catch
            (error) {
            return res.status(401).send({ message: ErrorMessage.ServerError })
        }
    }
);

module.exports = router
