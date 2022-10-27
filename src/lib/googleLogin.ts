const GoogleStrategy = require('passport-google-oauth20').Strategy
import ChatModel from '../apis/chat/model'
import UserModel from '../apis/users/model'
import { createAccessToken, createTokens } from './tokens'

const googleStrategy = new GoogleStrategy({
    clientID:process.env.GOOGLE_ID,
    clientSecret:process.env.GOOGLE_SECRET,
    callbackURL:process.env.GOOGLE_REDIRECT_URL

},async (_accessToken :any, _refreshTokeh: any, profile: any, passportNext: (arg: null, arg1: any) => void )=>{
     console.log("PROFILE:", profile)
    try {

    const user =await UserModel.findOne({email: profile._json.email})

    if(user) {
        const tokens = await createTokens(user);

          passportNext(null,{
            accessToken: tokens?.accessToken,
            refreshToken: tokens?.refreshToken,
          })
    } else {

        const { given_name, family_name, picture, email} = profile._json
        const newUser = new UserModel({
            name: given_name,
            surname: family_name,
            email,
            googleID: profile.id,
            image_path: picture
        })

        
        const createdUser = await newUser.save()

        const admin = await UserModel.findOne({role:'admin'})
        if(admin?._id) {
          const  chat  = new ChatModel({members:[ createdUser._id,  admin._id] })
          await chat.save()
        } else {
          const  chat  = new ChatModel({members:[ createdUser._id, "633e9e3b53156da398451d62"]})
          await chat.save()
        }

        const tokens = await createTokens(createdUser);

        passportNext(null,{
          accessToken: tokens?.accessToken,
          refreshToken: tokens?.refreshToken,
        })
    }
        
    } catch (error) {
        
    }
})

export default googleStrategy