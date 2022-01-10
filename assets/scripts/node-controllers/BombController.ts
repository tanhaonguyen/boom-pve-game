
import { _decorator, Component, Node, PolygonCollider2D, Collider2D, Contact2DType, IPhysics2DContact, RigidBody2D, instantiate, Prefab, director, ExtrapolationMode, Vec3, AudioSource } from 'cc';
import { Coordinate } from '../GlobalDefines';
import { ExplosionController } from './ExplosionController';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;



@ccclass('BombController')
export class BombController extends Component {

    public static occupyCoor: Coordinate[] = [];

    private audioSource: AudioSource = undefined;
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
    
    // ---------------------------------------------------------------------------------
    private player: PlayerController = undefined;
    private collider: Collider2D = undefined;

    // ---------------------------------------------------------------------------------
    onLoad() {
       
    }

    start() {
        this.scheduleOnce(this.explode, 3);
        this.player = PlayerController.instance;
        this.audioSource = this.node.getComponent(AudioSource);
    }

    update(deltaTime: number) {
    }
    onDestroy() {    
    }
    // ---------------------------------------------------------------------------------
    public static pushPositionToQueue(xVal: number, yVal: number): void {
        BombController.occupyCoor.push({x: xVal, y: yVal});
    }

    public static popPositionFromQueue(): void {
        BombController.occupyCoor.shift();
    }

    // ------------------------------------------------------------------------------------
    public explode() {
        this.audioSource.playOneShot(this.audioSource.clip, 5);

        this.generateExplosion(this.player.bombLength);
        this.player.updatePlacedBombAmount(); // Decrease the amount of bomb that has been placed by player
        BombController.popPositionFromQueue(); // Pop the position of the bomb that has just exploded

        this.node.destroy();       
    }

    public generateExplosion(length: number): void {
        // Initialize things
        let baseX = this.node.position.x;
        let baseY = this.node.position.y;
        let baseZ = this.node.position.z;

        // Create center explosion
        let center = instantiate(this.centerExplosion);
        center.setParent(this.node.getParent().getParent().getChildByName("Explosion"));
        center.setPosition(this.node.position);

        // Create left explosion
        for (let i = 0; i < length; i++) {
            let left = instantiate(this.leftExplosion);
            left.setParent(this.node.getParent().getParent().getChildByName("Explosion"));
            left.setPosition(new Vec3(baseX - 40 * (i + 1), baseY, baseZ));          
        }

        // Create right explosion
        for (let i = 0; i < length; i++) {
            let right = instantiate(this.rightExplosion);
            right.setParent(this.node.getParent().getParent().getChildByName("Explosion"));
            right.setPosition(new Vec3(baseX + 40 * (i + 1), baseY, baseZ));          
        }

        // Create up explosion
        for (let i = 0; i < length; i++) {
            let up = instantiate(this.upExplosion);
            up.setParent(this.node.getParent().getParent().getChildByName("Explosion"));
            up.setPosition(new Vec3(baseX, baseY + 40 * (i + 1), baseZ));          
        }

        // Create down explosion
        for (let i = 0; i < length; i++) {
            let down = instantiate(this.downExplosion);
            down.setParent(this.node.getParent().getParent().getChildByName("Explosion"));
            down.setPosition(new Vec3(baseX, baseY - 40 * (i + 1), baseZ));          
        }
    }
}