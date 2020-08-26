import request from '../../utils/request';

export const listCostRule = query => {
    return request({
        url: '/api/fCostRule/listCostRule',
        method: 'get',
        params: query
    });
};

export const updateCostRule = query => {
    return request({
        url: '/api/fCostRule/updateCostRule',
        method: 'put',
        data: query
    });
};

export const insertCostRule = query => {
    return request({
        url: '/api/fCostRule/insertCostRule',
        method: 'post',
        data: query
    });
};

export const deleteCostRule = query => {
    return request({
        url: '/api/fCostRule/'+query,
        method: 'delete'
    });
};

export const listCostItem = query => {
    return request({
        url: '/api/fCostRule/costItemList/'+query,
        method: 'get',
    });
};