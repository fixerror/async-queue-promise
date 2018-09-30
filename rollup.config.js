import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';

export default [
    {
        input: 'src/index.js',
        output: {
            name: 'sync-queue',
            file: pkg.browser,
            format: 'umd'
        },
        plugins: [
            babel({
                runtimeHelpers: 'true',
                exclude: 'node_modules/**'
            }),
            resolve(),
            commonjs()
        ]
    },
    {
        input: 'src/index.js',
        external: ['ms'],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' }
        ]
    }
];
