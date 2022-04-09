import { Component, ReactNode, createRef } from 'react';
import '../styles/components/Loading.css'

export default class Loading extends Component {
    private _isShow!: boolean;

    componentDidMount(): void {
        this._isShow = false;
    }

    render(): ReactNode {
        if (this._isShow) {
            return (
                <div className='loading-form'>
                    <span className='loading-text'>請稍候</span>
                </div>
            );
        }
        return null;
    }

    show(): void {
        this._isShow = true;
    }
    hide(): void {
        this._isShow = false;
    }
}