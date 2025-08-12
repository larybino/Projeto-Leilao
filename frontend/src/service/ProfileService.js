import BaseService from "./BaseService";

class ProfileService extends BaseService{
    constructor() {
        super('/profile');
    } 
}
export default ProfileService;
