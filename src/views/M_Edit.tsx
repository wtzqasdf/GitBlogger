import { Component, ReactNode, RefObject, createRef } from 'react';
import '../styles/Page.css';

import MessageBox from '../components/MessageBox';

import GitApi from '../api/GitApi';
import Setting from '../api/Setting';
import { Article } from '../core/Article';
import Direct from '../core/Direct';
import Encoding from '../core/Encoding';
import XCodeTextarea from '../components/code/XCodeTextarea';

export default class M_Edit extends Component {
    private _msgBox!: RefObject<MessageBox>;
    private _article!: Article;

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
        document.title = '編輯文章';

        this._msgBox = createRef();
        const fileNameBase64 = Direct.getParam('fn');
        const fileName = Encoding.fromBase64(fileNameBase64);
        this._article = await Article.getArticle(GitApi.current, setting, fileName);
        this.forceUpdate();
    }

    render(): ReactNode {
        return (
            <div>
                <div className='container-fluid pt-3'>
                    <div className='row justify-content-center'>
                        <div className='col-xl-7 col-lg-8 col-12'>
                            <h2 className='main-title'>編輯文章</h2>
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-xl-7 col-lg-8 col-12'>
                            <div className='d-flex justify-content-between'>
                                <button className='xbtn xbtn-red' onClick={() => { this.onBeforePage() }}>上一頁</button>
                                <button className='xbtn xbtn-green' onClick={() => { this.onSubmit() }}>更新</button>
                            </div>
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-xl-7 col-lg-8 col-12'>
                            <div className='box'>
                                <div className='input-grp'>
                                    <label>文章標題</label>
                                    <input type="text" onInput={(e) => { this.onInputTitle(e); }} value={this._article?.title} />
                                </div>
                                <div className='input-grp'>
                                    <label>文章內容</label>
                                    <XCodeTextarea value={this._article?.content} onInput={(e) => { this.onInputContent(e) }}></XCodeTextarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/** 錯誤訊息視窗  */}
                <MessageBox ref={this._msgBox} msgTitle='錯誤訊息' msgContent='標題與內容必須輸入!' showConfirm={true} showCancel={false} onConfirm={() => { this.onErrorMsgBoxConfirm() }} onCancel={() => { }}></MessageBox>
            </div>
        );
    }

    onErrorMsgBoxConfirm(): void {
        this._msgBox.current?.hide();
        this.forceUpdate();
    }
    showErroMsgBox(): void {
        this._msgBox.current?.show();
        this.forceUpdate();
    }

    onInputTitle(e: React.FormEvent<HTMLInputElement>): void {
        this._article.title = e.currentTarget.value;
        this.forceUpdate();
    }
    onInputContent(e: React.FormEvent<HTMLTextAreaElement>): void {
        this._article.content = e.currentTarget.value;
        this.forceUpdate();
    }

    onBeforePage(): void {
        Direct.go('/m_articles');
    }

    async onSubmit(): Promise<void> {
        if (this._article.title === '' || this._article.content === '') {
            this.showErroMsgBox();
            return;
        }
        this._article.updateDate = new Date();
        await this._article.update();
        Direct.go('/m_articles');
    }
}