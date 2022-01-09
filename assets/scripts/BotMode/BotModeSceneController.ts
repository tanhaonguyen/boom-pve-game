
import { _decorator, Component, find, Sprite, Color, Node, Vec3, director } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('BotModeSceneController')
export class BotModeSceneController extends Component {
    @property
    fogNodePath: string = "";

    @property
    startTxtNodePath: string = "";

    @property
    clearTxtNodePath: string = "";

    @property
    loseTxtNodePath: string = "";

    private fogSprite: Sprite = null;
    private startTxtNode: Node = null;
    private clearTxtNode: Node = null;
    private loseTxtNode: Node = null;
    private elapsedTime: number = 0;

    private starting: boolean = false;
    private clearing: boolean = false;
    private losing: boolean = false;

    public static _instance: BotModeSceneController = undefined;

    public static get instance(): BotModeSceneController {
        return BotModeSceneController._instance;
    }

    onLoad() {
        BotModeSceneController._instance = this;
        this.fogSprite = find(this.fogNodePath).getComponent(Sprite);
        this.startTxtNode = find(this.startTxtNodePath);
        this.clearTxtNode = find(this.clearTxtNodePath);
        this.loseTxtNode = find(this.loseTxtNodePath);

        this.elapsedTime = 0;
        this.startTxtNode.active = false;
        this.clearTxtNode.active = false;
        this.loseTxtNode.active = false;
    }

    start() {
        this.fogSprite.color = new Color(100, 100, 100, 150);
        this.starting = true;
    }

    update(deltaTime: number) {
        this.elapsedTime += deltaTime;

        if (this.starting) {
            if (!this.startTxtNode.active) {
                this.startTxtNode.active = true;
                this.clearTxtNode.active = false;
                this.loseTxtNode.active = false;
                this.elapsedTime = 0;
            }

            // Change fog color to transparent in 1 second
            if (this.fogSprite.color.a > 0 && this.elapsedTime > 1 && this.elapsedTime < 3) {
                let alpha = 255 - (this.elapsedTime * 255 / 2);
                this.fogSprite.color = new Color(100, 100, 100, alpha);
            }

            // Slide welcome text over
            if (this.elapsedTime > 1 && this.elapsedTime < 3) {
                let x = this.startTxtNode.position.x + this.elapsedTime * 50 / 2;
                this.startTxtNode.setPosition(new Vec3(x, 0, 0));
            }

            if (this.elapsedTime > 3) {
                this.starting = false;
                this.startTxtNode.active = false;
            }
        }
        else if (this.losing) {
            if (!this.loseTxtNode.active) {
                this.startTxtNode.active = false;
                this.clearTxtNode.active = false;
                this.loseTxtNode.active = true;
                this.elapsedTime = 0;
            }

            // Change fog color to gray in 2 second
            if (this.elapsedTime > 1 && this.elapsedTime < 3) {
                // Slowly fade in
                let alpha = Math.min(150, this.elapsedTime * 225 / 2 - 75);
                this.fogSprite.color = new Color(100, 100, 100, alpha);
            }

            // Slide lose text in
            if (this.elapsedTime > 1 && this.elapsedTime < 3) {
                let x = Math.max(0, this.loseTxtNode.position.x - this.elapsedTime * 50 / 2);
                this.loseTxtNode.setPosition(new Vec3(x, 0, 0));
            }

            if (this.elapsedTime > 3) {
                this.losing = false;
                director.pause();
            }
        }
        else if (this.clearing) {
            if (!this.clearTxtNode.active) {
                this.startTxtNode.active = false;
                this.clearTxtNode.active = true;
                this.loseTxtNode.active = false;
                this.elapsedTime = 0;
            }

            // Change fog color to gray in 2 second
            if (this.elapsedTime > 1 && this.elapsedTime < 3) {
                // Slowly fade in
                let alpha = Math.min(150, this.elapsedTime * 225 / 2 - 75);
                this.fogSprite.color = new Color(100, 100, 100, alpha);
            }

            // Slide clear text in
            if (this.elapsedTime > 1 && this.elapsedTime < 3) {
                let x = Math.max(0, this.clearTxtNode.position.x - this.elapsedTime * 50 / 2);
                this.clearTxtNode.setPosition(new Vec3(x, 0, 0));
            }

            if (this.elapsedTime > 3) {
                this.clearing = false;
                director.pause();
            }
        }
    }

    public onClear() {
        this.clearing = true;
    }

    public onLose() {
        this.losing = true;
    }
}
