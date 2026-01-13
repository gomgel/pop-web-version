module.exports = {
    apps: [
        {
            name: 'pop-client',
            cwd: './client',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
        },
        {
            name: 'pop-server',
            cwd: './server',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
                PORT: 4000,
            },
        },
    ],
};
