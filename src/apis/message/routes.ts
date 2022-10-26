import express from 'express';
import { addMessage, getMessagesForChat } from './index';

const messageRouter = express.Router();

messageRouter.post('/', addMessage);

messageRouter.get('/:chatId', getMessagesForChat);

export default messageRouter