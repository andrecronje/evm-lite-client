"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
const globals_1 = require("../utils/globals");
function commandTransfer(evmlc, session) {
    let description = 'Initiate a transfer of token(s) to an address. Default values for gas and gas prices are set in the' +
        ' configuration file.';
    return evmlc.command('transfer').alias('t')
        .description(description)
        .option('-i, --interactive', 'value to send')
        .option('-v, --value <value>', 'value to send')
        .option('-g, --gas <value>', 'gas to send at')
        .option('-gp, --gasprice <value>', 'gas price to send at')
        .option('-t, --to <address>', 'address to send to')
        .option('-f, --from <address>', 'address to send from')
        .types({
        string: ['t', 'to', 'f', 'from'],
    })
        .action((args) => {
        return new Promise((resolve) => {
            let interactive = args.options.interactive || session.interactive;
            // connect to API endpoints
            session.connect()
                .then((connection) => {
                session.keystore.decrypt(connection)
                    .then((accounts) => {
                    // handles signing and sending transaction
                    let handleTransfer = (tx) => {
                        let account = accounts.find((acc) => {
                            return acc.address === tx.from;
                        });
                        if (account) {
                            tx.chainId = 1;
                            tx.nonce = account.nonce;
                            account.signTransaction(tx)
                                .then((signed) => {
                                connection.api.sendRawTx(signed.rawTransaction)
                                    .then(resp => {
                                    globals_1.success(`Transferred.`);
                                    resolve();
                                })
                                    .catch(err => {
                                    console.log(err);
                                    resolve();
                                });
                            });
                        }
                        else {
                            globals_1.error('Cannot find associated local account.');
                        }
                    };
                    let choices = accounts.map((account) => {
                        return account.address;
                    });
                    let questions = [
                        {
                            name: 'from',
                            type: 'list',
                            message: 'From: ',
                            choices: choices
                        },
                        {
                            name: 'to',
                            type: 'input',
                            message: 'To'
                        },
                        {
                            name: 'value',
                            type: 'input',
                            default: '100',
                            message: 'Value: '
                        },
                        {
                            name: 'gas',
                            type: 'input',
                            default: session.config.data.defaults.gas || 10000,
                            message: 'Gas: '
                        },
                        {
                            name: 'gasPrice',
                            type: 'input',
                            default: session.config.data.defaults.gasPrice || 0,
                            message: 'Gas Price: '
                        }
                    ];
                    if (interactive) {
                        inquirer.prompt(questions)
                            .then(tx => {
                            handleTransfer(tx);
                        });
                    }
                    else {
                        let tx = {};
                        tx.from = args.options.from || undefined;
                        tx.to = args.options.to || undefined;
                        tx.value = args.options.value || undefined;
                        tx.gas = args.options.gas || session.config.data.defaults.gas || 100000;
                        tx.gasPrice = args.options.gasprice || session.config.data.defaults.gasPrice || 0;
                        if (tx.from && tx.to && tx.value) {
                            handleTransfer(tx);
                        }
                        else {
                            globals_1.error('Provide from, to and a value.');
                            resolve();
                        }
                    }
                })
                    .catch(err => globals_1.error(err));
            })
                .catch(err => globals_1.error(err));
        });
    });
}
exports.default = commandTransfer;
;
