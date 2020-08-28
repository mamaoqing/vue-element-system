import request from '../../utils/request';

export const listCostRule = query => {
    return request({
        url: '/order/fCostRule/listCostRule',
        method: 'get',
        params: query
    });
};

export const updateCostRule = query => {
    return request({
        url: '/order/fCostRule/updateCostRule',
        method: 'put',
        data: query
    });
};

export const insertCostRule = query => {
    return request({
        url: '/order/fCostRule/insertCostRule',
        method: 'post',
        data: query
    });
};

export const deleteCostRule = query => {
    return request({
        url: '/order/fCostRule/'+query,
        method: 'delete'
    });
};

export const listCostItem = query => {
    return request({
        url: '/order/fCostRule/costItemList/'+query,
        method: 'get',
    });
};

export const insertRuleRoom = query => {
    return request({
        url: '/order/fCostRuleRoom/insertRoomRule',
        method: 'post',
        data: query
    });
};

export const getRoomIds = query => {
    return request({
        url: '/order/fCostRuleRoom/'+query,
        method: 'get'
    });
};