
import { _decorator, Component, Node, animation, math, macro, Vec3, random, randomRange, Vec2, randomRangeInt, TERRAIN_MAX_BLEND_LAYERS, director, Collider2D, Contact2DType, PhysicsSystem2D, } from 'cc';
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
 
@ccclass('GreenZombie')
export class GreenZombie extends Component {
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
        this.animator.setValue('lookX',-1);
        this.animator.setValue('lookY', 0);

        if(this.Player == null){
            var canvas = this.node.parent;
            this.Player = canvas.getChildByName('player');
        }

        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    
        }
    }
    
    private isFollowing: boolean = false;
    private onCollision: boolean = false;
    update (deltaTime: number) {
        // [4]
        this.deltaTime = deltaTime;
        this.playerOnSight(deltaTime);
        if(!this.isFollowing){
            this.speed = 40;
            this.timer -= deltaTime;
            this.actionBaseOnNumber(this.actionNumber,deltaTime);
            if(this.timer<0){         
                this.actionNumber = randomRangeInt(1,5);  
                this.changeTime=randomRangeInt(2,4);
                this.timer = this.changeTime;
            }
        }
        else{
           this.followPlayer(deltaTime);
        }
        // console.log(this.isFollowing);
        // console.log(this.animator.getValue('lookX'));
    }

    private changeTime: number = 3;
    private timer: number;
    private speed: number = 40;
    private actionNumber: number;

    private currentLookX: number = -1;

    actionBaseOnNumber(actionNumber, dt){
        if(actionNumber == 0){
            this.stayIdle();
        }
        else{
            this.movingAround(actionNumber,dt);
        }
    }

    stayIdle(){
        this.animator.setValue('isMoving', false);   
    }

    movingAround(actionNumber: number, dt:number){
        this.animator.setValue('isMoving', true);
        if(actionNumber == 1){   
            this.currentLookX = 1;
            this.animator.setValue('lookX',1);
            this.animator.setValue('lookY',0);
            this.node.setPosition(this.node.position.x + this.speed*dt,this.node.position.y);   
        }
        else if(actionNumber == 2){
            this.currentLookX = -1;
            this.animator.setValue('lookX',-1);
            this.animator.setValue('lookY',0);
            this.node.setPosition(this.node.position.x - this.speed*dt,this.node.position.y);
        }
        else if(actionNumber == 3){   
            this.animator.setValue('lookY',1);
            this.currentLookX = 0;
            this.node.setPosition(this.node.position.x ,this.node.position.y + this.speed*dt);              
        }
        else if(actionNumber == 4){
            this.animator.setValue('lookY',-1);
            this.currentLookX = 0;
            this.node.setPosition(this.node.position.x ,this.node.position.y - this.speed*dt);
        }
    }

    @property({ type: Node })
    Player: Node;
    private distanceFollow: number = 200;
    private direction: Vec3;

    playerOnSight(dt:number){
        var direction = this.Player.getPosition().subtract(this.node.position).normalize();
        direction = new Vec3(Math.round(direction.x),Math.round(direction.y),0);

        var look = new Vec3(this.currentLookX, this.animator.getValue('lookY'),0);
       
        var distance = Vec3.distance(this.Player.getPosition(),this.node.getPosition());
        if(distance < this.distanceFollow){
            if(look.strictEquals(direction)){
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
    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D) {
        // will be called once when two colliders begin to contact
        if(!otherCollider.node.getComponent("PlayerMovement")){
            var look = new Vec3(this.currentLookX, this.animator.getValue('lookY'),0);
            
            // var direction = otherCollider.node.getPosition().subtract(selfCollider.node.position).normalize();
            // direction = new Vec3(Math.round(direction.x),Math.round(direction.y),0);

            this.isFollowing = false;
            if(look.x == 0){
                this.actionNumber = randomRangeInt(1,3);  
            }
            else if(look.y == 0) {
                this.actionNumber = randomRangeInt(3,5);  
            }
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
