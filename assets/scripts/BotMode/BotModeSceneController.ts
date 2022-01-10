
import { _decorator, Component, find, Sprite, Color, Node, Vec3, director, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;
 

@ccclass('BotModeSceneController')
export class BotModeSceneController extends Component {
    @property(Prefab)
    startTextPrefab: Prefab = undefined;

    @property(Prefab)
    clearTextPrefab: Prefab = undefined;

    @property(Prefab)
    loseTextPrefab: Prefab = undefined;

    @property
    nextSceneName: string = "";

    public static _instance: BotModeSceneController = undefined;

    public static get instance(): BotModeSceneController {
        return BotModeSceneController._instance;
    }

    onLoad() {
        BotModeSceneController._instance = this;
    }

    start() {
        let startText = instantiate(this.startTextPrefab);
        startText.setParent(this.node);
    }

    public onClear() {
        let clearText = instantiate(this.clearTextPrefab);
        clearText.setParent(this.node);
        
        this.scheduleOnce(() => {
            if (this.nextSceneName !== "")
                director.loadScene(this.nextSceneName);
            else 
                director.pause();
        }, 2);
    }

    public onLose() {
        let loseText = instantiate(this.loseTextPrefab);
        loseText.setParent(this.node);
        
        this.scheduleOnce(() => {
            director.pause();
        }, 2);
    }
}
