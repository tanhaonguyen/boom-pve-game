
import { _decorator, Component, Node, animation, math, macro, Vec3, random, randomRange, Vec2, randomRangeInt, TERRAIN_MAX_BLEND_LAYERS, director, Collider2D, Contact2DType, PhysicsSystem2D, equals, RigidBody2D, UITransform, BoxCollider2D, } from 'cc';
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
 
@ccclass('BasicLevelAI')
export class BasicLevelAI extends Component {
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
            this.Player = canvas.getChildByName('player');
        }

        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
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
            this.speed = 40;
            this.movingAround(this.randomX,this.randomY,deltaTime);
            if(this.timer<0){         
                this.randomX = randomRangeInt(-1,2);
                this.randomY = randomRangeInt(-1,2); 
                this.checkEqual(this.randomX,this.randomY);
                this.changeTime=randomRangeInt(3,5);
                this.timer = this.changeTime;
            }
        }
        else{
           this.followPlayer(deltaTime);
        }
        // console.log(this.randomX,this.randomY);
    }

    private changeTime: number = 3;
    private timer: number;
    private speed: number = 40;

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
    private distanceFollow: number = 200;
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
            }
        }
        else{
            this.isFollowing = false;
        }
        
    }

    followPlayer(deltaTime:number){
        this.speed = 100;
        this.node.setPosition(this.node.position.x+this.speed*deltaTime*this.direction.x,this.node.position.y+this.speed*deltaTime*this.direction.y);
    }

    deltaTime: number;

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if(!otherCollider.node.getComponent("PlayerController")){

            var objectSize = otherCollider.node.getComponent(UITransform).contentSize;
            var objectPos = otherCollider.node.getPosition();
            objectPos.x = objectPos.x + objectSize.width/2;
            objectPos.y = objectPos.y + objectSize.height/2;

            var direction = objectPos.subtract(selfCollider.node.getPosition()).normalize();
            direction.x = Math.round(direction.x);
            direction.y = Math.round(direction.y);

            var look = new Vec2(this.animator.getValue('lookX'), this.animator.getValue('lookY'));

            this.isFollowing = false;

            var number = 1;

            var chooseNegative = Math.random()>=0.5;
            if(chooseNegative){
                number = -number;
            }

            if(direction.x != 0 && direction.y != 0){
                var choosePath = Math.random()>=0.5;
                if(choosePath){
                    this.randomX = -look.x;
                    this.randomY = 0;
                }
                else{
                    this.randomY = -look.y;
                    this.randomX = 0;
                }
            }
            else if(direction.x == 0){
                this.randomX = number;
                this.randomY = 0;
            }
            else if(direction.y == 0){
                this.randomY = number;
                this.randomX = 0;
            }

            this.timer = this.changeTime;

 
        }
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
