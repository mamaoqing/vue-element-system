import request from '../../utils/request';

export const listPark = query => {
    return request({
        url: '/api/rParkingSpace/listPark',
        method: 'get',
        params: query
    });
};

export const updatePark = query => {
    return request({
        url: '/api/rParkingSpace/updatePark',
        method: 'put',
        data: query
    });
};

export const insertPark = query => {
    return request({
        url: '/api/rParkingSpace/insertPark',
        method: 'post',
        data: query
    });
};

export const deletePark = query => {
    return request({
        url: '/api/rParkingSpace/'+query,
        method: 'delete'
    });
};

export const upload = query => {
    return request({
        url: '/api/rParkingSpace/fileUpload',
        method: 'post',
        data:query
    });
};

export const exportExcel = query => {
    return request({
        url: '/api/file/exportFile',
        method: 'get',
        params: {className :query},
        responseType: 'blob'
    });
};

export const listOwner = query => {
    return request({
        url: '/api/rOwnerProperty/ownerPro/'+query,
        method: 'get'
    });
};

export const deleteAllPark = query => {
    return request({
        url: '/api/rParkingSpace/deleteAll/'+query,
        method: 'delete'
    });
};

