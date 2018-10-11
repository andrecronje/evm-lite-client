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
function commandAccountsCreate(evmlc, session) {
    let description = 'Allows you to create and encrypt accounts locally. Created accounts will either be placed in the' +
        ' keystore folder inside the data directory provided by the global --datadir, -d flag or if no flag is' +
        ' provided, in the keystore specified in the configuration file.';
    return evmlc.command('accounts create').alias('a c')
        .description(description)
        .option('-o, --output <path>', 'provide output path')
        .option('-p, --password <path>', 'provide password file path')
        .option('-i, --interactive', 'use interactive mode')
        .types({
        string: ['p', 'password', 'o', 'output']
    })
        .action((args) => {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                let interactive = args.options.interactive || session.interactive;
                let questions = [
                    {
                        name: 'outputPath',
                        message: 'Enter keystore output path: ',
                        default: session.keystore.path,
                        type: 'input'
                    },
                    {
                        name: 'passwordPath',
                        message: 'Enter password file path: ',
                        default: session.passwordPath,
                        type: 'input'
                    }
                ];
                if (interactive) {
                    let answers = yield inquirer.prompt(questions);
                    args.options.output = answers.outputPath;
                    args.options.password = answers.passwordPath;
                }
                globals_1.success(session.keystore.create(args.options.output, args.options.password));
            }
            catch (err) {
                (typeof err === 'object') ? console.log(err) : globals_1.error(err);
            }
            resolve();
        }));
    });
}
exports.default = commandAccountsCreate;
;
