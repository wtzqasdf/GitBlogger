import { Component, ReactNode } from 'react';

import '../styles/Page.css';
import '../styles/View.css';

import Footer from '../components/Footer';

import GitApi from '../api/GitApi';
import Setting from '../api/Setting';
import { Article } from '../core/Article';
import Direct from '../core/Direct';
import XCodeParser from '../components/code/XCodeParser';

export default class View extends Component {
    private _article!: Article;
    private _siteName!: string;

    async componentDidMount(): Promise<void> {
        const setting = await Setting.current();
        //如果設定檔未啟用就轉到安裝頁面
        if (setting.enabled === false) {
            Direct.go('/install');
        }

        const fileName = Direct.getParam('fn');
        this._article = await Article.getArticle(GitApi.current, setting, fileName);
        document.title = `${this._article.title} - ${setting.siteName}的部落格`;
        this._siteName = setting.siteName;

        this.forceUpdate();
    }

    render(): ReactNode {
        return (
            <div>
                <div className='container-fluid'>
                    <div className='row justify-content-center'>
                        <div className='col-xl-8 col-lg-10 col-12'>
                            <h3 className='main-title mt-2 mb-2'>{this._article?.title}</h3>
                            <div><small className='fst-italic'>發布日期:{this._article?.createDate.toLocaleString()}</small></div>
                            <div><small className='fst-italic'>最後更新:{this._article?.updateDate.toLocaleString()}</small></div>
                            <div className='underline mt-2 mb-2'></div>
                            <div className='article-content-default'>
                                {new XCodeParser(this._article?.content).toNode()}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer title={this._siteName}></Footer>
            </div>
        );
    }
}