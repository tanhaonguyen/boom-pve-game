
import { _decorator, Component, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('CaptainGreyController')
export class CaptainGreyController extends Component {
    //------------------------------------------------------------------------------
    private _speed: number = 200;

    //------------------------------------------------------------------------------

    private onLeft: boolean = false;
    private onRight: boolean = false;
    private onUp: boolean = false;
    private onDown: boolean = false;

    //------------------------------------------------------------------------------

    start () {

    }

    update (deltaTime: number) {
        if (this.onLeft) {
            this.node.setPosition(this.node.position.x - this._speed * deltaTime, this.node.position.y);
        }
        else if (this.onRight) {
            this.node.setPosition(this.node.position.x + this._speed * deltaTime, this.node.position.y);
        }
        else if (this.onUp) {
            this.node.setPosition(this.node.position.x, this.node.position.y + this._speed * deltaTime);
        }
        else if (this.onDown) {
            this.node.setPosition(this.node.position.x, this.node.position.y - this._speed * deltaTime);
        }
    }

    onKeyPressed(event: string): void {
        switch (event) {
            case "left": // Move left
                !this.onLeft ? this.getComponent(Animation).play("player-left") : undefined;
                this.onLeft = true;
                this.onRight = false;
                this.onUp = false;
                this.onDown = false;
                break;

            case "right": // Move right
                !this.onRight ? this.getComponent(Animation).play("player-right") : undefined;
                this.onLeft = false;
                this.onRight = true;
                this.onUp = false;
                this.onDown = false;
                break;

            case "up": // Move up
                !this.onUp ? this.getComponent(Animation).play("player-up") : undefined;
                this.onLeft = false;
                this.onRight = false;
                this.onUp = true;
                this.onDown = false;
                break;

            case "down": // Move down
                !this.onDown ? this.getComponent(Animation).play("player-down") : undefined;
                this.onLeft = false;
                this.onRight = false;
                this.onUp = false;
                this.onDown = true;
                break;

        }
    }
}
