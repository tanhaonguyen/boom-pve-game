
import { _decorator, Component, Node, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { BombController } from './bomb_controller';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ExplosionController
 * DateTime = Mon Nov 29 2021 07:54:19 GMT+0700 (Indochina Time)
 * Author = hao_nguyen3
 * FileBasename = explosion_controller.ts
 * FileBasenameNoExtension = explosion_controller
 * URL = db://assets/scripts/explosion_controller.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('ExplosionController')
export class ExplosionController extends Component {

    private collider: Collider2D;

    //------------------------------------------------------------------------------------
    onLoad() {
        this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    start() {
        this.schedule(function(){
            this.node.destroy();
        }, 0.25);
    }

    update(deltaTime: number) {
    }

    onDestroy() {
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
    }
    //------------------------------------------------------------------------------------
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // console.log("Explosion touched object group" + otherCollider.group);

        // switch (otherCollider.group){
        //     case 2:
        //         console.log("Boom another bomb" + otherCollider.node.toString());
        //         // otherCollider.node.getComponent(BombController).explode();
        //         break;
        //     case 4:
        //         console.log("Now we destroy object" + otherCollider.node.toString());
        //         // otherCollider.node.destroy();
        //         break;
        // }

        
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // this.getComponent(Collider2D).group = 0;
        // console.log("Explosion untouched");
    }
}