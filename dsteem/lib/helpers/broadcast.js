"use strict";
/**
 * @file Broadcast API helpers.
 * @author Johan Nordberg <code@johan-nordberg.com>
 * @license
 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *  1. Redistribution of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *
 *  2. Redistribution in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *
 *  3. Neither the name of the copyright holder nor the names of its contributors
 *     may be used to endorse or promote products derived from this software without
 *     specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * You acknowledge that this software is not designed, licensed or intended for use
 * in the design, construction, operation or maintenance of any military facility.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const crypto_1 = require("./../crypto");
const account_1 = require("./../steem/account");
const asset_1 = require("./../steem/asset");
const misc_1 = require("./../steem/misc");
class BroadcastAPI {
    constructor(client) {
        this.client = client;
        /**
         * How many milliseconds in the future to set the expiry time to when
         * broadcasting a transaction, defaults to 1 minute.
         */
        this.expireTime = 60 * 1000;
    }
    /**
     * Broadcast a comment, also used to create a new top level post.
     * @param comment The comment/post.
     * @param key Private posting key of comment author.
     */
    comment(comment, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const op = ['comment', comment];
            return this.sendOperations([op], key);
        });
    }
    /**
     * Broadcast a comment and set the options.
     * @param comment The comment/post.
     * @param options The comment/post options.
     * @param key Private posting key of comment author.
     */
    commentWithOptions(comment, options, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const ops = [
                ['comment', comment],
                ['comment_options', options],
            ];
            return this.sendOperations(ops, key);
        });
    }
    /**
     * Broadcast a vote.
     * @param vote The vote to send.
     * @param key Private posting key of the voter.
     */
    vote(vote, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const op = ['vote', vote];
            return this.sendOperations([op], key);
        });
    }
    /**
     * Broadcast a transfer.
     * @param data The transfer operation payload.
     * @param key Private active key of sender.
     */
    transfer(data, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const op = ['transfer', data];
            return this.sendOperations([op], key);
        });
    }
    /**
     * Broadcast custom JSON.
     * @param data The custom_json operation payload.
     * @param key Private posting or active key.
     */
    json(data, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const op = ['custom_json', data];
            return this.sendOperations([op], key);
        });
    }
    /**
     * Create a new account.
     * @param options New account options.
     * @param key Private active key of account creator.
     */
    createAccount(options, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, metadata, creator } = options;
            const prefix = this.client.addressPrefix;
            let owner, active, posting, memo_key;
            if (options.password) {
                const ownerKey = crypto_1.PrivateKey.fromLogin(username, options.password, 'owner').createPublic(prefix);
                owner = account_1.Authority.from(ownerKey);
                const activeKey = crypto_1.PrivateKey.fromLogin(username, options.password, 'active').createPublic(prefix);
                active = account_1.Authority.from(activeKey);
                const postingKey = crypto_1.PrivateKey.fromLogin(username, options.password, 'posting').createPublic(prefix);
                posting = account_1.Authority.from(postingKey);
                memo_key = crypto_1.PrivateKey.fromLogin(username, options.password, 'memo').createPublic(prefix);
            }
            else if (options.auths) {
                owner = account_1.Authority.from(options.auths.owner);
                active = account_1.Authority.from(options.auths.active);
                posting = account_1.Authority.from(options.auths.posting);
                memo_key = crypto_1.PublicKey.from(options.auths.memoKey, prefix);
            }
            else {
                throw new Error('Must specify either password or auths');
            }
            let { fee, delegation } = options;
            if (fee === undefined || delegation === undefined) {
                const [dynamicProps, chainProps] = yield Promise.all([
                    this.client.database.getDynamicGlobalProperties(),
                    this.client.database.getChainProperties(),
                ]);
                const sharePrice = misc_1.getVestingSharePrice(dynamicProps);
                const creationFee = asset_1.Asset.from(chainProps.account_creation_fee);
                const modifier = 30; // STEEMIT_CREATE_ACCOUNT_WITH_STEEM_MODIFIER
                const ratio = 5; // STEEMIT_CREATE_ACCOUNT_DELEGATION_RATIO
                const targetDelegation = sharePrice
                    .convert(creationFee.multiply(modifier * ratio))
                    .add('0.000002 VESTS'); // add a tiny buffer since we are trying to hit a moving target
                if (delegation !== undefined && fee === undefined) {
                    delegation = asset_1.Asset.from(delegation, 'VESTS');
                    fee = asset_1.Asset.max(sharePrice.convert(targetDelegation.subtract(delegation)).divide(ratio), creationFee);
                }
                else {
                    fee = asset_1.Asset.from(fee || creationFee, 'STEEM');
                    delegation = asset_1.Asset.max(targetDelegation.subtract(sharePrice.convert(fee.multiply(ratio))), asset_1.Asset.from(0, 'VESTS'));
                }
            }
            const op = ['account_create_with_delegation', {
                    active, creator,
                    delegation: asset_1.Asset.from(delegation, 'VESTS'),
                    extensions: [],
                    fee: asset_1.Asset.from(fee, 'STEEM'),
                    json_metadata: metadata ? JSON.stringify(metadata) : '',
                    memo_key,
                    new_account_name: username,
                    owner, posting,
                }];
            return this.sendOperations([op], key);
        });
    }
    /**
     * Update account.
     * @param data The account_update payload.
     * @param key The private key of the account affected, should be the corresponding
     *            key level or higher for updating account authorities.
     */
    updateAccount(data, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const op = ['account_update', data];
            return this.sendOperations([op], key);
        });
    }
    /**
     * Delegate vesting shares from one account to the other. The vesting shares are still owned
     * by the original account, but content voting rights and bandwidth allocation are transferred
     * to the receiving account. This sets the delegation to `vesting_shares`, increasing it or
     * decreasing it as needed. (i.e. a delegation of 0 removes the delegation)
     *
     * When a delegation is removed the shares are placed in limbo for a week to prevent a satoshi
     * of VESTS from voting on the same content twice.
     *
     * @param options Delegation options.
     * @param key Private active key of the delegator.
     */
    delegateVestingShares(options, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const op = ['delegate_vesting_shares', options];
            return this.sendOperations([op], key);
        });
    }
    /**
     * Sign and broadcast transaction with operations to the network. Throws if the transaction expires.
     * @param operations List of operations to send.
     * @param key Private key(s) used to sign transaction.
     */
    sendOperations(operations, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const props = yield this.client.database.getDynamicGlobalProperties();
            const ref_block_num = props.head_block_number & 0xFFFF;
            const ref_block_prefix = Buffer.from(props.head_block_id, 'hex').readUInt32LE(4);
            const expiration = new Date(Date.now() + this.expireTime).toISOString().slice(0, -5);
            const extensions = [];
            const tx = {
                expiration,
                extensions,
                operations,
                ref_block_num,
                ref_block_prefix,
            };
            const result = yield this.send(this.sign(tx, key));
            assert(result.expired === false, 'transaction expired');
            return result;
        });
    }
    /**
     * Sign a transaction with key(s).
     */
    sign(transaction, key) {
        return crypto_1.cryptoUtils.signTransaction(transaction, key, this.client);
    }
    /**
     * Broadcast a signed transaction to the network.
     */
    send(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.call('broadcast_transaction_synchronous', [transaction]);
        });
    }
    /**
     * Convenience for calling `network_broadcast_api`.
     */
    call(method, params) {
        return this.client.call('network_broadcast_api', method, params);
    }
}
exports.BroadcastAPI = BroadcastAPI;