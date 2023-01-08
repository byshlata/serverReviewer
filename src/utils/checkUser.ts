import { ErrorMessage, Secret } from "../enums";
import { getUserById } from "../server/repository";
import { decipherToken } from "../utils";

export const checkUser = async (req, res, next) => {
    const token = req.cookies.access_token

    if (token) {
        try {
            const decodedToken = decipherToken(token, Secret.Secret)
            const user = await getUserById(decodedToken)
            if (user) {
                req.body.id = decodedToken;
            }
        } catch (error) {

            return res.status(401).send({ message: ErrorMessage.Authorized })
        }
    }
    next()
}
