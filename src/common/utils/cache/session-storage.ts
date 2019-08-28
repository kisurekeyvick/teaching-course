import { StorageService } from './storage';

export default class SessionStorageService extends StorageService {
    constructor() {
        super('session');
    }
}