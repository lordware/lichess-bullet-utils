setTimeout(() => {
  setTimeout(_=>document.getElementById("user_tag").click(),50);document.getElementById("user_tag").click()
  const q = (s) => document.querySelector(s), cE = (t) => document.createElement(t), sT = (e, p, v) => e.style[p] = v;
  const l = q(".round__app.variant-standard"), d = cE("p"), mC = q(".rclock.rclock-bottom"), oC = q(".rclock.rclock-top"), w = 200;
  let mT = 0, oT = 0, mB = cE("div"), oB = cE("div");
  [mB, oB].forEach((b, i) => { b.id = i ? "opBar" : "myBar"; sT(b, "width", "0px"); sT(b, "backgroundColor", i ? "green" : "red"); document.body.appendChild(b); });
  [mB, oB].forEach(b => { sT(b, "position", "absolute"); sT(b, "left", "50%"); sT(b, "transform", "translateX(-50%)"); });
  const h = window.innerHeight, bH = mB.offsetHeight + oB.offsetHeight, bT = (h - bH) / 2;
  sT(mB, "top", bT + "px"); sT(oB, "top", (bT + mB.offsetHeight) + "px"); sT(mB, "marginTop", "5px");
  sT(mB, "height", '2px'); sT(oB, "height", '2px'); l.appendChild(d);
  d.id = "Lag"; d.innerHTML = "Lag Measurements"; sT(d, "cssText", "left:5px;top:5px;color:white;");
  const tS = time => { const [m, sP] = time.trim().split(":"), [s, h] = sP.split("."); return parseInt(m) * 60 + parseInt(s) + parseInt(h || 0) / 10; };
  const rT = clock => { const t = clock.querySelector(".time"); return t ? tS(t.textContent) : 0; };
  let n = 0, aPT = [], iT = rT(mC) * 2, b = false;
  const menu = cE("div"); menu.style.cssText = "position:absolute;top:5px;right:5px;display:flex;flex-direction:column;align-items:flex-end;z-index:9999;";
  const lS = cS("Lag Measurement", true), bS = cS("Auto-Berserk Back", true);
  menu.append(lS, bS); document.body.appendChild(menu);
  function cS(text, checked) { const l = cE("label"); l.style.cssText = "display:flex;align-items:center;"; const c = cE("input"); c.type = "checkbox"; c.checked = checked; const s = cE("span"); s.style.marginLeft = "5px"; s.textContent = text; l.append(c, s); c.addEventListener("change", () => { console.log(`${text} ${c.checked ? "enabled" : "disabled"}`); if (text === "Lag Measurement") { sT(d, "display", c.checked ? "block" : "none"); } else { b = !c.checked; } }); return l; }
  q("#user_tag").click(); q("#user_tag").click(); let pMT = null, pOT = null;
  setInterval(() => { mT = rT(mC); oT = rT(oC); if (mT < 10 && (pMT === null || mT < pMT)) { sT(mB, "width", `${w * mT / iT / 2}px`); } if (oT < 10 && (pOT === null || oT < pOT)) { sT(oB, "width", `${w * oT / iT / 2}px`); } if (!b && q(".berserked.top")) { document.getElementsByClassName("fbt go-berserk")[0].click(); b = true; } pMT = mT; pOT = oT; }, 100);
  q("cg-board").onmouseup = () => { if ((rT(mC) < iT / 2 || rT(oC) < iT / 2) && !q(".result_wrap")) { if (n > 0) { aPT[n] = Date.now(); let tD = aPT[n] - aPT[0], mT = rT(mC), oT = rT(oC), tPC = (iT - (mT + oT)) * 1000, cL = Math.max(0, Math.round((tD - tPC) / n)); n++; let yPL = q(".ping"); if (!yPL) { q("#user_tag").click(); q("#user_tag").click(); yPL = q(".ping"); } let pN = yPL.querySelector("strong").innerText, pO = cL - pN; if (pO >= 0 && cL >= 0) { d.innerHTML = `Opponent's approximate lag: ${pO}<br /> Common lag: ${cL}<br /> Your ping according to Lichess: ${pN}`; } } else { aPT[0] = Date.now() - (iT - (rT(mC) + rT(oC))) * 1000; n = 1; } } };
}, 500);
