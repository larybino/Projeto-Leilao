import BaseService from "./BaseService";

class ProfileService extends BaseService{
    constructor() {
        super('/profile');
    } 

    async getMe() {
        return  this.api.get('/profile/me');
    }
}
const profileService = new ProfileService();
export default profileService;
