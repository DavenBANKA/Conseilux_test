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
  document.getElementById('cefr-line').textContent = `Niveau: ${mapCEFR(score)}`;
  document.getElementById('time-line').textContent = `Temps: ${timeStr}`;

  document.getElementById('restart-btn').addEventListener('click', function(){
    clearForRestart();
  });

  document.getElementById('print-btn').addEventListener('click', function(){
    window.print();
  });

  document.getElementById('pdf-btn').addEventListener('click', function(){
    // Astuce: la plupart des navigateurs proposent l'option "Enregistrer au format PDF" via l'impression
    window.print();
  });

  document.getElementById('share-btn').addEventListener('click', async function(){
    const text = `J'ai obtenu ${score}/${total} au Conseilux Test — Niveau ${mapCEFR(score)}.`;
    try{
      if(navigator.share){
        await navigator.share({ title: 'Conseilux Test', text, url: window.location.origin });
      } else {
        await navigator.clipboard.writeText(text + ' ' + window.location.origin);
        alert('Résultats copiés dans le presse-papiers.');
      }
    }catch(e){
      console.error(e);
    }
  });
})();
