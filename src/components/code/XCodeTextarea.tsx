import React, { Component, ReactNode, RefObject, createRef } from 'react';
import '../../styles/components/code/XCodeTextarea.css';

export default class XCodeTextarea extends Component<{ value: string, onInput: (e: React.FormEvent<HTMLTextAreaElement>) => void }> {

    render(): ReactNode {
        return (
            <div className='xcode-grp'>
                <textarea className='xcode-input' placeholder={this.generatePlaceHolder()} value={this.props.value} onInput={(e) => { this.props.onInput(e) }}></textarea>
            </div>
        );
    }

    generatePlaceHolder(): string {
        var text = 'XCode功能範例\n';
        text += '[text color="red" bg="black" size="16" italic bold]Input your text[/text]\n';
        text += '[video url=""][/video]\n';
        text += '[img url="" large middle small][/img]';
        return text;
    }
}