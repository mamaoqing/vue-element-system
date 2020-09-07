module.exports = {
    baseUrl: './',
    outputDir: 'dist2',
    assetsDir: 'assets',
    lintOnSave: false,
    devServer: {
        port: 8900,
        open: false,
        https: false,
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {
            '/api':{
                target:'http://localhost:9000/',
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
                target: 'http://localhost:9001/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '/order'
                }
            }
        }
    }
}

