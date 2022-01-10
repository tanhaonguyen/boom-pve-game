
import { _decorator, Component, instantiate, Prefab, Vec3 } from 'cc';
import { Coordinate } from '../GlobalDefines';
import { BotModePlayerController } from './BotModePlayerController';
const { ccclass, property } = _decorator;


@ccclass('BotModeBombController')
export class BotModeBombController extends Component {
    public static bombData: {coor: Coordinate, length: number, timeLeft: number}[] = [];

    // ---------------------------------------------------------------------------------
    @property(Prefab)
    centerExplosion: Prefab = undefined;
    @property(Prefab)
    leftExplosion: Prefab = undefined;
    @property(Prefab)
    rightExplosion: Prefab = undefined;
    @property(Prefab)
    upExplosion: Prefab = undefined;
    @property(Prefab)
    downExplosion: Prefab = undefined;

    public bombLength = 1;
    
    // ---------------------------------------------------------------------------------
    start() {
        this.schedule(this.explode, 3);
    }

    update(deltaTime: number) {
        for (let i = 0; i < BotModeBombController.bombData.length; i++) {
            BotModeBombController.bombData[i].timeLeft -= deltaTime;
        }
    }

    // ---------------------------------------------------------------------------------
    public static pushPositionToQueue(xVal: number, yVal: number, length: number, timeLeft: number): void {
        BotModeBombController.bombData.push({coor: {x: xVal, y: yVal}, length, timeLeft});
    }

    public static popPositionFromQueue(): void {
        BotModeBombController.bombData.shift();
    }

    public explode() {
        this.generateExplosion();

        BotModePlayerController.instance.updatePlacedBombAmount(); // Decrease the amount of bomb that has been placed by player
        BotModeBombController.popPositionFromQueue(); // Pop the position of the bomb that has just exploded

        this.node.destroy();       
    }

    public generateExplosion(): void {
        // Initialize things
        let baseX = this.node.position.x;
        let baseY = this.node.position.y;
        let baseZ = this.node.position.z;

        // Create center explosion
        let center = instantiate(this.centerExplosion);
        center.setParent(this.node.getParent().getParent().getChildByName("Explosion"));
        center.setPosition(this.node.position);

        // Create left explosion
        for (let i = 0; i < this.bombLength; i++) {
            let left = instantiate(this.leftExplosion);
            left.setParent(this.node.getParent().getParent().getChildByName("Explosion"));
            left.setPosition(new Vec3(baseX - 40 * (i + 1), baseY, baseZ));          
        }

        // Create right explosion
        for (let i = 0; i < this.bombLength; i++) {
            let right = instantiate(this.rightExplosion);
            right.setParent(this.node.getParent().getParent().getChildByName("Explosion"));
            right.setPosition(new Vec3(baseX + 40 * (i + 1), baseY, baseZ));          
        }

        // Create up explosion
        for (let i = 0; i < this.bombLength; i++) {
            let up = instantiate(this.upExplosion);
            up.setParent(this.node.getParent().getParent().getChildByName("Explosion"));
            up.setPosition(new Vec3(baseX, baseY + 40 * (i + 1), baseZ));          
        }

        // Create down explosion
        for (let i = 0; i < this.bombLength; i++) {
            let down = instantiate(this.downExplosion);
            down.setParent(this.node.getParent().getParent().getChildByName("Explosion"));
            down.setPosition(new Vec3(baseX, baseY - 40 * (i + 1), baseZ));          
        }
    }
}
