module.exports = {
    slack_notification: true,
    db_write_host: "test.c32p9vantn17.ap-northeast-2.rds.amazonaws.com",
    db_write_user: "admin",
    db_write_pass: "02881212",
    db_write_name: "xmasletter",

    db_read_host: "test.c32p9vantn17.ap-northeast-2.rds.amazonaws.com",
    db_read_user: "admin",
    db_read_pass: "02881212",
    db_read_name: "xmasletter",
    env: "dev",
    firebaseConfig: {
        apiKey: 'AIzaSyD4FL_E018cOzQIL3eT3zSMbclYQKkgZ_4',
        authDomain: 'xmasletter-6aaef.firebaseapp.com',
        projectId: 'xmasletter-6aaef',
        storageBucket: 'xmasletter-6aaef.appspot.com',
        messagingSenderId: '44142301747',
        appId: '1:44142301747:web:c4f283bc466982f02a8946',
    },
    kakaoConfig: {
        apiKey: '03a73fde8c057a6dffe96af953f353f4',
        jsKey: '57856c31c4eeb528ada1fba4c922e017',
    },
};
