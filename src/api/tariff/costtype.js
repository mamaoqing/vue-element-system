import request from '../../utils/request';

export const listCostType = query => {
    return request({
        url: '/order/fCostType/listCostType',
        method: 'get',
        params: query
    });
};

export const updateCostType = query => {
    return request({
        url: '/order/fCostType/updateCostType',
        method: 'put',
        data: query
    });
};

export const insertCostType = query => {
    return request({
        url: '/order/fCostType/insertCostType',
        method: 'post',
        data: query
    });
};

export const deleteCostType = query => {
    return request({
        url: '/order/fCostType/'+query,
        method: 'delete'
    });
};