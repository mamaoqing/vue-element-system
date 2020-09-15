import request from '../../utils/request';

export const listAccount = query => {
    return request({
        url: '/order/fAccount/listAccount',
        method: 'get',
        params: query
    });
};
export const insertAccount = query => {
    return request({
        url: '/order/fAccount/insertAccount',
        method: 'post',
        data: query
    });
};
export const updateAccount = query => {

    return request({
        url: '/order/fAccount/updateAccount',
        method: 'put',
        data: query
    });
};
export const getRuleList = ownerId => {
    return request({
        url: 'order/fCostRule/getRuleByOwnerId/'+ownerId,
        method: 'get'
    });
};
export const getAccount = query => {

    return request({
        url: '/order/fAccount/getAccount',
        method: 'post',
        params: query
    });
};
export const listFinanceRecord = query => {

    return request({
        url: '/order/fFinanceRecord/listFinanceRecord',
        method: 'get',
        params: query
    });
};

export const listFinanceBillRecord = query => {

    return request({
        url: '/order/fFinanceBillRecord/listFinanceBillRecord',
        method: 'get',
        params: query
    });
};

export const getTypeName = query => {
    return request({
        url: '/order/fAccount/getType',
        method: 'get',
        params: query
    });
};