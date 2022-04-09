import { Component, ReactNode, createRef } from 'react';
import '../styles/Page.css';
import '../styles/components/Footer.css';

export default class Footer extends Component<{ title: string }> {

    render(): ReactNode {
        return (
            <footer className='footer'>
                <div className='text-center'>
                    <small>Copyright © {this.props.title}</small>&nbsp;&nbsp;
                    <small className='fw-bold fst-italic'>by GitBlogger</small>
                </div>
                <div className='text-center'>
                    <small>由此<a className='link' href="#/login">登入</a>管理</small>
                </div>
            </footer>
        );
    }

}