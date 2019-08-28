import * as _ from 'lodash';
// import { ENVConfig } from '../../../environment/environment';

/** 可将数据存储到window.name上 */
class innerStorage {
    public store: any;
    private _proxy: any;

    constructor(type: string) {
        let storage: any;

        if (window.name) {
            try {
                storage = JSON.parse(window.name);
            } catch (error) {
                storage = {};
            }
        }

        storage = (!_.isPlainObject(storage) && {}) || storage;

        if (!storage['session']) {
            storage['session'] = {};
        }

        if (!storage['local']) {
            storage['local'] = {};
        }

        this._proxy['local'] = storage['local'];
        this._proxy['session'] = storage['session'];

        this.store = this._proxy[type];
    }

    public getItem(key: string) {
        return this.store[key];
    }

    public setItem(key: string, value: any) {
        this.store[key] = value;
        this._saveStorage();
    }

    public removeItem(key: string) {
        delete this.store[key];
        this._saveStorage();
    }

    public clear() {
        this.store = {};
        this._saveStorage();
    }

    private _saveStorage() {
        const storage = {
            session: this._proxy['session'],
            local: this._proxy['local']
        };

        window.name = JSON.stringify(storage);
    }
}

interface IStorageValue {
    timestamp?: number;
    expires?: any;
    [key: string]: any;
}

export class StorageService {
    /** 当前浏览器是否支持storage */
    private _supportStorage: any = {
        local: 1,
        session: 1
    };
    private _proxy: any;
    private _type: any;

    constructor(public type: string) {
        this.isSupportStorage();
        
        this._supportStorage[type] ?
        this._proxy = (this.type === 'local' && localStorage) || sessionStorage :
        this._proxy = new innerStorage(this.type);
        
        this._type = type;
    }

    /** 判断浏览器是否支持本地存储 */
    private isSupportStorage() {
        try {
            sessionStorage.setItem('sessionTest', 'success');
        } catch (error) {
            this._supportStorage.session = 0;
        }

        try {
            localStorage.setItem('localTest', 'success');
        } catch (error) {
            this._supportStorage.local = 0;
        }
    }

    get(key: string) {
        const item = this._proxy.getItem(key);

        if (item) {
            const value:IStorageValue = JSON.parse(item);

            /** 如果存在expires */
            if (value.expires) {
                const differ: number = Date.now() - value.timestamp!;

                if (differ > value.expires || differ < 0) {
                    this._proxy.removeItem(key);
                    return null;
                }
            }

            return value;
        } else {
            return null;
        }
    }

    set(key: string, value: any, expires?: number) {
        const item: any = {
            value
        };

        if (expires) {
            item['expires'] = this._setExpires(expires);
            item['timestamp'] = Date.now();
        }

        try {
            this._proxy.setItem(key, JSON.stringify(item));
        } catch (error) {
            if (this._isQuotaExceeded(error)) {
                this._removeHttp();
            }
        }
    }

    public remove(key: string) {
        this._proxy.removeItem(key);
    }

    public clear() {
        for(const key in this._proxyFrom()) {
            this._proxy.removeItem(key);
        }
    }

    /** 判断proxy的来源 */
    private _proxyFrom() {
        return this._proxy instanceof innerStorage ? this._proxy.store : this._proxy;
    }

    /** 内存溢出 */
    private _isQuotaExceeded(e: any): boolean {
        let quotaExceeded = false;
        if (e) {
          if (e.code) {
            switch (e.code) {
              case 22:
                quotaExceeded = true;
                break;
              case 1014:
                // Firefox
                if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                  quotaExceeded = true;
                }
                break;
            }
          } else if (e.number === -2147024882) {
            // Internet Explorer 8
            quotaExceeded = true;
          }
        }

        return quotaExceeded;
    }

    /** 删除http缓存 */
    private _removeHttp(url = '') {
        url = `'http:'${url}`;
        for(const key in this._proxyFrom()) {
            if (key.startsWith(url)) {
                this._proxy.removeItem(key);
            }
        }
    }

    /** 设置过期时间 */
    private _setExpires(time: number) {
        const str = time + '';
        let count = 0;

        str.replace(/(\d+)([DHMS])/g, function (match: any, $1: any, $2: any): any {
            $1 = parseInt($1, 10);

            switch ($2) {
                case 'D':
                count += $1 * 24 * 3600;
                break;
                case 'H':
                count += $1 * 3600;
                break;
                case 'M':
                count += $1 * 60;
                break;
                case 'S':
                count += $1;
                break;
            }
        });

        time = count ? count : time;

        return time * 1000;
    }
}