import api from '../config/axiosConfig';

class BaseService {
    constructor(endPoint) {
        this.endPoint = endPoint;
        this.api=api;
    }

async create(data){
    const response = await this.api.post(this.endPoint, data);
    return response;
}

async update(data){
    const response = await this.api.put(this.endPoint, data);
    return response;
}

async delete(id){
    const response = await this.api.delete(`${this.endPoint}/${id}`);
    return response;
}

async getAll(){
    const response = await this.api.get(this.endPoint);
    return response;
}
}

export default BaseService;