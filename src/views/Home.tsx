import { Component, ReactNode, RefObject, createRef } from 'react';
import '../styles/Page.css';
import '../styles/Article.css';

import Loading from '../components/Loading';
import Footer from '../components/Footer';
import { Article, ArticleThumbnail } from '../core/Article';

import GitApi from '../api/GitApi';
import Setting from '../api/Setting';
import Direct from '../core/Direct';
import KeyValue from '../core/KeyValue';

export default class Home extends Component {
    private _thumbnails!: ArticleThumbnail[];
    private _articles!: Article[];
    private _loadingForm!: RefObject<Loading>;

    private _siteTitle!: string;
    private _siteName!: string;

    private _pageNumber: number = 1;
    private _articleCountOfPage: number = 10;
    private _loadStartIndex!: number;
    private _loadEndIndex!: number;

    async componentDidMount(): Promise<void> {
        const setting = await Setting.current();
        //如果設定檔未啟用就轉到安裝頁面
        if (setting.enabled === false) {
            Direct.go('/install');
        }
        document.title = this._siteTitle = `${setting.siteName}的部落格`;
        this._siteName = setting.siteName;

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
                <div className='container-fluid'>
                    <div className='row justify-content-center'>
                        <div className='col-xl-6 col-lg-8 col-12'>
                            <div>
                                <h1 className='main-title mt-2 mb-2'>{this._siteTitle}</h1>
                            </div>
                            {this.generateArticleNodes(this._articles)}
                            <div className='xbtn-between mt-4'>
                                <button className='xbtn xbtn-red' onClick={() => { this.onBeforePage() }}>上一頁</button>
                                <button className='xbtn xbtn-green' onClick={() => { this.onNextPage() }}>下一頁</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer title={this._siteName}></Footer>
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
                        <h5 className='title-active' onClick={() => { this.onToView(a) }}>{a.title}</h5>
                        <div className='d-flex justify-content-end'>
                            <small>{a.updateDate.toLocaleString()}</small>
                        </div>
                    </div>
                );
            }
            return tempArticles;
        }
        return null;
    }

    async getArticleThumnails(setting: Setting): Promise<void> {
        //取得文章快照
        this._thumbnails = await Article.getArticles(GitApi.current, setting);
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
    async getArticles(): Promise<void> {
        this._articles = [];
        const setting = await Setting.current();
        for (let i = this._loadStartIndex; i < this._loadEndIndex; i++) {
            //取得所有文章資料
            this._articles.push(await Article.getArticle(GitApi.current, setting, this._thumbnails[i].fileName));
        }
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
    onToView(article: Article): void {
        Direct.go('/view', new KeyValue<string, string>('fn', article.fileName));
    }
}