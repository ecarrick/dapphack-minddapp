import { PublicKey } from './../crypto';
import { Asset } from './asset';
export interface AuthorityType {
    weight_threshold: number;
    account_auths: Array<[string, number]>;
    key_auths: Array<[string | PublicKey, number]>;
}
export declare class Authority implements AuthorityType {
    /**
     * Convenience to create a new instance from PublicKey or authority object.
     */
    static from(value: string | PublicKey | AuthorityType): Authority;
    weight_threshold: number;
    account_auths: Array<[string, number]>;
    key_auths: Array<[string | PublicKey, number]>;
    constructor({weight_threshold, account_auths, key_auths}: AuthorityType);
}
export interface Account {
    id: number;
    name: string;
    owner: Authority;
    active: Authority;
    posting: Authority;
    memo_key: string;
    json_metadata: string;
    proxy: string;
    last_owner_update: string;
    last_account_update: string;
    created: string;
    mined: boolean;
    owner_challenged: boolean;
    active_challenged: boolean;
    last_owner_proved: string;
    last_active_proved: string;
    recovery_account: string;
    reset_account: string;
    last_account_recovery: string;
    comment_count: number;
    lifetime_vote_count: number;
    post_count: number;
    can_vote: boolean;
    voting_power: number;
    last_vote_time: string;
    balance: string | Asset;
    savings_balance: string | Asset;
    sbd_balance: string | Asset;
    sbd_seconds: string;
    sbd_seconds_last_update: string;
    sbd_last_interest_payment: string;
    savings_sbd_balance: string | Asset;
    savings_sbd_seconds: string;
    savings_sbd_seconds_last_update: string;
    savings_sbd_last_interest_payment: string;
    savings_withdraw_requests: number;
    reward_sbd_balance: string | Asset;
    reward_steem_balance: string | Asset;
    reward_vesting_balance: string | Asset;
    reward_vesting_steem: string | Asset;
    curation_rewards: number | string;
    posting_rewards: number | string;
    vesting_shares: string | Asset;
    delegated_vesting_shares: string | Asset;
    received_vesting_shares: string | Asset;
    vesting_withdraw_rate: string | Asset;
    next_vesting_withdrawal: string;
    withdrawn: number | string;
    to_withdraw: number | string;
    withdraw_routes: number;
    proxied_vsf_votes: number[];
    witnesses_voted_for: number;
    average_bandwidth: number | string;
    lifetime_bandwidth: number | string;
    last_bandwidth_update: string;
    average_market_bandwidth: number | string;
    lifetime_market_bandwidth: number | string;
    last_market_bandwidth_update: string;
    last_post: string;
    last_root_post: string;
}
export interface ExtendedAccount extends Account {
    /**
     * Convert vesting_shares to vesting steem.
     */
    vesting_balance: string | Asset;
    reputation: string | number;
    /**
     * Transfer to/from vesting.
     */
    transfer_history: any[];
    /**
     * Limit order / cancel / fill.
     */
    market_history: any[];
    post_history: any[];
    vote_history: any[];
    other_history: any[];
    witness_votes: string[];
    tags_usage: string[];
    guest_bloggers: string[];
    open_orders?: any[];
    comments?: any[];
    blog?: any[];
    feed?: any[];
    recent_replies?: any[];
    recommended?: any[];
}
