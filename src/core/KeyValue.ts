export default class KeyValue<In, Out> {
    private _key: In;
    private _value: Out;

    constructor(key: In, value: Out) {
        this._key = key;
        this._value = value;
    }

    public get key(): In {
        return this._key;
    }
    public get value(): Out {
        return this._value;
    }
}