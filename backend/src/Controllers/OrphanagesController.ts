import {Request, Response} from 'express'
import * as yup from 'yup';

import { getRepository } from 'typeorm';
import Orphanages from '../models/Orphanage';
import OrphanagesView from '../views/OrphanagesView';

export default {
    async index(req: Request, res:Response){
        
        const orphanagensRepository = getRepository(Orphanages)

        const orphanages = await orphanagensRepository.find({
            relations: ['images']
        })
        
        return res.status(200).json(OrphanagesView.renderMany(orphanages))
    },

    async create(req: Request,res: Response){
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends
        } = req.body

        const requestImages = req.files as Express.Multer.File[];

        const images = requestImages.map(image => {
            return {path: image.filename}
        })

        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends === 'true',
            images
        }

        const schema  = yup.object().shape({
            name: yup.string().required(),
            latitude: yup.number().required(),
            longitude: yup.number().required(),
            about: yup.string().required(),
            instructions: yup.string().required(),
            opening_hours: yup.string().required(),
            open_on_weekends: yup.string().required(),
            images: yup.array(yup.object().shape({
                path: yup.string().required()
            }))
        })
    
        const orphanagensRepository = getRepository(Orphanages)
    
        const orphanage = orphanagensRepository.create(data)

        await schema.validate(data, {
            abortEarly: false
        })
    
        await orphanagensRepository.save(orphanage)

        
        return res.status(201).send('Orfanato recebido')
    }, 

    async show(req: Request, res:Response){
        const id_orphanage = req.params.id

        const orphanagensRepository = getRepository(Orphanages)

        const orphanage = await orphanagensRepository.findOneOrFail(id_orphanage, {
            relations: ['images']
        });

        return res.status(200).json(OrphanagesView.render(orphanage))

    }
}