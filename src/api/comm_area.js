import request from '../utils/request';

export const getAllArea = query => {
    return request({
        url: '/api/rCommArea/getAllAreaByUserId',
        method: 'get',
    });
};
