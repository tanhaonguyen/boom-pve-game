
import { _decorator, Component, Node, SystemEvent, systemEvent, EventKeyboard, KeyCode, Animation, TERRAIN_HEIGHT_BASE, RigidBody, Vec3, RigidBody2D, Vec2, Prefab, director, instantiate, math } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PlayerMovement
 * DateTime = Sat Nov 27 2021 00:08:56 GMT+0700 (Indochina Time)
 * Author = hao_nguyen3
 * FileBasename = player_movement.ts
 * FileBasenameNoExtension = player_movement
 * URL = db://assets/scripts/player_movement.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('PlayerMovement')
export class PlayerMovement extends Component {
    //------------------------------------------------------------------------------
    private arrow_left_down: boolean = false;
    private arrow_right_down: boolean = false;
    private arrow_up_down: boolean = false;
    private arrow_down_down: boolean = false;

    //------------------------------------------------------------------------------
    @property
    boom_amount: number = null;
    @property
    moving_offset: number = null;
    @property({ type: Prefab })
    bomb_prefab: Prefab = null;

    //--------------------------Life-cycle-functions--------------------------------
    onLoad() {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyReleased, this);
    }

    start() {
    }

    update(deltaTime: number) {
    }

    onDestroy() {
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyReleased, this);
    }
    //------------------------------------------------------------------------------
    onKeyPressed(event: EventKeyboard) {
        switch (event.keyCode) {

            case KeyCode.ARROW_LEFT:
                if (!this.arrow_left_down) {
                    this.getComponent(Animation).play("player_left");
                    this.arrow_left_down = true;
                }
                this.node.setPosition(this.node.position.x - this.moving_offset, this.node.position.y);
                break;

            case KeyCode.ARROW_RIGHT:
                if (!this.arrow_right_down) {
                    this.getComponent(Animation).play("player_right");
                    this.arrow_right_down = true;
                }
                this.node.setPosition(this.node.position.x + this.moving_offset, this.node.position.y);
                break;

            case KeyCode.ARROW_UP:
                if (!this.arrow_up_down) {
                    this.getComponent(Animation).play("player_up");
                    this.arrow_up_down = true;
                }
                this.node.setPosition(this.node.position.x, this.node.position.y + this.moving_offset);
                break;

            case KeyCode.ARROW_DOWN:
                if (!this.arrow_down_down) {
                    this.getComponent(Animation).play("player_down");
                    this.arrow_down_down = true;
                }
                this.node.setPosition(this.node.position.x, this.node.position.y - this.moving_offset);
                break;

            case KeyCode.SPACE:
                // console.log("SPACEBAR pressed");
                let bomb = instantiate(this.bomb_prefab);

                bomb.setParent(this.node.getParent().getChildByName("bomb"));

                let suitableX = this.findBombCoordinate(this.node.position.x, 40);
                let suitableY = this.findBombCoordinate(this.node.position.y, 40);
                bomb.setPosition(new Vec3(suitableX, suitableY, 0));
                break;
        }
    }

    onKeyReleased(event: EventKeyboard) {
        let other_key_down_exist = false;
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT:
                other_key_down_exist = this.arrow_right_down || this.arrow_up_down || this.arrow_down_down;
                if (!other_key_down_exist) {
                    this.getComponent(Animation).play("player_idle_left");
                }

                this.arrow_left_down = false;
                break;
            case KeyCode.ARROW_RIGHT:
                other_key_down_exist = this.arrow_left_down || this.arrow_up_down || this.arrow_down_down;
                if (!other_key_down_exist) {
                    this.getComponent(Animation).play("player_idle_right");
                }

                this.arrow_right_down = false;
                break;
            case KeyCode.ARROW_UP:
                other_key_down_exist = this.arrow_right_down || this.arrow_left_down || this.arrow_down_down;
                if (!other_key_down_exist) {
                    this.getComponent(Animation).play("player_idle_up");
                }

                this.arrow_up_down = false;
                break;
            case KeyCode.ARROW_DOWN:
                other_key_down_exist = this.arrow_right_down || this.arrow_up_down || this.arrow_left_down;
                if (!other_key_down_exist) {
                    this.getComponent(Animation).play("player_idle_down");
                }

                this.arrow_down_down = false;
                break;
            // case KeyCode.SPACE:
            //     break;
        }
    }
    //------------------------------------------------------------------------------
    findBombCoordinate(num: number, tileSize: number): number {
        let sign = 1;
        if (num < 0) {
            sign = -1;
            num *= -1;
        }

        //tileSize = 40 => find k that 40*k + 20 = num
        let halfTileSize = Math.floor(tileSize / 2);
        let k = Math.round((num - halfTileSize) / tileSize);
        let suitableCoordinate = (tileSize * k + halfTileSize) * sign;

        return suitableCoordinate;
    }
}
