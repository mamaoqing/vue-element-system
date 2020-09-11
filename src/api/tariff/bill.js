import request from '../../utils/request';

export const listBillss = query => {
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

export const listOwner = query => {
    return request({
        url: '/order/fBill/listOwner',
        method: 'get',
    });
};

export const doPay = query => {
    return request({
        url: '/order/fBill/doPay',
        method: 'post',
        data:query
    });
};

export const getOwnerList = query => {
    return request({
        url: '/order/fBill/getOwners',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: query
    });
};

export const insertBill = query => {
    return request({
        url: '/order/fBill/insertBill',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: query
    });
};
