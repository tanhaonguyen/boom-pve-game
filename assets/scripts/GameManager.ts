
import { _decorator, Component, Node, Vec3, Prefab, instantiate, director } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('GameManager')
export class GameManager extends Component {

    public static _instance: GameManager = undefined;

    public static get instance(): GameManager {
        return GameManager._instance;
    }

   // -------------------------------------------------------------
    @property(Prefab)
    lengthPotion: Prefab = undefined;
    @property(Prefab)
    maxLengthBuff: Prefab = undefined;
    @property(Prefab)
    moreBomb: Prefab = undefined;
    @property(Prefab)
    speed: Prefab = undefined;
    @property(Prefab)
    loseScreen: Prefab = undefined;
    
    onLoad() {
        GameManager._instance = this;
    }

    start () {
    }

    update (deltaTime: number) {
    }

    // ------------------------------------------------------------
    dropBuffAt(coor: Vec3): void {
        let randomNumber: number = Math.round(Math.random() * 100);
        let buffNode: Node = undefined;

        if (randomNumber < 76) {
            return;
        }
        else if (randomNumber <81) {
            buffNode = instantiate(this.moreBomb);
        }
        else if (randomNumber < 91) {
            buffNode = instantiate(this.speed);
        }
        else if (randomNumber < 96) {
            buffNode = instantiate(this.lengthPotion);
        }
        else if (randomNumber < 101) {
            buffNode = instantiate(this.maxLengthBuff);
        } 

        buffNode.setParent(this.node.getParent().getChildByName("Canvas").getChildByName("Buff"));
        buffNode.setPosition(new Vec3(coor.x, coor.y + 20, coor.z));
        buffNode.active = false;

        if (buffNode) {
            this.scheduleOnce(() => {
               buffNode.active = true;
            }, 0.4)
                
        }          
    }

    loseGame(): void {
        console.log("Lose game at: ", this.node.name);
        let tmp = instantiate(this.loseScreen);
        tmp.setParent(this.node.getParent().getChildByName("Canvas"));
        tmp.setPosition(new Vec3(0, 0, 0));          

        this.scheduleOnce(() => {
            director.loadScene("menu");
        }, 2);

    }

    loadSurvival(): void {
        director.loadScene("Cementary");
    }

    loadChallenger(): void {
        director.loadScene("Island");
    }

    loadBoss(): void {
        director.loadScene("gameplay");
    }
}