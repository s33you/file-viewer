import { program } from "commander";


export const registerCommmand = () => {
    const commandOptions = {}
    program
        .createCommand()
        .option("-p, --port <port>", "port", "8088")
        .action((params) => {
            commandOptions.port = params.port
        })
        .parse(process.argv);
    return commandOptions
}