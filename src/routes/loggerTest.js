import { Router } from "express"

const router = Router()

router.get('/', (req, res) => {
    req.logger.debug('debug')
    req.logger.info('Se llamo a esta url')
    req.logger.warning('Aviso de error')
    req.logger.error('Se cayo el server ')
    req.logger.fatal("Error fatal!")
    res.send({message: 'Prueba de registro'})
})

export default router