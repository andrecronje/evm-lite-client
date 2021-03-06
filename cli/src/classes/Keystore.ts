import * as fs from "fs";
import * as path from "path";
import * as JSONBig from 'json-bigint';

import {Account} from "../../../lib";
import {BaseAccount, warning} from "../utils/globals";
import {Controller} from "../../../lib/@types";


export default class Keystore {

    public accounts: Account[];

    constructor(readonly path: string, readonly password: string) {
        this.accounts = [];
    }

    decrypt(connection: Controller): Promise<Account[]> {
        this.accounts = [];

        let promises = [];

        fs.readdirSync(this.path).forEach((file) => {
            if (!file.startsWith('.')) {
                let keystoreFile = path.join(this.path, file);
                let v3JSONKeyStore = JSONBig.parse(fs.readFileSync(keystoreFile, 'utf8'));
                let decryptedAccount: Account = Account.decrypt(v3JSONKeyStore, this.password);

                promises.push(
                    connection.api.getAccount(decryptedAccount.address).then((a) => {
                        let account: BaseAccount = JSONBig.parse(a);

                        decryptedAccount.balance = account.balance;

                        if (typeof account.balance === 'object')
                            decryptedAccount.balance = account.balance.toFormat(0);

                        decryptedAccount.nonce = account.nonce;

                        this.accounts.push(decryptedAccount);
                    })
                );
            }
        });

        return Promise.all(promises)
            .then(() => {
                return new Promise<Account[]>(resolve => {
                    resolve(this.accounts);
                });
            })
            .catch(() => {
                return new Promise<Account[]>(resolve => {
                    resolve([])
                })
            })
    }

    create(outputPath: string = undefined, pass: string = undefined): string {
        let account: Account = Account.create();

        let output = this.path;
        let password = this.password;

        if (outputPath) {
            if (fs.existsSync(outputPath)) {
                output = outputPath;
            } else {
                warning(`Output path provided does not exists: ${outputPath}. Using default...`);
            }
        }

        if (pass) {
            if (fs.existsSync(pass)) {
                password = fs.readFileSync(pass, 'utf8');
            } else {
                warning(`Password file provided does not exists: ${pass}. Using default...`);
            }
        }

        let encryptedAccount = account.encrypt(password);
        let stringEncryptedAccount = JSONBig.stringify(encryptedAccount);
        let fileName = `UTC--date--timestamp--${account.address}`;

        fs.writeFileSync(path.join(output, fileName), stringEncryptedAccount);

        return stringEncryptedAccount;
    }

}