export type PositionType = {
    x: number;
    y: number;
};

export const INPUT_WIDTH = 180;
export const INPUT_HEIGHT = 38;

export const POSITION_OFFSET_X = INPUT_WIDTH / 2;
export const POSITION_OFFSET_Y = INPUT_HEIGHT / 2;

export const colors = [
    'blue',
    'red',
    'green',
    'purple',
    'pink',
    'yellow',
    'orange',
    'cyan',
    'teal',
    'slate',
    'gray'
]

export const getBgColorLight = (color:string) => {
    switch (color) {
        case 'red':
            return 'bg-red-100';
        case 'green':
            return 'bg-green-100';
        case 'blue':
            return 'bg-blue-100';
        case 'yellow':
            return 'bg-yellow-100';
        case 'orange':
            return 'bg-orange-100';
        case 'purple':
            return 'bg-purple-100';
        case 'pink':
            return 'bg-pink-100';
        case 'cyan':
            return 'bg-cyan-100';
        case 'teal':
            return 'bg-teal-100';
        case 'slate':
            return 'bg-slate-100';
        default:
            return 'bg-gray-100';
    }
}


export const getBgColorBold = (color:string) => {
    switch (color) {
        case 'red':
            return 'bg-red-400';
        case 'green':
            return 'bg-green-400';
        case 'blue':
            return 'bg-blue-400';
        case 'yellow':
            return 'bg-yellow-400';
        case 'orange':
            return 'bg-orange-400';
        case 'purple':
            return 'bg-purple-400';
        case 'pink':
            return 'bg-pink-400';
        case 'cyan':
            return 'bg-cyan-400';
        case 'teal':
            return 'bg-teal-400';
        case 'slate':
            return 'bg-slate-400';
        default:
            return 'bg-gray-400';
    }
}


export const getBorderColorBold = (color:string) => {
    switch (color) {
        case 'red':
            return 'border-red-400';
        case 'green':
            return 'border-green-400';
        case 'blue':
            return 'border-blue-400';
        case 'yellow':
            return 'border-yellow-400';
        case 'orange':
            return 'border-orange-400';
        case 'purple':
            return 'border-purple-400';
        case 'pink':
            return 'border-pink-400';
        case 'cyan':
            return 'border-cyan-400';
        case 'teal':
            return 'border-teal-400';
        case 'slate':
            return 'border-slate-400';
        default:
            return 'border-gray-400';
    }
}