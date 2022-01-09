
import { _decorator, Component, Node, animation,Animation, math, macro, Vec3, random, randomRange, Vec2, randomRangeInt, TERRAIN_MAX_BLEND_LAYERS, director, Collider2D, Contact2DType, PhysicsSystem2D, equals, RigidBody2D, UITransform, BoxCollider2D, AnimationClip, } from 'cc';
import { ColliderGroup } from '../../GlobalDefines';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GreenZombie
 * DateTime = Wed Jan 05 2022 18:39:31 GMT+0700 (Indochina Time)
 * Author = khuongnguyen
 * FileBasename = GreenZombie.ts
 * FileBasenameNoExtension = GreenZombie
 * URL = db://assets/scripts/AIZombie/GreenZombie.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('Zombie')
export class Zombie extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    private animator: animation.AnimationController;
    start () {
        // [3]
        this.animator = this.node.getComponent(animation.AnimationController);
        this.timer = this.changeTime;

        if(this.Player == null){
            var canvas = this.node.parent;
            this.Player = canvas.getChildByName('Player');
        }

        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
            collider.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
        }

        this.animator.setValue('lookX',0);
        this.changeTime = 3;

        this.randomX = randomRangeInt(-1,2);
        this.randomY = randomRangeInt(-1,2);
        this.checkEqual(this.randomX,this.randomY);
    }
    
    private isFollowing: boolean = false;

    randomX: number;
    randomY: number;

    update (deltaTime: number) {
        // [4]

        this.deltaTime = deltaTime;
        this.playerOnSight(deltaTime);
        this.timer -= deltaTime;
        if(!this.isFollowing){
            this.speed = this.normalSpeed;
            this.movingAround(this.randomX,this.randomY,deltaTime);
            if(this.timer<0){         
                this.randomPath();
                this.changeTime=randomRangeInt(3,5);
                this.timer = this.changeTime;
            }
        }
        else{
            this.followPlayer(deltaTime);
        }
        this.destroyThing();
        this.selfDestroy();
    }

    destroyThing(){
        if(this.destroyObject != null){
            var canvas = this.node.getParent();
            var tiledMap = canvas.getChildByName("TiledMap");
            var largeObject = tiledMap.getChildByName(this.destroyObjectParent);
            var object = largeObject.getChildByName(this.destroyObject);
            object.active = false;
            this.destroyObject = null;
        }
    }

    private changeTime: number = 3;
    private timer: number;
    private speed: number;
    private normalSpeed: number = 30;

    checkEqual(x,y){
        //Neu hai so bang nhau
        if(Math.abs(x)==Math.abs(y)){
            var number = 0;

            //Neu bang nhau so 0 thi number = 1
            if(x == 0){
                number = 1;
            }

            //Random am duong cho number
            var chooseNegative = Math.random()>0.5;
            if(chooseNegative){
                number = -number;
            }

            //Chon x hay y la number
            var chooseNumber = Math.random()>0.5;
            if(chooseNumber){
                x = number;
            }
            else{
                y = number;
            }
        }
        
        this.randomX = x;
        this.randomY = y;
    }

    movingAround(x, y, dt:number){
        this.animator.setValue('lookX', x);
        this.animator.setValue('lookY', y);
        this.node.setPosition(this.node.position.x + x*this.speed*dt, this.node.position.y + y*this.speed*dt);
    }

    @property({ type: Node })
    Player: Node;
    private distanceFollow: number = 150;
    private direction: Vec3;

    playerOnSight(dt:number){
        var direction = this.Player.getPosition().subtract(this.node.position).normalize();
        direction = new Vec3(Math.round(direction.x),Math.round(direction.y),0);

        var look = new Vec3(this.animator.getValue('lookX'), this.animator.getValue('lookY'),0);
       
        var distance = Vec3.distance(this.Player.getPosition(),this.node.getPosition());

        if(distance < this.distanceFollow){
            if(direction.strictEquals(look)){
                this.isFollowing = true;
                this.direction = direction;
                this.animator.setValue('isFollow', true);
            }
        }    
    }


    followPlayer(deltaTime:number){
        this.speed = this.normalSpeed*2;
        this.node.setPosition(this.node.position.x+this.speed*deltaTime*this.direction.x,this.node.position.y+this.speed*deltaTime*this.direction.y);
    }

    deltaTime: number;
   
    randomPath(){
        var number = 1;
        var chooseNegative = Math.random()>=0.5;
        if(chooseNegative){
            number = -number;
        }

        var choosePath = Math.random()>=0.5;
        if(choosePath){
            if(this.randomX != 0){
                this.randomX = -this.randomX;
            }
            else{
                this.randomX = number;
            }
            this.randomY = 0;
        }
        else{
            if(this.randomY != 0){
                this.randomY = -this.randomY;
            }
            else{
                this.randomY = number;
            }
            this.randomX = 0;
        }
    }

    onPreSolve(selfCollider: Collider2D, otherCollider: Collider2D) {
        if(!otherCollider.node.getComponent("PlayerController")){
            if(this.isFollowing){
                this.randomX = this.direction.x;
                this.randomY = this.direction.y; 

                this.animator.setValue('lookX', this.randomX);
                this.animator.setValue('lookY', this.randomY);
            }  
            if(!this.checkWall(otherCollider.node)){
                this.destroyObjectParent = otherCollider.node.getParent().name;
                this.destroyObject = otherCollider.node.name;
            } 
        }
    } 

    onPostSolve(selfCollider: Collider2D, otherCollider: Collider2D) {
        if(!otherCollider.node.getComponent("PlayerController")){
            if(this.isFollowing){
                this.isFollowing = false;
                this.animator.setValue('isFollow', false);
            }
        }
    } 

    checkWall(object: Node){
        var canvas = this.node.getParent();
        var tiledMap = canvas.getChildByName("TiledMap");
        var wall = tiledMap.getChildByName("Wall");
        var largeObject = tiledMap.getChildByName("LargeObject");
        var bottomCollider = canvas.getChildByName("BottomCollider");

        var nodeParent = object.getParent();
        return (nodeParent == wall || nodeParent == largeObject || object == bottomCollider);
    }

    destroyNode: boolean = false;
    selfDestroy(){
        if(this.destroyNode){
            this.bombCount = this.bombCount + 1;
            if(this.bombCount > 1){
                this.node.destroy();
            }
            this.destroyNode = false;
        }
    }

    bombCount: number = 0;
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {

        if(!otherCollider.node.getComponent("PlayerController")){
            if(otherCollider.group == ColliderGroup.Explosion){
                this.destroyNode = true;
                return;
            }
            if(!this.checkWall(otherCollider.node)){
                return;
            }
            this.randomPath();
        }
    }

    destroyObject: string = null;
    destroyObjectParent: string;
    
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
