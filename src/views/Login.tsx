import React, { Component, ReactNode } from 'react';
import '../styles/Page.css';
import Setting from '../api/Setting';
import Direct from '../core/Direct';

export default class Login extends Component {
    private _password!: string;

    async componentWillMount(): Promise<void> {
        const setting = await Setting.current();
        //如果設定檔未啟用就轉到安裝頁面
        if (setting.enabled === false) {
            Direct.go('/install');
        }
        //如果有輸入密碼就轉到管理主頁
        if (setting.hasPassword) {
            Direct.go('/m_articles');
        }

        document.title = '登入管理';
    }

    render(): ReactNode {
        return (
            <div className='container-fluid'>
                <div className='row justify-content-center mt-4'>
                    <div className='col-xl-6 col-lg-8 col-12'>
                        <div className='box box-lightblue'>
                            <h4>登入管理</h4>
                            <div className='input-grp'>
                                <label>密碼</label>
                                <input type="password" onInput={e => { this.onPasswordInput(e) }} onKeyDown={(e) => { this.onInputKeyDown(e) }} />
                            </div>
                            <button className='xbtn xbtn-block xbtn-green' onClick={() => { this.onLogin() }}>登入</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private onPasswordInput(e: React.FormEvent<HTMLInputElement>): void {
        this._password = e.currentTarget.value;
    }

    private async onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>): Promise<void> {
        if (e.key == 'Enter') {
            this.onLogin();
        }
    }

    private async onLogin(): Promise<void> {
        const setting = await Setting.current();
        setting.password = this._password;
        //在設置密碼後, 檢查token是否能被解密
        if (setting.token === '' || setting.token === null) {
            alert('密碼錯誤!');
            return;
        }
        Direct.go('/m_articles');
    }
}