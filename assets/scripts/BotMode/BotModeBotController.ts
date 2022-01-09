
import { _decorator, Component, resources, JsonAsset, find, Node, instantiate, Vec3, Vec2, Prefab, Animation, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { BotModeBombController } from './BotModeBombController';
import { BotModePlayerController } from './BotModePlayerController';
const { ccclass, property } = _decorator;
 
enum AIAction {
    None,
    PlaceBomb,
    MoveUp,
    MoveDown,
    MoveLeft,
    MoveRight,
    Dead
}

enum ColliderGroup {
    DEFAULT = 1,
    Player = 2,
    Buff = 4,
    Bomb = 8
}

enum Buff {
    LengthPotion,
    MaxLengthBuff,
    MoreBomb,
    Speed
}

@ccclass('BotModeBotController')
export class BotModeBotController extends Component {
    @property
    sceneName: string = '';

    @property
    maxSpeed: number = 1000;

    @property(Prefab)
    bombPrefab: Prefab = null;

    @property(Prefab)
    coinPrefab: Prefab = null;

    @property
    assetCharacterName: string = '';

    @property
    maxBombAmount: number = 10;

    private sceneMatrix: string[][] = [];
    private action: AIAction = AIAction.None;

    private speed: number = 100;
    private bombAmount: number = 1;
    private placedBomb: number = 0;

    private movingUp: boolean = false;
    private movingLeft: boolean = false;
    private movingDown: boolean = false;
    private movingRight: boolean = false;
    private dead: boolean = false;
    public get isDead() {
        return this.dead;
    }

    private updateIntervalHandle: number | null = null;

    public static _instance: BotModeBotController = undefined;

    public static get instance(): BotModeBotController {
        return BotModeBotController._instance;
    }

    onLoad () {
        BotModeBotController._instance = this;

        resources.load(this.sceneName + '/matrix', JsonAsset, (err, res) => {
            let data = res.json;
            this.sceneMatrix = data['matrix'];

            if (data["horizontalSymetric"]) {
                for (let i = this.sceneMatrix.length - 1; i >= 0; --i) {
                    let newRow = this.sceneMatrix[i].slice();
                    this.sceneMatrix.push(newRow);
                }
            }

            if (data["verticalSymetric"]) {
                for (let i = 0; i < this.sceneMatrix.length; ++i)
                    for (let j = this.sceneMatrix[i].length - 1; j >= 0; --j)
                        this.sceneMatrix[i].push(this.sceneMatrix[i][j]);
            }
        });
    }

    start () {
        setTimeout(() => {
            this.updateIntervalHandle = setInterval(this.__updateAction.bind(this), 20);
        }, 2000);

        let collider: Collider2D = this.node.getComponent(Collider2D);
        if (collider)
            collider.on(Contact2DType.BEGIN_CONTACT, this.__onBeginContact, this);
    }

    update (deltaTime: number) {
        if (this.action === AIAction.PlaceBomb) {
            if (this.placedBomb < this.bombAmount) {
                let suitableX = this.__findBombCoordinate(this.node.position.x, 40);
                let suitableY = this.__findBombCoordinate(this.node.position.y, 40);

                let occupied: boolean = false;
              
                for (let coor of BotModeBombController.occupyCoor) {
                    if (coor.x === suitableX && coor.y === suitableY) {
                        occupied = true;
                        break;
                    }
                }

                if (!occupied) {  
                    ++this.placedBomb;

                    let bomb = instantiate(this.bombPrefab);
                    bomb.setParent(this.node.getParent().getChildByName("Bomb"));
                    bomb.setPosition(new Vec3(suitableX, suitableY, 0));

                    BotModeBombController.pushPositionToQueue(suitableX, suitableY); // Mark this coordinate is occupied
                }
            }
        }
        else if (this.action === AIAction.MoveUp) {
            this.node.setPosition(this.node.getPosition().add(new Vec3(0, this.speed * deltaTime, 0)));
            if (!this.movingUp) {
                this.movingUp = true;
                this.movingLeft = false;
                this.movingDown = false;
                this.movingRight = false;
                this.dead = false;

                this.getComponent(Animation).play(this.assetCharacterName + '-up');
            }
        }
        else if (this.action === AIAction.MoveDown) {
            this.node.setPosition(this.node.getPosition().add(new Vec3(0, -this.speed * deltaTime, 0)));
            if (!this.movingDown) {
                this.movingUp = false;
                this.movingLeft = false;
                this.movingDown = true;
                this.movingRight = false;
                this.dead = false;

                this.getComponent(Animation).play(this.assetCharacterName + '-down');
            }
        }
        else if (this.action === AIAction.MoveLeft) {
            this.node.setPosition(this.node.getPosition().add(new Vec3(-this.speed * deltaTime, 0, 0)));
            if (!this.movingLeft) {
                this.movingUp = false;
                this.movingLeft = true;
                this.movingDown = false;
                this.movingRight = false;
                this.dead = false;

                this.getComponent(Animation).play(this.assetCharacterName + '-left');
            }
        }
        else if (this.action === AIAction.MoveRight) {
            this.node.setPosition(this.node.getPosition().add(new Vec3(this.speed * deltaTime, 0, 0)));
            if (!this.movingRight) {
                this.movingUp = false;
                this.movingLeft = false;
                this.movingDown = false;
                this.movingRight = true;
                this.dead = false;

                this.getComponent(Animation).play(this.assetCharacterName + '-right');
            }
        }
        else if (this.action === AIAction.None) {
            this.movingUp = false;
            this.movingLeft = false;
            this.movingDown = false;
            this.movingRight = false;
            this.dead = false;

            this.getComponent(Animation).play(this.assetCharacterName + '-idle-down');
        }
        else if (this.action === AIAction.Dead) {
            if (!this.dead) {
                this.movingUp = false;
                this.movingLeft = false;
                this.movingDown = false;
                this.movingRight = false;
                this.dead = true;

                this.getComponent(Animation).play(this.assetCharacterName + '-dead');
            }
        }
    }

    onDestroy() {
        clearInterval(this.updateIntervalHandle);
        this.updateIntervalHandle = null;

        let collider: Collider2D = this.node.getComponent(Collider2D);
        if (collider)
            collider.off(Contact2DType.BEGIN_CONTACT, this.__onBeginContact, this);
    }

    private __findBombCoordinate(num: number, tileSize: number): number {
        let sign = 1;
        if (num < 0) {
            sign = -1;
            num *= -1;
        }

        //tileSize = 40 => find k that 40*k + 20 = num
        let halfTileSize = Math.floor(tileSize / 2);
        let k = Math.round((num - halfTileSize) / tileSize);
        let suitableCoordinate = (tileSize * k + halfTileSize) * sign;

        return suitableCoordinate;
    }

    private __updateAction() {
        if (this.updateIntervalHandle === null)
            return;

        let aiPos = this.node.getPosition();
        let aiSquareIdx = this.__getMatrixIdxFromPos(aiPos);

        let playerPos = BotModePlayerController.instance.node.getPosition();
        let playerSquareIdx = this.__getMatrixIdxFromPos(playerPos);

        if (this.__canKillPlayer(aiSquareIdx, playerSquareIdx))
            this.action = AIAction.PlaceBomb;
        else {
            let route = this.__updateRoute(aiSquareIdx, playerSquareIdx);
            this.action = this.__getActionFromRoute(aiSquareIdx, route);
        }
    }

    // Calcalate route from ai to player using BFS and scene matrix
    private __updateRoute(aiSquareIdx: Vec2, playerSquareIdx: Vec2) {
        let visited: Set<string> = new Set();
        let queue: Vec2[][] = [];

        // Push first node to queue
        queue.push([aiSquareIdx]);

        let curRoute: Vec2[] = null;
        let curNode: Vec2 = null;

        // While queue is not empty
        while (queue.length > 0) {
            // Get current node from queue
            curRoute = queue.shift();
            curNode = curRoute[curRoute.length - 1];

            // Found target node
            if (this.__canKillPlayer(curNode, playerSquareIdx) || 
                this.sceneMatrix[curNode.y][curNode.x] === 'i') {
                curRoute.shift();
                return curRoute;
            }

            // If current node is not visited
            if (!visited.has(curNode.x + '_' + curNode.y)) {
                // Push current node to visited
                visited.add(curNode.x + '_' + curNode.y);

                // Push current node's children to queue
                this.__getNextNodes(curNode).forEach(node => queue.push([...curRoute, node]));
            }
        }

        return [];
    }

    // Determine square index from position, each square has size 40x40
    private __getMatrixIdxFromPos(pos: Vec3, noOffset: boolean = false) {
        if (!noOffset) {
            if (this.action === AIAction.MoveRight)
                pos.x -= 20;
            else if (this.action === AIAction.MoveLeft)
                pos.x += 20;
            else if (this.action === AIAction.MoveUp)
                pos.y -= 20;
            else if (this.action === AIAction.MoveDown)
                pos.y += 20;
        }

        return new Vec2(
            Math.floor((pos.x + 960 / 2) / 40), 
            Math.floor((-pos.y + 640 / 2) / 40)
        );
    }

    private __getNextNodes(nodeIdx: Vec2) {
        let nextNodes: Vec2[] = [];
        let availableMoves = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        
        availableMoves.forEach(nextMove => {
            let newX = nodeIdx.x + nextMove[0];
            let newY = nodeIdx.y + nextMove[1];

            if (newX >= 0 && newX < this.sceneMatrix[0].length && newY >= 0 && newY < this.sceneMatrix.length) {
                if (this.sceneMatrix[newY][newX] !== 'b' && this.sceneMatrix[newY][newX] !== 'o') {
                    if (!this.__canBeKilled(new Vec2(newX, newY)) || this.__isNearBot(new Vec2(newX, newY)))
                        nextNodes.push(new Vec2(newX, newY));
                }
            }
        });

        return nextNodes;
    }

    // Detemine if a bomb can kill bot if stand on this position
    private __canBeKilled(aiSquareIdx: Vec2) {
        for (let coor of BotModeBombController.occupyCoor) {
            let bombSquareIdx = this.__getMatrixIdxFromPos(new Vec3(coor.x, coor.y, 0), true);

            if (aiSquareIdx.x === bombSquareIdx.x && Math.abs(aiSquareIdx.y - bombSquareIdx.y) <= 2)
                return true;

            if (aiSquareIdx.y === bombSquareIdx.y && Math.abs(aiSquareIdx.x - bombSquareIdx.x) <= 2)
                return true;
        }
        
        return false;
    }

    private __isNearBot(aiSquareIdx: Vec2) {
        let curIdx = this.__getMatrixIdxFromPos(this.node.getPosition(), true);
        return Math.abs(aiSquareIdx.y - curIdx.y) <= 2 || Math.abs(aiSquareIdx.x - curIdx.x) <= 2;
    }

    // Determine if ai can kill player, bomb explode area is 3x3, bomb will be placed in AI position
    private __canKillPlayer(aiSquareIdx: Vec2, playerSquareIdx: Vec2) {
        if (aiSquareIdx.x === playerSquareIdx.x && Math.abs(aiSquareIdx.y - playerSquareIdx.y) <= 2)
            return true;
        
        if (aiSquareIdx.y === playerSquareIdx.y && Math.abs(aiSquareIdx.x - playerSquareIdx.x) <= 2)
            return true;
        
        return false;
    }
    
    // Determine action from route
    private __getActionFromRoute(aiSquareIdx: Vec2, route: Vec2[]) {
        if (route.length === 0)
            return AIAction.None;

        let squareToGo = route[0];
        if (aiSquareIdx.x === squareToGo.x && aiSquareIdx.y === squareToGo.y) {
            route.shift();
            return this.__getActionFromRoute(aiSquareIdx, route);
        }

        let action: AIAction;

        let pos = this.node.getPosition();
        let posNorm = new Vec2(Math.abs(pos.x - 20), Math.abs(pos.y));
        let offsetRadius = 2;

        if (squareToGo.x === aiSquareIdx.x) {
            if (squareToGo.y > aiSquareIdx.y)
                action = AIAction.MoveDown;
            else
                action = AIAction.MoveUp;
        }
        else {
            if (squareToGo.x > aiSquareIdx.x)
                action = AIAction.MoveRight;
            else
                action = AIAction.MoveLeft;
        }

        return action;
    }

    public onKilled() {
        if (!this.dead) {
            this.onDestroy();
            this.action = AIAction.Dead;
            this.__spawnCoin();
            this.scheduleOnce(() => this.node.destroy(), 1);
        }
    }

    private __spawnCoin() {
        let firstX = -460;
        let firstY = 300;

        // Iterate over scene matrix
        for (let i = 0; i < this.sceneMatrix.length; ++i) {
            for (let j = 0; j < this.sceneMatrix[0].length; ++j) {
                if (this.sceneMatrix[i][j] === 'f') {
                    let coin = instantiate(this.coinPrefab);
                    coin.setParent(this.node.getParent().getChildByName('Coin'));
                    coin.setPosition(new Vec3(firstX + j * 40, firstY - i * 40, 0));
                }
            }
        }
    }

    private __updateBotStats(buffTag: number, pos: Vec3): void {
        switch (buffTag) {
            case Buff.LengthPotion:
                // this._bombLength = (this._bombLength < this.maxBombLength) ? this._bombLength + 1 : this._bombLength;
                break;
            case Buff.MaxLengthBuff:
                // this._bombLength = this.maxBombLength;
                break;
            case Buff.MoreBomb:
                this.bombAmount = (this.bombAmount < this.maxBombAmount) ? this.bombAmount + 1 : this.bombAmount;
                break;
            case Buff.Speed:
                this.speed = (this.speed < this.maxSpeed) ? this.speed + 50 : this.speed;
                break;
        }

        this.setMapToFree(pos);
    }

    private __onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        console.log("Bot begin contact with", otherCollider.group);

        switch (otherCollider.group) {
            case ColliderGroup.Buff:
                this.__updateBotStats(otherCollider.tag, otherCollider.node.getPosition());
                otherCollider.node.destroy();
                break;
            case ColliderGroup.DEFAULT:
                if (otherCollider.tag === 200) // Explosion area
                    this.onKilled();
                break;
        }
    }

    public setMapToFree(pos: Vec3, offset: Vec3 = null) {
        if (offset !== null)
            pos = pos.add(offset);

        let squareIdx = this.__getMatrixIdxFromPos(pos, true);
        this.sceneMatrix[squareIdx.y][squareIdx.x] = 'f';
    }
}
