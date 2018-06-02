/// <reference types="node" />
/**
 * @file Steem protocol serialization.
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
import * as ByteBuffer from 'bytebuffer';
import { PublicKey } from './../crypto';
import { Asset } from './asset';
import { HexBuffer } from './misc';
import { Operation } from './operation';
export interface SerializerOptions {
    addressPrefix: string;
}
export declare type Serializer = (buffer: ByteBuffer, data: any, options: SerializerOptions) => void;
export declare const Types: {
    Array: (itemSerializer: Serializer) => (buffer: ByteBuffer, data: any[], options: SerializerOptions) => void;
    Asset: (buffer: ByteBuffer, data: string | number | Asset) => void;
    Authority: (buffer: ByteBuffer, data: {
        [key: string]: any;
    }, options: SerializerOptions) => void;
    Binary: (size?: number | undefined) => (buffer: ByteBuffer, data: HexBuffer | Buffer) => void;
    Boolean: (buffer: ByteBuffer, data: boolean) => void;
    Date: (buffer: ByteBuffer, data: string) => void;
    FlatMap: (keySerializer: Serializer, valueSerializer: Serializer) => (buffer: ByteBuffer, data: [any, any][], options: SerializerOptions) => void;
    Int16: (buffer: ByteBuffer, data: number) => void;
    Int32: (buffer: ByteBuffer, data: number) => void;
    Int64: (buffer: ByteBuffer, data: number) => void;
    Int8: (buffer: ByteBuffer, data: number) => void;
    Object: (keySerializers: [string, Serializer][]) => (buffer: ByteBuffer, data: {
        [key: string]: any;
    }, options: SerializerOptions) => void;
    Operation: (buffer: ByteBuffer, operation: Operation, options: SerializerOptions) => void;
    Optional: (valueSerializer: Serializer) => (buffer: ByteBuffer, data: any, options: SerializerOptions) => void;
    Price: (buffer: ByteBuffer, data: {
        [key: string]: any;
    }, options: SerializerOptions) => void;
    PublicKey: (buffer: ByteBuffer, data: string | Buffer | PublicKey, options: SerializerOptions) => void;
    StaticVariant: (itemSerializers: Serializer[]) => (buffer: ByteBuffer, data: [number, any], options: SerializerOptions) => void;
    String: (buffer: ByteBuffer, data: string) => void;
    Transaction: (buffer: ByteBuffer, data: {
        [key: string]: any;
    }, options: SerializerOptions) => void;
    UInt16: (buffer: ByteBuffer, data: number) => void;
    UInt32: (buffer: ByteBuffer, data: number) => void;
    UInt64: (buffer: ByteBuffer, data: number) => void;
    UInt8: (buffer: ByteBuffer, data: number) => void;
    Void: (buffer: ByteBuffer) => never;
};
