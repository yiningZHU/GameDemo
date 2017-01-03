// TypeScript file
var Player = (function () {
    function Player() {
        this.Walkleft = false;
        this.WalkRight = false;
        this.PeopleBitmap = new egret.Bitmap();
        this.PeopleBitmap.height = 32;
        this.PeopleBitmap.width = 32;
        this.PeopleBitmap.anchorOffsetX = this.PeopleBitmap.height / 2;
        this.PeopleBitmap.anchorOffsetY = this.PeopleBitmap.width / 2;
        this.ifWalk = false;
        this.ifIdle = true;
        this.WalkRightOrLeft = new StateMachine(); //?
        this.WalkOrIdle = new StateMachine(); //?
    }
    var d = __define,c=Player,p=c.prototype;
    p.SetPeopleBitmap = function (peopleBitmap) {
        this.PeopleBitmap = peopleBitmap;
    };
    p.SetIdle = function (If) {
        this.ifIdle = If;
    };
    p.GetIdle = function () {
        return this.ifIdle;
    };
    p.SetWalk = function (If) {
        this.ifWalk = If;
        console.log("Start walk");
    };
    p.GetWalk = function () {
        return this.ifWalk;
    };
    p.SetWslkleft = function () {
        this.Walkleft = true;
        this.WalkRight = false;
        //console.log("Start walkleft");
    };
    p.GetWalkleft = function () {
        return this.Walkleft;
    };
    p.SetWalkright = function () {
        this.Walkleft = false;
        this.WalkRight = true;
        //console.log("Start walkright");
    };
    p.GetWalkright = function () {
        return this.WalkRight;
    };
    p.creatBitmapByname = function (name) {
        var map = new egret.Bitmap();
        var textfield = RES.getRes(name);
        map.texture = textfield;
        return map;
    };
    p.SetState = function (e, _main) {
        this.WalkOrIdle.setState(e, _main);
    };
    p.SetDirection = function (e, _main) {
        this.WalkRightOrLeft.setState(e, _main);
    };
    return Player;
}());
egret.registerClass(Player,'Player');
var StateMachine = (function () {
    function StateMachine() {
    }
    var d = __define,c=StateMachine,p=c.prototype;
    p.setState = function (s, _main) {
        if (this.currentState != null) {
            this.currentState.onExit(_main);
        }
        this.currentState = s;
        this.currentState.onEnter(_main);
    };
    return StateMachine;
}());
egret.registerClass(StateMachine,'StateMachine');
//继承State
var PeopleState = (function () {
    function PeopleState() {
    }
    var d = __define,c=PeopleState,p=c.prototype;
    p.onEnter = function (_main) { };
    ;
    p.onExit = function (_main) { };
    ;
    return PeopleState;
}());
egret.registerClass(PeopleState,'PeopleState',["State"]);
var PeopleWalk = (function () {
    function PeopleWalk() {
    }
    var d = __define,c=PeopleWalk,p=c.prototype;
    p.onEnter = function (_main) {
        _main.People.SetWalk(true);
        _main.People.SetIdle(false);
    };
    ;
    p.onExit = function (_main) {
        _main.People.SetWalk(false);
    };
    ;
    return PeopleWalk;
}());
egret.registerClass(PeopleWalk,'PeopleWalk');
var PeopleIdle = (function () {
    function PeopleIdle() {
    }
    var d = __define,c=PeopleIdle,p=c.prototype;
    p.onEnter = function (_main) {
        _main.People.SetIdle(true);
        _main.People.SetWalk(false);
    };
    ;
    p.onExit = function (_main) {
        _main.People.SetIdle(false);
    };
    ;
    return PeopleIdle;
}());
egret.registerClass(PeopleIdle,'PeopleIdle');
var PeopleWalkleftState = (function () {
    function PeopleWalkleftState() {
    }
    var d = __define,c=PeopleWalkleftState,p=c.prototype;
    p.onEnter = function (_main) {
        _main.People.SetWslkleft();
    };
    ;
    p.onExit = function (_main) {
    };
    ;
    return PeopleWalkleftState;
}());
egret.registerClass(PeopleWalkleftState,'PeopleWalkleftState');
var PeopleWalkrightState = (function () {
    function PeopleWalkrightState() {
    }
    var d = __define,c=PeopleWalkrightState,p=c.prototype;
    p.onEnter = function (_main) {
        _main.People.SetWalkright();
    };
    ;
    p.onExit = function (_main) {
    };
    ;
    return PeopleWalkrightState;
}());
egret.registerClass(PeopleWalkrightState,'PeopleWalkrightState');
