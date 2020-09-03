import request from '../../utils/request';

export const listBills = query => {
    return request({
        url: '/order/fBill/listBill',
        method: 'get',
        params: query
    });
};

