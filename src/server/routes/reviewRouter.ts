import {
    AppSettingsResponseType,
    DataCommentType,
    Empty,
    ErrorResponseType,
    IdSomeType,
    IdType,
    LikeType,
    ResponseAppType,
    ReviewResponseType,
    ReviewsSomeSendType,
    ReviewUserTableType,
    SearchQueryParamsType,
    SearchResponseType,
    StarType,
} from "../../types";
import express, { Request } from "express";
import { ErrorMessage, Path, QueryAPI } from '../../enums'
import {
    checkAuth,
    checkUser,
    createAppSettingsAndUserSend,
    createReviewSend,
    createUserReviewsTableResponse
} from "../../utils";
import {
    addComment,
    deleteSomeReviews,
    getReviewsById,
    getReviewsUser,
    searchByReview,
    setLike,
    setStar
} from "../repository";


const router = express.Router();

router.get<Empty, ResponseAppType<ReviewResponseType>, IdType, Empty>(`${Path.Root}${Path.Id}`, checkUser, async (req: Request<{ id: string }>, res) => {
        try {
            const { id } = req.params
            const reviewBase = await getReviewsById(id)
            const review = createReviewSend(reviewBase)
            const { user, appSettings } = await createAppSettingsAndUserSend(req.body.id)

            return res.send({ user, appSettings, review });
        } catch
            (error) {

            return res.status(401).send({ message: ErrorMessage.ServerError })
        }
    }
);

router.get<Empty, ResponseAppType<ReviewsSomeSendType<ReviewUserTableType>>, IdType, Empty>(`${Path.User}${Path.Root}${Path.Id}`, checkUser, async (req: Request<{ id: string }>, res) => {
        try {
            const { id } = req.params
            const reviewsBase = await getReviewsUser(id)
            const reviews = createUserReviewsTableResponse(reviewsBase)
            const { user, appSettings } = await createAppSettingsAndUserSend(req.body.id)

            return res.send({ user, appSettings, reviews });
        } catch
            (error) {

            return res.status(401).send({ message: ErrorMessage.ServerError })
        }
    }
);

router.post<Empty, ResponseAppType<SearchResponseType> & AppSettingsResponseType | ErrorResponseType, IdType, Empty>(`${Path.Root}`, checkUser, async (req: Request<Empty, Empty, IdType, SearchQueryParamsType>, res) => {
        try {
            const { query } = req
            const searchResult = await searchByReview(query[QueryAPI.Search])
            const { user, appSettings } = await createAppSettingsAndUserSend(req.body.id)

            return res.send({ user, searchResult, appSettings });
        } catch
            (error) {

            return res.status(401).send({ message: ErrorMessage.ServerError })
        }
    }
);

router.post<Empty, ResponseAppType<Empty>, LikeType & IdType, Empty>(`${Path.Like}`, checkAuth, async (req, res) => {
        try {
            const { idReview, id } = req.body
            await setLike({ idReview, id })
            const { user, appSettings } = await createAppSettingsAndUserSend(id)

            return res.status(200).send({
                user,
                appSettings
            })
        } catch
            (error) {

            return res.status(401).send({ message: ErrorMessage.ServerError })
        }
    }
);

router.post<Empty, ResponseAppType<Empty>, StarType & IdType, Empty>(`${Path.Star}`, checkAuth, async (req, res) => {
        try {
            const { idReview, numberStar, id } = req.body
            await setStar({ idReview, id, numberStar })
            const { user, appSettings } = await createAppSettingsAndUserSend(id)

            return res.status(200).send({
                user,
                appSettings
            })
        } catch
            (error) {

            return res.status(401).send({ message: ErrorMessage.ServerError })
        }
    }
);

router.post<Empty, ResponseAppType<ReviewResponseType>, DataCommentType, Empty>(`${Path.CreateComment}`, checkAuth, async (req, res) => {
        try {
            const { id, textComment, idReview } = req.body;
            if (id) {
                const reviewBase = await addComment({ id, textComment, idReview })
                const review = createReviewSend(reviewBase)
                const { user, appSettings } = await createAppSettingsAndUserSend(id)

                return res.status(200).send({
                    appSettings,
                    review,
                    user
                });
            }
        } catch
            (error) {

            return res.status(401).send({ message: ErrorMessage.Authorized })
        }
    }
);

router.delete<Empty, ResponseAppType<ReviewsSomeSendType<ReviewUserTableType>>, IdSomeType & IdType, Empty>(`${Path.Delete}`, checkAuth, async (req, res) => {
        try {
            const { idSome, id } = req.body;
            const reviewsBase = await deleteSomeReviews({ idSome, id })
            const reviews = createUserReviewsTableResponse(reviewsBase)
            const { user, appSettings } = await createAppSettingsAndUserSend(id)

            return res.status(200).send({ user, appSettings, reviews });
        } catch
            (error) {

            return res.status(401).send({ message: ErrorMessage.ServerError })
        }
    }
);


module.exports = router
