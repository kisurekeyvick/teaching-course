import { StorageService } from './storage';

export default class LocalStorageService extends StorageService {
    constructor() {
        super('local');
    }
}