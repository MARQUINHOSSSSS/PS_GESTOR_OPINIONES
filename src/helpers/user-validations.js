import User from '../users/user.model.js'
import zxcvbn from 'zxcvbn';

const emailExists = async (mail = '') => {
    try {
        const emailExists = await User.findOne({ mail });
        if (emailExists) {
            throw new Error(`Email "${mail}" already registered. Choose another.`);
        }
    } catch (error) {
        throw error;
    }
}

const userNameExists = async (username = '') => {
    try {
        const userNameExists = await User.findOne({ username });
        if (userNameExists) {
            throw new Error(`Username ${username} is not available`);
        }
    } catch (error) {
        throw error;
    }
}

const validatePassword = async (password = '') => {
    const result = zxcvbn(password);

    if (result.score < 2) {
        throw new Error(`The password is not safe enough.`);
    }
    if (password.length < 6) {
        throw new Error('The password must be at least 6 characters.');
    }
};

const existUserById = async (id = '') => {
    try {
        const existUserById = await User.findById(id);
        if (!existUserById) {
            throw new Error(`The user with the ${id} does not exist`);
        }
    } catch (error) {
        throw error;
    }
};

//EXPORTA LAS VALIDACIONES DE USUARIO
export { emailExists, userNameExists, validatePassword, existUserById };