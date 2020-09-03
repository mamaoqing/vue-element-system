import request from '../utils/request';

export const insertAuditerCnf = query => {
    return request({
        url: '/api/sAuditerCnf/insertAuditerCnf',
        method: 'post',
        data: query
    });
};

export const deleteAuditerCnf = id => {

    return request({
        url: '/api/sAuditerCnf/'+id,
        method: 'delete'
    });
};
export const updateAuditerCnf = query => {

    return request({
        url: '/api/sAuditerCnf/updateAuditerCnf',
        method: 'put',
        data: query
    });
};

export const checkAuditerCnf = query => {

    return request({
        url: '/api/sAuditerCnf/checkAuditerCnf',
        method: 'put',
        data: query
    });
};
export const listAuditerCnf = query => {
    return request({
        url: '/api/sAuditerCnf/listAuditerCnf',
        method: 'get',
        params: query
    });
};
export const listAuditerCnfNum = query => {
    return request({
        url: '/api/sAuditerCnf/listAuditerCnfNum',
        method: 'get',
        params: query
    });
};

