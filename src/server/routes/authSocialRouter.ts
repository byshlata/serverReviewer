import { createUser, getAppSetting, getUserByEmail, getUserById } from "../repository";
import express from "express";
import { Empty, RegistrationType, ResponseAppType } from "types";
import { ErrorMessage, Path, Secret, Status } from "../../enums";
import { registerValidation } from '../../validation/authValidation'
import { validationResult } from 'express-validator'
import {
    createCookieOption,
    createToken,
    createTokenAndUserSend,
    createUserSend
} from "../../utils";

const router = express.Router();

router.post<Empty, ResponseAppType<Empty>, RegistrationType, Empty>(`${Path.Root}`, registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req.body);
        if (!errors.isEmpty()) {
            return res.status(400).send({ message: ErrorMessage.CorrectEnter })
        }
        const { email, login, password, avatar } = req.body
        let userBase = await getUserByEmail(email)
        if (!userBase) {
            userBase = await createUser({ login, password, email, avatar })
        }
        const appSettings = await getAppSetting()

        return res.status(200).cookie(Secret.NameToken, createToken(userBase._id), createCookieOption()).send({
                user: createUserSend(userBase),
                appSettings,
            })

    } catch (error) {
        return res.status(500).send({ message: ErrorMessage.ServerError })
    }
});

module.exports = router
