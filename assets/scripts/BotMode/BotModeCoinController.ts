
import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { BotModePlayerController } from './BotModePlayerController';
const { ccclass } = _decorator;

@ccclass('BotModeCoinController')
export class BotModeCoinController extends Component {
    private collider: Collider2D = undefined;

    onLoad() {
        this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onDestroy() {
        if (this.collider)
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
    
    // ------------------------------------------------------------------------------------
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.group === 2) { // Player
            BotModePlayerController.instance.onCoinCollected();
            this.node.destroy();
        }
    }
}
