import { ReactNode, useCallback } from 'react';

export default class XCodeParser {
    private _originText: string;
    private _tags: string[];
    private _matchTag: string;

    constructor(text: string) {
        this._matchTag = 'video|img|text|link';
        if (text === '' || text === undefined) {
            this._originText = '';
            this._tags = [];
        }
        else {
            this._originText = text;
            this._tags = this.matchAll(text, this._matchTag);
        }
    }

    /**
     * 匹配並抓取所有的Tag組合
     */
    private matchAll(text: string, tag: string): string[] {
        const arr: string[] = [];
        //抓取所有Tag的字串組合
        const pattern = `\\[(${tag})(.{0,}?)\\](.{0,}?)\\[\\/(${tag})\\]`;
        text.match(new RegExp(pattern, 'g'))?.forEach(t => {
            arr.push(t);
        });
        return arr;
    }
    private toText(parser: TagParser): ReactNode {
        const color = parser.getProperty('color');
        const bg = parser.getProperty('bg');
        var fontSize = parser.getProperty('size');
        const italic = parser.hasProperty('italic');
        const bold = parser.hasProperty('bold');
        fontSize = fontSize === undefined ? undefined : fontSize + 'px';

        return (<span style={{
            color: color,
            backgroundColor: bg,
            fontSize: fontSize,
            fontStyle: italic ? 'italic' : undefined,
            fontWeight: bold ? 'bold' : undefined
        }}>{parser.content}</span>);
    }
    private toVideo(parser: TagParser): ReactNode {
        const url = parser.getProperty('url');
        return (<embed width={'300px'} height={'300px'} src={url}></embed>)
    }
    private toImage(parser: TagParser): ReactNode {
        const url = parser.getProperty('url');
        var width = '300px';
        var height = '300px';
        if (parser.hasProperty('large')) {
            width = '600px';
            height = '600px';
        }
        else if (parser.hasProperty('middle')) {
            width = '450px';
            height = '450px';
        }
        else if (parser.hasProperty('small')) {
            width = '300px';
            height = '300px';
        }
        return (<a href={url} target='_blank'><img src={url} style={{ width: width, height: height }}></img></a>)
    }
    private toLink(parser: TagParser): ReactNode {
        const url = parser.getProperty('url');
        var color = parser.getProperty('color');
        var fontSize = parser.getProperty('size');
        const bg = parser.getProperty('bg');
        const italic = parser.hasProperty('italic');
        const bold = parser.hasProperty('bold');
        color = color === undefined ? 'darkred' : color;
        fontSize = fontSize === undefined ? undefined : fontSize + 'px';

        return (<a href={url} target="_blank" style={{
            color: color,
            backgroundColor: bg,
            fontSize: fontSize,
            fontStyle: italic ? 'italic' : undefined,
            fontWeight: bold ? 'bold' : undefined
        }}>{parser.content}</a>);
    }

    /**
     * 將指定的內容轉換成ReactNode
     */
    public toNode(): ReactNode {
        const nodes: ReactNode[] = [];
        const lines = this._originText.split('\n');
        //處理所有內容以及Tag
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            var a = line;
            var b = '';
            var tagElement: ReactNode | string = '';
            //遍歷已匹配的所有Tag
            for (let j = 0; j < this._tags.length; j++) {
                const tag = this._tags[j];
                //如果目前文字行存在Tag的話就解析
                if (line.indexOf(tag) !== -1) {
                    //將原始文字與Tag區分開來
                    const sp = line.split(tag);
                    a = sp[0];
                    b = sp[1];
                    //判斷Tags
                    const parser = new TagParser(tag);
                    if (parser.isTagCorrect('text')) {
                        tagElement = this.toText(parser);
                    } else if (parser.isTagCorrect('link')) {
                        tagElement = this.toLink(parser);
                    } else if (parser.isTagCorrect('video')) {
                        tagElement = this.toVideo(parser);
                    } else if (parser.isTagCorrect('img')) {
                        tagElement = this.toImage(parser);
                    }
                    break;
                }
            }
            nodes.push(
                <div key={i}>
                    {a}
                    {tagElement}
                    {b}
                </div>);
        }
        return (<pre>{nodes}</pre>);
    }
}

class TagParser {
    private _prefix: string;
    private _suffix: string;
    private _content: string;

    constructor(tag: string) {
        //匹配前後標籤
        const fixMatches = tag.match(/\[(.{1,}?)\]/g);
        this._prefix = fixMatches![0];
        this._suffix = fixMatches![1];
        //使用前後標籤取代完整內容，就可以得知標籤中間的內容
        this._content = tag.replace(this._prefix, '').replace(this._suffix, '');
    }

    /**
     * Tag名稱是否正確
     */
    public isTagCorrect(name: string): boolean {
        //Tag name會接在[後面，所以索引為1
        return this._prefix.indexOf(name) === 1;
    }

    /**
     * 是否存在指定的屬性值
     */
    public hasProperty(name: string): boolean {
        return this._prefix.indexOf(name) !== -1;
    }

    /**
     * 取得指定屬性
     */
    public getProperty(name: string): string | undefined {
        const matches = this._prefix.match(new RegExp(`${name}="(.{1,}?)"`));
        //如果未匹配到的話
        if (matches === null || matches!.length < 2) {
            return undefined;
        }
        return matches![1];
    }

    /** 
     * 取得Tag內容
     */
    public get content(): string {
        return this._content;
    }
}