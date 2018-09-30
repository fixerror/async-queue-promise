'use strict';

const resolveFn = Symbol('resolveFn');
const maxPendingProp = Symbol('maxPending');
const maxQueuedProp = Symbol('maxQueued');
const pendingProp = Symbol('pending');
const queue = Symbol('queue');
const dequeue = Symbol('dequeue');

/**
 * class Queue
 */
class Queue {
    /**
     * @param {number|Infinity} maxPending
     * @param {number|Infinity} maxQueued
     */
    constructor({ maxPending = Infinity, maxQueued = Infinity } = {}) {
        this[pendingProp] = 0;
        this[maxPendingProp] = maxPending;
        this[maxQueuedProp] = maxQueued;
        this[queue] = [];
    }

    /**
     * Get count promise pending
     * @returns {number}
     */
    get pending() {
        return this[pendingProp];
    }

    /**
     * Get length queue
     * @returns {number}
     */
    get length() {
        return this[queue].length;
    }

    /**
     * Set item
     * @param {*} value
     * @returns {Promise<any>}
     */
    add(value) {
        return new Promise((resolve, reject) => {
            if (this.length >= this[maxQueuedProp]) {
                reject(new Error('Queue limit'));
                return false;
            }
            let temp = value;
            if (temp && typeof temp !== 'function') {
                temp = () => value;
            }
            this[queue].push({
                promiseFn: temp,
                resolve,
                reject
            });

            return this[dequeue]();
        });
    }

    /**
     * Dequeue item
     * @private
     * @returns {boolean}
     */
    [dequeue]() {
        if (this.pending >= this[maxPendingProp]) {
            return false;
        }

        const item = this[queue].shift();
        if (!item) {
            return false;
        }

        try {
            this[pendingProp] += 1;
            this[resolveFn](item.promiseFn())
                .then((value) => {
                    this[pendingProp] -= 1;
                    item.resolve(value);
                    this[dequeue]();
                })
                .catch((value) => {
                    this[pendingProp] -= 1;
                    item.reject(value);
                    this[dequeue]();
                });
        } catch (e) {
            this[pendingProp] -= 1;
            item.reject(e);
            this[dequeue]();
        }
        return true;
    }

    [resolveFn](value) {
        if (value && typeof value.then === 'function') {
            return value;
        }

        return new Promise((resolve) => {
            resolve(value);
        });
    }
}

module.exports = Queue;
