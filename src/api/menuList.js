import request from '../utils/request';

export const addChildOrg = query => {
    return request({
        url: '/api/sOrg/insertOrg',
        method: 'post',
        data: query
    });
};

export const getMenuList = query => {
    return request({
        url: '/api/sMenu/getMenuListUser',
        method: 'get',
        params: query
    });
};