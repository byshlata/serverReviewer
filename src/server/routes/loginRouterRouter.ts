import { getAppSetting, getUserById, loginUser } from "../repository";
import express from "express";
import { Empty, LoginType, ResponseAppType } from "types";
import { ErrorMessage, Path, Secret, Status } from '../../enums/'
import { loginValidation } from '../../validation/authValidation'
import { validationResult } from 'express-validator'
import {
    createCookieOption,
    createToken,
    createTokenAndUserSend,
    createUserSend
} from "../../utils";

const router = express.Router();

router.post<Empty, ResponseAppType<Empty>, LoginType, Empty>(`${Path.Root}`, loginValidation, async (req, res) => {
    try {
        const errors = validationResult(req.body);
        if (!errors.isEmpty()) {
            return res.status(400).send({ message: ErrorMessage.CorrectEnter })
        }
        const email = req.body.email;
        const password = req.body.password;
        const userBase = await loginUser({ password, email })
        const appSettings = await getAppSetting()

        return userBase && userBase.status !== Status.Block
            ? res.status(200).cookie(Secret.NameToken, createToken(userBase._id), createCookieOption()).send({
                user: createUserSend(userBase),
                appSettings,
            })
            : res.clearCookie(Secret.NameToken, createCookieOption()).status(404).send({
                message: ErrorMessage.EmailOrPassword
            })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: ErrorMessage.EmailOrPassword })
    }
});

module.exports = router
