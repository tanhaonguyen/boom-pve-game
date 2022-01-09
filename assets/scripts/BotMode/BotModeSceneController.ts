
import { _decorator, Component, find, Sprite, Color, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('BotModeSceneController')
export class SceneController extends Component {
    @property
    fogNodePath: string = "";

    @property
    welcomeTxtNodePath: string = "";

    private fogSprite: Sprite = null;
    private welconeTxtNode: Node = null;
    private elapsedTime: number = 0;

    onLoad() {
        this.fogSprite = find(this.fogNodePath).getComponent(Sprite);
        this.welconeTxtNode = find(this.welcomeTxtNodePath);
        this.elapsedTime = 0;
    }

    start() {
        this.fogSprite.color = new Color(100, 100, 100, 150);
    }

    update(deltaTime: number) {
        this.elapsedTime += deltaTime;

        // Change fog color to transparent in 1 second
        if (this.fogSprite.color.a > 0 && this.elapsedTime > 1 && this.elapsedTime < 3) {
            let alpha = 255 - (this.elapsedTime * 255 / 2);
            this.fogSprite.color = new Color(100, 100, 100, alpha);
        }

        // Slide welcome text over
        if (this.elapsedTime > 1 && this.elapsedTime < 3) {
            let x = this.welconeTxtNode.position.x + this.elapsedTime * 50 / 2;
            this.welconeTxtNode.setPosition(new Vec3(x, 0, 0));
        }
    }
}
