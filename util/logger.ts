import ip from "ip";
import path from "path";
import colors from "colors";
import winston, { format, transports } from "winston";
import winstonDaily from "winston-daily-rotate-file";
const divider = colors.gray("\n-----------------------------------");
const { combine, timestamp, printf, } = format;

const customFormat = printf(info => {
    let level = info.level.toUpperCase();
    let timestamp = colors.cyan(info.timestamp);
    switch (level) {
        case "ERROR":
            level = colors.red(level);
            break;
        case "SYSTEM":
            level = colors.green(level);
            break;
        case "CONSOLE":
            level = colors.cyan(level);
            break;
        case "DEBUG":
        default:
            level = colors.yellow(level);
            break;
    }

    return `[${timestamp}] ${level}: ${info.message}`;
});

const log_file_max_size = 1048576 * 5; // 100MB

const levels = { system: 0, error: 1, debug: 2, console: 3 };

const transport = [
    new transports.Console({
        level: "console",
        handleExceptions: true,
        format: combine(timestamp({ format: "HH:mm:ss:ms" })),
    }),
    new winstonDaily({
        level: "system",
        datePattern: "MMDD",
        dirname: path.join(__dirname, "../logs/system"),
        filename: `sac_%DATE%.system.log`,
        maxSize: log_file_max_size,
        maxFiles: 50,
        
    }),
    new winstonDaily({
        level: "error",
        datePattern: "YYYYMMDD",
        dirname: path.join(__dirname, "../logs/error"),
        filename: `sac_%DATE%.error.log`,
        maxSize: log_file_max_size,
        maxFiles: 50,
    }),
    new winstonDaily({
        level: "debug",
        datePattern: "MMDD",
        dirname: path.join(__dirname, "../logs/debug"),
        filename: `sac_%DATE%.debug.log`,
        maxSize: log_file_max_size,
        maxFiles: 100,
    }),
];

const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        customFormat
    ),
    levels: levels,
    transports: transport,
});

const stream = {
    write: message => {
        logger.info(message);
    },
};

const log = (type: string, msg : string, ...params : any[]) => {
    if(params){
        msg += ` ${params.join(" ")}`
    }
    logger.log(type, msg);
};

const template = {
    // Called when express.js app starts on given port w/o errors
    appStarted: (port, host) => {
        log("system", `Server started ! ${colors.green("✓")}`);

        log(
            "system",
            `
${colors.bold("Access URLs:")}${divider}
Localhost: ${colors.magenta(`http://${host}:${port}`)}
      LAN: ${colors.magenta(`http://${ip.address()}:${port}`)}${divider}
${colors.blue(`Press ${colors.italic("CTRL-C")} to stop`)}
    `
        );
    },
};

export { log, stream, template };
