import * as React from 'react';
import { Input, Form} from 'antd';

export const EditableContext = React.createContext({});

const { Item } = Form;

export class EditableCell extends React.Component<any, any> {
    constructor(public props: any) {
        super(props);
    }

    public getInput = () => {
        return <Input />;
    }

    public renderCell = ({getFieldDecorator}: any): React.ReactNode => {
        const { editing, dataIndex, record, children, ...restProps } = this.props;

        return (
            <td {...restProps}>
                {
                    editing ? (
                        <Item style={{ margin: 0 }}>
                            {
                                getFieldDecorator(dataIndex, {
                                    initialValue: record[dataIndex]
                                })(this.getInput())
                            }
                        </Item>
                    ) : (children)
                }
            </td>
        );
    }

    public render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}
