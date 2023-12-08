module.exports = {
    apps: [
        {
            name: "x-mas-letter",
            script: "./server.js",
            args: "--client=../sac_client",
            // exec_mode: "fork",
            // autorestart: true,
            watch: false,
            // min_uptime: 500,
            exec_mode: "fork",
            wait_ready: true,
            listen_timeout: 10000,
            kill_timeout: 2000,
            max_memory_restart: "500M",
        },
    ],
};
