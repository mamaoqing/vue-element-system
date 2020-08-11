import request from '../utils/request';

export const addRole = query => {
    console.log(query);
    return request({
        url: '/api/sRole/insertRole',
        method: 'post',
        data: query
    });
};

export const deleteRole = id => {

    return request({
        url: '/api/sRole/'+id,
        method: 'delete'
    });
};

export const updateRole = query => {

    return request({
        url: '/api/sRole/updateRole',
        method: 'put',
        data: query
    });
};
export const listRole = query => {
    return request({
        url: '/api/sRole/listRole',
        method: 'get',
        params: query
    });
};
export const listRoleNum = query => {
    return request({
        url: '/api/sRole/listRoleNum',
        method: 'get',
        params: query
    });
};

export const checkRoleMenuUser = id => {
    return request({
        url: '/api/sRole/checkRoleMenuUser/'+id,
        method: 'get'
    });
};
export const setUserRole = query => {

    return request({
        url: '/api/sRole/setUserRole',
        method: 'post',
        data: query
    });
};