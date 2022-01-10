
import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact, Vec2, Vec3 } from 'cc';
import { ColliderGroup } from '../GlobalDefines';
import { BotModeBotController } from './BotModeBotController';
import { BotModePlayerController } from './BotModePlayerController';
const { ccclass } = _decorator;


@ccclass('BotModeExplosionController')
export class BotModeExplosionController extends Component {
    // ------------------------------------------------------------------------------------
    onLoad() {        
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    start() {
        this.schedule(function(){
            this.node.destroy();
        }, 0.25);
    }

    onDestroy() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
    
    // ------------------------------------------------------------------------------------
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log("Explosion touched object group" + otherCollider.group + " with name " + otherCollider.node.name);

        switch (otherCollider.group){
            case ColliderGroup.Player: // Player
                BotModePlayerController.instance.onKilled();
                break;
            case ColliderGroup.DEFAULT: // Other objects
                if (otherCollider.tag == 100) { // Destroyable object
                    otherCollider.node.destroy();
                    
                    if (!BotModeBotController.instance.isDead)
                        BotModeBotController.instance.setMapToFree(otherCollider.node.getPosition(), new Vec3(20, 10, 0));
                }
                else if (otherCollider.tag === 300) // Bot
                    otherCollider.node.getComponent(BotModeBotController).onKilled();
                break;
        }
    }
}
