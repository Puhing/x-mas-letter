const exec = require("child_process").exec;
const path = require("path");
const client = exec(`nodemon --watch '**' --ext 'ts,json' --exec \"ts-node ./index.ts ${process.argv.join(" ")}\"`, {
    windowsHide: true,
    cwd: path.join(__dirname, "./"),
    maxBuffer: 10 * 1024 * 1024 * 1024,
});
client.stdout.pipe(process.stdout);
client.stderr.pipe(process.stderr);
