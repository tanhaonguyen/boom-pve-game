
import { _decorator, Component, EventKeyboard, KeyCode, Animation, Vec3, Prefab, instantiate, Input, input, Collider2D, Contact2DType, IPhysics2DContact, sys, Label, find } from 'cc';
import { Buff, ColliderGroup } from '../GlobalDefines';
import { BotModeBombController } from './BotModeBombController';
import { BotModeBotController } from './BotModeBotController';
import { BotModeSceneController } from './BotModeSceneController';
const { ccclass, property } = _decorator;


@ccclass('BotModePlayerController')
export class BotModePlayerController extends Component {
    public static _instance: BotModePlayerController = undefined;

    public static get instance(): BotModePlayerController {
        return BotModePlayerController._instance;
    }

    //------------------------------------------------------------------------------
    private _bombAmount: number = 1;
    private _placedBomb: number = 0;
    private _speed: number = 100;
    public bombLength: number = 1;
    private coinCount: number = 0;

    //------------------------------------------------------------------------------
    @property(Prefab)
    bombPrefab: Prefab = undefined;
    @property
    maxBombAmount: number = 10;
    @property
    maxSpeed: number = 1000;
    @property
    maxBombLength: number = 10;

    //------------------------------------------------------------------------------
    private arrowLeftDown: boolean = false;
    private arrowRightDown: boolean = false;
    private arrowUpDown: boolean = false;
    private arrowDownDown: boolean = false;

    //--------------------------Life-cycle-functions--------------------------------
    onLoad() {
        BotModePlayerController._instance = this;

        sys.localStorage.getItem("coinCount") ? this.coinCount = parseInt(sys.localStorage.getItem("coinCount")) : 0;
        find('Canvas/CoinCount/CoinCountLabel').getComponent(Label).string = this.coinCount.toString();

        input.on(Input.EventType.KEY_DOWN, this.onKeyPressed, this);
        input.on(Input.EventType.KEY_UP, this.onKeyReleased, this);
    }

    start() {
        let collider: Collider2D = this.node.getComponent(Collider2D);
        if (collider)
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    update(deltaTime: number) {
        if (this.arrowLeftDown) {
            this.node.setPosition(this.node.position.x - this._speed * deltaTime, this.node.position.y);
        }
        else if (this.arrowRightDown) {
            this.node.setPosition(this.node.position.x + this._speed * deltaTime, this.node.position.y);
        }
        else if (this.arrowUpDown) {
            this.node.setPosition(this.node.position.x, this.node.position.y + this._speed * deltaTime);
        }
        else if (this.arrowDownDown) {
            this.node.setPosition(this.node.position.x, this.node.position.y - this._speed * deltaTime);
        }
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyPressed, this);
        input.off(Input.EventType.KEY_UP, this.onKeyReleased, this);

        let collider: Collider2D = this.node.getComponent(Collider2D);
        if (collider)
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    //----------------------------Trigger-function----------------------------------------
    onKeyPressed(event: EventKeyboard): void {
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT: // Move left
                !this.arrowLeftDown ? this.getComponent(Animation).play("player-left") : undefined;
                this.arrowLeftDown = true;
                this.arrowRightDown = false;
                this.arrowUpDown = false;
                this.arrowDownDown = false;
                break;

            case KeyCode.ARROW_RIGHT: // Move right
                !this.arrowRightDown ? this.getComponent(Animation).play("player-right") : undefined;
                this.arrowLeftDown = false;
                this.arrowRightDown = true;
                this.arrowUpDown = false;
                this.arrowDownDown = false;
                break;

            case KeyCode.ARROW_UP: // Move up
                !this.arrowUpDown ? this.getComponent(Animation).play("player-up") : undefined;
                this.arrowLeftDown = false;
                this.arrowRightDown = false;
                this.arrowUpDown = true;
                this.arrowDownDown = false;
                break;

            case KeyCode.ARROW_DOWN: // Move down
                !this.arrowDownDown ? this.getComponent(Animation).play("player-down") : undefined;
                this.arrowLeftDown = false;
                this.arrowRightDown = false;
                this.arrowUpDown = false;
                this.arrowDownDown = true;
                break;

            case KeyCode.SPACE: // Place the bomb
                if (this._placedBomb < this._bombAmount) {
                    let suitableX = this.findBombCoordinate(this.node.position.x, 40);
                    let suitableY = this.findBombCoordinate(this.node.position.y, 40);

                    let occupied: boolean = false;
                  
                    for (let bombData of BotModeBombController.bombData) {
                        if (bombData.coor.x === suitableX && bombData.coor.y === suitableY) {
                            occupied = true;
                            break;
                        }
                    }

                    if (!occupied) {  
                        ++this._placedBomb;

                        let bomb = instantiate(this.bombPrefab);
                        bomb.setParent(this.node.getParent().getChildByName("Bomb"));
                        bomb.setPosition(new Vec3(suitableX, suitableY, 0));
                        bomb.getComponent(BotModeBombController).bombLength = this.bombLength;

                        BotModeBombController.pushPositionToQueue(suitableX, suitableY, this.bombLength, 3); // Mark this coordinate is occupied
                    }
                }
                break;
        }
    }

    onKeyReleased(event: EventKeyboard): void {
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
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        console.log("Player begin contact with", otherCollider.group);

        switch (otherCollider.group) {
            case ColliderGroup.Buff:
                this.updatePlayerStats(otherCollider.tag);
                otherCollider.node.destroy();

                if (!BotModeBotController.instance.isDead)
                    BotModeBotController.instance.setMapToFree(otherCollider.node.getPosition());
                break;
            case ColliderGroup.DEFAULT:
                if (otherCollider.tag === 200) // Explosion area
                    this.onKilled();
                break;
        }
    }
    //------------------------Funtional-functions------------------------------
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

    updatePlacedBombAmount(): void {
        --this._placedBomb;
    }

    updatePlayerStats(buffTag: number): void {
        switch (buffTag) {
            case Buff.LengthPotion:
                this.bombLength = (this.bombLength < this.maxBombLength) ? this.bombLength + 1 : this.bombLength;
                break;
            case Buff.MaxLengthBuff:
                this.bombLength = this.maxBombLength;
                break;
            case Buff.MoreBomb:
                this._bombAmount = (this._bombAmount < this.maxBombAmount) ? this._bombAmount + 1 : this._bombAmount;
                break;
            case Buff.Speed:
                this._speed = (this._speed < this.maxSpeed) ? this._speed + 50 : this._speed;
                break;
        }
    }

    public onKilled() {
        this.getComponent(Animation).play("player-dead");
        this.onDestroy();
        setTimeout(() => BotModeSceneController.instance.onLose(), 500);
    }

    public onCoinCollected() {
        ++this.coinCount;
        find('Canvas/CoinCount/CoinCountLabel').getComponent(Label).string = this.coinCount.toString();
        sys.localStorage.setItem("coinCount", this.coinCount.toString());
    }
}
