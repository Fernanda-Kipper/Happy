import {Router} from 'express';
import multer from  'multer'; 

import orphanagesController from './Controllers/OrphanagesController'
import uploadConfig from './config/upload'

const routes = Router();
const upload = multer(uploadConfig)

routes.post('/orphanages', upload.array('images'),orphanagesController.create)
routes.get('/orphanages', orphanagesController.index)
routes.get('/orphanages/:id', orphanagesController.show)

export default routes;
