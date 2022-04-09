import { Component, ReactNode, RefObject, createRef } from 'react';
import '../styles/Page.css';
import '../styles/Article.css';

import Loading from '../components/Loading';
import { Article, ArticleThumbnail } from '../core/Article';

import GitApi from '../api/GitApi';
import Encoding from '../core/Encoding';
import Setting from '../api/Setting';
import Direct from '../core/Direct';
import KeyValue from '../core/KeyValue';

export default class M_Articles extends Component {
    private _thumbnails!: ArticleThumbnail[];
    private _articles!: Article[];
    private _loadingForm!: RefObject<Loading>;

    private _pageNumber: number = 1;
    private _articleCountOfPage: number = 10;
    private _loadStartIndex!: number;
    private _loadEndIndex!: number;

    async componentWillMount(): Promise<void> {
        const setting = await Setting.current();
        //如果設定檔未啟用就轉到安裝頁面
        if (setting.enabled === false) {
            Direct.go('/install');
        }
        //判斷是否有token, 也表示token是否能正確被解密
        if (setting.token === '' || setting.token === null) {
            Direct.go('/');
        }
        document.title = `管理文章 - ${setting.siteName}的部落格`;

        this._loadingForm.current?.show();
        this.forceUpdate();
        await this.getArticleThumnails(setting);
        await this.beforePage();
        this._loadingForm.current?.hide();
        this.forceUpdate();
    }

    render(): ReactNode {
        this._loadingForm = createRef();
        return (
            <div>
                <div className='container-fluid pt-3'>
                    <div className='row justify-content-center'>
                        <div className='col-xl-7 col-lg-8 col-12'>
                            <h2 className='main-title'>管理文章</h2>
                            <button className='xbtn xbtn-green' onClick={() => { this.onAddArticle() }}>新增</button>
                            {this.generateArticleNodes(this._articles)}
                            <div className='text-center fw-bold text-danger'>建立,編輯,刪除文章後需等待一段時間才會更新!</div>
                            <div className='xbtn-between mt-4'>
                                <button className='xbtn xbtn-red' onClick={() => { this.onBeforePage() }}>上一頁</button>
                                <button className='xbtn xbtn-green' onClick={() => { this.onNextPage() }}>下一頁</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Loading ref={this._loadingForm}></Loading>
            </div>
        );
    }

    /**
     * 生成文章節點(元素)
     */
    generateArticleNodes(articles: Article[] | undefined): ReactNode {
        if (articles !== undefined) {
            var tempArticles = [];
            for (let i = 0; i < articles.length; i++) {
                const a = articles[i];
                tempArticles.push(
                    <div className='article' key={i}>
                        <h5 className='title'>{a.title}</h5>
                        <div className='actions'>
                            <button className='xbtn xbtn-blue me-2' onClick={() => { this.onEditArticle(a.fileName) }}>編輯</button>
                            <button className='xbtn xbtn-red' onClick={() => { this.onDeleteArticle(a) }}>刪除</button>
                        </div>
                    </div>
                );
            }
            return tempArticles;
        }
        return null;
    }

    onAddArticle(): void {
        Direct.go('/m_new');
    }
    onEditArticle(fileName: string): void {
        Direct.go(
            '/m_edit',
            new KeyValue<string, string>('fn', Encoding.toBase64(fileName)),
        );
    }
    onDeleteArticle(article: Article): void {
        if (!window.confirm(`您確定要刪除"${article.title}"這篇文章嗎?`))
            return;
        article.delete();
    }
    async onBeforePage(): Promise<void> {
        this._loadingForm.current?.show();
        this.forceUpdate();
        await this.beforePage();
        this._loadingForm.current?.hide();
        this.forceUpdate();
    }
    async onNextPage(): Promise<void> {
        this._loadingForm.current?.show();
        this.forceUpdate();
        await this.nextPage();
        this._loadingForm.current?.hide();
        this.forceUpdate();
    }

    async getArticleThumnails(setting: Setting): Promise<void> {
        //取得文章快照
        this._thumbnails = await Article.getArticles(GitApi.current, setting);
    }
    async getArticles(): Promise<void> {
        this._articles = [];
        const setting = await Setting.current();
        for (let i = this._loadStartIndex; i < this._loadEndIndex; i++) {
            //取得所有文章資料
            this._articles.push(await Article.getArticle(GitApi.current, setting, this._thumbnails[i].fileName));
        }
    }
    async beforePage(): Promise<void> {
        if (this._pageNumber <= 0)
            return;
        this._pageNumber--;
        //計算每一頁讀取文章的索引區間
        this._loadStartIndex = this._pageNumber * this._articleCountOfPage;
        this._loadEndIndex = this._loadStartIndex + this._articleCountOfPage >= this._thumbnails.length ?
            this._thumbnails.length : this._loadStartIndex + this._articleCountOfPage;

        await this.getArticles();
    }
    async nextPage(): Promise<void> {
        if ((this._pageNumber + 1) * this._articleCountOfPage >= this._thumbnails.length)
            return;
        this._pageNumber++;
        //計算每一頁讀取文章的索引區間
        this._loadStartIndex = this._pageNumber * this._articleCountOfPage;
        this._loadEndIndex = this._loadStartIndex + this._articleCountOfPage >= this._thumbnails.length ?
            this._thumbnails.length : this._loadStartIndex + this._articleCountOfPage;

        await this.getArticles();
    }
}