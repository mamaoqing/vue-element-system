import request from '../utils/request';

export const addMenu = query => {
    return request({
        url: '/api/sMenu/insertMenu',
        method: 'post',
        data: query
    });
};

export const updateMenu = query => {
    return request({
        url: '/api/sMenu/updateMenu',
        method: 'put',
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
export const deleteMenu = id => {
    return request({
        url: '/api/sMenu/'+id,
        method: 'delete'
    });
};