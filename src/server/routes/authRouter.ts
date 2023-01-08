import express from "express";
import { Empty, IdType, ResponseAppType } from "types";
import { ErrorMessage, Path, Secret } from '../../enums'
import { checkAuth, createCookieOption, createTokenAndUserSend } from "../../utils";
import { getAppSetting, getUserById } from "../repository";

const router = express.Router();

router.get<Empty, ResponseAppType<Empty>, IdType, Empty>(`${Path.Root}`, checkAuth, async (req, res) => {
    try {
        const userBase = await getUserById(req.body.id)
        const { user, token } = createTokenAndUserSend(userBase)
        const appSettings = await getAppSetting()
        return user
            ? res.cookie(Secret.NameToken, token, createCookieOption()).status(200).send({
                user,
                appSettings
            })
            : res.clearCookie(Secret.NameToken).status(200).send({
                user: null,
                appSettings
            })
    } catch (error) {

        return res.status(401).send({ message: ErrorMessage.Authorized })
    }
});

module.exports = router
