import request from '../utils/request';

export const getOwenList = query => {
    return request({
        url: '/api/rOwner/getOwenerList',
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        data: query
    });
};
