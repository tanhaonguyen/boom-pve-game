
import { _decorator, Component, Node, animation, math, macro, Vec3, random, randomRange, Vec2, randomRangeInt, TERRAIN_MAX_BLEND_LAYERS, } from 'cc';
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
    }

    update (deltaTime: number) {
        // [4]
        this.timer -= deltaTime;
        if(this.timer<0){         
            this.actionNumber = randomRangeInt(0,5);
            if(this.actionNumber == 0){
                this.timer=randomRangeInt(1,2);
            }
            else{
                this.timer=randomRangeInt(3,4);
            }
        }
        this.actionBaseOnNumber(this.actionNumber,deltaTime);
        console.log(this.Player.position.subtract(this.node.position).normalize);
    }


    private isMoving: boolean;
    private changeTime: number = 3;
    private timer: number;
    private speed: number = 40;
    private actionNumber: number;

    actionBaseOnNumber(actionNumber, dt){
        if(actionNumber == 0){
            this.isMoving = false;
            this.animator.setValue('isMoving', this.isMoving);
        }
        else{
            this.isMoving = true;
            this.animator.setValue('isMoving', this.isMoving);
            if(actionNumber == 1){   
                this.node.setPosition(this.node.position.x + this.speed*dt,this.node.position.y);
                this.animator.setValue('lookX',1);
                this.animator.setValue('lookY',0);
            }
            else if(actionNumber == 2){
                this.node.setPosition(this.node.position.x + -this.speed*dt,this.node.position.y);
                this.animator.setValue('lookX',-1);
                this.animator.setValue('lookY',0);
            }
            else if(actionNumber == 3){   
                this.node.setPosition(this.node.position.x ,this.node.position.y + this.speed*dt);
                this.animator.setValue('lookY',1);
            }
            else if(actionNumber == 4){
                this.node.setPosition(this.node.position.x ,this.node.position.y + -this.speed*dt);
                this.animator.setValue('lookY',-1);
            }
        }
    }

    @property({ type: Node })
    Player: Node;
    private distanceFollow: number = 20;
    followPlayer(){
        var distance = Vec3.distance(this.node.position, this.Player.position);
        if (distance < this.distanceFollow){
            var lookX = this.animator.getValue('lookX');
            var lookY = this.animator.getValue('lookY');
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
