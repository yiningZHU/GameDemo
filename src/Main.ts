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

class Main extends egret.DisplayObjectContainer 
{

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;

    public constructor() 
    {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
    }

    private _onAddToStage(event:egret.Event) 
    {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void 
    {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void 
    {
        if (event.groupName == "preload") 
        {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void 
    {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void 
    {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void 
    {
        if (event.groupName == "preload") 
        {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void 
    {
        //添背景
        var sky:egret.Bitmap = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        //创建Player类型的people
        var people : Player = new Player();
        people.x = 300;
        people.y = 300;
        this.addChild(people);
        people.idle();
        //people.idle(100,100);

        //让物体跟着鼠标移动(未加缓动)
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,( evt:egret.TouchEvent)=>{
            people.x = evt.localX;
            people.y = evt.localY;
        },this);


    }
   
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name:string):egret.Bitmap 
    {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }


    
}

class Player extends egret.DisplayObjectContainer
{
    private loadingView:LoadingUI;
    _state:StateMachine;
    _people:egret.Bitmap;
    _ifIdle:boolean;
    _ifWalk:boolean;

    public constructor() 
    {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
    }

    private _onAddToStage(event:egret.Event) 
    {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.createPeople, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }
    
    
  
    

    public createPeople():void
    {
        this._state = new StateMachine();
        this._people = new egret.Bitmap();
        var _texture:egret.Texture = RES.getRes("1_jpg");
        this._people.texture = _texture;
        this._ifIdle = true;
        this._ifWalk = false;
        this.addChild(this._people);
    }

    public idle()
    {
        this._state.setState(new PeopleIdleState(this));
    }

    public walk()
    {
        //this._state.setState(new PeopleWalkState(this));
    }

    public StartIdle()
    {
       var list = ["1_jpg","2_jpg","3_jpg","4_jpg"];
       var num:number = -1;
       num = num+0.2;
        if(num >list.length)
           {num = 0;}
           this._people.texture = RES.getRes(list[num]);
           var _people2:egret.Bitmap;
           _people2.texture = RES.getRes(list[num+1]);
       egret.setTimeout(()=>
       {
           
           this._people.texture;
       },_people2.texture,2000)

       //egret.Ticker.getInstance().register(()=>
       //{
         //  num = num +1;
           //if(num>list.length)
           //{
             //  num = 0;
           //}
           //this._people.texture = RES.getRes(list[Math.floor(num)]);
       //},this);

       
    }
}

//状态机
class StateMachine 
{
    _currentMachine: State;
    setState(s:State)
    {
        if(this._currentMachine)
        {
            this._currentMachine.onExit();
        }
        //s.stateMachine = this;
        this._currentMachine = s;
        this._currentMachine.onEnter();
    }
}

//作为一个接口
interface State
{
    //stateMachine:StateMachine;

    onEnter();

    onExit();

}

//继承State （正确）
class PeopleState implements State
{
    //stateMachine:StateMachine;
    _people:Player;

    constructor(people:Player)
    {
        this._people = people;
    }

    onEnter()
    {

    }

    onExit()
    {

    }
}

class PeopleIdle_1State extends PeopleState
{
    onEnter()
    {
       
    }

    onExit()
    {

    }
}

class PeopleIdleState extends PeopleState
{
    onEnter()
    {
       this._people._ifIdle = true;
       this._people.StartIdle();
    }

    onExit()
    {
        this._people._ifIdle = false;
    }
}

class PeopleWalkState extends PeopleState
{
    //super();
    onEnter()
    {

    }

    onExit()
    {

    }
}