import express from 'express'
import {passwordReset} from './index'


const pinRouter = express.Router()




pinRouter.post("/reset-password", passwordReset)

export default pinRouter