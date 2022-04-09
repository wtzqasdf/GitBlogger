import React, { Component, ReactNode, RefObject, createRef } from 'react';
import '../styles/Page.css';

import MessageBox from '../components/MessageBox';

import Setting from '../api/Setting';
import Direct from '../core/Direct';
import { Article } from '../core/Article';
import GitApi from '../api/GitApi';
import XCodeTextarea from '../components/code/XCodeTextarea';

export default class M_New extends Component {
    private _errorMsgBox!: RefObject<MessageBox>;
    private _title!: string;
    private _content!: string;

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
        
        document.title = '新增文章';
        this._title = '';
        this._content = '';
        this._errorMsgBox = createRef();
    }

    render(): ReactNode {
        return (
            <div>
                <div className='container-fluid pt-3'>
                    <div className='row justify-content-center'>
                        <div className='col-xl-7 col-lg-8 col-12'>
                            <h2 className='main-title'>新增文章</h2>
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-xl-7 col-lg-8 col-12'>
                            <div className='d-flex justify-content-between'>
                                <button className='xbtn xbtn-red' onClick={() => { this.onBeforePage(); }}>上一頁</button>
                                <button className='xbtn xbtn-green' onClick={() => { this.onSubmit(); }}>發布</button>
                            </div>
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-xl-7 col-lg-8 col-12'>
                            <div className='box'>
                                <div className='input-grp'>
                                    <label>文章標題</label>
                                    <input type="text" onInput={(e) => { this.onInputTitle(e); }} />
                                </div>
                                <div className='input-grp'>
                                    <label>文章內容</label>
                                    <XCodeTextarea value={this._content} onInput={(e) => { this.onInputContent(e) }}></XCodeTextarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/** 錯誤訊息視窗  */}
                <MessageBox ref={this._errorMsgBox} msgTitle='錯誤訊息' msgContent='標題與內容必須輸入!' showConfirm={true} showCancel={false} onConfirm={() => { this.onErrorMsgBoxConfirm() }} onCancel={() => { }}></MessageBox>
            </div>
        );
    }

    onErrorMsgBoxConfirm(): void {
        this._errorMsgBox.current?.hide();
        this.forceUpdate();
    }
    showErroMsgBox(): void {
        this._errorMsgBox.current?.show();
        this.forceUpdate();
    }

    onInputTitle(e: React.FormEvent<HTMLInputElement>): void {
        this._title = e.currentTarget.value;
    }
    onInputContent(e: React.FormEvent<HTMLTextAreaElement>): void {
        this._content = e.currentTarget.value;
    }

    onBeforePage(): void {
        Direct.go('/m_articles');
    }

    async onSubmit(): Promise<void> {
        if (this._title === '' || this._content === '') {
            this.showErroMsgBox();
            return;
        }
        const setting = await Setting.current();
        const fileName = this.generateFileName();
        const article = new Article(GitApi.current, setting, fileName, '');
        article.title = this._title;
        article.content = this._content;
        article.createDate = article.updateDate = new Date();
        article.create();
        Direct.go('/m_articles');
    }
    generateFileName(): string{
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();
        const ms = date.getMilliseconds();
        return `${year}${month}${day}${hour}${min}${sec}${ms}.article`;
    }
}