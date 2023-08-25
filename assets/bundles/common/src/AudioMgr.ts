/**
 * 音效管理者
 */

import { GameDataCenter } from "../../config/GameDataCenter";
import { GameEvents } from "../../config/GConfig";

 
const {ccclass, property} = cc._decorator;

@ccclass
export class AudioMgr extends cc.Component {

    /**背景音乐id */
	private bgmId = -1;
	/**背景音乐id */
	private soundId = -1;
	private soundData = {};

	onEnable() {
		cc.systemEvent.on(GameEvents.S_Play_Sound, this.onPlaySound, this);
		cc.systemEvent.on(GameEvents.S_Stop_Sound, this.onStopSound, this);
		cc.systemEvent.on(GameEvents.S_Play_Bgm_Sound, this.playBgm, this);
		cc.systemEvent.on(GameEvents.S_Stop_Bgm_Sound, this.stopBgm, this);
	}
    
    onDisable() {
        cc.systemEvent.off(GameEvents.S_Play_Sound, this.onPlaySound, this);
		cc.systemEvent.off(GameEvents.S_Stop_Sound, this.onStopSound, this);
		cc.systemEvent.off(GameEvents.S_Play_Bgm_Sound, this.playBgm, this);
		cc.systemEvent.off(GameEvents.S_Stop_Bgm_Sound, this.stopBgm, this);
    }

	onStopSound(audioName) {
		if (this.soundData[audioName] || audioName == 'bgMugic') {
			cc.audioEngine.stop(this.soundData[audioName]);
			this.soundData[audioName] = null;
		}
	}

	/**
	 * 音效播放
	 * @param audioName  音频名称
	 * @param record    记录id
	 * @param loop      是否循环
	 * @param volume    音量
	 */
	onPlaySound(audioName, record = false, loop = false, volume = 1) {
		if (audioName == 'bgm') {
			this.playBgm(audioName);
		} else if (audioName == 'stopBgm' || audioName == 'stopSound') {
			this[audioName].call(this);
		} else {
			let clip = GameDataCenter.audios[audioName];
            if (clip) {
                let id = cc.audioEngine.play(clip, loop || false, volume);
                record && (this.soundId = id);
            }
		}
	}

    /** 播放背景音乐. */
	playBgm(name) {
		let clip = GameDataCenter.audios[name];
		if (clip) {
			this.stopBgm();
			let id = cc.audioEngine.play(clip, true, 1);
			this.bgmId = id;
		}
	}

	/** 关闭背景音乐. */
	stopBgm() {
		if (this.bgmId > -1) {
			cc.audioEngine.stop(this.bgmId); //await  stopMusic
			this.bgmId = -1;
		}
	}

	/** 关闭音效 */
	stopSound() {
		if (this.soundId > -1) {
			cc.audioEngine.stop(this.soundId);
			this.soundId = -1;
		}
	}
}
