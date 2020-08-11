import request from '../utils/request';

export const addDict = query => {

    return request({
        url: '/api/sDict/insertDict',
        method: 'post',
        data: query
    });
};

export const deleteDict = id => {

    return request({
        url: '/api/sDict/'+id,
        method: 'delete'
    });
};

export const updateDict = query => {

    return request({
        url: '/api/sDict/updateDict',
        method: 'put',
        data: query
    });
};
export const listDict = query => {
    return request({
        url: '/api/sDict/listDict',
        method: 'get',
        params: query
    });
};
export const listDictAll = query => {
    return request({
        url: '/api/sDict/listDictAll',
        method: 'get',
        params: query
    });
};
export const checkDictName = (name) => {

    return request({
        url: '/api/sDict/checkDictName/'+name,
        method: 'get'
    });
};