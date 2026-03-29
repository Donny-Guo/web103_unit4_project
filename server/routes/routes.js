import express from 'express'
import {
    createCar,
    deleteCar,
    editCar,
    getAllOptions,
    getCarById,
    getCars,
    getOptionsByCategory
} from '../controllers/controllers.js'


const router = express.Router()

router.get('/options', getAllOptions)
router.get('/options/:category', getOptionsByCategory)
router.get('/cars', getCars)
router.get('/cars/:id', getCarById)
router.post('/cars', createCar)
router.put('/cars/:id', editCar)
router.delete('/cars/:id', deleteCar)


export default router