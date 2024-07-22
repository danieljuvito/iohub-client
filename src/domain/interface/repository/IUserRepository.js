/** @interface */
class IUserRepository {
    /**
     * @param {UserRepositoryGetSpec} spec
     * @return {UserRepositoryGetResult}
     * */
    async get(spec) {
    }

    /**
     * @param {UserRepositoryCreateSpec} spec
     * @return {UserRepositoryCreateResult}
     * */
    async create(spec) {
    }
}