import request from '../utils/request';

export const getAllArea = query => {
    return request({
        url: '/api/rCommArea/getAllAreaByUserId',
        method: 'get',
        params: query,
    });
};

export const getComm = query => {
    return request({
        url: '/api/rCommunity/getAllComm',
        method: 'get',
    });
};

export const getCommById = id => {
    return request({
        url: '/api/rCommunity/'+id,
        method: 'get',
    });
};

export const addArea = query => {
    return request({
        url: '/api/rCommArea/insertArea',
        method: 'post',
        data: query
    });
};

export const getComp = query => {
    return request({
        url: '/api/rCommArea/getComp',
        method: 'get',
    });
};

export const updateData = query => {
    return request({
        url: '/api/rCommArea/update',
        method: 'post',
        data: query
    });
};

export const deleteData = id => {
    return request({
        url: '/api/rCommArea/'+id,
        method: 'delete',
    });
};
