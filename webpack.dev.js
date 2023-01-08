import path from 'path';
import common from './webpack.common.js';
const __dirname = path.resolve();
export default Object.assign(common,{
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 3000,
    }
})
