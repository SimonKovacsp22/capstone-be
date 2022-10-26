import express from 'express'
import { createChat, getChatsForUser, getChatWithParticipants } from './index';
const chatRouter = express.Router()

chatRouter.post('/', createChat);
chatRouter.get('/:userId', getChatsForUser);
chatRouter.get('/find/:firstId/:secondId', getChatWithParticipants);

export default chatRouter