import { RequestHandler } from 'express'
import ResetPinModel from './model'
import { getUserByEmail } from '../users'
import { sendEmail } from '../../lib/sendGrid'
import createHttpError from 'http-errors'

const createRandomPin = () => {
    let pin = ''

    for (let index = 0; index < 6; index++) {
        const number = Math.floor( Math.random() * 10 )

        pin += number

    }

    return pin
}


const createPinObj = async (email:String) => {
    let randomPin = createRandomPin()

    const resetPinObj = {
        email,
        pin: randomPin

    }

    const pin = new ResetPinModel(resetPinObj)

    const result = await pin.save()

    console.log(result)

    return result


}

export const passwordReset: RequestHandler = async (req,res,next) => {
    try {
        const {email} = req.body

        const user = await getUserByEmail(email)

        if(user && user.email){ 
            
        const  pin = await createPinObj(user.email)
            
        await sendEmail(user.email,pin.pin)

        }

        res.send({message:"Email with verification pin was sent to your mailbox!"})
        
        } catch (error) {
        console.log(error)
        next(error)
    }
}

export const findPinInDB = async (email:String,pin:String) => {
   try {

     const data = await ResetPinModel.findOne({email,pin})

     return data

   } catch (error) {

    console.log(error)
   }
}

export const checkIfPinExpired = ( createdAt: Date) => {
   
    const expDate= createdAt.setDate( createdAt.getDate() + 1)

    const today = Date.now()

    if(today < expDate) {
        return true
    } else return false
}


