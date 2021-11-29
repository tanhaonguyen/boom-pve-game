
import { _decorator, Component, Node, Animation, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GhostController
 * DateTime = Mon Nov 29 2021 09:19:13 GMT+0700 (Indochina Time)
 * Author = hao_nguyen3
 * FileBasename = ghost_controller.ts
 * FileBasenameNoExtension = ghost_controller
 * URL = db://assets/scripts/ghost_controller.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('GhostController')
export class GhostController extends Component {

    @property
    private moving_offset: number = null;
    @property
    private horizontal_distance: number = null;
    @property
    private vertical_distance: number = null;
    @property
    private orientation: number = null; //0: right, 1: down, 2: left, 3: up
    @property
    private x_offset: number = null;
    @property
    private y_offset: number = null;

    private i: number = 0;
    private horizontal_step: number = null;
    private vertical_step: number = null;

    //------------------------------------------------------------------------------------
    start() {
        this.horizontal_step = Math.round(this.horizontal_distance / this.moving_offset);
        this.vertical_step = Math.round(this.vertical_distance / this.moving_offset)
    }

    update(deltaTime: number) {
        //Move the ghost
        this.node.setPosition(this.node.position.x + this.x_offset, this.node.position.y + this.y_offset);

        //If the ghost reached predefined coordinate, change its moving orientation
        if (this.i == this.horizontal_step) {

            switch (this.orientation) {
                case 0:
                    this.changeOrientation("ghost_down", 1, 0, -this.moving_offset); //0: right, 1: down, 2: left, 3: up
                    break;
                case 2:
                    this.changeOrientation("ghost_up", 3, 0, this.moving_offset); //0: right, 1: down, 2: left, 3: up
                    break;
            }
        }

        if (this.i == this.vertical_step) {

            switch (this.orientation) {
                case 1:
                    this.changeOrientation("ghost_left", 2, -this.moving_offset, 0); //0: right, 1: down, 2: left, 3: up
                    break;
                case 3:
                    this.changeOrientation("ghost_right", 0, this.moving_offset, 0); //0: right, 1: down, 2: left, 3: up
                    break;
            }
        }

        this.i++;
    }
    //------------------------------------------------------------------------------------
    changeOrientation(animation_name: string, orientation: number, x_offset: number, y_offset: number) {
        this.getComponent(Animation).play(animation_name);

        this.orientation = orientation; //0: right, 1: down, 2: left, 3: up
        this.x_offset = x_offset;
        this.y_offset = y_offset;

        this.i = 0; //Reset the counting variable
    }
}