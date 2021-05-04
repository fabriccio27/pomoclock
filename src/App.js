
import React from 'react';
class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      sessionMinutes:25,
      breakMinutes:5,
      actualPeriod:"session",
      isRunning:false,
      timerId:0,
      timer:1500
    }
    this.setCurrentTime = this.setCurrentTime.bind(this);
    this.decrementMinutes = this.decrementMinutes.bind(this);
    this.incrementMinutes = this.incrementMinutes.bind(this);
    this.handleReset = this.handleReset.bind(this);

    this.timerControl = this.timerControl.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.decrementTimer = this.decrementTimer.bind(this);
    this.periodControl = this.periodControl.bind(this);
    this.listenLastFive = this.listenLastFive.bind(this);


    console.log("welcome, running state is: " + this.state.isRunning);
  }

  setCurrentTime(){
    let time = this.state.timer;
    let mins = Math.floor(time/60);
    let secs = time-mins*60;
    mins = mins<10?"0"+mins:mins;
    secs = secs<10?"0"+secs:secs;
    return `${mins}:${secs}`;
  }
  decrementMinutes(targetPeriod){
    if(!this.state.running && this.state.timerId==0){
      if (targetPeriod=="break" && this.state.breakMinutes>1){
        console.log("clicked to dec break minutes");
        this.setState(state=>{
          return {breakMinutes:state.breakMinutes-1};
        })
      }
      if (targetPeriod=="session" && this.state.sessionMinutes>1){
        console.log("clicked to dec session minutes");
        this.setState(state=>{
          return {sessionMinutes:state.sessionMinutes-1};
        });
        this.setState(state=>{
          return {timer:state.sessionMinutes*60};
        });

      }
    }
  }
  incrementMinutes(targetPeriod){
    if(!this.state.running && this.state.timerId==0){
      if (targetPeriod=="break" && this.state.breakMinutes<60){
         console.log("clicked to inc break minutes");
         this.setState(state=>{
           return {breakMinutes:state.breakMinutes+1};
         })
       }
      if (targetPeriod=="session" && this.state.sessionMinutes<60){
        console.log("clicked to inc session minutes");
        this.setState(state=>{
          return {sessionMinutes:state.sessionMinutes+1};
        });
        this.setState(state=>{
          return {timer:state.sessionMinutes*60};
        })
      }
    }
  }

  handleReset(){
    console.log("Reset babyyyy");
    clearInterval(this.state.timerId);
    this.setState({
      sessionMinutes:25,
      breakMinutes:5,
      isRunning:false,
      timerId:0,
      timer:1500,
      actualPeriod:"session"
    });
    let beepAudio = document.querySelector("#beep");
    beepAudio.pause();
    beepAudio.currentTime = 0;
  }

  startTimer(){
    this.setState({
      timerId:setInterval(()=>{
        this.decrementTimer();
        this.periodControl();
      },1000)
    })
  }

  decrementTimer(){
    this.setState(state=>{
        return {timer:state.timer-1};
    })
  }

  periodControl(){
    let timer = this.state.timer;
    this.listenLastFive(timer)
    if (timer<0) {
      console.log("entered the periodControl conditionals");
      if (this.state.timerId!=0) {
        clearInterval(this.state.timerId);
      }
      if (this.state.actualPeriod === 'session') {
        this.setState({
          timer:this.state.breakMinutes*60,
          actualPeriod:"break"
        });
        this.startTimer();

      } else {
        this.startTimer();
        this.setState({
          timer:this.state.sessionMinutes*60,
          actualPeriod:"session"
        })
      }
    }
  }
  listenLastFive(secs){
    if (secs==0){
      console.log("reached 00:00");
      let beepAudio = document.querySelector("#beep");
      beepAudio.play();
    }
  }
  timerControl(){
    console.log("asked for timerControl");
    if (!this.state.isRunning){
      console.log("trying to startTimer");
      this.startTimer();
      this.setState({isRunning:true});
    }else{
      console.log("trying to stop timer");
      this.setState({isRunning:false});
      clearInterval(this.state.timerId);
    }
  }
  render(){

    return(
      <div>
        <h1 className="clock-title">25 + 5 clock</h1>

        <div className="row">
          <TimeSetter periodLabel="break" periodLength={this.state.breakMinutes} decMinutes={this.decrementMinutes} incMinutes={this.incrementMinutes}/>
          <TimeSetter periodLabel="session" periodLength={this.state.sessionMinutes} decMinutes={this.decrementMinutes} incMinutes={this.incrementMinutes} />
        </div>

        <div class="row">
          <div className="container timer-box">
            <p className="period-label" id="timer-label">{this.state.actualPeriod[0].toUpperCase()+this.state.actualPeriod.slice(1)}</p>
            <p id="time-left">{this.setCurrentTime()}</p>

            <audio id="beep">
               <source src="https://bigsoundbank.com/UPLOAD/mp3/0096.mp3" type="audio/mpeg" />
            </audio>

            <div>
              <button className="timer-buttons" onClick={this.timerControl} id="start_stop"><i class="fas fa-play"></i><i class="fas fa-pause"></i></button>
              <button className="timer-buttons" onClick={this.handleReset} id="reset"><i class="fas fa-redo-alt"></i></button>
            </div>

          </div>
          <p style={{width:"100%"}}><small>designed by fabricio</small></p>
        </div>

      </div>
    );
  }
}



      // la funcion que corre el timer se va a encargar de togglear el running state


class TimeSetter extends React.Component {

  handleDec=()=>{
    this.props.decMinutes(this.props.periodLabel)
  }
  handleInc=()=>{
    this.props.incMinutes(this.props.periodLabel)
  }
  render(){
    return(
      <div>
      <p className="modifiers-label" id={this.props.periodLabel+"-label"}>{this.props.periodLabel} length</p>
      <div className="container text-center">
        <button className="inc-dec-btn" id={this.props.periodLabel+"-decrement"} onClick={this.handleDec}>-</button>
        <span id={this.props.periodLabel+"-length"}>{this.props.periodLength}</span>
        <button className="inc-dec-btn" id={this.props.periodLabel+"-increment"} onClick={this.handleInc}>+</button>
      </div>
    </div>
    )
  }
}


export default App;
