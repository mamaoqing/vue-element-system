import request from '../../utils/request';

export const listComm = query => {
    return request({
        url: '/api/rCommunity/listComm/'+query,
        method: 'get'
    });
};

export const listArea = query => {
    return request({
        url: '/api/rCommArea/listArea/'+query,
        method: 'get'
    });
};