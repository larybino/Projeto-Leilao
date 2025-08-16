import BaseService from "./BaseService";

class ProfileService extends BaseService{
    constructor() {
        super('/profile');
    } 
}
const profileService = new ProfileService();
export default profileService;
