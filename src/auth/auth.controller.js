import bcryptjs from 'bcryptjs';
import User from '../users/user.model.js'
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await User.findOne({
            $or: [
                { mail: identifier },
                { username: identifier }
            ]
        });

        if (!user) {
            return res.status(400).json({
                msg: "Incorrect credentials, Email or Username does not exist in the database",
            });
        }

        //VERIFICA SI EL USUARIO ESTA ACTIVO
        if (!user.status) {
            return res.status(400).json({
                msg: "The user does not exist in the database",
            });
        }

        //VERIFICAR LA PASSOWORD
        const validPassword = bcryptjs.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: "Password is incorrect",
            });
        }

        //GENERAR EL JWT
        const token = await generarJWT(user.id);

        const userData = {
            username: user.username,
            mail: user.mail,
        };

        res.status(200).json({
            msg: 'Login Ok',
            user: userData,
            token
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: "Contact administrator",
        });
    }
}