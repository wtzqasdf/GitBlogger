import Encoding from '../core/Encoding';

export default class GitApi {
    private _baseUrl: string;

    constructor() {
        this._baseUrl = 'https://api.github.com';
    }

    /**
     * 取得檔案內容
     */
    public async get(owner: string, repo: string, fileName: string): Promise<GitResponse> {
        const fullUrl = `${this._baseUrl}/repos/${owner}/${repo}/contents/${fileName}`;
        const res = await fetch(fullUrl, { method: 'GET' });
        const data = await res.json();
        return new GitResponse(data.name, data.path, data.sha, data.content);
    }

    /**
     * 取得所有檔案資料
     */
    public async getAll(owner: string, repo: string, dirName: string): Promise<GitResponse[]> {
        const fullUrl = `${this._baseUrl}/repos/${owner}/${repo}/contents/${dirName}`;
        const res = await fetch(fullUrl, { method: 'GET' });
        const datas = await res.json();
        const responses: GitResponse[] = [];
        for (let i = 0; i < datas.length; i++) {
            const d = datas[i];
            responses.push(new GitResponse(d.name, d.path, d.sha, ''));
        }
        return responses;
    }

    /**
     * 建立新檔案
     */
    public async create({ owner, repo, fileName, message, content, token }: {
        owner: string,
        repo: string,
        fileName: string,
        message: string,
        content: any,
        token: string
    }): Promise<Response> {
        const body = {
            message: message,
            content: Encoding.toBase64(JSON.stringify(content)),
        };
        const fullUrl = `${this._baseUrl}/repos/${owner}/${repo}/contents/${fileName}`;
        const res = await fetch(fullUrl, {
            headers: new Headers({ 'Authorization': `Token ${token}` }),
            method: 'PUT',
            body: JSON.stringify(body)
        })
        return res;
    }

    /**
     * 更新檔案
     */
    public async update({ owner, repo, fileName, message, content, sha, token }: {
        owner: string,
        repo: string,
        fileName: string,
        message: string,
        content: any,
        sha: string,
        token: string
    }): Promise<Response> {
        const body = {
            message: message,
            content: Encoding.toBase64(JSON.stringify(content)),
            sha: sha
        };
        const fullUrl = `${this._baseUrl}/repos/${owner}/${repo}/contents/${fileName}`;
        const res = await fetch(fullUrl, {
            headers: new Headers({ 'Authorization': `Token ${token}` }),
            method: 'PUT',
            body: JSON.stringify(body)
        })
        return res;
    }

    /**
     * 刪除檔案
     */
    public async delete({ owner, repo, fileName, message, sha, token }: {
        owner: string,
        repo: string,
        fileName: string,
        message: string,
        sha: string,
        token: string
    }): Promise<Response> {
        const body = {
            message: message,
            sha: sha
        };
        const fullUrl = `${this._baseUrl}/repos/${owner}/${repo}/contents/${fileName}`;
        const res = await fetch(fullUrl, {
            headers: new Headers({ 'Authorization': `Token ${token}` }),
            method: 'DELETE',
            body: JSON.stringify(body)
        });
        return res;
    }

    // Static
    private static _api: GitApi;
    public static get current(): GitApi {
        if (this._api === null || this._api === undefined) {
            this._api = new GitApi();
        }
        return this._api;
    }
}

export class GitResponse {
    private _name: string;
    private _path: string;
    private _sha: string;
    private _content: string;

    constructor(name: string, path: string, sha: string, content: string) {
        this._name = name;
        this._path = path;
        this._sha = sha;
        this._content = content;
    }

    public get name(): string {
        return this._name;
    }
    public get path(): string {
        return this._path;
    }
    public get sha(): string {
        return this._sha;
    }
    public get content(): string {
        return this._content;
    }
}