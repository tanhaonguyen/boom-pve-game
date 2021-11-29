
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
    private horizontal_distance: number = 0;
    @property
    private vertical_distance: number = 0;

    @property
    private orientation: number = 0; //0: right, 1: down, 2: left, 3: up

    private i: number = 0;
    private horizontal_step: number = null;
    private vertical_step: number = null;

    @property
    private x_offset: number = 0;
    @property
    private y_offset: number = 0;

    //------------------------------------------------------------------------------------
    start() {
        this.horizontal_step = Math.round(this.horizontal_distance / this.moving_offset);
        this.vertical_step = Math.round(this.vertical_distance / this.moving_offset)
    }

    update(deltaTime: number) {

        this.node.setPosition(this.node.position.x + this.x_offset, this.node.position.y + this.y_offset);

        if (this.i == this.horizontal_step) {
         
            switch (this.orientation) {
                case 0:
                    this.getComponent(Animation).play("ghost_down");

                    this.orientation = 1;
                    this.x_offset = 0;
                    this.y_offset = -this.moving_offset;
                    this.i = 0;
                    break;
                case 2:
                    this.getComponent(Animation).play("ghost_up");

                    this.orientation = 3;
                    this.x_offset = 0;
                    this.y_offset = this.moving_offset;
                    this.i = 0;
                    break;

            }
        }

        if (this.i == this.vertical_step) {

            switch (this.orientation) {
                case 1:
                    this.getComponent(Animation).play("ghost_left");

                    this.orientation = 2;
                    this.x_offset = -this.moving_offset;
                    this.y_offset = 0;
                    this.i = 0;
                    break;
                case 3:
                    this.getComponent(Animation).play("ghost_right");

                    this.orientation = 0;
                    this.x_offset = this.moving_offset;
                    this.y_offset = 0;
                    this.i = 0;
                    break;
            }


        }

        this.i++;
    }
    //------------------------------------------------------------------------------------
    changeOrientation(orientation, x_offset, y_offset){
        this.orientation = orientation;
        this.x_offset = x_offset;
        this.y_offset = y_offset;
    }
}