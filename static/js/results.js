(function(){
  const LS_KEY = 'conseilux_test_state';
  const LS_START = 'conseilux_test_start_ts';

  function loadState(){
    try{ return JSON.parse(localStorage.getItem(LS_KEY)); }
    catch(e){ return null; }
  }

  function clearForRestart(){
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(LS_START);
  }

  function elapsedString(){
    const start = Number(localStorage.getItem(LS_START) || Date.now());
    const ms = Date.now() - start;
    const pad = n => String(n).padStart(2,'0');
    const hh = Math.floor(ms / 3600000);
    const mm = Math.floor((ms % 3600000)/60000);
    const ss = Math.floor((ms % 60000)/1000);
    return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
  }

  function computeScore(state){
    if(!state) return 0;
    const key = window.CONSEILUX.ANSWER_KEY;
    let correct = 0;
    key.forEach((ans, idx)=>{
      const qid = idx+1;
      if(state.answers && state.answers[qid] === ans) correct += 1;
    });
    return correct;
  }

  function mapCEFR(score){
    if(score <= 20) return 'A1 (Beginner)';
    if(score <= 35) return 'A2 (Elementary)';
    if(score <= 60) return 'B1 (Intermediate)';
    if(score <= 80) return 'B2 (Upper Intermediate)';
    if(score <= 85) return 'C1 (Advanced)';
    return 'C2 (Proficient)';
  }

  const state = loadState();
  const score = computeScore(state);
  const total = window.CONSEILUX.ANSWER_KEY.length;
  const timeStr = elapsedString();

  document.getElementById('score-line').textContent = `Score: ${score} / ${total}`;
  document.getElementById('cefr-line').textContent = `Level: ${mapCEFR(score)}`;
  document.getElementById('time-line').textContent = `Time: ${timeStr}`;

  document.getElementById('restart-btn').addEventListener('click', function(e){
    e.preventDefault();
    clearForRestart();
    sessionStorage.removeItem('studentData');
    window.location.href = '/register';
  });
})();

