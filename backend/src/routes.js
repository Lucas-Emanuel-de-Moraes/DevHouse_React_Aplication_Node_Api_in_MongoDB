import { Router } from 'express'
import multer from 'multer'
import uploadConfig from './config/upload'
import SessionController from './controllers/SessionController'
import HouseController from './controllers/HouseController'
import DashboardController from './controllers/DashboardController'
import ReserveController from './controllers/ReserveController'

const routes = new Router()
const upload = multer(uploadConfig)

routes.post('/sessions', SessionController.store)

routes.get('/houses', HouseController.index)
routes.post('/houses', upload.single('thumbnail'), HouseController.store)
routes.put('/houses', upload.single('thumbnail'), HouseController.update)
routes.delete('/houses', HouseController.destroy)

routes.get('/dashboard', DashboardController.show)

routes.get('/reserves', ReserveController.index)
routes.post('/reserve', ReserveController.store)
routes.delete('/reserves/cancel', ReserveController.destroy)

export default routes