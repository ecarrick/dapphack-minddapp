import { Client } from './../client';
import { PrivateKey, PublicKey } from './../crypto';
import { AuthorityType } from './../steem/account';
import { Asset } from './../steem/asset';
import { AccountUpdateOperation, CommentOperation, CommentOptionsOperation, CustomJsonOperation, DelegateVestingSharesOperation, Operation, TransferOperation, VoteOperation } from './../steem/operation';
import { SignedTransaction, Transaction, TransactionConfirmation } from './../steem/transaction';
export interface CreateAccountOptions {
    /**
     * Username for the new account.
     */
    username: string;
    /**
     * Password for the new account, if set, all keys will be derived from this.
     */
    password?: string;
    /**
     * Account authorities, used to manually set account keys.
     * Can not be used together with the password option.
     */
    auths?: {
        owner: AuthorityType | string | PublicKey;
        active: AuthorityType | string | PublicKey;
        posting: AuthorityType | string | PublicKey;
        memoKey: PublicKey | string;
    };
    /**
     * Creator account, fee will be deducted from this and the key to sign
     * the transaction must be the creators active key.
     */
    creator: string;
    /**
     * Account creation fee. If omitted fee will be set to lowest possible.
     */
    fee?: string | Asset | number;
    /**
     * Account delegation, amount of VESTS to delegate to the new account.
     * If omitted the delegation amount will be the lowest possible based
     * on the fee. Can be set to zero to disable delegation.
     */
    delegation?: string | Asset | number;
    /**
     * Optional account meta-data.
     */
    metadata?: {
        [key: string]: any;
    };
}
export declare class BroadcastAPI {
    readonly client: Client;
    /**
     * How many milliseconds in the future to set the expiry time to when
     * broadcasting a transaction, defaults to 1 minute.
     */
    expireTime: number;
    constructor(client: Client);
    /**
     * Broadcast a comment, also used to create a new top level post.
     * @param comment The comment/post.
     * @param key Private posting key of comment author.
     */
    comment(comment: CommentOperation[1], key: PrivateKey): Promise<TransactionConfirmation>;
    /**
     * Broadcast a comment and set the options.
     * @param comment The comment/post.
     * @param options The comment/post options.
     * @param key Private posting key of comment author.
     */
    commentWithOptions(comment: CommentOperation[1], options: CommentOptionsOperation[1], key: PrivateKey): Promise<TransactionConfirmation>;
    /**
     * Broadcast a vote.
     * @param vote The vote to send.
     * @param key Private posting key of the voter.
     */
    vote(vote: VoteOperation[1], key: PrivateKey): Promise<TransactionConfirmation>;
    /**
     * Broadcast a transfer.
     * @param data The transfer operation payload.
     * @param key Private active key of sender.
     */
    transfer(data: TransferOperation[1], key: PrivateKey): Promise<TransactionConfirmation>;
    /**
     * Broadcast custom JSON.
     * @param data The custom_json operation payload.
     * @param key Private posting or active key.
     */
    json(data: CustomJsonOperation[1], key: PrivateKey): Promise<TransactionConfirmation>;
    /**
     * Create a new account.
     * @param options New account options.
     * @param key Private active key of account creator.
     */
    createAccount(options: CreateAccountOptions, key: PrivateKey): Promise<TransactionConfirmation>;
    /**
     * Update account.
     * @param data The account_update payload.
     * @param key The private key of the account affected, should be the corresponding
     *            key level or higher for updating account authorities.
     */
    updateAccount(data: AccountUpdateOperation[1], key: PrivateKey): Promise<TransactionConfirmation>;
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
    delegateVestingShares(options: DelegateVestingSharesOperation[1], key: PrivateKey): Promise<TransactionConfirmation>;
    /**
     * Sign and broadcast transaction with operations to the network. Throws if the transaction expires.
     * @param operations List of operations to send.
     * @param key Private key(s) used to sign transaction.
     */
    sendOperations(operations: Operation[], key: PrivateKey | PrivateKey[]): Promise<TransactionConfirmation>;
    /**
     * Sign a transaction with key(s).
     */
    sign(transaction: Transaction, key: PrivateKey | PrivateKey[]): SignedTransaction;
    /**
     * Broadcast a signed transaction to the network.
     */
    send(transaction: SignedTransaction): Promise<TransactionConfirmation>;
    /**
     * Convenience for calling `network_broadcast_api`.
     */
    call(method: string, params?: any[]): Promise<any>;
}
