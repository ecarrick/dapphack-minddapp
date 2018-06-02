/// <reference types="node" />
import { Blockchain } from './helpers/blockchain';
import { BroadcastAPI } from './helpers/broadcast';
import { DatabaseAPI } from './helpers/database';
/**
 * Library version.
 */
export declare const VERSION: string;
/**
 * Main steem network chain id.
 */
export declare const DEFAULT_CHAIN_ID: Buffer;
/**
 * Main steem network address prefix.
 */
export declare const DEFAULT_ADDRESS_PREFIX = "STM";
/**
 * RPC Client options
 * ------------------
 */
export interface ClientOptions {
    /**
     * Steem chain id. Defaults to main steem network:
     * `0000000000000000000000000000000000000000000000000000000000000000`
     */
    chainId?: string;
    /**
     * Steem address prefix. Defaults to main steem network:
     * `STM`
     */
    addressPrefix?: string;
    /**
     * Send timeout, how long to wait in milliseconds before giving
     * up on a rpc call. Note that this is not an exact timeout,
     * no in-flight requests will be aborted, they will just not
     * be retried any more past the timeout.
     * Can be set to 0 to retry forever. Defaults to 60 * 1000 ms.
     */
    timeout?: number;
    /**
     * Retry backoff function, returns milliseconds. Default = {@link defaultBackoff}.
     */
    backoff?: (tries: number) => number;
    /**
     * Node.js http(s) agent, use if you want http keep-alive.
     * Defaults to using https.globalAgent.
     * @see https://nodejs.org/api/http.html#http_new_agent_options.
     */
    agent?: any;
}
/**
 * RPC Client
 * ----------
 * Can be used in both node.js and the browser. Also see {@link ClientOptions}.
 */
export declare class Client {
    /**
     * Create a new client instance configured for the testnet.
     */
    static testnet(options?: ClientOptions): Client;
    /**
     * Client options, *read-only*.
     */
    readonly options: ClientOptions;
    /**
     * Address to Steem RPC server, *read-only*.
     */
    readonly address: string;
    /**
     * Database API helper.
     */
    readonly database: DatabaseAPI;
    /**
     * Broadcast API helper.
     */
    readonly broadcast: BroadcastAPI;
    /**
     * Blockchain helper.
     */
    readonly blockchain: Blockchain;
    /**
     * Chain ID for current network.
     */
    readonly chainId: Buffer;
    /**
     * Address prefix for current network.
     */
    readonly addressPrefix: string;
    private seqNo;
    private timeout;
    private backoff;
    /**
     * @param address The address to the Steem RPC server, e.g. `https://api.steemit.com`.
     * @param options Client options.
     */
    constructor(address: string, options?: ClientOptions);
    /**
     * Make a RPC call to the server.
     *
     * @param api     The API to call, e.g. `database_api`.
     * @param method  The API method, e.g. `get_dynamic_global_properties`.
     * @param params  Array of parameters to pass to the method, optional.
     *
     */
    call(api: string, method: string, params?: any[]): Promise<any>;
}
