import express from 'express';
import { startLiveSession, joinLiveSession, endLiveSession } from '../controllers/liveController.js';
import isAuth from '../middlewares/isAuth.js';
import isEducator from '../middlewares/isEducator.js';

const router = express.Router();

// Start live session - Educator only
router.post('/start-live/:lectureId', isAuth, isEducator, startLiveSession);

// Join live session - Authenticated user (enrollment checked in controller)
router.get('/join-live/:lectureId', isAuth, joinLiveSession);

// End live session - Educator only
router.post('/end-live/:lectureId', isAuth, isEducator, endLiveSession);

export default router;
