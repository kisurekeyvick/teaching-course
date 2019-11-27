import * as React from 'react';
import './icon.scss';

interface IIconProps {
    type: string;
}

const SvgComponent: React.FC<IIconProps> = props => {
    return (
        <svg className="svg-icon" aria-hidden="true">
            <use xlinkHref={`#${props.type}`} />
        </svg>
    )
};

export default SvgComponent;

// export const iconList: {
//     [key: string]: React.ReactNode
// } = {
//     iconBook: <SvgComponent type='icon-book'></SvgComponent>
// };