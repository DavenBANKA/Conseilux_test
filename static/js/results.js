(function(){
  const LS_READING = 'conseilux_test_state';
  const LS_LISTENING = 'conseilux_listening_state_v2';
  const LS_START = 'conseilux_test_start_ts';

  // Listening official answer key (1..26)
  const LISTENING_KEY = {
    1:'b',2:'c',3:'b',4:'b',5:'b',
    6:'a',7:'b',8:'b',9:'a',10:'a',
    11:'b',12:'b',13:'b',14:'b',15:'a',16:'b',
    17:'b',18:'b',19:'c',20:'b',21:'b',
    22:'b',23:'b',24:'b',25:'b',26:'a'
  };

  function loadJSON(key){
    try{ return JSON.parse(localStorage.getItem(key) || 'null'); }
    catch(e){ return null; }
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

  function computeReadingScore(){
    const state = loadJSON(LS_READING) || {};
    const answers = state.answers || {};
    const key = (window.CONSEILUX && window.CONSEILUX.ANSWER_KEY) ? window.CONSEILUX.ANSWER_KEY : [];
    let correct = 0;
    for(let i=1;i<=key.length;i++){
      if(answers[i] && key[i-1] && answers[i] === key[i-1]) correct++;
    }
    return correct;
  }

  function computeListeningScore(){
    const state = loadJSON(LS_LISTENING) || {};
    const answers = state.answers || {};
    let correct = 0;
    for(let i=1;i<=26;i++){
      const right = LISTENING_KEY[i];
      if(answers[i] && right && answers[i] === right) correct++;
    }
    return correct;
  }

  function mapCEFRTotal(total){
    // Out of 116 questions (90 reading + 26 listening)
    if(total >= 101) return 'C2';
    if(total >= 81)  return 'C1';
    if(total >= 61)  return 'B2';
    if(total >= 41)  return 'B1';
    if(total >= 21)  return 'A2';
    return 'A1';
  }

  function clearForRestart(){
    localStorage.removeItem(LS_READING);
    localStorage.removeItem(LS_LISTENING);
    localStorage.removeItem(LS_START);
  }

  const readingScore = computeReadingScore();
  const listeningScore = computeListeningScore();
  const totalScore = readingScore + listeningScore;
  const timeStr = elapsedString();

  const scoreLine = document.getElementById('score-line'); // legacy (may not exist)
  const readingLine = document.getElementById('reading-score-line');
  const listeningLine = document.getElementById('listening-score-line');
  const totalLine = document.getElementById('total-score-line');
  const cefrLine = document.getElementById('cefr-line');
  const timeLine = document.getElementById('time-line');
  if(scoreLine){ scoreLine.textContent = `${totalScore} / 116 (Reading ${readingScore}/90, Listening ${listeningScore}/26)`; }
  if(readingLine){ readingLine.textContent = `${readingScore} / 90`; }
  if(listeningLine){ listeningLine.textContent = `${listeningScore} / 26`; }
  if(totalLine){ totalLine.textContent = `${totalScore} / 116`; }
  if(cefrLine){ cefrLine.textContent = mapCEFRTotal(totalScore); }
  if(timeLine){ timeLine.textContent = timeStr; }

  const restartBtn = document.getElementById('restart-btn');
  if(restartBtn){
    restartBtn.addEventListener('click', function(e){
      e.preventDefault();
      clearForRestart();
      sessionStorage.removeItem('studentData');
      window.location.href = '/register';
    });
  }
})();

