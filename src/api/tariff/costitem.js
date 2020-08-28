import request from '../../utils/request';

export const listCostItem = query => {
    return request({
        url: '/order/fCostItem/listCostItem',
        method: 'get',
        params: query
    });
};

export const updateCostItem = query => {
    return request({
        url: '/order/fCostItem/updateCostItem',
        method: 'put',
        data: query
    });
};

export const insertCostItem = query => {
    return request({
        url: '/order/fCostItem/insertCostItem',
        method: 'post',
        data: query
    });
};

export const deleteCostItem = query => {
    return request({
        url: '/order/fCostItem/'+query,
        method: 'delete'
    });
};

export const listCostType = query => {
    return request({
        url: '/order/fCostItem/listCostType',
        method: 'get',
        params: query
    });
};