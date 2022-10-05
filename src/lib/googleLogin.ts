const GoogleStrategy = require('passport-google-oauth20').Strategy
import UserModel from '../apis/users/model'
import { createAccessToken } from './tokens'

const googleStrategy = new GoogleStrategy({
    clientID:process.env.GOOGLE_ID,
    clientSecret:process.env.GOOGLE_SECRET,
    callbackURL:process.env.GOOGLE_REDIRECT_URL

},async (_accessToken :any, _refreshTokeh: any, profile: any, passportNext: (arg: null, arg1: any) => void )=>{
     console.log("PROFILE:", profile)
    try {

    const user =await UserModel.findOne({email: profile._json.email})

    if(user) {
          const accessToken = await createAccessToken({_id: user._id, role: user.role})

          passportNext(null,{ accessToken })
    } else {

        const { given_name, family_name, picture, email} = profile._json
        const newUser = new UserModel({
            name: given_name,
            surname: family_name,
            email,
            googleID: profile.id
        })

        console.log("newUser:", newUser)
        const createdUser = await newUser.save()

        const accessToken = await createAccessToken({ _id: createdUser._id, role: createdUser.role })

        passportNext(null, { accessToken })
    }
        
    } catch (error) {
        
    }
})

export default googleStrategy