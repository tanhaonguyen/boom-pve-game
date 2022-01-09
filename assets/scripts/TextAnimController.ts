
import { _decorator, Component, Node } from 'cc';
const { ccclass } = _decorator;
 
@ccclass('TextAnimController')
export class TextAnimController extends Component {
    start () {
        this.scheduleOnce(() => this.node.destroy(), 2);
    }
}
