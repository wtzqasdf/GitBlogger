export default class Encoding {
    public static toBase64(source: string): string {
        return btoa(encodeURIComponent(source).replace(/%([0-9A-F]{2})/g, function (match, pl) {
            return String.fromCharCode(parseInt(pl, 16));
        }));
    }

    public static fromBase64(source: string): string {
        return decodeURIComponent(Array.prototype.map.call(atob(source), function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''));
    }
}