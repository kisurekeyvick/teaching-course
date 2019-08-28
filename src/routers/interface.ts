export interface IBase {
    path: string;
    exact?: boolean;
    key: number;
}

export interface ILoadableRoute extends IBase {
    component: any;
    [key: string]: any;
}