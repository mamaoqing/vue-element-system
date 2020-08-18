import request from '../utils/request';

// 用户列表
export const listCommunity = query => {
    return request({
        url: '/api/rCommunity/listCommunity',
        method: 'get',
        params:query
    });
};