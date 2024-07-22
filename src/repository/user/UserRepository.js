import axios from "axios";

/** @implements IUserRepository */
class UserRepository {

    create(spec) {
        return undefined;
    }

    async get(spec) {
        try {
            const response = await axios.get(`http://localhost:8080/user?email=${spec.email}`);
            console.log(response);
        } catch (error) {
            console.error(error);
        }

        return undefined;
    }
}