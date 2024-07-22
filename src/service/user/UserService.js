/** @implements IUserService */
class UserService {
    /** @type IUserRepository */
    userRepository

    /** @param {IUserRepository} userRepository */
    constructor(
        userRepository,
    ) {
        this.userRepository = userRepository
    }

    get(spec) {
        return undefined;
    }

    signUp(spec) {
        const getResult = this.userRepository.get({
            email: '',
        })

        if (getResult.user !== undefined) {
            throw 'user already exist'
        }

        const createResult = this.userRepository.create({
            user: {
                email: spec.email,
                password: spec.password,
            }
        })

        return {
            id: createResult.id
        };
    }
}