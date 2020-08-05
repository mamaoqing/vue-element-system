module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    // devServer: {
    //     proxy: {
    //         '/api':{
    //             target:'http://jsonplaceholder.typicode.com',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 '/api':''
    //             }
    //         }
    //     }
    // }

    devServer:{
    port:8080,
        open:true,
        https:false,
        overlay: {
        warnings: true,
            errors: true
    },
    proxy: {
        '/api': {
            target: 'http://192.168.0.105:9000/', //对应自己的接口
                changeOrigin: true,
                ws: true,
                write:{
                    encode : true
                },
                pathRewrite: {
                '^/api': '/sdzy'
            }
        }
    }
}
}
