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
                target:'http://192.168.0.106:9000/',
                changeOrigin: true,
                ws: true,
                write: {
                    encode: true
                },
                pathRewrite: {
                    '^/api': '/sdzy'
                }
            }
        }
    }
}

