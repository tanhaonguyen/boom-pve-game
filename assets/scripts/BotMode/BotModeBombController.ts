
import { _decorator, Component, instantiate, Prefab } from 'cc';
import { BotModePlayerController } from './BotModePlayerController';
const { ccclass, property } = _decorator;

type Coordinate = {
    x: number,
    y: number
}

@ccclass('BotModeBombController')
export class BotModeBombController extends Component {
    public static occupyCoor: Coordinate[] = [];

    // ---------------------------------------------------------------------------------
    @property({ type: Prefab })
    explosionPrefab: Prefab = undefined;
    
    // ---------------------------------------------------------------------------------
    start() {
        this.schedule(this.explode, 3);
    }

    // ---------------------------------------------------------------------------------
    public static pushPositionToQueue(xVal: number, yVal: number): void {
        BotModeBombController.occupyCoor.push({x: xVal, y: yVal});
    }

    public static popPositionFromQueue(): void {
        BotModeBombController.occupyCoor.shift();
    }

    public explode() {
        let explosion = instantiate(this.explosionPrefab);
        explosion.setParent(this.node.getParent().getParent().getChildByName("Explosion"));
        explosion.setPosition(this.node.position);

        BotModePlayerController.instance.updatePlacedBombAmount(); // Decrease the amount of bomb that has been placed by player
        BotModeBombController.popPositionFromQueue(); // Pop the position of the bomb that has just exploded
        this.node.destroy();
    }
}