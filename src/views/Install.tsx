import React, { Component, ReactNode, RefObject, createRef } from 'react';
import '../styles/Page.css';

import MessageBox from '../components/MessageBox';

import GitApi from '../api/GitApi';
import Setting from '../api/Setting';
import { Article } from '../core/Article';
import Direct from '../core/Direct';

export default class Install extends Component {
    private _msgBox!: RefObject<MessageBox>;
    private _siteTitle!: string;

    private _inputSiteName!: string;
    private _inputToken!: string;
    private _inputPassword!: string;

    async componentDidMount(): Promise<void> {
        const setting = await Setting.current();
        //如果已啟用就導向主頁面
        if (setting.enabled) {
            Direct.go('/');
        }

        document.title = this._siteTitle = '安裝設定頁面';
        this._inputSiteName = '';
        this._inputToken = '';
        this._inputPassword = '';
        this._msgBox = createRef();
        this.forceUpdate();
    }

    render(): ReactNode {
        return (
            <div>
                <div className='container-fluid'>
                    <div className='row justify-content-center'>
                        <div className='col-xl-7 col-lg-8 col-12'>
                            <h4 className='main-title mt-2 mb-2'>{this._siteTitle}</h4>
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-xl-7 col-lg-8 col-12'>
                            <div className='box box-lightyellow'>
                                <div className='input-grp'>
                                    <label>網站名稱</label>
                                    <input type="text" onInput={(e) => { this.onInputSiteName(e) }} value={this._inputSiteName} />
                                </div>
                                <div className='input-grp'>
                                    <label>GitHub Token</label>
                                    <input type="text" onInput={(e) => { this.onInputToken(e) }} value={this._inputToken} />
                                </div>
                                <div className='input-grp'>
                                    <label>Token存取密碼</label>
                                    <input type="password" onInput={(e) => { this.onInputPassword(e) }} value={this._inputPassword} />
                                </div>
                                <div className='text-center'>
                                    <small className='text-danger fw-bold'>這會將您的Token加密存在Github Repository</small>
                                </div>
                                <div>
                                    <button className='xbtn xbtn-block xbtn-green' onClick={() => { this.onBtnSubmit() }}>確定</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <MessageBox ref={this._msgBox} msgTitle='錯誤訊息' msgContent='所有欄位必須輸入' showConfirm={true} showCancel={false} onConfirm={() => { this.onErrorMsgBoxConfirm() }} onCancel={() => { }}></MessageBox>
            </div>
        );
    }

    onInputSiteName(e: React.FormEvent<HTMLInputElement>): void {
        this._inputSiteName = e.currentTarget.value;
        this.forceUpdate();
    }
    onInputToken(e: React.FormEvent<HTMLInputElement>): void {
        this._inputToken = e.currentTarget.value;
        this.forceUpdate();
    }
    onInputPassword(e: React.FormEvent<HTMLInputElement>): void {
        this._inputPassword = e.currentTarget.value;
        this.forceUpdate();
    }
    onErrorMsgBoxConfirm(): void {
        this._msgBox.current?.hide();
        this.forceUpdate();
    }
    async onBtnSubmit(): Promise<void> {
        if (this._inputSiteName === '' || this._inputToken === '' || this._inputPassword === '') {
            this._msgBox.current?.show();
            this.forceUpdate();
            return;
        }
        if (window.confirm('設定之後就無法再更改，確定嗎?') === false) {
            return;
        }
        
        const setting = await Setting.current();
        setting.enabled = true;
        setting.siteName = this._inputSiteName;
        setting.password = this._inputPassword;
        setting.token = this._inputToken;
        await setting.save(GitApi.current);
        Direct.go('/');
    }
}