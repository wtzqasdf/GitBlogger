import GitApi from "./GitApi";
import * as CryptoJS from 'crypto-js';

export default class Setting {
    private _enabled: boolean;
    private _owner: string;
    private _repoName: string;
    private _siteName: string;
    private _hashToken: string;

    constructor(enabled: boolean, owner: string, repoName: string, siteName: string, hashToken: string) {
        this._enabled = enabled;
        this._owner = owner;
        this._repoName = repoName;
        this._siteName = siteName;
        this._hashToken = hashToken;
    }

    // Properties
    public get enabled(): boolean {
        return this._enabled;
    }
    public set enabled(e: boolean) {
        this._enabled = e;
    }

    public get owner(): string {
        return this._owner;
    }
    public set owner(o: string) {
        this._owner = o;
    }

    public get repoName(): string {
        return this._repoName;
    }
    public set repoName(r: string) {
        this._repoName = r;
    }

    public get password(): string {
        const pw = sessionStorage.getItem('password');
        return pw === null ? '' : pw;
    }
    public set password(p: string) {
        sessionStorage.setItem('password', p);
    }

    public get hasPassword(): boolean {
        return this.password !== '' && this.password !== null && this.password !== undefined;
    }

    public get siteName(): string {
        return this._siteName;
    }
    public set siteName(s: string) {
        this._siteName = s;
    }

    /**
     * Get token, this will return decrypted token.
    */
    public get token(): string {
        const result = CryptoJS.AES.decrypt(this._hashToken, this.password);
        return result.toString(CryptoJS.enc.Utf8);
    }
    /**
    * Set token, this will auto encrypt token.
    */
    public set token(t: string) {
        const result = CryptoJS.AES.encrypt(t, this.password);
        this._hashToken = result.toString();
    }

    // Methods
    /**
     * Save this setting data.
     */
    public async save(api: GitApi): Promise<void> {
        //Only get "sha" string
        const res = await api.get(this._owner, this._repoName, Setting._fileName);
        const settingJson = {
            'enabled': true,
            'owner': this._owner,
            'repoName': this._repoName,
            'siteName': this._siteName,
            'hashToken': this._hashToken
        };
        api.update({
            owner: this._owner,
            repo: this._repoName,
            fileName: Setting._fileName,
            message: 'Update setting.json',
            content: JSON.stringify(settingJson),
            sha: res.sha,
            token: this.token
        });
    }

    // Static
    private static _fileName: string = 'setting.json';
    private static _current: Setting;
    public static async current(): Promise<Setting> {
        if (this._current === null || this._current === undefined) {
            const res = await fetch(`${window.location.pathname}${this._fileName}`, { method: 'GET' });
            var obj = await res.json();
            try {
                obj = JSON.parse(obj);
            } catch (e) {
            }
            this._current = new Setting(obj.enabled, obj.owner, obj.repoName, obj.siteName, obj.hashToken);
        }
        return this._current;
    }
}