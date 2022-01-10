
import { _decorator, Component, Node, Animation, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { GameManager } from '../GameManager';
import { ColliderGroup } from '../GlobalDefines';
const { ccclass, property } = _decorator;
 
@ccclass('CaptainGreyController')
export class CaptainGreyController extends Component {
    //------------------------------------------------------------------------------
    private _speed: number = 200;
    private _captainIsDead: boolean = false;

    //------------------------------------------------------------------------------
    private collider: Collider2D = undefined;
    private gameManager: GameManager = undefined;

    private onLeft: boolean = true;
    private onRight: boolean = false;
    private onUp: boolean = false;
    private onDown: boolean = false;

    //------------------------------------------------------------------------------
    onLoad() {
    }

    start () {
        this.collider = this.node.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        this.getComponent(Animation).play("captain-left")

        // this.schedule(() => {
        //     let randomNum: number = Math.round(Math.random() * 10);
        //     if (randomNum < 3) {
        //         this.onLeft = true;
        //         this.onRight = false;
        //         this.onUp = false;
        //         this.onDown = false;
        //     }
        //     else if (randomNum < 5) {
        //         this.onLeft = false;
        //         this.onRight = true;
        //         this.onUp = false;
        //         this.onDown = false;
        //     }
        //     else if (randomNum < 7) {
        //         this.onLeft = false;
        //         this.onRight = false;
        //         this.onUp = true;
        //         this.onDown = false;
        //     }
        //     else if (randomNum < 9) {
        //         this.onLeft = false;
        //         this.onRight = false;
        //         this.onUp = false;
        //         this.onDown = true;
        //     }
        // }, 1);
    }

    update (deltaTime: number) {
        if (this._captainIsDead) {
            return;
        }

        if (this.onLeft) {
            !this.onLeft ? this.getComponent(Animation).play("captain-left") : undefined;
            this.node.setPosition(this.node.position.x - this._speed * deltaTime, this.node.position.y);
        }
        else if (this.onRight) {
            !this.onRight ? this.getComponent(Animation).play("captain-right") : undefined;
            this.node.setPosition(this.node.position.x + this._speed * deltaTime, this.node.position.y);
        }
        else if (this.onUp) {
            !this.onUp ? this.getComponent(Animation).play("captain-up") : undefined;
            this.node.setPosition(this.node.position.x, this.node.position.y + this._speed * deltaTime);
        }
        else if (this.onDown) {
            !this.onDown ? this.getComponent(Animation).play("captain-down") : undefined;
            this.node.setPosition(this.node.position.x, this.node.position.y - this._speed * deltaTime);
        }
    }

    onKeyPressed(event: string): void {
        switch (event) {
            case "left": // Move left
                this.onLeft = true;
                this.onRight = false;
                this.onUp = false;
                this.onDown = false;
                break;

            case "right": // Move right
                this.onLeft = false;
                this.onRight = true;
                this.onUp = false;
                this.onDown = false;
                break;

            case "up": // Move up
                this.onLeft = false;
                this.onRight = false;
                this.onUp = true;
                this.onDown = false;
                break;

            case "down": // Move down
                this.onLeft = false;
                this.onRight = false;
                this.onUp = false;
                this.onDown = true;
                break;

        }
    }

    //------------------------------------------------------------------------------
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
       if (this._captainIsDead) {
           return;
       }

        switch (otherCollider.group) {
            case ColliderGroup.Explosion:
                this._captainIsDead = true;

                this.getComponent(Animation).play("destroy-by-bomb");  

                this.scheduleOnce(() => {
                    // this.gameManager.loseGame();
                }, 2.5);
                break;
            case ColliderGroup.DEFAULT || ColliderGroup.Bomb || ColliderGroup.DestroyableNode:
                let curX: number = this.node.position.x;
                let curY: number = this.node.position.y;
                let objX: number = otherCollider.node.position.x;
                let objY: number = otherCollider.node.position.y;

                let left: boolean = (objX < curX) ? true: false;
                let right: boolean  = (objX > curX) ? true: false;
                let up: boolean  = (objY > curY) ? true: false;
                let down: boolean  = (objY < curY)? true: false;

                if (left) {
                    this.onKeyPressed("right");
                } 
                else if (right) {
                    this.onKeyPressed("left");
                }
                else if (up) {
                    this.onKeyPressed("down");
                }
                else if (down) {
                    this.onKeyPressed("up");
                }

                break;
        }
    }
}
