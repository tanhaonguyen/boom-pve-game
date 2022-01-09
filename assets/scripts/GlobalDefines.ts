export enum Buff {
    LengthPotion,
    MaxLengthBuff,
    MoreBomb,
    Speed
}

export enum ColliderGroup {
    DEFAULT = 1,
    Player = 2,
    Buff = 4,
    Bomb = 8,
    DestroyableNode = 16
}

export type Coordinate = {
    x: number,
    y: number
}