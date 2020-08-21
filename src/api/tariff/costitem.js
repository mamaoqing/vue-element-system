import request from '../../utils/request';

export const listCostItem = query => {
    return request({
        url: '/api/fCostItem/listCostItem',
        method: 'get',
        params: query
    });
};

export const updateCostItem = query => {
    return request({
        url: '/api/fCostItem/updateCostItem',
        method: 'put',
        data: query
    });
};

export const insertCostItem = query => {
    return request({
        url: '/api/fCostItem/insertCostItem',
        method: 'post',
        data: query
    });
};

export const deleteCostItem = query => {
    return request({
        url: '/api/fCostItem/'+query,
        method: 'delete'
    });
};

export const listCostType = query => {
    return request({
        url: '/api/fCostItem/listCostType',
        method: 'get',
        params: query
    });
};