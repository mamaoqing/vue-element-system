import request from '../utils/request';

export const addDictItem = query => {

    return request({
        url: '/api/sDictItem/insertDictItem',
        method: 'post',
        data: query
    });
};

export const deleteDictItem = id => {

    return request({
        url: '/api/sDictItem/'+id,
        method: 'delete'
    });
};

export const checkDictItemName = (dictId,name) => {

    return request({
        url: '/api/sDictItem/'+dictId+'/'+name,
        method: 'get'
    });
};

export const updateDictItem = query => {

    return request({
        url: '/api/sDictItem/updateDictItem',
        method: 'put',
        data: query
    });
};
export const listDictItem = query => {
    return request({
        url: '/api/sDictItem/listDictItem',
        method: 'get',
        params: query
    });
};
export const findDictItemList= query => {
    return request({
        url: '/api/sDictItem/findDictItemList',
        method: 'get',
        params: query
    });
};