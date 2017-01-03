// TypeScript file

class Player
{
    public PeopleBitmap:egret.Bitmap;
    public ifWalk:boolean;
    public ifIdle:boolean;
    
    public Walkleft:boolean = false;
    public WalkRight:boolean = false;
    public WalkOrIdle : StateMachine;//?
    public WalkRightOrLeft : StateMachine;//?

    constructor()
    {
        this.PeopleBitmap = new egret.Bitmap();
        this.PeopleBitmap.height = 32;
        this.PeopleBitmap.width = 32;
        this.PeopleBitmap.anchorOffsetX = this.PeopleBitmap.height/2;
        this.PeopleBitmap.anchorOffsetY = this.PeopleBitmap.width/2;
        this.ifWalk = false;
        this.ifIdle = true;

        this.WalkRightOrLeft = new StateMachine();//?
        this.WalkOrIdle = new StateMachine();//?

    }

    public SetPeopleBitmap(peopleBitmap:egret.Bitmap)
    {
        this.PeopleBitmap = peopleBitmap;
    }

    public SetIdle(If:boolean)
    {
        this.ifIdle = If;
    }
    public GetIdle():boolean
    {
        return this.ifIdle;
    }

    public SetWalk(If:boolean)
    {
        this.ifWalk = If;
        console.log("Start walk");
    }
    public GetWalk():boolean
    {
        return this.ifWalk;
    }

    public SetWslkleft()
    {
        this.Walkleft = true;
        this.WalkRight = false;
        //console.log("Start walkleft");

    }
    public GetWalkleft():boolean
    {
        return this.Walkleft;
    }


    public SetWalkright()
    {
        this.Walkleft = false;
        this.WalkRight = true;
         //console.log("Start walkright");
    }
    public GetWalkright():boolean
    {
        return this.WalkRight;
    }



    public creatBitmapByname(name:string):egret.Bitmap
    {
        var map = new egret.Bitmap();
        var textfield:egret.Texture = RES.getRes(name);
        map.texture = textfield;
        return map;

    }

    public SetState(e:State,_main:Main)
    {
        this.WalkOrIdle.setState(e,_main);
    } 

    public SetDirection( e:State,_main:Main)
    {
        this.WalkRightOrLeft.setState(e,_main);
    }
}


//作为一个Stste接口
interface State
{
    onEnter(_main:Main);

    onExit(_main:Main);

}

class StateMachine 
{
    currentState: State;
    setState( s:State , _main:Main)
    {
      if(this.currentState != null)
      {
          this.currentState.onExit(_main);
      }
      this.currentState = s;
      this.currentState.onEnter(_main);

    }
}

//继承State
class PeopleState implements State
{
    onEnter(_main:Main){};

    onExit(_main:Main){};

}


class PeopleWalk implements PeopleState
{
    onEnter(_main:Main)
    {
       _main.People.SetWalk(true);
       _main.People.SetIdle(false);
    };

    onExit(_main:Main)
    {
        _main.People.SetWalk(false);
    };
}

class PeopleIdle implements PeopleState
{
    onEnter(_main:Main)
    {
        _main.People.SetIdle(true);
        _main.People.SetWalk(false);
    };

    onExit(_main:Main)
    {
        _main.People.SetIdle(false);
    };
}


class PeopleWalkleftState implements PeopleState
{
    onEnter(_main:Main)
    {
        _main.People.SetWslkleft();
    };

    onExit(_main:Main)
    {

    };

}

class PeopleWalkrightState implements PeopleState
{
    onEnter(_main:Main)
    {
        _main.People.SetWalkright();
    };

    onExit(_main:Main)
    {

    };

}