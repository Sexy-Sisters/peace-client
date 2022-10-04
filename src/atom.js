import { atom } from 'recoil'
import { v1 } from 'uuid';

export const musicState = atom({
    key: `musicState/${v1()}`,
    default: [{
        singer: "",
        title: "",
    }]
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

export const userState = atom({
    key: `user/${v1()}`,
    default: {
        id: 0,
        profileImg: "",
        name: "",
        nickName: "",
        email: "",
        authority: "",
        requestedSong: {
            id: 0,
            imgUrl: "",
            title: "",
            singer: "",
            numberOfUps: 0,
            userName: "",
            createdHour: 0,
        }
        // requestedSong: null
    }
})