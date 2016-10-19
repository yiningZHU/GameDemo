//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p._onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        //添背景
        var sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        //创建Player类型的people
        var people = new Player();
        people.x = 300;
        people.y = 300;
        this.addChild(people);
        people.idle();
        //people.idle(100,100);
        //让物体跟着鼠标移动(未加缓动)
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (evt) {
            people.x = evt.localX;
            people.y = evt.localY;
        }, this);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
    }
    var d = __define,c=Player,p=c.prototype;
    p._onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.createPeople, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    p.createPeople = function () {
        this._state = new StateMachine();
        this._people = new egret.Bitmap();
        var _texture = RES.getRes("1_jpg");
        this._people.texture = _texture;
        this._ifIdle = true;
        this._ifWalk = false;
        this.addChild(this._people);
    };
    p.idle = function () {
        this._state.setState(new PeopleIdleState(this));
    };
    p.walk = function () {
        //this._state.setState(new PeopleWalkState(this));
    };
    p.StartIdle = function () {
        var _this = this;
        var list = ["1_jpg", "2_jpg", "3_jpg", "4_jpg"];
        var num = -1;
        num = num + 0.2;
        if (num > list.length) {
            num = 0;
        }
        this._people.texture = RES.getRes(list[num]);
        var _people2;
        _people2.texture = RES.getRes(list[num + 1]);
        egret.setTimeout(function () {
            _this._people.texture;
        }, _people2.texture, 2000);
        //egret.Ticker.getInstance().register(()=>
        //{
        //  num = num +1;
        //if(num>list.length)
        //{
        //  num = 0;
        //}
        //this._people.texture = RES.getRes(list[Math.floor(num)]);
        //},this);
    };
    return Player;
}(egret.DisplayObjectContainer));
egret.registerClass(Player,'Player');
//状态机
var StateMachine = (function () {
    function StateMachine() {
    }
    var d = __define,c=StateMachine,p=c.prototype;
    p.setState = function (s) {
        if (this._currentMachine) {
            this._currentMachine.onExit();
        }
        //s.stateMachine = this;
        this._currentMachine = s;
        this._currentMachine.onEnter();
    };
    return StateMachine;
}());
egret.registerClass(StateMachine,'StateMachine');
//继承State （正确）
var PeopleState = (function () {
    function PeopleState(people) {
        this._people = people;
    }
    var d = __define,c=PeopleState,p=c.prototype;
    p.onEnter = function () {
    };
    p.onExit = function () {
    };
    return PeopleState;
}());
egret.registerClass(PeopleState,'PeopleState',["State"]);
var PeopleIdle_1State = (function (_super) {
    __extends(PeopleIdle_1State, _super);
    function PeopleIdle_1State() {
        _super.apply(this, arguments);
    }
    var d = __define,c=PeopleIdle_1State,p=c.prototype;
    p.onEnter = function () {
    };
    p.onExit = function () {
    };
    return PeopleIdle_1State;
}(PeopleState));
egret.registerClass(PeopleIdle_1State,'PeopleIdle_1State');
var PeopleIdleState = (function (_super) {
    __extends(PeopleIdleState, _super);
    function PeopleIdleState() {
        _super.apply(this, arguments);
    }
    var d = __define,c=PeopleIdleState,p=c.prototype;
    p.onEnter = function () {
        this._people._ifIdle = true;
        this._people.StartIdle();
    };
    p.onExit = function () {
        this._people._ifIdle = false;
    };
    return PeopleIdleState;
}(PeopleState));
egret.registerClass(PeopleIdleState,'PeopleIdleState');
var PeopleWalkState = (function (_super) {
    __extends(PeopleWalkState, _super);
    function PeopleWalkState() {
        _super.apply(this, arguments);
    }
    var d = __define,c=PeopleWalkState,p=c.prototype;
    //super();
    p.onEnter = function () {
    };
    p.onExit = function () {
    };
    return PeopleWalkState;
}(PeopleState));
egret.registerClass(PeopleWalkState,'PeopleWalkState');
