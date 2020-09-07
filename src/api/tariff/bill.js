import request from '../../utils/request';

export const listBills = query => {
    return request({
        url: '/order/fBill/listBill',
        method: 'get',
        params: query
    });
};
export const resetBillAll = query => {
    return request({
        url: '/order/fBill/resetBillAll',
        method: 'post',
        data: query
    });
};

export const resetBill = query => {
    return request({
        url: '/order/fBill/resetBill/'+query,
        method: 'post',
    });
};

export const fCostRule = query => {
    return request({
        url: '/order/fCostRule/listCostRule',
        method: 'get',
        params: query
    });
};
