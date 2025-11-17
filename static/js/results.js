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
    if(score <= 20) return 'A1 (Débutant)';
    if(score <= 35) return 'A2 (Faux débutant)';
    if(score <= 60) return 'B1 (Intermédiaire)';
    if(score <= 80) return 'B2 (Avancé)';
    if(score <= 85) return 'C1 (Courant)';
    return 'C2 (Bilingue)';
  }

  const state = loadState();
  const score = computeScore(state);
  const total = window.CONSEILUX.ANSWER_KEY.length;
  const timeStr = elapsedString();

  document.getElementById('score-line').textContent = `Score: ${score} / ${total}`;
  document.getElementById('cefr-line').textContent = `Level: ${mapCEFR(score)}`;
  document.getElementById('time-line').textContent = `Time: ${timeStr}`;

  // Load student data and populate certificate
  const studentData = JSON.parse(sessionStorage.getItem('studentData') || '{}');
  if(studentData.firstName && studentData.lastName){
    const fullName = `${studentData.firstName} ${studentData.lastName}`;
    document.getElementById('cert-name').textContent = fullName;
    document.getElementById('cert-level').textContent = mapCEFR(score);
    document.getElementById('cert-score').textContent = `${score}/${total}`;
    
    const today = new Date();
    const dateStr = `${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,'0')}/${String(today.getDate()).padStart(2,'0')}`;
    document.getElementById('cert-date').textContent = dateStr;
    
    // Show certificate
    document.getElementById('certificate-preview').style.display = 'block';
  }

  document.getElementById('restart-btn').addEventListener('click', function(){
    clearForRestart();
    sessionStorage.removeItem('studentData');
  });

  document.getElementById('print-btn').addEventListener('click', function(){
    window.print();
  });

  document.getElementById('pdf-btn').addEventListener('click', function(){
    window.print();
  });

  document.getElementById('share-btn').addEventListener('click', async function(){
    const text = `I scored ${score}/${total} on the Conseilux Test — Level ${mapCEFR(score)}.`;
    try{
      if(navigator.share){
        await navigator.share({ title: 'Conseilux Test', text, url: window.location.origin });
      } else {
        await navigator.clipboard.writeText(text + ' ' + window.location.origin);
        alert('Results copied to clipboard.');
      }
    }catch(e){
      console.error(e);
    }
  });
})();
