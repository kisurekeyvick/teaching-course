export interface IMenuItem {
    name: string;
    key: string;
    value: any;
    weight: number;
    isLeaf: boolean;
    id: number;
    children?: IMenuItem[]
}
