
import { _decorator, Component, Node, Camera, director, UITransform, Vec3, Prefab, Size, misc } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Camera
 * DateTime = Thu Dec 30 2021 18:47:24 GMT+0700 (Indochina Time)
 * Author = khuongnguyen
 * FileBasename = Camera.ts
 * FileBasenameNoExtension = Camera
 * URL = db://assets/Scripts/Camera.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start() {
        // [3]
        if(this.Player == null){
            var canvas = this.node.parent;
            this.Player = canvas.getChildByName('Player');
        }
        this.setPlayerPositionAtStart();
    }

    update() {
        this.CameraFollowObject();
    }


    @property({ type: Node })
    Player: Node;

    CameraFollowObject() {
        

        let playerPosition = this.Player.getPosition();
        let currentPosition = this.node.getPosition();

        currentPosition.lerp(playerPosition, 0.1);

        var canvas = this.node.parent;
        var tiledmap = canvas.getChildByName("TiledMap");

        var canvasSize = canvas.getComponent(UITransform).contentSize;
        var tiledmapSize = tiledmap.getComponent(UITransform).contentSize;

        var boundaryY = Math.abs(tiledmapSize.height - canvasSize.height)/2 + 40 + tiledmap.position.y;
        currentPosition.y = misc.clampf(playerPosition.y, -boundaryY, boundaryY);
        currentPosition.z = 1000;
        currentPosition.x = tiledmap.position.x;

        if(tiledmapSize.width>canvasSize.width){
            var boundaryX = (tiledmapSize.width - canvasSize.width)/2 + 40;
            currentPosition.x = misc.clampf(playerPosition.x, -boundaryX, boundaryX);
        }

        this.node.setPosition(currentPosition);
    }

    setPlayerPositionAtStart(){
        var canvas = this.node.getParent();
        var tiledmap = canvas.getChildByName("TiledMap");

        var tiledmapSize = tiledmap.getComponent(UITransform).contentSize;
        this.Player.setPosition(0 + tiledmap.position.x, -tiledmapSize.height/2 + 5 + tiledmap.position.y);
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
