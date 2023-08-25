/**
 * 启动场景
 */

import { UIManager } from "../../bundles/framework/UIManager";



 
const {ccclass, property} = cc._decorator;

@ccclass
export class StartScene extends cc.Component {

    private progressComp = null;
    private progress = 0.5;
    private stop = false;

    onLoad() {
        let node = this.node.getChildByName('progress');
        this.progressComp = node.getComponent(cc.ProgressBar);
    }

    start() {
        let temp = [];
        for (let i = 0; i < 3; ++i) {
            let item = this.node.getChildByName('spot' + i);
            item.opacity = 0;
            temp.push(item);
        }

        cc.tween(this.node).repeatForever(
            cc.tween().delay(0.5).call(() => {
                temp[0].opacity = 255;
            }).delay(0.5).call(() => {
                temp[1].opacity = 255;
            }).delay(0.5).call(() => {
                temp[2].opacity = 255;
            }).delay(0.5).call(() => {
                temp[0].opacity = 0;
                temp[1].opacity = 0;
                temp[2].opacity = 0;
            })
        ).start();

        this.initScene();
    }

    lateUpdate(dt: number) {
        if (this.stop) { return }
        if (this.progressComp) {
            if (this.progressComp.progress < this.progress) {
                this.progressComp.progress += 0.05;
                if (this.progressComp.progress >= 1) {
                    this.stop = true;
                    this.enterMainScene();
                }
            }
        }
    }

    enterMainScene() {
        cc.director.loadScene('MainScene');
    }

    private initScene() {
        cc.assetManager.loadBundle('common', (err, bundle) => {
            if (err) { return console.error(err); }
            //加载音频资源
            bundle.loadDir('res/snd', cc.AudioClip, (err, audios: cc.AudioClip[]) => {
                this.updateProgress();
                for (let i = 0; i < audios.length; i++) {
                    let audio = audios[i];
                    (window as any).GameDataCenter.audios[audio.name] = audio;
                }
            });

            cc.assetManager.loadBundle('home', (err, bundle) => {
                UIManager.preloadPanel('home/HomePanel');
                this.updateProgress();
            });
            
            cc.assetManager.loadBundle('game', (err, bundle) => {
                UIManager.preloadPanel('game/GamePanel');
                this.updateProgress();
            });
            
            cc.assetManager.loadBundle('sign', (err, bundle) => {
                UIManager.preloadPanel('sign/SignPanel');
                this.updateProgress();
            });

            cc.assetManager.loadBundle('levelProgress', (err, bundle) => {
                UIManager.preloadPanel('levelProgress/LevelProgress');
                this.updateProgress();
            });
        });
    }

    /**更新进度条 */
    updateProgress() {
        this.progress += 0.10;
    }
}
