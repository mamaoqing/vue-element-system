import request from '../utils/request';

export const insertMeter = query => {
    return request({
        url: '/api/fMeter/insertMeter',
        method: 'post',
        data: query
    });
};
export const exportXlsByT = query => {
    return request({
        url: '/api/fMeter/export',
        method: 'post',
        params: query,
        responseType: 'blob'
    });
};
export const deleteMeter = id => {

    return request({
        url: '/api/fMeter/'+id,
        method: 'delete'
    });
};
export const upload = file => {

    return request({
        url: '/api/fMeter/upload',
        method: 'post',
        data: file
    });
};
export const updateMeter = query => {

    return request({
        url: '/api/fMeter/updateMeter',
        method: 'put',
        data: query
    });
};
export const listMeter = query => {
    return request({
        url: '/api/fMeter/listMeter',
        method: 'get',
        params: query
    });
};
export const listMeterNum = query => {
    return request({
        url: '/api/fMeter/listMeterNum',
        method: 'get',
        params: query
    });
};
export const checkMeterNo = query => {
    return request({
        url: '/api/fMeter/checkMeterNo',
        method: 'post',
        data: query
    });
};
