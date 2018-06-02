/// <reference types="node" />
import { SignedTransaction, Transaction } from './steem/transaction';
/**
 * Network id used in WIF-encoding.
 */
export declare const NETWORK_ID: Buffer;
/**
 * ECDSA (secp256k1) public key.
 */
export declare class PublicKey {
    readonly key: Buffer;
    readonly prefix: string;
    /**
     * Create a new instance from a WIF-encoded key.
     */
    static fromString(wif: string, prefix?: string): PublicKey;
    /**
     * Create a new instance.
     */
    static from(value: string | PublicKey | Buffer, prefix?: string): PublicKey;
    constructor(key: Buffer, prefix?: string);
    /**
     * Verify a 32-byte signature.
     * @param message 32-byte message to verify.
     * @param signature Signature to verify.
     */
    verify(message: Buffer, signature: Signature): boolean;
    /**
     * Return a WIF-encoded representation of the key.
     */
    toString(): string;
    /**
     * Return JSON representation of this key, same as toString().
     */
    toJSON(): string;
    /**
     * Used by `utils.inspect` and `console.log` in node.js.
     */
    inspect(): string;
}
export declare type KeyRole = 'owner' | 'active' | 'posting' | 'memo';
/**
 * ECDSA (secp256k1) private key.
 */
export declare class PrivateKey {
    private key;
    /**
     * Convenience to create a new instance from WIF string or buffer.
     */
    static from(value: string | Buffer): PrivateKey;
    /**
     * Create a new instance from a WIF-encoded key.
     */
    static fromString(wif: string): PrivateKey;
    /**
     * Create a new instance from a seed.
     */
    static fromSeed(seed: string): PrivateKey;
    /**
     * Create key from username and password.
     */
    static fromLogin(username: string, password: string, role?: KeyRole): PrivateKey;
    constructor(key: Buffer);
    /**
     * Sign message.
     * @param message 32-byte message.
     */
    sign(message: Buffer): Signature;
    /**
     * Derive the public key for this private key.
     */
    createPublic(prefix?: string): PublicKey;
    /**
     * Return a WIF-encoded representation of the key.
     */
    toString(): string;
    /**
     * Used by `utils.inspect` and `console.log` in node.js. Does not show the full key
     * to get the full encoded key you need to explicitly call {@link toString}.
     */
    inspect(): string;
}
/**
 * ECDSA (secp256k1) signature.
 */
export declare class Signature {
    data: Buffer;
    recovery: number;
    static fromBuffer(buffer: Buffer): Signature;
    static fromString(string: string): Signature;
    constructor(data: Buffer, recovery: number);
    /**
     * Recover public key from signature by providing original signed message.
     * @param message 32-byte message that was used to create the signature.
     */
    recover(message: Buffer, prefix?: string): PublicKey;
    toBuffer(): Buffer;
    toString(): string;
}
/** Misc crypto utility functions. */
export declare const cryptoUtils: {
    decodePrivate: (encodedKey: string) => Buffer;
    doubleSha256: (input: string | Buffer) => Buffer;
    encodePrivate: (key: Buffer) => string;
    encodePublic: (key: Buffer, prefix: string) => string;
    isCanonicalSignature: (signature: Buffer) => boolean;
    ripemd160: (input: string | Buffer) => Buffer;
    sha256: (input: string | Buffer) => Buffer;
    signTransaction: (transaction: Transaction, keys: PrivateKey | PrivateKey[], options: {
        chainId: Buffer;
        addressPrefix: string;
    }) => SignedTransaction;
};
