import request from '../utils/request';

// 用户列表
export const listCommunity = query => {
    return request({
        url: '/api/rCommunity/listCommunity',
        method: 'get',
        params:query
    });
};

export const addComm = query => {
    return request({
        url: '/api/rCommunity/insertCommunity',
        method: 'post',
        data:query
    });
};

export const updateComm = query => {
    return request({
        url: '/api/rCommunity/updateCommunity',
        method: 'put',
        data:query
    });
};

export const deleteComm = id => {
    return request({
        url: '/api/rCommunity/'+id,
        method: 'delete'
    });
};