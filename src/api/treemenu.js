import request from '../utils/request';

export const treemenu = query => {
    return request({
        url: '/api/rCommunity/userCommunity',
        method: 'get'
    });
};