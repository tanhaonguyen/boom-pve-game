
import { _decorator, Component, Node, UITransform, Vec2, Size, TiledMap } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = BottomCollider
 * DateTime = Sat Jan 01 2022 15:18:09 GMT+0700 (Indochina Time)
 * Author = khuongnguyen
 * FileBasename = BottomCollider.ts
 * FileBasenameNoExtension = BottomCollider
 * URL = db://assets/scripts/BottomCollider/BottomCollider.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('BottomCollider')
export class BottomCollider extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    onLoad () {
        // [3]
        var canvas = this.node.parent;
        var tiledMap = canvas.getChildByName("TiledMap");

        var tiledMapSize = tiledMap.getComponent(UITransform).contentSize;
        this.node.getComponent(UITransform).setContentSize(new Size(tiledMapSize.width,1));
        this.node.setScale(tiledMap.scale); 
        console.log(tiledMap.scale);
        this.node.setPosition(this.node.position.x, -(tiledMapSize.height/2)*tiledMap.scale.y);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
