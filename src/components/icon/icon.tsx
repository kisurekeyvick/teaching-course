import * as React from 'react';
import { Icon } from 'antd';
import { env } from 'environment/index';
import './icon.scss';

interface IIconProps {
    type: string;
    onClick?: Function;
    className?: string;
}

export const IconFont = Icon.createFromIconfontCN({
    scriptUrl: env.svgUrl
});

export const SvgComponent: React.FC<IIconProps> = props => {
    const innerProps = {
        ...props.onClick && {
            onClick: props.onClick
        }
    };

    return (
        <i aria-hidden="true" className={`anticon ${props.className}`} {...innerProps}>
            <svg className="svg-icon">
                <use xlinkHref={`#${props.type}`} />
            </svg>
        </i>
    )
};
