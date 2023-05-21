import UserDTO from '../dao/DTO/users.dto.js'
import CustomError from '../errors/custom.errors.js'
import EErros from '../errors/enums.js'
import { generateToken } from '../utils.js'
import { generateProdErrorInfo } from '../errors/info.js'
import config from '../config/config.js'
import Mail from '../modules/mail.js'

export default class UserRepository {
    constructor(dao) {
        this.dao = dao
        this.mail = new Mail()
    }

    get = async() => {
        return await this.dao.get()
    }

    getOneByID = async(id) => {
        return await this.dao.getOneByID(id)
    }

    getOneByEmail = async(email) => {
        return await this.dao.getOneByEmail(email)
    }

    create = async(data) => {
        const dataToInsert = new UserDTO(data)
        return await this.dao.create(dataToInsert)
    }

    updateUser = async (id, password) => {
        return await this.dao.updatePass(id, password)
    }

    sendMail = async (email) => {
        const user = await this.getOneByEmail(email)
        if(!user){
            CustomError.createError({
                name: "Authentication error",
                cause: generateProdErrorInfo(),
                message: "Error trying to find user",
                code: EErros.INVALID_TYPES_ERROR
            })
        }

        const token = generateToken(user._id, "1h")

        const html = `
        <p>Ingresa al link para cambio de contraseña</p>
        <a href=${config.BASE_URL}/session/forgotPassword/${user.id || user._id}/${token}>Cambiar</a>
        <br>
        `

        return await this.mail.send(email, "Restaurar contraseña", html)
      }
}