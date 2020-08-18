import request from '../../utils/request';

export const listAgreement = query => {
    return request({
        url: '/api/rCommRoleAgreement/listAgreement',
        method: 'get',
        params: query
    });
};