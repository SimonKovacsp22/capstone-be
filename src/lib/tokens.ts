import jwt from "jsonwebtoken";
import { TokenPayload, RefreshTokenPayload, Tokens, UserDocument } from "../types";
import UserModel from "../apis/users/model"
import createHttpError from "http-errors";

export const createTokens = async (user:UserDocument): Promise<Tokens| undefined> => {

   const accessToken = await createAccessToken({_id:user._id,role:user.role})
   const refreshToken = await createRefreshToken({_id: user._id})

   if(accessToken && refreshToken) {

    user.refreshToken = refreshToken as string

    await user.save()

    return {accessToken , refreshToken}}
}



export const createAccessToken = (
  payload: TokenPayload
): Promise<string | undefined> =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "3600s" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    )
  );

export const verifyAccessToken = (
  token: string
): Promise<TokenPayload | undefined> =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET!, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload as TokenPayload);
      }
    })
  );

export const createRefreshToken = (
  payload: RefreshTokenPayload
): Promise<string | undefined> =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.REFRESH_SECRET!,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    )
  );

  export const verifyRefreshToken = (
    token: string
  ): Promise<RefreshTokenPayload | undefined> =>
    new Promise((resolve, reject) =>
      jwt.verify(token, process.env.REFRESH_SECRET!, (err, payload) => {
        if (err) {
          reject(err);
        } else {
          resolve(payload as RefreshTokenPayload);
        }
      })
    );

    export const createNewTokens = async (currentRefreshToken: string) => {
      try {

         const payload = await verifyRefreshToken(currentRefreshToken)

         const user = await UserModel.findById(payload?._id)

         if(user) {

          if(user.refreshToken && user.refreshToken === currentRefreshToken){
            const tokens = await createTokens(user)

            return { accessToken:tokens?.accessToken, refreshToken:tokens?.refreshToken }
          } else {

            throw new (createHttpError as any)(401, "Refresh token is not valid")
          }

         } else {

          throw new (createHttpError as any)(404, `User with id ${payload?._id} not found`)
         }
        
      } catch (error) {
        
      }
    }
