"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
const globals_1 = require("../utils/globals");
function commandConfigSet(evmlc, session) {
    let description = 'Set values of the configuration inside the data directory.';
    return evmlc.command('config set').alias('c s')
        .description(description)
        .option('-i, --interactive', 'enter into interactive command')
        .option('-h, --host <host>', 'default host')
        .option('-p, --port <port>', 'default port')
        .option('--from <from>', 'default from')
        .option('--gas <gas>', 'default gas')
        .option('--gasprice <gasprice>', 'gas price')
        .option('--keystore <path>', 'keystore path')
        .option('--pwd <path>', 'password path')
        .types({
        string: ['h', 'host', 'from', 'keystore', 'pwd']
    })
        .action((args) => {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                let interactive = args.options.interactive || session.interactive;
                let questions = [
                    {
                        name: 'host',
                        default: session.config.data.connection.host,
                        type: 'input',
                        message: 'Host: '
                    },
                    {
                        name: 'port',
                        default: session.config.data.connection.port,
                        type: 'input',
                        message: 'Port: '
                    },
                    {
                        name: 'from',
                        default: session.config.data.defaults.from,
                        type: 'input',
                        message: 'Default From Address: '
                    },
                    {
                        name: 'gas',
                        default: session.config.data.defaults.gas,
                        type: 'input',
                        message: 'Default Gas: '
                    },
                    {
                        name: 'gasPrice',
                        default: session.config.data.defaults.gasPrice,
                        type: 'input',
                        message: 'Default Gas Price: '
                    },
                ];
                if (interactive) {
                    let answers = yield inquirer.prompt(questions);
                    args.options.host = answers.host;
                    args.options.port = answers.port;
                    args.options.from = answers.from;
                    args.options.gas = answers.gas;
                    args.options.gasprice = answers.gasPrice;
                }
                if (!Object.keys(args.options).length) {
                    globals_1.error('No options provided. To enter interactive mode use: -i, --interactive.');
                    resolve();
                }
                for (let prop in args.options) {
                    if (prop.toLowerCase() === 'host') {
                        if (session.config.data.connection.host !== args.options[prop])
                            globals_1.success(`Updated '${(prop)}' with value ${(args.options[prop])}.`);
                        session.config.data.connection.host = args.options[prop];
                    }
                    if (prop.toLowerCase() === 'port') {
                        if (session.config.data.connection.port !== args.options[prop])
                            globals_1.success(`Updated '${(prop)}' with value ${(args.options[prop])}.`);
                        session.config.data.connection.port = args.options[prop];
                    }
                    if (prop.toLowerCase() === 'from') {
                        if (session.config.data.defaults.from !== args.options[prop])
                            globals_1.success(`Updated '${(prop)}' with value ${(args.options[prop])}.`);
                        session.config.data.defaults.from = args.options[prop];
                    }
                    if (prop.toLowerCase() === 'gas') {
                        if (session.config.data.defaults.gas !== args.options[prop])
                            globals_1.success(`Updated '${(prop)}' with value ${(args.options[prop])}.`);
                        session.config.data.defaults.gas = args.options[prop];
                    }
                    if (prop.toLowerCase() === 'gasprice') {
                        if (session.config.data.defaults.gasPrice !== args.options[prop])
                            globals_1.success(`Updated '${(prop)}' with value ${(args.options[prop])}.`);
                        session.config.data.defaults.gasPrice = args.options[prop];
                    }
                }
                session.config.save();
            }
            catch (err) {
                (typeof err === 'object') ? console.log(err) : globals_1.error(err);
            }
            resolve();
        }));
    });
}
exports.default = commandConfigSet;
;
