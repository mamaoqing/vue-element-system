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

export const insertRulePark = query => {
    return request({
        url: '/order/fCostRuleRoom/insertRoomPark',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: query
    });
};

export const getRoomIds = query => {
    return request({
        url: '/order/fCostRuleRoom/'+query,
        method: 'get'
    });
};

export const getParkIds = query => {
    return request({
        url: '/order/fCostRuleRoom/getParkIds/'+query,
        method: 'get'
    });
};

export const getCostPark = query => {
    return request({
        url: '/order/fCostRuleRoom/costPark/'+query,
        method: 'get'
    });
};

export const deletparkById = query => {
    return request({
        url: '/order/fCostRuleRoom/'+query,
        method: 'delete'
    });
};

export const deleteAllPark = query => {
    return request({
        url: '/order/fCostRuleRoom/deleteAllParks',
        method: 'delete',
        params:query
    });
};
export const listBills = query => {
    return request({
        url: '/order/fBillDate/'+query,
        method: 'get',
    });
};


export const updateBillDate = query => {
    return request({
        url: '/order/fBillDate/updateBillDate',
        method: 'put',
        data: query
    });
};

export const getCostRule = query => {
    return request({
        url: '/order/fCostRule/'+query,
        method: 'get',
    });
};