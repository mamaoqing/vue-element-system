import request from '../utils/request';

export const insertRoom = query => {
    return request({
        url: '/api/rRoom/insertRoom',
        method: 'post',
        data: query
    });
};

export const deleteRoom = id => {

    return request({
        url: '/api/rRoom/'+id,
        method: 'delete'
    });
};
export const upload = file => {

    return request({
        url: '/api/rRoom/upload',
        method: 'post',
        data: file
    });
};
export const checkRoomOwer = roomId => {
    return request({
        url: '/api/rRoom/checkRoomOwer/'+roomId,
        method: 'get'
    });
};
export const updateRoom = query => {

    return request({
        url: '/api/rRoom/updateRoom',
        method: 'put',
        data: query
    });
};
export const listRoom = query => {
    return request({
        url: '/api/rRoom/listRoom',
        method: 'get',
        params: query
    });
};
export const listRoomNum = query => {
    return request({
        url: '/api/rRoom/listRoomNum',
        method: 'get',
        params: query
    });
};

