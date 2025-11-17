(function(){
  // Check if user is registered
  const studentData = sessionStorage.getItem('studentData');
  if(!studentData){
    alert('Please register before taking the test.');
    window.location.href = '/register';
    return;
  }

  const LS_KEY = 'conseilux_test_state';
  const LS_START = 'conseilux_test_start_ts';

  const qEl = document.getElementById('question-text');
  const formEl = document.getElementById('options-form');
  const nextBtn = document.getElementById('next-btn');
  const progressEl = document.getElementById('progress');
  const timerEl = document.getElementById('timer');
  const perQTimerEl = document.getElementById('perq-timer');
  const progressFillEl = document.getElementById('progress-fill');

  const questions = window.CONSEILUX.questions;

  // State
  let state = loadState() || { index: 0, answers: {} };

  // Timer
  ensureStartTime();
  let timerInterval = setInterval(updateTimer, 1000);
  updateTimer();

  // Per-question countdown (10s)
  const PER_Q_LIMIT = 10; // seconds
  let perQRemaining = PER_Q_LIMIT;
  let perQInterval = null;

  function ensureStartTime(){
    if(!localStorage.getItem(LS_START)){
      localStorage.setItem(LS_START, String(Date.now()));
    }
  }

  function elapsed(){
    const start = Number(localStorage.getItem(LS_START) || Date.now());
    const ms = Date.now() - start;
    const hh = Math.floor(ms / 3600000);
    const mm = Math.floor((ms % 3600000)/60000);
    const ss = Math.floor((ms % 60000)/1000);
    return [hh,mm,ss];
  }

  function pad(n){ return String(n).padStart(2,'0'); }

  function updateTimer(){
    const [h,m,s] = elapsed();
    timerEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  function saveState(){ localStorage.setItem(LS_KEY, JSON.stringify(state)); }
  function loadState(){
    try{ return JSON.parse(localStorage.getItem(LS_KEY)); }
    catch(e){ return null; }
  }

  function startPerQCountdown(){
    stopPerQCountdown();
    perQRemaining = PER_Q_LIMIT;
    if(perQTimerEl){ perQTimerEl.classList.remove('pulse'); }
    renderPerQTimer();
    perQInterval = setInterval(()=>{
      perQRemaining -= 1;
      if(perQRemaining <= 0){
        // Temps écoulé: avancer automatiquement
        stopPerQCountdown();
        goNext(true);
      } else {
        renderPerQTimer();
        if(perQTimerEl){
          if(perQRemaining <= 3){ perQTimerEl.classList.add('pulse'); }
        }
      }
    }, 1000);
  }

  function stopPerQCountdown(){
    if(perQInterval){
      clearInterval(perQInterval);
      perQInterval = null;
    }
  }

  function renderPerQTimer(){
    if(perQTimerEl){
      perQTimerEl.textContent = `${perQRemaining}s`;
    }
  }

  function updateProgressBar(){
    if(!progressFillEl) return;
    const pct = Math.min(100, Math.max(0, (state.index / questions.length) * 100));
    progressFillEl.style.width = pct + '%';
  }

  function render(){
    const q = questions[state.index];
    if(!q){
      // terminé => aller aux résultats
      window.location.href = '/resultats';
      return;
    }
    qEl.textContent = q.text;
    progressEl.textContent = `Question ${state.index+1} sur ${questions.length}`;
    updateProgressBar();

    formEl.innerHTML = '';
    ['a','b','c','d'].forEach(letter => {
      const id = `q${q.id}_${letter}`;
      const wrapper = document.createElement('label');
      wrapper.className = 'option';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `q${q.id}`;
      input.value = letter;
      input.id = id;
      if(state.answers[q.id] === letter) input.checked = true;
      const span = document.createElement('span');
      span.textContent = `${letter}) ${q.options[letter]}`;
      wrapper.appendChild(input);
      wrapper.appendChild(span);
      formEl.appendChild(wrapper);
    });

    startPerQCountdown();
  }

  function goNext(auto=false){
    const q = questions[state.index];
    if(!q){ return; }
    const selected = formEl.querySelector('input[type=radio]:checked');
    if(selected){
      state.answers[q.id] = selected.value;
      saveState();
    }
    state.index += 1;
    saveState();
    render();
  }

  nextBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    stopPerQCountdown();
    if(perQTimerEl){ perQTimerEl.classList.remove('pulse'); }
    goNext(false);
  });

  // Render initial
  render();
})();
