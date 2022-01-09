
import { _decorator, Component, Node, Collider2D, Camera, director } from 'cc';
import { ColliderGroup } from '../GlobalDefines';
import { CameraFollow } from './CameraFollow';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ControlScene
 * DateTime = Mon Jan 10 2022 03:38:20 GMT+0700 (Indochina Time)
 * Author = khuongnguyen
 * FileBasename = ControlScene.ts
 * FileBasenameNoExtension = ControlScene
 * URL = db://assets/scripts/ZombieModeScriptStuff/ControlScene.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('ControlScene')
export class ControlScene extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    childrenNode: Array<Node>;
    animStart;
    animClear;

    start () {
        // [3]
        var scene = this.node;
        if(scene.name == "Cementary"){
            this.animStart = this.node.getChildByName("Stage1Start");
            this.animClear = this.node.getChildByName("Stage1Clear");
        }
        else if(scene.name == "Hallway"){
            this.animStart = this.node.getChildByName("Stage2Start");
            this.animClear = this.node.getChildByName("Stage2Clear");
        }
        else if(scene.name == "Tomb"){
            this.animStart = this.node.getChildByName("Stage3Start");
            this.animClear = this.node.getChildByName("Stage3Clear");
        }
        
        var tiledMap = this.node.getChildByName("TiledMap");
        this.animStart.setPosition(tiledMap.getPosition());
        var camera = this.node.getChildByName("Camera");
        camera.getComponent(CameraFollow).enabled = false;
        var mapPos = tiledMap.getPosition();
        camera.setPosition(mapPos.x,mapPos.y,1000);
        this.scheduleOnce(()=>{
            camera.getComponent(CameraFollow).enabled = true;
        }, 2);
    }

    minionCount: number = 0;
    stageClear: boolean = false;
    checkMinion(){
        this.childrenNode = this.node.children;
        var count = 0;
        this.childrenNode.forEach(function(item, index, array) {
            var collider = item.getComponent(Collider2D);
            if(collider){
                if(collider.group == ColliderGroup.Minion){
                    count = count + 1;
                }
            }
        });
        this.minionCount = count;
        if(this.minionCount == 0){
            this.stageClear = true;
        }
    }

    stageClearAnim(){
        if(this.stageClear){

            var tiledMap = this.node.getChildByName("TiledMap");
            this.animClear.setPosition(tiledMap.getPosition());
            this.animClear.active = true;
            var camera = this.node.getChildByName("Camera");
            camera.getComponent(CameraFollow).enabled = false;
            var mapPos = tiledMap.getPosition();
            camera.setPosition(mapPos.x,mapPos.y,1000);
            
            var scene = this;
            var name = null;
            if(scene.name == "Cementary"){
                name = "Hallway";
            }
            else if(scene.name == "Hallway"){
                name = "Tomb";
            }
            director.preloadScene(name);
            this.scheduleOnce(() => director.loadScene(name),3);
            this.stageClear = false;
        }
    }

    update (deltaTime: number) {
        // [4]
        this.checkMinion();
        this.stageClearAnim();
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
