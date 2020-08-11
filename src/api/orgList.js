import request from '../utils/request';

export const addChildOrg = query => {
    return request({
        url: '/api/sOrg/insertOrg',
        method: 'post',
        data: query
    });
};

export const getChildOrg = id => {
    return request({
        url: '/api/sOrg/getOnlyChildOrg',
        method: 'get',
        params: id
    });
};

export const deleteOrg = id => {
    return request({
        url: '/api/sOrg/'+id,
        method: 'delete',
    });
};