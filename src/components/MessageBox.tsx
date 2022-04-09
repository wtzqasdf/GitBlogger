import { Component, ReactNode } from 'react';
import '../styles/Page.css';
import '../styles/components/MessageBox.css';

export default class MessageBox extends Component<
    { msgTitle: string, msgContent: string, showConfirm: boolean, showCancel: boolean, onConfirm: () => void, onCancel: () => void }> {
    private _isShow!: boolean;

    componentDidMount(): void {
        this._isShow = false;
    }

    render(): ReactNode {
        var btnGroup = null;
        if (this.props.showConfirm && this.props.showCancel) {
            btnGroup = <div className='xbtn-between'>
                <button className='xbtn xbtn-red' onClick={() => { this.props.onCancel() }}>取消</button>
                <button className='xbtn xbtn-green' onClick={() => { this.props.onConfirm() }}>確定</button>
            </div>
        }
        else if (this.props.showConfirm) {
            btnGroup = <div className='xbtn-end'>
                <button className='xbtn xbtn-green' onClick={() => { this.props.onConfirm() }}>確定</button>
            </div>
        }
        else if (this.props.showCancel) {
            btnGroup = <div className='xbtn-end'>
                <button className='xbtn xbtn-red' onClick={() => { this.props.onCancel() }}>取消</button>
            </div>
        }
        if (this._isShow) {
            return (
                <div className='dark-window'>
                    <div className='inner-window'>
                        <h4 className='title'>{this.props.msgTitle}</h4>
                        <div className='content'>{this.props.msgContent}</div>
                        {btnGroup}
                    </div>
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