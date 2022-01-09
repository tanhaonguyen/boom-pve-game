
import { _decorator, Component, Node, UITransform, math } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ScaleTiledmap
 * DateTime = Sun Jan 09 2022 20:24:52 GMT+0700 (Indochina Time)
 * Author = khuongnguyen
 * FileBasename = ScaleTiledmap.ts
 * FileBasenameNoExtension = ScaleTiledmap
 * URL = db://assets/scripts/ScaleTiledmap.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('ScaleTiledmap')
export class ScaleTiledmap extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    scale: number;
    start () {
        // [3]
        var mapSize = this.node.getComponent(UITransform).contentSize;
        var canvasSize = this.node.getParent().getComponent(UITransform).contentSize;

        var scale = mapSize.height/canvasSize.height;
        scale = Math.floor(scale);
        this.scale = scale;
    }

    update (deltaTime: number) {
        // [4]
        this.node.setScale(this.scale,this.scale,this.scale);
        this.node.setScale(1,1,1);
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
