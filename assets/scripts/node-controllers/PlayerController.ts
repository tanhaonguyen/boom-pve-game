
import { _decorator, Component, EventKeyboard, KeyCode, Animation, Vec3, Prefab, instantiate, Input, input } from 'cc';
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
        input.on(Input.EventType.KEY_DOWN, this.onKeyPressed, this);
        input.on(Input.EventType.KEY_UP, this.onKeyReleased, this);
    }

    start() {
    }

    update(deltaTime: number) {
        if (this.arrowLeftDown) {
            this.node.setPosition(this.node.position.x - this.movingOffset * deltaTime, this.node.position.y);
        }
        else if (this.arrowRightDown) {
            this.node.setPosition(this.node.position.x + this.movingOffset * deltaTime, this.node.position.y);
        }
        else if (this.arrowUpDown) {
            this.node.setPosition(this.node.position.x, this.node.position.y  + this.movingOffset * deltaTime);
        }
        else if (this.arrowDownDown) {
            this.node.setPosition(this.node.position.x, this.node.position.y - this.movingOffset * deltaTime);
        }

    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyPressed, this);
        input.off(Input.EventType.KEY_UP, this.onKeyReleased, this);
    }
    //------------------------------------------------------------------------------
    onKeyPressed(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT:              
                !this.arrowLeftDown ? this.getComponent(Animation).play("player-left"): undefined;
                this.arrowLeftDown = true;
                this.arrowRightDown = false;
                this.arrowUpDown = false;
                this.arrowDownDown = false;
                break;

            case KeyCode.ARROW_RIGHT:
                !this.arrowRightDown ? this.getComponent(Animation).play("player-right"): undefined;
                this.arrowLeftDown = false;
                this.arrowRightDown = true;
                this.arrowUpDown = false;
                this.arrowDownDown = false;
                break;

            case KeyCode.ARROW_UP:
                !this.arrowUpDown ? this.getComponent(Animation).play("player-up"): undefined;
                this.arrowLeftDown = false;
                this.arrowRightDown = false;
                this.arrowUpDown = true;
                this.arrowDownDown = false;
                break;

            case KeyCode.ARROW_DOWN:
                !this.arrowDownDown ? this.getComponent(Animation).play("player-down"): undefined;
                this.arrowLeftDown = false;
                this.arrowRightDown = false;
                this.arrowUpDown = false;
                this.arrowDownDown = true;
                break;

            case KeyCode.SPACE:
                let bomb = instantiate(this.bombPrefab);

                bomb.setParent(this.node.getParent().getChildByName("Bomb"));

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
