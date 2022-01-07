
import { _decorator, Component, Node, PolygonCollider2D, Collider2D, Contact2DType, IPhysics2DContact, RigidBody2D, instantiate, Prefab, director, ExtrapolationMode } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

@ccclass('BombController')
export class BombController extends Component {

    @property({ type: Prefab })
    explosionPrefab: Prefab = undefined;
    
    private player: PlayerController = undefined;
    private collider: Collider2D = undefined;

    // ---------------------------------------------------------------------------------
    onLoad() {
        this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    start() {
        this.schedule(this.explode, 3);
        this.player = PlayerController.instance;
    }

    update(deltaTime: number) {
        // this.getComponent(PolygonCollider2D).group = "";
    }
    onDestroy() {
        console.log("Go to function onDestroy");

        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    // ------------------------------------------------------------------------------------
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log("Bomb touched");
        // this.explode();
    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // this.getComponent(Collider2D).group = 0;
        console.log("Bomb untouched");
        }

    // ------------------------------------------------------------------------------------
    public explode() {
        // console.log("Go to function Explode");

        let explosion = instantiate(this.explosionPrefab);
        explosion.setParent(this.node.getParent().getParent().getChildByName("Explosion"));
        explosion.setPosition(this.node.position);

        this.player.updatePlacedBombAmount();
        this.node.destroy();
    }
}