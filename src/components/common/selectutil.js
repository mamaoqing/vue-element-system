import request from '../../utils/request';

export const listComm = query => {
    return request({
        url: '/api/rCommunity/listComm/'+query,
        method: 'get'
    });
};