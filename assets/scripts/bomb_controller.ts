
import { _decorator, Component, Node, PolygonCollider2D, Collider2D, Contact2DType, IPhysics2DContact, RigidBody2D, instantiate, Prefab, director, ExtrapolationMode } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = BombController
 * DateTime = Mon Nov 29 2021 01:41:04 GMT+0700 (Indochina Time)
 * Author = hao_nguyen3
 * FileBasename = bomb_controller.ts
 * FileBasenameNoExtension = bomb_controller
 * URL = db://assets/scripts/bomb_controller.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('BombController')
export class BombController extends Component {

    private collider: Collider2D;

    @property({ type: Prefab })
    explosion_prefab: Prefab = null;

    //---------------------------------------------------------------------------------
    onLoad() {
        this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    start() {
        this.schedule(this.explode, 3);
    }

    update(deltaTime: number) {
        // this.getComponent(PolygonCollider2D).group = "";
    }
    onDestroy() {
        console.log("Go to function onDestroy");
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    //------------------------------------------------------------------------------------
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log("Bomb touched");
        // this.explode();
    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // this.getComponent(Collider2D).group = 0;
        console.log("Bomb untouched");
        }

    //------------------------------------------------------------------------------------
    public explode() {
        console.log("Go to function Explode");
        let explosion = instantiate(this.explosion_prefab);
        explosion.setParent(this.node.getParent().getParent().getChildByName("explosion"));
        explosion.setPosition(this.node.position);

        this.node.destroy();
    }
}