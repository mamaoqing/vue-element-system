import request from '../utils/request';


export const listAgreement = query => {
    return request({
        url: '/api/rCommRoleAgreement/listAgreement',
        method: 'get',
        params: query
    });
};

export const insertAgreement = query => {
    return request({
        url: '/api/rCommRoleAgreement/insertAgreement',
        method: 'post',
        data: query
    });
};

export const updateAgreement = query => {
    return request({
        url: '/api/rCommRoleAgreement/updateAgreement',
        method: 'put',
        data: query
    });
};

export const deleteAgreement = id => {
    return request({
        url: '/api/rCommRoleAgreement/'+id,
        method: 'delete'
    });
};
export const allRoleList = id => {
    return request({
        url: '/api/sRole/listRoleNum',
        method: 'get',
        params:{type:'全局角色',pageNo:1 ,size:100}
    });
};

export const getCommList = id => {
    return request({
        url: '/api/rCommunity/'+id,
        method: 'get'
    });
};
