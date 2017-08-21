interface item {
    src: string;
    _id: string;
    _name: string;
}


declare class Player {
    _list: item[];
    playing: item;
    options: any;
    constructor(list: string | string[]);
    readonly list: string[];
    play(): void;
    next(): void;
    prev(): void;
    stop(): void;
    pause(): void;
    add(url: string): void;
    on(event: 'playing', callback: (item: item) => void): never;
    on(event: 'playend', callback: (item: item) => void): never;
    on(event: 'error', callback: (err: Error) => void): never;
}
export default Player;
