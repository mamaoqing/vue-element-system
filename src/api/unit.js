import request from '../utils/request';

export const getAllUnit = query => {
    return request({
        url: '/api/rUnit/getAllUnit',
        method: 'get',
        params: query,
    });
};

export const getAllModel = query => {
    return request({
        url: '/api/rUnit/getUnitModel',
        method: 'get',
    });
};

export const getComm = query => {
    return request({
        url: '/api/rCommunity/getAllComm',
        method: 'get',
    });
};

export const getArea = id => {
    return request({
        url: '/api/rCommArea/getArea/'+id,
        method: 'get',
    });
};

export const getBuild = id => {
    return request({
        url: '/api/rUnit/getBuilding/'+id,
        method: 'get',
    });
};

export const addUnit = query => {
    return request({
        url: '/api/rUnit/addUnit',
        method: 'post',
        data: query
    });
};

export const getComp = query => {
    return request({
        url: '/api/rCommArea/getComp',
        method: 'get',
    });
};

export const updateData = query => {
    return request({
        url: '/api/rUnit/updateUnit',
        method: 'post',
        data: query
    });
};

export const deleteUnit = id => {
    return request({
        url: '/api/rUnit/delUnit/'+id,
        method: 'delete',
    });
};

export const PlAddRoom = query => {
    return request({
        url: '/api/rUnit/PlAddRoom',
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        data: query
    });
};

export const copyUnit = query => {
    return request({
        url: '/api/rUnit/copyUnit',
        method: 'post',
        data: query
    });
};
