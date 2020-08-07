import request from '../utils/request';

export const treemenu = query => {
    return request({
        url: '/api/rCommunity/userCommunity',
        method: 'get'
    });
};
export const treeorg = query => {
    return request({
        url: '/api/sOrg/listOrg',
        method: 'get'
    });
};