import GitApi from "../api/GitApi";
import Setting from "../api/Setting";
import Encoding from "./Encoding";

export class Article {
    private _api: GitApi;
    private _setting: Setting;
    private _fileName: string;
    private _sha: string;

    private _title: string;
    private _content: string;
    private _createDate: Date | null;
    private _updateDate: Date | null;

    constructor(api: GitApi, setting: Setting, fileName: string, sha: string) {
        this._api = api;
        this._setting = setting;
        this._fileName = fileName;
        this._sha = sha;
        this._title = '';
        this._content = '';
        this._createDate = null;
        this._updateDate = null;
    }

    public get title(): string {
        return this._title;
    }
    public set title(t: string) {
        this._title = t;
    }

    public get content(): string {
        return this._content;
    }
    public set content(c: string) {
        this._content = c;
    }

    public get fileName(): string {
        return this._fileName;
    }

    public get createDate(): Date {
        return this._createDate!;
    }
    public set createDate(d: Date) {
        this._createDate = d;
    }

    public get updateDate(): Date {
        return this._updateDate!;
    }
    public set updateDate(d: Date) {
        this._updateDate = d;
    }

    // Methods

    /**
     * 建立新文章，只有在手動創建物件時使用
     */
    public async create(): Promise<void> {
        const obj = {
            title: this._title,
            content: this._content,
            createDate: this._createDate?.toString(),
            updateDate: this._updateDate?.toString()
        };
        this._api.create({
            owner: this._setting.owner,
            repo: this._setting.repoName,
            fileName: `${Article._dirName}/${this._fileName}`,
            message: 'Create new article',
            content: obj,
            token: this._setting.token
        });
    }

    /**
     * 更新文章
     */
    public async update(): Promise<void> {
        const obj = {
            title: this._title,
            content: this._content,
            createDate: this._createDate?.toString(),
            updateDate: this._updateDate?.toString()
        };
        this._api.update({
            owner: this._setting.owner,
            repo: this._setting.repoName,
            fileName: `${Article._dirName}/${this._fileName}`,
            message: 'Update article',
            content: obj,
            sha: this._sha,
            token: this._setting.token
        });
    }

    /**
     * 刪除文章
     */
    public async delete(): Promise<void> {
        this._api.delete({
            owner: this._setting.owner,
            repo: this._setting.repoName,
            fileName: `${Article._dirName}/${this._fileName}`,
            message: 'Delete article',
            sha: this._sha,
            token: this._setting.token
        });
    }

    // Static
    private static _dirName: string = 'articles';
    /**
     * 取得所有文章, 這只會取得文章快照
     */
    public static async getArticles(api: GitApi, setting: Setting): Promise<ArticleThumbnail[]> {
        const datas = await api.getAll(setting.owner, setting.repoName, this._dirName);
        const articles: ArticleThumbnail[] = [];
        for (let i = 0; i < datas.length; i++) {
            const data = datas[i];
            articles.push(new ArticleThumbnail(data.name));
        }
        return articles;
    }

    /**
     * 取得文章內容
     */
    public static async getArticle(api: GitApi, setting: Setting, fileName: string): Promise<Article> {
        const fullPath = `${this._dirName}/${fileName}`;
        const data = await api.get(setting.owner, setting.repoName, fullPath);
        const obj = JSON.parse(Encoding.fromBase64(data.content));
        const article = new Article(api, setting, data.name, data.sha);
        article.title = obj.title;
        article.content = obj.content;
        article.createDate = new Date(obj.createDate);
        article.updateDate = new Date(obj.updateDate);
        return article;
    }
}

export class ArticleThumbnail {
    private _fileName: string;

    constructor(fileName: string) {
        this._fileName = fileName;
    }

    public get fileName(): string {
        return this._fileName;
    }
}