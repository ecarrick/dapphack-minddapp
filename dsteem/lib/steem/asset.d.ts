/**
 * Asset symbol string.
 */
export declare type AssetSymbol = 'STEEM' | 'VESTS' | 'SBD';
/**
 * Class representing a steem asset, e.g. `1.000 STEEM` or `12.112233 VESTS`.
 */
export declare class Asset {
    readonly amount: number;
    readonly symbol: AssetSymbol;
    /**
     * Create a new Asset instance from a string, e.g. `42.000 STEEM`.
     */
    static fromString(string: string, expectedSymbol?: AssetSymbol): Asset;
    /**
     * Convenience to create new Asset.
     * @param symbol Symbol to use when created from number. Will also be used to validate
     *               the asset, throws if the passed value has a different symbol than this.
     */
    static from(value: string | Asset | number, symbol?: AssetSymbol): Asset;
    /**
     * Return the smaller of the two assets.
     */
    static min(a: Asset, b: Asset): Asset;
    /**
     * Return the larger of the two assets.
     */
    static max(a: Asset, b: Asset): Asset;
    constructor(amount: number, symbol: AssetSymbol);
    /**
     * Return asset precision.
     */
    getPrecision(): number;
    /**
     * Return a string representation of this asset, e.g. `42.000 STEEM`.
     */
    toString(): string;
    /**
     * Return a new Asset instance with amount added.
     */
    add(amount: Asset | string | number): Asset;
    /**
     * Return a new Asset instance with amount subtracted.
     */
    subtract(amount: Asset | string | number): Asset;
    /**
     * Return a new Asset with the amount multiplied by factor.
     */
    multiply(factor: Asset | string | number): Asset;
    /**
     * Return a new Asset with the amount divided.
     */
    divide(divisor: Asset | string | number): Asset;
    /**
     * For JSON serialization, same as toString().
     */
    toJSON(): string;
}
/**
 * Represents quotation of the relative value of asset against another asset.
 * Similar to 'currency pair' used to determine value of currencies.
 *
 *  For example:
 *  1 EUR / 1.25 USD where:
 *  1 EUR is an asset specified as a base
 *  1.25 USD us an asset specified as a qute
 *
 *  can determine value of EUR against USD.
 */
export declare class Price {
    readonly base: Asset;
    readonly quote: Asset;
    /**
     * Convenience to create new Price.
     */
    static from(value: Price | {
        base: Asset | string;
        quote: Asset | string;
    }): Price;
    /**
     * @param base  - represents a value of the price object to be expressed relatively to quote
     *                asset. Cannot have amount == 0 if you want to build valid price.
     * @param quote - represents an relative asset. Cannot have amount == 0, otherwise
     *                asertion fail.
     *
     * Both base and quote shall have different symbol defined.
     */
    constructor(base: Asset, quote: Asset);
    /**
     * Return a string representation of this price pair.
     */
    toString(): string;
    /**
     * Return a new Asset with the price converted between the symbols in the pair.
     * Throws if passed asset symbol is not base or quote.
     */
    convert(asset: Asset): Asset;
}
