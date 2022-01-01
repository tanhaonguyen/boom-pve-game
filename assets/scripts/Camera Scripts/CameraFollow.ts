
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
 
@ccclass('Camera')
export class CameraFollow extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start () {
        // [3]
        this.setCameraPositionAtStart();
    }

    update(){
        this.scaleTiledMapAndCamera();
        this.CameraFollowObject();
    }

    private tiledMapSize: Size;
    private scale: number;
    private orthoHeight: number;

    setCameraPositionAtStart(){
        //Doc canvas va tiledmap
        var canvas = this.node.parent;
        var tiledMap = canvas.getChildByName("TiledMap");

        //Tinh scale dua tren content size cua canvas va tiledmap
        var canvasSize = canvas.getComponent(UITransform).contentSize;
        var tiledMapSize = tiledMap.getComponent(UITransform).contentSize;
        var scale = canvasSize.height*1.0/tiledMapSize.height;

        //Lam tron den 1 chu so thap phan
        scale = Math.floor(scale*10)/10 - 0.05;

        //Scale tiledmap cho vua voi canvas
        tiledMap.setScale(new Vec3(scale,scale,scale));

        //Chinh orthoHeight cho vua voi map
        this.node.getComponent(Camera).orthoHeight = this.node.getComponent(Camera).orthoHeight*scale;

        //Chinh vi tri cua camera xuong duoi chan map
        var cameraPosition = canvasSize.height/2 - this.node.getComponent(Camera).orthoHeight;
        this.node.setPosition(this.node.position.x,-cameraPosition);

        this.tiledMapSize = tiledMapSize;
        this.scale = scale;
        this.orthoHeight = this.node.getComponent(Camera).orthoHeight;
    }

    scaleTiledMapAndCamera(){
        var canvas = this.node.parent;
        var tiledMap = canvas.getChildByName("TiledMap");
        
        tiledMap.setScale(new Vec3(this.scale,this.scale,this.scale));
        this.node.getComponent(Camera).orthoHeight = this.orthoHeight;
    }

    @property({ type: Node })
    Player: Node;

    CameraFollowObject(){

        let playerPosition = this.Player.getPosition();
        let currentPosition = this.node.getPosition();

        currentPosition.lerp(playerPosition,0.1);

        var canvas = this.node.parent;
        var canvasSize = canvas.getComponent(UITransform).contentSize;

        var boundary = canvasSize.height/2-this.orthoHeight;
        console.log(boundary);
        currentPosition.y = misc.clampf(playerPosition.y,-boundary,boundary);
        currentPosition.z = 1000;
        currentPosition.x = 0;

        this.node.setPosition(currentPosition);
        
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
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
