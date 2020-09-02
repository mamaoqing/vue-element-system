import request from '../utils/request';

export const insertMeterRecord = query => {
    return request({
        url: '/api/fMeterRecord/insertMeterRecord',
        method: 'post',
        data: query
    });
};
export const exportXlsByT = query => {
    return request({
        url: '/api/fMeterRecord/export',
        method: 'post',
        params: query,
        responseType: 'blob'
    });
};
export const exportXlsTemplateByT = query => {
    return request({
        url: '/api/fMeterRecord/exportTemplate',
        method: 'post',
        params: query,
        responseType: 'blob'
    });
};

export const deleteMeterRecord = id => {

    return request({
        url: '/api/fMeterRecord/'+id,
        method: 'delete'
    });
};
export const upload = file => {

    return request({
        url: '/api/fMeterRecord/upload',
        method: 'post',
        data: file
    });
};
export const updateMeterRecord = query => {

    return request({
        url: '/api/fMeterRecord/updateMeterRecord',
        method: 'put',
        data: query
    });
};

export const checkMeterRecord = query => {

    return request({
        url: '/api/fMeterRecord/checkMeterRecord',
        method: 'put',
        data: query
    });
};
export const listMeterRecord = query => {
    return request({
        url: '/api/fMeterRecord/listMeterRecord',
        method: 'get',
        params: query
    });
};
export const listMeterRecordNum = query => {
    return request({
        url: '/api/fMeterRecord/listMeterRecordNum',
        method: 'get',
        params: query
    });
};

