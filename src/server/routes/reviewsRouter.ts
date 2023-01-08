import {
    Empty,
    IdType,
    ResponseAppType,
    ReviewSendShortType,
    SortQueryParamsType
} from "../../types";
import express, { Request } from "express";
import { ErrorMessage, Path, QueryAPI, Secret, Status } from '../../enums'
import {
    getAppSetting,
    getUserById,
    searchByTag,
    sortByData,
    sortByRating
} from "../repository";
import {
    checkUser,
    createAppSettingsAndUserSend, createCookieOption,
    createReviewSendShort, createUserSend
} from "../../utils";
import { ReviewsGetType } from "types/ReviewsGetType";

const router = express.Router();

router.get<Empty, ResponseAppType<ReviewsGetType<ReviewSendShortType[]>>, IdType, Empty>(`${Path.Root}`, checkUser, async (req: Request<Empty, Empty, IdType, SortQueryParamsType>, res) => {
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
            const userBase = await getUserById(req.body.id)
            const appSettings = await getAppSetting()
            return userBase && userBase.status !== Status.Block
                ? res.status(200).send({
                    user: createUserSend(userBase),
                    appSettings,
                    reviewsSortData,
                    reviewsSortRating,
                    reviewsTag
                })
                : res.clearCookie(Secret.NameToken, createCookieOption()).status(200).send({
                    user: null,
                    appSettings,
                    reviewsSortData,
                    reviewsSortRating,
                    reviewsTag
                })
        } catch
            (error) {

            return res.status(401).send({ message: ErrorMessage.ServerError })
        }
    }
);

module.exports = router
