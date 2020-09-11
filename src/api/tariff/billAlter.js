import request from '../../utils/request';

export const insertBillAlter = query => {
    return request({
        url: '/order/fBillAlter/insertBillAlter',
        method: 'post',
        data: query
    });
};

export const deleteBillAlter = id => {

    return request({
        url: '/order/fBillAlter/'+id,
        method: 'delete'
    });
};
export const getPropertyName = propertyId => {

    return request({
        url: '/api/fMeter/getPropertyName/'+propertyId,
        method: 'get'
    });
};
export const getCostRuleName = id => {

    return request({
        url: '/order/fCostRule/getCostRuleName/'+id,
        method: 'get'
    });
};
export const updateBillAlter = query => {

    return request({
        url: '/order/fBillAlter/updateBillAlter',
        method: 'put',
        data: query
    });
};
export const listBillAlter = query => {
    return request({
        url: '/order/fBillAlter/listBillAlter',
        method: 'get',
        params: query
    });
};

export const getRuleList = query => {
    return request({
        url: '/order/fCostRule/listAllCostRule',
        method: 'get',
        params: query
    });
};

export const getAuditorList = query => {
    return request({
        url: '/api/sAuditerCnf/listAllAuditerCnf',
        method: 'get' ,
        params: query
    });
};
export const exportXlsByT = query => {
    return request({
        url: '/order/fBillAlter/export',
        method: 'post',
        params: query,
        responseType: 'blob'
    });
};
