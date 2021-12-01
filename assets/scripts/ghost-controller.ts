
import { _decorator, Component, Node, Animation, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GhostController')
export class GhostController extends Component {

    @property
    movingOffset: number = 0;
    @property
    horizontalDistance: number = 0;
    @property
    verticalDistance: number = 0;
    @property
    orientation: number = 0; // 0: right, 1: down, 2: left, 3: up
    

    private i: number;
    private horizontalStep: number;
    private verticalStep: number;
    private xOffset: number;
    private yOffset: number;

    // ------------------------------------------------------------------------------------
    start() {
        this.i = 0;

        this.horizontalStep = Math.round(this.horizontalDistance / this.movingOffset);
        this.verticalStep = Math.round(this.verticalDistance / this.movingOffset)

        
        switch (this.orientation) {
            case 0:
                this.xOffset = this.movingOffset;
                this.yOffset = 0;
                break;
            case 1:
                this.xOffset = 0;
                this.yOffset = -this.movingOffset;
                break;
            case 2:
                this.xOffset = -this.movingOffset;
                this.yOffset = 0;
                break;
            case 3: 
                this.xOffset = 0;
                this.yOffset = this.movingOffset;
                break;
        }
    }

    update(deltaTime: number) {
        // Move the ghost
        this.node.setPosition(this.node.position.x + this.xOffset, this.node.position.y + this.yOffset);

        // If the ghost reached predefined coordinate, change its moving orientation
        if (this.i === this.horizontalStep) {

            switch (this.orientation) {
                case 0:
                    this.changeOrientation("ghost-down", 1, 0, -this.movingOffset); //0: right, 1: down, 2: left, 3: up
                    break;
                case 2:
                    this.changeOrientation("ghost-up", 3, 0, this.movingOffset); //0: right, 1: down, 2: left, 3: up
                    break;
            }
        }

        if (this.i === this.verticalStep) {

            switch (this.orientation) {
                case 1:
                    this.changeOrientation("ghost-left", 2, -this.movingOffset, 0); // 0: right, 1: down, 2: left, 3: up
                    break;
                case 3:
                    this.changeOrientation("ghost-right", 0, this.movingOffset, 0); // 0: right, 1: down, 2: left, 3: up
                    break;
            }
        }

        this.i++;
    }
    // ------------------------------------------------------------------------------------
    changeOrientation(animationName: string, orientation: number, xOffset: number, yOffset: number) {
        this.getComponent(Animation).play(animationName);

        this.orientation = orientation; // 0: right, 1: down, 2: left, 3: up
        this.xOffset = xOffset;
        this.yOffset = yOffset;

        this.i = 0; // Reset the counting variable
    }
}