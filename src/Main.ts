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
    public People:Player = new Player();
    public PreviousPoint:egret.Point = new egret.Point();

    private createGameScene():void 
    {
       //添背景
        var background:egret.Bitmap = this.createBitmapByName("background_png");
        this.addChild(background);
        background.width = 640;
        background.height = 480;

        //添加人物
        var peoplepicture:egret.Bitmap = this.createBitmapByName("characterfront_01_png");
        this.People.SetPeopleBitmap(peoplepicture);
        this.addChild(this.People.PeopleBitmap);
        this.People.PeopleBitmap.height = 64;
        this.People.PeopleBitmap.width= 64;
        this.People.PeopleBitmap.x = 200;
        this.People.PeopleBitmap.y = 100;

        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,(e:egret.TouchEvent)=>{
            egret.Tween.removeTweens(this.People.PeopleBitmap);
            this.People.SetState(new PeopleWalk(),this);
            var distanceX = e.stageX - this.People.PeopleBitmap.x;
            var distanceY = e.stageY - this.People.PeopleBitmap.y;
            this.PreviousPoint.x = e.stageX;
            this.PreviousPoint.y = e.stageY;
            if(distanceX >= 0)
            {
                this.People.SetDirection(new PeopleWalkrightState(),this);
            }
            if(distanceX < 0)
            {
                this.People.SetDirection(new PeopleWalkleftState(),this);
            }
            egret.Tween.get(this.People.PeopleBitmap).to({ x:e.stageX, y:e.stageY},Math.abs(distanceX) * 5 + Math.abs(distanceY) * 5)
        },this);

        this.PeopleAnimation();
    }

  /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name:string): egret.Bitmap 
    {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    public PeopleAnimation()
    {
        var idleList = ["Idle1_png","Idle2_png","Idle3_png","Idle4_png","Idle32_png"];
        //var idleList = ["characterfront_01_png","characterfront_02_png","characterfront_03_png","characterfront_04_png"];
        var walkRightList = ["right1_png","right2_png","right3_png","right4_png"];
        var walkLeftList = ["left1_png","left2_png","left3_png","left4_png"];

        var self:any = this;
        var idleframe = 0;
        var walkRightFrame = 0;
        var walkLeftFrame = 0;
        var frame = 0;

        var Move:Function = function()
        {
            egret.Ticker.getInstance().register(()=>{
                if(frame%4 == 0)
                {
                    if(self.People.GetIdle() && !self.People.GetWalk())
                    {
                        walkLeftFrame = 0;
                        walkRightFrame = 0;
                        var idletextureName = idleList[idleframe]
                        var idletexture : egret.Bitmap = RES.getRes(idletextureName);
                        self.People.PeopleBitmap.texture = idletexture;
                        idleframe++;
                        if(idleframe >= idleList.length)
                        {
                            idleframe=0;
                        }
                    }

                    if(!self.People.GetIdle() && self.People.GetWalk() && self.People.GetWalkright())
                    {
                        idleframe = 0;
                        walkLeftFrame = 0;
                        var walkrighttextureName = walkRightList[walkRightFrame];
                        var walkrighttexture : egret.Bitmap = RES.getRes(walkrighttextureName);
                        self.People.PeopleBitmap.texture = walkrighttexture;
                        walkRightFrame++;
                        if(walkRightFrame >= walkRightList.length)
                        {
                            walkRightFrame = 0;
                        }
                    }

                    if(!self.People.GetIdle() && self.People.GetWalk() && self.People.GetWalkleft())
                    {
                        idleframe = 0;
                        walkRightFrame = 0;
                        var walklefttextureName = walkLeftList[walkLeftFrame];
                        var walklefttexture : egret.Bitmap = RES.getRes(walklefttextureName);
                        self.People.PeopleBitmap.texture = walklefttexture;
                        walkLeftFrame++;
                        if(walkLeftFrame >= walkLeftList.length)
                        {
                            walkLeftFrame = 0;
                        }
                    }
                }

                if(self.People.PeopleBitmap.x == self.PreviousPoint.x && self.People.PeopleBitmap.y == self.PreviousPoint.y)
                {
                    self.People.SetState(new PeopleIdle(),self);
                }


            },self);
        }

        var FramaPlus:Function = function()
        {
            egret.Ticker.getInstance().register(()=>{
                frame++;
                if(frame == 400 )
                {
                    frame = 0;
                }

            },self)
        }

        Move();
        FramaPlus();
    }
}