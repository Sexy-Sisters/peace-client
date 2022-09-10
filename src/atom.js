import { atom } from 'recoil'
import { v1 } from 'uuid';

export const musicState = atom({
    key: `musicState/${v1()}`,
    default: []
});

export const songState = atom({
    key: `tokenState/${v1()}`,
    default: ""
});

export const isSelectedMusicState = atom({
    key: `isSelectedMusicState/${v1()}`,
    default: false
});

export const disabledState = atom({
    key: `disabled/${v1()}`,
    default: true
});
