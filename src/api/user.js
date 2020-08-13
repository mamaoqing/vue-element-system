import request from '../utils/request';

// 用户列表
export const userList = query => {
    return request({
        url: '/api/sUser/listUser',
        method: 'get',
        params:query
    });
};

// 添加用户
export const addUser = query => {
    return request({
        url: '/api/sUser/insertUser',
        method: 'post',
        params:query
    });
};

// 更新用户
export const updateUser = query => {
    return request({
        url: '/api/sUser/updateUser',
        method: 'put',
        params:query
    });
};
// 删除用户
export const deleteUser = id => {
    return request({
        url: '/api/sUser/' + id,
        method: 'delete'
    });
};
// 获取公司 如果不是超级管理员只能看到自己公司
export const getComp = id => {
    return request({
        url: '/api/sCompany/getComp',
        method: 'get'
    });
};
// 获取机构
export const getOrg = query => {
    return request({
        url: '/api/sOrg/getBaseOrg',
        method: 'get',
        params:query
    });
};

// 获取用户权限
export const getUserComm = row => {
    return request({
        url: '/api/sUserComm/listUserComm',
        method: 'get',
        params:row
    });
};

// 设置用户权限
export const setUserComm = row => {
    return request({
        url: '/api/sUserComm/setUserComm',
        method: 'post',
        params:row
    });
};
// 获取用户角色
export const getUserRole = row => {
    return request({
        url: '/api/sUserRole/listUserRole',
        method: 'get',
        params:row
    });
};

// 设置用户角色
export const setUserRole = row => {
    return request({
        url: '/api/sUser/setUserRole',
        method: 'post',
        params:row
    });
};

// 设置用户角色
export const reSetPassword = row => {
    return request({
        url: '/api/sUser/reSetPasswordAdmin',
        method: 'put',
        params:row
    });
};