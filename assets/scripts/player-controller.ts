
import { _decorator, Component, Node, SystemEvent, systemEvent, EventKeyboard, KeyCode, Animation, TERRAIN_HEIGHT_BASE, RigidBody, Vec3, RigidBody2D, Vec2, Prefab, director, instantiate, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerMovement')
export class PlayerMovement extends Component {
    //------------------------------------------------------------------------------
    private arrowLeftDown: boolean = false;
    private arrowRightDown: boolean = false;
    private arrowUpDown: boolean = false;
    private arrowDownDown: boolean = false;

    //------------------------------------------------------------------------------
    @property
    boomAmount: number = 0;
    @property
    movingOffset: number = 0;
    @property({ type: Prefab })
    bombPrefab: Prefab = undefined;

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
                if (!this.arrowLeftDown) {
                    this.getComponent(Animation).play("player-left");
                    this.arrowLeftDown = true;
                }
                this.node.setPosition(this.node.position.x - this.movingOffset, this.node.position.y);
                break;

            case KeyCode.ARROW_RIGHT:
                if (!this.arrowRightDown) {
                    this.getComponent(Animation).play("player-right");
                    this.arrowRightDown = true;
                }
                this.node.setPosition(this.node.position.x + this.movingOffset, this.node.position.y);
                break;

            case KeyCode.ARROW_UP:
                if (!this.arrowUpDown) {
                    this.getComponent(Animation).play("player-up");
                    this.arrowUpDown = true;
                }
                this.node.setPosition(this.node.position.x, this.node.position.y + this.movingOffset);
                break;

            case KeyCode.ARROW_DOWN:
                if (!this.arrowDownDown) {
                    this.getComponent(Animation).play("player-down");
                    this.arrowDownDown = true;
                }
                this.node.setPosition(this.node.position.x, this.node.position.y - this.movingOffset);
                break;

            case KeyCode.SPACE:
                // console.log("SPACEBAR pressed");
                let bomb = instantiate(this.bombPrefab);

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
                other_key_down_exist = this.arrowRightDown || this.arrowUpDown || this.arrowDownDown;
                if (!other_key_down_exist) {
                    this.getComponent(Animation).play("player-idle-left");
                }

                this.arrowLeftDown = false;
                break;
            case KeyCode.ARROW_RIGHT:
                other_key_down_exist = this.arrowLeftDown || this.arrowUpDown || this.arrowDownDown;
                if (!other_key_down_exist) {
                    this.getComponent(Animation).play("player-idle-right");
                }

                this.arrowRightDown = false;
                break;
            case KeyCode.ARROW_UP:
                other_key_down_exist = this.arrowRightDown || this.arrowLeftDown || this.arrowDownDown;
                if (!other_key_down_exist) {
                    this.getComponent(Animation).play("player-idle-up");
                }

                this.arrowUpDown = false;
                break;
            case KeyCode.ARROW_DOWN:
                other_key_down_exist = this.arrowRightDown || this.arrowUpDown || this.arrowLeftDown;
                if (!other_key_down_exist) {
                    this.getComponent(Animation).play("player-idle-down");
                }

                this.arrowDownDown = false;
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
