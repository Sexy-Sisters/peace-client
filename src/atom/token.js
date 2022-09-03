import { atom } from 'recoil'
import { v1 } from 'uuid';

export const tokenState = atom({
    key: `tokenState/${v1()}`,
    default: {}
});