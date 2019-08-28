export interface IConfig {
    rule: any[];
    initialValue: any;
    [key: string]: any;
    options?: any[];
    format?: string;
}

export interface IForm {
    label: string;
    id: number;
    key: string;
    type: string;
    config: IConfig;
    hasFeedback ?: boolean;
    placeholder?: string;
}

// export type Config = IConfig;
// export type Form = IForm;
