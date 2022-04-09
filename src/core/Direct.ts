import KeyValue from "./KeyValue";

export default class Direct {
    public static go(path: string, ...values: KeyValue<string, string>[]): void {
        var param = '';
        for (let i = 0; i < values.length; i++) {
            //處理特殊字元部分
            param += param !== '' ? '&' : '?';
            //處理參數部分
            param += `${values[i].key}=${values[i].value}`;
        }
        window.location.hash = `#${path}${param}`;
    }

    public static getParam(key: string): string {
        //取得參數部分
        const ps = window.location.hash.split('?').pop()?.split('&');
        if (ps!.length === 0) {
            return '';
        }
        for (let i = 0; i < ps!.length; i++) {
            const keyValue = ps![i].split('=');
            //陣列第一個值為key
            if (keyValue[0] === key) {
                return keyValue[1];
            }
        }
        return '';
    }
}