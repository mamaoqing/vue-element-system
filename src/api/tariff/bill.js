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
        url: '/order/fBill/resetBill/' + query,
        method: 'post'
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
        method: 'get'
    });
};
export const addBill = query => {
    return request({
        url: '/order/fBill/addBill',
        method: 'post',
        data: query
    });
};

export const pay = query => {
    return request({
        url: '/order/fFinanceRecord/pay',
        method: 'post',
        data: query
    });
};

export const getOwnerByName = query => {
    return request({
        url: '/order/fFinanceRecord/getOwnerByName',
        method: 'get',
        params: query
    });
};

export const getOwnerPropId = query => {
    return request({
        url: '/order/fFinanceRecord/getOwnerBill',
        method: 'get',
        params: query
    });
};

export const getRoomByOwnerId = ownerId => {
    return request({
        url: '/order/rOwner/getRoomByOwnerId/'+ownerId,
        method: 'get',
    });
};

export const getParkByOwnerId = ownerId => {
    return request({
        url: '/order/rOwner/getParkByOwnerId/'+ownerId,
        method: 'get',
    });
};

export const payPrice = query => {
    return request({
        url: '/order/fFinanceRecord/payPrice',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: query
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
export const listBills = query => {
    return request({
        url: '/order/fBillDate/'+query,
        method: 'get',
    });
};

export const getAccountByOwnerId = ownerId => {
    return request({
        url: '/order/fAccount/getAccountByOwnerId/'+ownerId,
        method: 'get',
    });
};
