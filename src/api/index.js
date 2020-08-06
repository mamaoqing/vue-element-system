import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: '/api/sCompany/listCompany',
        method: 'get',
        params: query
    });
};
export const updateData = query => {

    return request({
        url: '/api/sCompany/updateCompany',
        method: 'put',
        data: query
    });
};

export const deleteData = id => {

    return request({
        url: '/api/sCompany/' + id,
        method: 'delete'

    });
};

export const addData = query => {

    return request({
        url: '/api/sCompany/insertCompany',
        method: 'post',
        data: query
    });
};

export const fetchLinkData = query => {

    return request({
        url: '/api/sCompLink/'+query.id,
        method: 'get',
        params: query
    });
};

export const deleteLinkData = id => {

    return request({
        url: '/api/sCompLink/'+id,
        method: 'delete'
    });
};

export const updateLinkData = query => {

    return request({
        url: '/api/sCompLink/updateCompLink',
        method: 'put',
        data: query
    });
};

export const addLinkData = query => {
    console.log(query)
    return request({
        url: '/api/sCompLink/insertCompLink',
        method: 'post',
        data: query
    });
};

export const getProvinceDict = query => {
    return request({
        url: '/api/rProvince/get',
        method: 'get'
    });
};

export const getCityDict = query => {
    return request({
        url: '/api/rProvince/get',
        method: 'get'
    });
};
