const createBar = (id, color) => {
  const bar = document.createElement("div");
  bar.id = id;
  bar.style.width = "0px";
  bar.style.backgroundColor = color;
  bar.style.position = "absolute";
  bar.style.left = "50%";
  bar.style.transform = "translateX(-50%)";
  bar.style.height = "2px";
  document.body.appendChild(bar);
  return bar;
};

const createSwitch = (text, checked, onChange) => {
  const label = document.createElement("label");
  label.style.cssText = "display:flex;align-items:center;";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = checked;
  const span = document.createElement("span");
  span.style.marginLeft = "5px";
  span.textContent = text;
  label.append(checkbox, span);
  checkbox.addEventListener("change", () => onChange(checkbox.checked));
  return label;
};

const toSeconds = (time) => {
  const [minutes, secondsParts] = time.trim().split(":");
  const [seconds, hundredths] = secondsParts.split(".");
  return parseInt(minutes) * 60 + parseInt(seconds) + parseInt(hundredths || 0) / 10;
};

const readTime = (clock) => {
  const timer = clock.querySelector(".time");
  return timer ? toSeconds(timer.textContent) : 0;
};

setTimeout(() => {
  const lichess = document.querySelector(".round__app.variant-standard");
  const display = document.createElement("p");
  const myClock = document.querySelector(".rclock.rclock-bottom");
  const opClock = document.querySelector(".rclock.rclock-top");
  const barWidth = 200;
  const myBar = createBar("myBar", "red");
  const opBar = createBar("opBar", "green");

  const windowHeight = window.innerHeight;
  const barsHeight = myBar.offsetHeight + opBar.offsetHeight;
  const barsTop = (windowHeight - barsHeight) / 2;
  
  myBar.style.top = `${barsTop}px`;
  opBar.style.top = `${barsTop + myBar.offsetHeight}px`;
  myBar.style.marginTop = "5px";
  
  lichess.appendChild(display);

  display.id = "Lag";
  display.innerHTML = "Lag Measurements";
  display.style.cssText = "left:5px;top:5px;color:white;font-size:20px;"

  let myTimer = 0;
  let opTimer = 0;
  let prevMyTimer = null;
  let prevOpTimer = null;
  let n = 0;
  let arrayOfPerformanceTimes = [];
  let initialTimeHalf = readTime(myClock);
  let initialTime = initialTimeHalf * 2;
  let berserked = false;

  const menu = document.createElement("div");
  menu.style.cssText = "position:absolute;top:5px;right:5px;display:flex;flex-direction:column;align-items:flex-end;z-index:9999;";
  const lagSwitch = createSwitch("Lag Measurement", true, (checked) => {
    display.style.display = checked ? "block" : "none";
  });
  const berserkSwitch = createSwitch("Auto-Berserk Back", true, (checked) => {
    berserked = !checked;
  });

  menu.append(lagSwitch, berserkSwitch);
  document.body.appendChild(menu);

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

  document.querySelector("cg-board").onmouseup = () => {
    if ((readTime(myClock) < initialTimeHalf || readTime(opClock) < initialTimeHalf) && !document.querySelector(".result_wrap")) {
      if (n > 0) {
        arrayOfPerformanceTimes[n] = Date.now();
        const timeDuration = arrayOfPerformanceTimes[n] - arrayOfPerformanceTimes[0];
        const myTime = readTime(myClock);
        const opTime = readTime(opClock);
        const timePassedOnClock = (initialTime - (myTime + opTime)) * 1000;
        const lag = timeDuration - timePassedOnClock;
        display.innerHTML = `Lag: ${(lag / n).toFixed(1)}ms`;
        
        const cgBoard = document.querySelector("cg-board");
        if ((lag / n) > 120) {
          cgBoard.style.outline = "3px solid red";
        } else {
          cgBoard.style.outline = "0px solid red";
        }

        n++;
      } else {
        arrayOfPerformanceTimes[0] = Date.now();
        n++;
      }
    }
  };
}, 1000);
