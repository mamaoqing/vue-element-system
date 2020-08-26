import request from '../utils/request';

export const getOwenList = query => {
    return request({
        url: '/api/rOwner/getOwenerList',
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        data: query
    });

};

export const addOwner = query => {
    return request({
        url: '/api/rOwner/insert',
        method: 'post',
        data: query
    });
};

export const update = query => {
    return request({
        url: '/api/rOwner/update',
        method: 'post',
        data: query
    });
};

export const getCount = query => {
    return request({
        url: '/api/rOwner/getCount',
        method: 'post',
        data: query
    });
};


export const deleteOwner = id => {
    return request({
        url: '/api/rOwner/delete/'+id,
        method: 'delete',
    });
};


export const fetchLinkData = query => {
    return request({
        url: '/api/rOwnerInvoiceInfo/getListByOwnerId',
        method: 'get',
        params: query,
    });
};

export const deleteLinkData = id => {
    return request({
        url: '/api/rOwnerInvoiceInfo/delete/'+id,
        method: 'delete',
    });
};

export const addLinkData = query => {
    return request({
        url: '/api/rOwnerInvoiceInfo/add',
        method: 'post',
        data: query
    });
};

export const updateLinkData = query => {
    return request({
        url: '/api/rOwnerInvoiceInfo/update',
        method: 'post',
        data: query,
    });
};

export const getInfo = query => {
    return request({
        url: '/api/rOwnerInvoiceInfo/getInfo',
        method: 'post',
        data: query,
    });
};
