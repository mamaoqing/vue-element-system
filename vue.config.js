module.exports = {
    baseUrl: './',
    outputDir: 'dist2',
    assetsDir: 'assets',
    lintOnSave: false,
    devServer: {
        port: 8900,
        open: true,
        https: false,
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {
            '/api':{
                target:'http://192.168.0.107:9000/',
                changeOrigin: true,
                ws: true,
                write: {
                    encode: true
                },
                pathRewrite: {
                    '^/api': '/sdzy'
                }
            },
            '/order': {
                target: 'http://192.168.0.107:9001/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '/order'
                }
            }
        }
    }
}

