import request from '../utils/request';

export const addUnitModel = query => {

    return request({
        url: '/api/sUnitModel/insertUnitModel',
        method: 'post',
        data: query
    });
};

export const deleteUnitModel = id => {

    return request({
        url: '/api/sUnitModel/'+id,
        method: 'delete'
    });
};

export const updateUnitModel = query => {

    return request({
        url: '/api/sUnitModel/updateUnitModel',
        method: 'put',
        data: query
    });
};
export const listUnitModel = query => {
    return request({
        url: '/api/sUnitModel/listUnitModel',
        method: 'get',
        params: query
    });
};