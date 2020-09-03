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


export const getOwenerByRoom = query => {
    return request({
        url: '/api/rOwner/getOwenerByRoom',
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
        url: '/api/rOwner/delete/' + id,
        method: 'delete'
    });
};

export const deleteIds = delIds => {
    return request({
        url: '/api/rOwner/deleteIds',
        method: 'delete',
        params: delIds
    });
};

export const deletePropIds = delIds => {
    return request({
        url: '/api/rOwnerProperty/deleteIds',
        method: 'delete',
        params: delIds
    });
};

export const exportXlsByT = query => {
    return request({
        url: '/api/rOwner/getExcel',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: query,
        responseType: 'blob'
    });
};

export const exportXlsByTPop = query => {
    return request({
        url: '/api/rOwnerProperty/export',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: query,
        responseType: 'blob'
    });
};

export const exportTemplate = query => {
    return request({
        url: '/api/rOwnerProperty/exportTemplate',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: query,
        responseType: 'blob'
    });
};

export const fetchLinkData = query => {
    return request({
        url: '/api/rOwnerInvoiceInfo/getListByOwnerId',
        method: 'get',
        params: query
    });
};

export const deleteLinkData = id => {
    return request({
        url: '/api/rOwnerInvoiceInfo/delete/' + id,
        method: 'delete'
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
        data: query
    });
};

export const getInfo = query => {
    return request({
        url: '/api/rOwnerInvoiceInfo/getInfo',
        method: 'post',
        data: query
    });
};


export const getOwnerProp = id => {
    return request({
        url: '/api/rOwnerProperty/getOwnerProp/' + id,
        method: 'get'
    });
};

export const upload = file => {

    return request({
        url: '/api/rOwner/upload',
        method: 'post',
        data: file
    });
};

export const listProvincesAndCity = id => {
    return request({
        url: '/api/rProvince/listProvincesAndCity',
        method: 'get'
    });
};

export const insertRoomOwnerOrPark = query => {
    return request({
        url: '/api/rOwnerProperty/insertRoomOwnerOrPark',
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        data: query
    });
};

export const deleteOwnerProp = id => {
    return request({
        url: '/api/rOwnerProperty/deleteOwnerProp/' + id,
        method: 'delete'
    });
};

export const updateOwnerProp = query => {
    return request({
        url: '/api/rOwnerProperty/update',
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        data: query
    });
};

export const getAllProp = query => {
    return request({
        url: '/api/rOwnerProperty/getAllProp',
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        data: query
    });
};

