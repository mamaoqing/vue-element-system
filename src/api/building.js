import request from '../utils/request';

export const insertBuilding = query => {
    return request({
        url: '/api/rBuilding/insertBuilding',
        method: 'post',
        data: query
    });
};
export const copyBuilding = query => {
    return request({
        url: '/api/rBuilding/copyBuilding',
        method: 'post',
        data: query
    });
};

export const deleteBuilding = id => {

    return request({
        url: '/api/rBuilding/'+id,
        method: 'delete'
    });
};

export const updateBuilding = query => {

    return request({
        url: '/api/rBuilding/updateBuilding',
        method: 'put',
        data: query
    });
};
export const listBuilding = query => {
    return request({
        url: '/api/rBuilding/listBuilding',
        method: 'get',
        params: query
    });
};
export const listBuildingNum = query => {
    return request({
        url: '/api/rBuilding/listBuildingNum',
        method: 'get',
        params: query
    });
};

export const getUserComm = compId => {
    return request({
        url: '/api/rBuilding/getUserComm/'+compId,
        method: 'get'
    });
};
export const getCommArea = commId => {
    return request({
        url: '/api/rBuilding/getCommArea/'+commId,
        method: 'get'
    });
};

export const getCommAreaContent = commAreaId => {
    return request({
        url: '/api/rBuilding/getCommAreaContent/'+commAreaId,
        method: 'get'
    });
};
export const getBuildings = commAreaId => {
    return request({
        url: '/api/rBuilding/getBuildings/'+commAreaId,
        method: 'get'
    });
};

export const getUnits = buildingId => {
    return request({
        url: '/api/rBuilding/getUnits/'+buildingId,
        method: 'get'
    });
};

export const getDictItemByDictId = dictId => {
    return request({
        url: '/api/sDictItem/getDictItemByDictId/'+dictId,
        method: 'get'
    });
};

export const checkBuildingRoomUnit = buildingId => {
    return request({
        url: '/api/rBuilding/checkBuildingRoomUnit/'+buildingId,
        method: 'get'
    });
};