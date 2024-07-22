/** @interface */
export default class IUserService {
    /**
     * @method
     * @param {UserServiceGetSpec} spec
     * @return {IUserServiceGetResult}
     * */
    get(spec) {
    }

    /**
     * @method
     * @param {UserServiceSignUpSpec} spec
     * @return {UserServiceSignUpResult}
     * */
    signUp(spec) {
    }
}

class UserServiceGetSpec {
    /** @type string */
    email
    /** @type string */
    password
}

/** @interface */
class IUserServiceGetResult {
}