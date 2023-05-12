setTimeout(() => {
  const lichess = document.querySelector(".round__app.variant-standard");
  const display = document.createElement("p");
  const myClock = document.querySelector(".rclock.rclock-bottom");
  const opClock = document.querySelector(".rclock.rclock-top");
  const barWidth = 200;
  setTimeout(function() {
    document.getElementById("user_tag").click();
  }, 50);
  document.getElementById("user_tag").click();
  

  let myTimer = 0;
  let opTimer = 0;
  const myBar = document.createElement("div");
  myBar.id = "myBar";
  myBar.style.width = "0px";
  myBar.style.backgroundColor = "red";
  document.body.appendChild(myBar);
  
  const opBar = document.createElement("div");
  opBar.id = "opBar";
  opBar.style.width = "0px";
  opBar.style.backgroundColor = "green";
  document.body.appendChild(opBar);
  
  myBar.style.position = "absolute";
  myBar.style.left = "50%";
  myBar.style.transform = "translateX(-50%)";
  
  opBar.style.position = "absolute";
  opBar.style.left = "50%";
  opBar.style.transform = "translateX(-50%)";

  const windowHeight = window.innerHeight;
  const barsHeight = myBar.offsetHeight + opBar.offsetHeight;
  const barsTop = (windowHeight - barsHeight) / 2;
  
  myBar.style.top = barsTop + "px";
  opBar.style.top = (barsTop + myBar.offsetHeight) + "px";
  myBar.style.marginTop = "5px";
  
  myBar.style.height = opBar.style.height = '2px';

  lichess.appendChild(display);

  display.id = "Lag";
  display.innerHTML = "Lag Measurements";
  display.style.cssText = "left:5px;top:5px;color:white;";

  function toSeconds(time) {
    const [minutes, secondsParts] = time.trim().split(":");
    const [seconds, hundredths] = secondsParts.split(".");
    return parseInt(minutes) * 60 + parseInt(seconds) + parseInt(hundredths || 0) / 10;
  }

  function readTime(clock) {
    const timer = clock.querySelector(".time");
    return timer ? toSeconds(timer.textContent) : 0;
  }

  let n = 0;
  let arrayOfPerformanceTimes = [];
  let initialTimeHalf = readTime(myClock);
  let initialTime = initialTimeHalf * 2;
  let berserked = false;

  const menu = document.createElement("div");
  menu.style.cssText = "position:absolute;top:5px;right:5px;display:flex;flex-direction:column;align-items:flex-end;z-index:9999;";

  const lagSwitch = createSwitch("Lag Measurement", true);
  const berserkSwitch = createSwitch("Auto-Berserk Back", true);

  menu.append(lagSwitch, berserkSwitch);
  document.body.appendChild(menu);
  // need to add a global save 
  function createSwitch(text, checked) {
    const label = document.createElement("label");
    label.style.cssText = "display:flex;align-items:center;";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked;
    const span = document.createElement("span");
    span.style.marginLeft = "5px";
    span.textContent = text;
    label.append(checkbox, span);
    checkbox.addEventListener("change", () => {
      console.log(`${text} ${checkbox.checked ? "enabled" : "disabled"}`);
      if (text === "Lag Measurement") {
        display.style.display = checkbox.checked ? "block" : "none";
      } else {
        berserked = !checkbox.checked;
      }
    });
    return label;
  }

  let prevMyTimer = null;
  let prevOpTimer = null;
  
  setInterval(() => {
    myTimer = readTime(myClock);
    opTimer = readTime(opClock);
  
    if (myTimer < 10 && (prevMyTimer === null || myTimer < prevMyTimer)) {
      myBar.style.width = `${barWidth * myTimer / initialTimeHalf}px`;
    }
  
    if (opTimer < 10 && (prevOpTimer === null || opTimer < prevOpTimer)) {
      opBar.style.width = `${barWidth * opTimer / initialTimeHalf}px`;
    }
  
    if (!berserked && document.querySelector(".berserked.top")) {
      document.getElementsByClassName("fbt go-berserk")[0].click();
      berserked = true;
    }
  
    prevMyTimer = myTimer;
    prevOpTimer = opTimer;
  }, 100);
  
  // Idea from: https://github.com/Comet16/Measure-opponent-s-lag-on-Lichess
  document.querySelector("cg-board").onmouseup = () => {
    if ((readTime(myClock) < initialTimeHalf || readTime(opClock) < initialTimeHalf) && !document.querySelector(".result_wrap")) {
      if (n > 0) {
        arrayOfPerformanceTimes[n] = Date.now();
        let timeDuration = arrayOfPerformanceTimes[n] - arrayOfPerformanceTimes[0];
        let myTime = readTime(myClock);
        let opTime = readTime(opClock);
        let timePassedOnClock = (initialTime - (myTime + opTime)) * 1000;
        let commonLag = Math.max(0, Math.round((timeDuration - timePassedOnClock) / n));
        n++;

        let yourPingAccordingToLichess = document.querySelector(".ping");
        if (!yourPingAccordingToLichess) {
          document.getElementById("user_tag").click();
          document.getElementById("user_tag").click();
          yourPingAccordingToLichess = document.querySelector(".ping");
        }
        let pingNumber = yourPingAccordingToLichess.querySelector("strong").innerText;
        let pingOfOpponent = commonLag - pingNumber;
        
        if (pingOfOpponent >= 0 && commonLag >= 0) {
          display.innerHTML = `Opponent's approximate lag: ${pingOfOpponent}<br /> Common lag: ${commonLag}<br /> Your ping according to Lichess: ${pingNumber}`;
        }
      } else {
        arrayOfPerformanceTimes[0] = Date.now() - (initialTime - (readTime(myClock) + readTime(opClock))) * 1000;
        n = 1;
      }
    }
  };
}, 500);
