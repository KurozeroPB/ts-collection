class Collection extends Map {
    /**
     * Another way is to use `base: new () => T` or `base: T&Function` but this does not work with abstract classes.
     *
     * @param {AbstractClass | null} [base] The type of the collection, even though it's optional it's better to always pass a param
     * @param {T[] | Record<string|number|symbol, T> | null} [from] Construct new Collection with items from array or object
     */
    constructor(base, from) {
        super();
        this.TName = base ? base.name : "any";
        if (from) {
            if (Array.isArray(from)) {
                for (let i = 0; i < from.length; i++) {
                    this.set(i, from[i]);
                }
            }
            else if (from instanceof Object) {
                for (const [key, value] of Object.entries(from)) {
                    this.set(key, value);
                }
            }
        }
    }
    /**
     * Create a Collection from an Array or Object
     *
     * @since 0.2.0
     *
     * @param {any[] | Record<string|number|symbol, any>} x The array you want to create a collection from
     * @returns {Collection<any>} The created collection
     */
    static from(x) {
        const col = new Collection();
        if (Array.isArray(x)) {
            for (let i = 0; i < x.length; i++) {
                col.set(i, x[i]);
            }
        }
        else if (x instanceof Object) {
            for (const [key, value] of Object.entries(x)) {
                col.set(key, value);
            }
        }
        return col;
    }
    /**
     * Merge multiple collections together
     *
     * @since 0.3.4
     *
     * @param {Collection<any>[]} collections All the collections you want to merge together
     */
    static merge(...collections) {
        const temp = new Collection();
        for (let i = 0; i < collections.length; i++) {
            for (const value of collections[i].values()) {
                temp.set(temp.size, value);
            }
        }
        return temp;
    }
    /**
     * Simple set function
     * If `v` has an index named `_key` it will use it as the key
     *
     * @since 0.2.0
     *
     * @example
     * ```ts
     * const collection = new Collection<string>(String);
     * collection.add("foo");
     * // Collection {
     * //     0 => 'foo'
     * // }
     * ```
     *
     * @param {T} v Value to add to the collection
     */
    add(v) {
        if (v["_key"]) {
            this.set(v["_key"], v);
        }
        else {
            this.set(this.size, v);
        }
    }
    /**
     * Add multiple items at once to the collection
     *
     * @since 0.3.3
     *
     * @example
     * ```ts
     * const collection = new Collection<string>(String);
     * collection.addMany(["foo", "bar", "baz", "123"]);
     * collection.addMany({ "foo": "bar", "baz": "123" });
     * // Collection {
     * //     0 => 'foo',
     * //     1 => 'bar',
     * //     2 => 'baz',
     * //     3 => '123',
     * //     'foo' => 'bar',
     * //     'baz' => '123'
     * // }
     * ```
     *
     * @param {T[] | Record<string|number|symbol, T>} x The array with items
     */
    addMany(x) {
        if (Array.isArray(x)) {
            for (let i = 0; i < x.length; i++) {
                this.set(this.size, x[i]);
            }
        }
        else if (x instanceof Object) {
            for (const [key, value] of Object.entries(x)) {
                this.set(key, value);
            }
        }
    }
    /**
     * Returns first matching Object or undefined if no match
     *
     * @since 0.1.0
     *
     * @example
     * ```ts
     * const collection = new Collection<string>(String, ["foo", "bar", "baz", "123"]);
     * collection.find((item) => item === "foo");
     * // "foo"
     * ```
     *
     * @param {Function} fn A function that returns true if it matches the given param
     * @returns {T | undefined} The first matching object or undefined if none found
     */
    find(fn) {
        for (const item of this.values()) {
            if (fn(item))
                return item;
        }
        return undefined;
    }
    /**
     * Returns an Array with all the elements that make the function evaluate true
     *
     * @since 0.1.0
     *
     * @example
     * ```ts
     * const collection = new Collection<string>(String, ["foo", "bar", "baz", "123"]);
     * collection.filter((item) => item.includes("a"));
     * // [
     * //     "bar",
     * //     "baz"
     * // ]
     * ```
     *
     * @param {Function} fn A function that returns true if it matches the given param
     * @returns {T[]} An array with all the elements that evaluated true
     */
    filter(fn) {
        const results = [];
        for (const item of this.values()) {
            if (fn(item))
                results.push(item);
        }
        return results;
    }
    /**
     * Returns an Array with the results of applying the given function to each element
     *
     * @since 0.1.0
     *
     * @param {Function} fn A function that returns a result
     * @returns {R[]} An array with the results
     */
    map(fn) {
        const results = [];
        const arr = Array.from(this.values());
        for (let i = 0; i < arr.length; i++) {
            results.push(fn(arr[i], i, this));
        }
        return results;
    }
    /**
     * Merge two collections
     *
     * @since 0.1.0
     *
     * @param {Collection<T>} x A collection to merge together with this
     * @returns {Collection<T>} The merged collection
     */
    merge(x) {
        const temp = new Collection();
        for (const [key, value] of this) {
            temp.set(key, value);
        }
        for (const value of x.values()) {
            temp.set(temp.size, value);
        }
        return temp;
    }
    /**
     * Returns a random Object from the Collection or undefined if the Collection is empty
     *
     * @since 0.1.0
     *
     * @returns {T|undefined} The random object or undefined if none exist
     */
    random() {
        if (!this.size)
            return undefined;
        return Array.from(this.values())[Math.floor(Math.random() * this.size)];
    }
    /**
     * @since 0.1.0
     */
    toString() {
        return `[Collection<${this.TName}>]`;
    }
}

export default Collection;
export { Collection };
