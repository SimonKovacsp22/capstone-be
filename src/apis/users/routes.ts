import express from "express"
import { registerUser, loginUser, getUsers, getMe, updateUser, updatePassword, refreshTokens, addOrRemoveProductToFavorites } from './index'
import { IUserRequest, JWTAuthMiddleware } from "../../lib/JWTMiddleware"
import passport from "passport"

const userRouter = express.Router()

userRouter.post("/register", registerUser )

userRouter.post("/login", loginUser)

userRouter.get("/", getUsers)

userRouter.get("/me", JWTAuthMiddleware, getMe)

userRouter.put("/me", JWTAuthMiddleware, updateUser)

userRouter.post("/me/favorites", JWTAuthMiddleware, addOrRemoveProductToFavorites)

userRouter.get("/googleLogin", passport.authenticate("google", {scope: ["profile","email"]}))

userRouter.get("/googleRedirect",passport.authenticate("google", { session: false }) ,(req: IUserRequest,res,next) => {
    try {
        const accessToken = req.user?.accessToken
        const refreshToken = req.user?.refreshToken
        
        res.redirect(`${process.env.FE_URL}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`)
    } catch (error) {
        next(error)
    }
})

userRouter.patch("/password-reset", updatePassword)

userRouter.post("/refresh-tokens", refreshTokens)



export default userRouter