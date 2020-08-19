import request from '../utils/request';

export const getCityList = id => {
    return request({
        url: '/api/rProvince/getCityList',
        method: 'get',
        params: id
    });
};

export const getDistList = id => {
    return request({
        url: '/api/rProvince/getDistList',
        method: 'get',
        params: id
    });
};