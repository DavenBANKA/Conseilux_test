(function(){
  const LS_LISTENING_KEY = 'conseilux_listening_state';

  const qEl = document.getElementById('question-text');
  const formEl = document.getElementById('options-form');
  const nextBtn = document.getElementById('next-btn');
  const progressEl = document.getElementById('progress');
  const perQTimerEl = document.getElementById('perq-timer');
  const progressFillEl = document.getElementById('progress-fill');
  const playAudioBtn = document.getElementById('play-audio');
  const speechStatusEl = document.getElementById('speech-status');

  const questions = [
    // A1
    {
      id: 1,
      text: 'Where does Sarah live?',
      speech: 'Hello, my name is Sarah. I live in London. I work in a small shop. I start work at 9 AM and finish at 5 PM. I like music and I play the guitar on weekends.',
      options: {
        a: 'Paris',
        b: 'London',
        c: 'New York',
        d: 'Berlin'
      }
    },
    {
      id: 2,
      text: 'Where does she work?',
      speech: 'Hello, my name is Sarah. I live in London. I work in a small shop. I start work at 9 AM and finish at 5 PM. I like music and I play the guitar on weekends.',
      options: {
        a: 'In a supermarket',
        b: 'In an office',
        c: 'In a small shop',
        d: 'In a restaurant'
      }
    },
    {
      id: 3,
      text: 'What time does she start work?',
      speech: 'Hello, my name is Sarah. I live in London. I work in a small shop. I start work at 9 AM and finish at 5 PM. I like music and I play the guitar on weekends.',
      options: {
        a: '8 AM',
        b: '9 AM',
        c: '10 AM',
        d: '11 AM'
      }
    },
    {
      id: 4,
      text: 'What does she like?',
      speech: 'Hello, my name is Sarah. I live in London. I work in a small shop. I start work at 9 AM and finish at 5 PM. I like music and I play the guitar on weekends.',
      options: {
        a: 'Dancing',
        b: 'Music',
        c: 'Cooking',
        d: 'Reading'
      }
    },
    {
      id: 5,
      text: 'What instrument does she play?',
      speech: 'Hello, my name is Sarah. I live in London. I work in a small shop. I start work at 9 AM and finish at 5 PM. I like music and I play the guitar on weekends.',
      options: {
        a: 'Piano',
        b: 'Guitar',
        c: 'Drums',
        d: 'Violin'
      }
    },

    // A2
    {
      id: 6,
      text: 'What day is it today?',
      speech: 'Today is Monday. Tom is taking the train to work because his car is at the garage. The train is slow and crowded. He usually arrives at 8:30, but today he will be late.',
      options: {
        a: 'Monday',
        b: 'Tuesday',
        c: 'Friday',
        d: 'Wednesday'
      }
    },
    {
      id: 7,
      text: 'Why is Tom taking the train?',
      speech: 'Today is Monday. Tom is taking the train to work because his car is at the garage. The train is slow and crowded. He usually arrives at 8:30, but today he will be late.',
      options: {
        a: 'He doesn\'t like driving',
        b: 'His car is at the garage',
        c: 'The train is faster',
        d: 'He likes trains'
      }
    },
    {
      id: 8,
      text: 'How is the train?',
      speech: 'Today is Monday. Tom is taking the train to work because his car is at the garage. The train is slow and crowded. He usually arrives at 8:30, but today he will be late.',
      options: {
        a: 'Fast and empty',
        b: 'Slow and crowded',
        c: 'Clean and expensive',
        d: 'Comfortable and quiet'
      }
    },
    {
      id: 9,
      text: 'What time does he usually arrive?',
      speech: 'Today is Monday. Tom is taking the train to work because his car is at the garage. The train is slow and crowded. He usually arrives at 8:30, but today he will be late.',
      options: {
        a: '8:30',
        b: '9:00',
        c: '7:45',
        d: '8:00'
      }
    },
    {
      id: 10,
      text: 'Will he be late today?',
      speech: 'Today is Monday. Tom is taking the train to work because his car is at the garage. The train is slow and crowded. He usually arrives at 8:30, but today he will be late.',
      options: {
        a: 'Yes',
        b: 'No',
        c: 'Maybe',
        d: 'Unknown'
      }
    },

    // B1
    {
      id: 11,
      text: 'What activity did they do?',
      speech: 'Last weekend, my friends and I went hiking in the mountains. The weather was sunny, but suddenly it started raining heavily. We had to stop and wait under a big tree. After one hour, the sky cleared, and we continued our hike to the top.',
      options: {
        a: 'Camping',
        b: 'Hiking',
        c: 'Swimming',
        d: 'Cycling'
      }
    },
    {
      id: 12,
      text: 'What was the weather like at first?',
      speech: 'Last weekend, my friends and I went hiking in the mountains. The weather was sunny, but suddenly it started raining heavily. We had to stop and wait under a big tree. After one hour, the sky cleared, and we continued our hike to the top.',
      options: {
        a: 'Rainy',
        b: 'Sunny',
        c: 'Windy',
        d: 'Cloudy'
      }
    },
    {
      id: 13,
      text: 'What happened suddenly?',
      speech: 'Last weekend, my friends and I went hiking in the mountains. The weather was sunny, but suddenly it started raining heavily. We had to stop and wait under a big tree. After one hour, the sky cleared, and we continued our hike to the top.',
      options: {
        a: 'They got lost',
        b: 'It started raining',
        c: 'They met other people',
        d: 'They saw an animal'
      }
    },
    {
      id: 14,
      text: 'Where did they wait?',
      speech: 'Last weekend, my friends and I went hiking in the mountains. The weather was sunny, but suddenly it started raining heavily. We had to stop and wait under a big tree. After one hour, the sky cleared, and we continued our hike to the top.',
      options: {
        a: 'In a car',
        b: 'Under a tree',
        c: 'At home',
        d: 'In a shelter'
      }
    },
    {
      id: 15,
      text: 'Did they reach the top?',
      speech: 'Last weekend, my friends and I went hiking in the mountains. The weather was sunny, but suddenly it started raining heavily. We had to stop and wait under a big tree. After one hour, the sky cleared, and we continued our hike to the top.',
      options: {
        a: 'Yes',
        b: 'No',
        c: 'Maybe',
        d: 'Unknown'
      }
    },
    {
      id: 16,
      text: 'How long did they wait under the tree?',
      speech: 'Last weekend, my friends and I went hiking in the mountains. The weather was sunny, but suddenly it started raining heavily. We had to stop and wait under a big tree. After one hour, the sky cleared, and we continued our hike to the top.',
      options: {
        a: '30 minutes',
        b: 'One hour',
        c: 'Two hours',
        d: '15 minutes'
      }
    },

    // B2
    {
      id: 17,
      text: 'What was the main topic of the conference?',
      speech: 'During the conference, the speaker discussed the impact of remote work on productivity. He explained that while some employees work more efficiently from home, others face challenges such as isolation and lack of structure. He suggested hybrid models as a balanced solution.',
      options: {
        a: 'Team-building',
        b: 'Remote work and productivity',
        c: 'Office design',
        d: 'Marketing strategies'
      }
    },
    {
      id: 18,
      text: 'What problem do some employees face when working from home?',
      speech: 'During the conference, the speaker discussed the impact of remote work on productivity. He explained that while some employees work more efficiently from home, others face challenges such as isolation and lack of structure. He suggested hybrid models as a balanced solution.',
      options: {
        a: 'Too many meetings',
        b: 'Isolation',
        c: 'Long commutes',
        d: 'Slow internet'
      }
    },
    {
      id: 19,
      text: 'What solution did the speaker suggest?',
      speech: 'During the conference, the speaker discussed the impact of remote work on productivity. He explained that while some employees work more efficiently from home, others face challenges such as isolation and lack of structure. He suggested hybrid models as a balanced solution.',
      options: {
        a: 'Full remote',
        b: 'Returning to office',
        c: 'Hybrid models',
        d: 'Flexible hours'
      }
    },
    {
      id: 20,
      text: 'Who works more efficiently from home?',
      speech: 'During the conference, the speaker discussed the impact of remote work on productivity. He explained that while some employees work more efficiently from home, others face challenges such as isolation and lack of structure. He suggested hybrid models as a balanced solution.',
      options: {
        a: 'Everyone',
        b: 'Some employees',
        c: 'No one',
        d: 'Only managers'
      }
    },
    {
      id: 21,
      text: 'The tone of the speaker was mainly…',
      speech: 'During the conference, the speaker discussed the impact of remote work on productivity. He explained that while some employees work more efficiently from home, others face challenges such as isolation and lack of structure. He suggested hybrid models as a balanced solution.',
      options: {
        a: 'Critical',
        b: 'Balanced',
        c: 'Negative',
        d: 'Humorous'
      }
    },

    // C1
    {
      id: 22,
      text: 'What trend is mentioned?',
      speech: 'Recent studies have shown a significant shift in consumer behavior towards sustainable products. This trend is driven by increasing environmental awareness, but also by stricter regulations across industries. Companies that fail to adapt risk losing market share, while those embracing sustainability often experience stronger brand loyalty and long-term growth.',
      options: {
        a: 'Cheaper products',
        b: 'Sustainable product consumption',
        c: 'Luxury product demand',
        d: 'Online shopping'
      }
    },
    {
      id: 23,
      text: 'What is driving this trend?',
      speech: 'Recent studies have shown a significant shift in consumer behavior towards sustainable products. This trend is driven by increasing environmental awareness, but also by stricter regulations across industries. Companies that fail to adapt risk losing market share, while those embracing sustainability often experience stronger brand loyalty and long-term growth.',
      options: {
        a: 'Marketing',
        b: 'Environmental awareness and regulations',
        c: 'Price reductions',
        d: 'Social media'
      }
    },
    {
      id: 24,
      text: 'What happens to companies that don\'t adapt?',
      speech: 'Recent studies have shown a significant shift in consumer behavior towards sustainable products. This trend is driven by increasing environmental awareness, but also by stricter regulations across industries. Companies that fail to adapt risk losing market share, while those embracing sustainability often experience stronger brand loyalty and long-term growth.',
      options: {
        a: 'They grow faster',
        b: 'They lose market share',
        c: 'Nothing changes',
        d: 'They get fined'
      }
    },
    {
      id: 25,
      text: 'What benefit is mentioned for companies adopting sustainability?',
      speech: 'Recent studies have shown a significant shift in consumer behavior towards sustainable products. This trend is driven by increasing environmental awareness, but also by stricter regulations across industries. Companies that fail to adapt risk losing market share, while those embracing sustainability often experience stronger brand loyalty and long-term growth.',
      options: {
        a: 'Better supply chains',
        b: 'Stronger brand loyalty',
        c: 'Lower production costs',
        d: 'Higher employee retention'
      }
    },
    {
      id: 26,
      text: 'How would you describe the tone of the passage?',
      speech: 'Recent studies have shown a significant shift in consumer behavior towards sustainable products. This trend is driven by increasing environmental awareness, but also by stricter regulations across industries. Companies that fail to adapt risk losing market share, while those embracing sustainability often experience stronger brand loyalty and long-term growth.',
      options: {
        a: 'Persuasive and analytical',
        b: 'Informal',
        c: 'Emotional',
        d: 'Humorous'
      }
    }
  ];

  let state = loadState() || { index: 0, answers: {}, playCount: {} };
  let totalSeconds = 0;
  const TOTAL_TIME_LIMIT = 600; // 10 minutes = 600 seconds
  const MAX_PLAYS = 2; // Maximum 2 plays per question
  let timeRemaining = TOTAL_TIME_LIMIT;
  let timerInterval = null;

  function saveState(){ localStorage.setItem(LS_LISTENING_KEY, JSON.stringify(state)); }
  function loadState(){
    try{ return JSON.parse(localStorage.getItem(LS_LISTENING_KEY)); }
    catch(e){ return null; }
  }

  function speak(text, questionId){
    if(!('speechSynthesis' in window)){
      if(speechStatusEl) speechStatusEl.textContent = 'Speech not supported in this browser';
      return;
    }
    
    // Check play count
    const currentPlayCount = state.playCount[questionId] || 0;
    if(currentPlayCount >= MAX_PLAYS){
      if(speechStatusEl) speechStatusEl.textContent = `Maximum ${MAX_PLAYS} plays reached`;
      return;
    }
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => {
      if(speechStatusEl) speechStatusEl.textContent = 'Speaking...';
      if(playAudioBtn) playAudioBtn.disabled = true;
    };
    utterance.onend = () => {
      // Increment play count
      state.playCount[questionId] = currentPlayCount + 1;
      saveState();
      
      const remaining = MAX_PLAYS - state.playCount[questionId];
      if(remaining > 0){
        if(speechStatusEl) speechStatusEl.textContent = `Finished. ${remaining} play(s) remaining`;
        if(playAudioBtn) playAudioBtn.disabled = false;
      } else {
        if(speechStatusEl) speechStatusEl.textContent = 'Maximum plays reached';
        if(playAudioBtn) playAudioBtn.disabled = true;
      }
    };
    utterance.onerror = () => {
      if(speechStatusEl) speechStatusEl.textContent = 'Error. Try again.';
      if(playAudioBtn) playAudioBtn.disabled = false;
    };
    window.speechSynthesis.speak(utterance);
  }

  function startTimer(){
    if(timerInterval) return; // Already started
    timerInterval = setInterval(()=>{
      timeRemaining -= 1;
      if(timeRemaining <= 0){
        stopTimer();
        // Time's up - submit test
        alert('Time is up! Submitting your test...');
        window.location.href = '/resultats';
      }
      renderTimer();
    }, 1000);
  }

  function stopTimer(){
    if(timerInterval){ clearInterval(timerInterval); timerInterval = null; }
  }

  function renderTimer(){
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    if(perQTimerEl){
      perQTimerEl.textContent = String(minutes).padStart(2,'0') + ':' + String(seconds).padStart(2,'0');
      if(timeRemaining <= 60){ 
        perQTimerEl.classList.add('pulse'); 
      } else {
        perQTimerEl.classList.remove('pulse');
      }
    }
  }

  function updateProgressBar(){
    const percent = ((state.index+1)/questions.length)*100;
    if(progressFillEl){ progressFillEl.style.width = percent + '%'; }
  }

  function goNext(timeout = false){
    const selected = formEl.querySelector('input[name="lq'+questions[state.index].id+'"]:checked');
    if(!selected && !timeout){
      alert('Please select an answer');
      return;
    }
    if(selected){
      state.answers[questions[state.index].id] = selected.value;
    }
    saveState();
    state.index++;
    if(state.index >= questions.length){
      // Finished listening test, go to results
      stopPerQCountdown();
      window.location.href = '/resultats';
    } else {
      render();
    }
  }

  function render(){
    const q = questions[state.index];
    if(!q){
      stopTimer();
      window.location.href = '/resultats';
      return;
    }

    if(!qEl || !formEl || !progressEl){
      console.error('Required elements not found');
      return;
    }

    qEl.textContent = q.text;
    progressEl.textContent = 'Listening - Question ' + (state.index+1) + ' of ' + questions.length;
    updateProgressBar();

    // Update play button status
    const currentPlayCount = state.playCount[q.id] || 0;
    const remaining = MAX_PLAYS - currentPlayCount;
    
    if(remaining > 0){
      if(speechStatusEl) speechStatusEl.textContent = `Click Play to listen (${remaining} play(s) remaining)`;
      if(playAudioBtn) playAudioBtn.disabled = false;
    } else {
      if(speechStatusEl) speechStatusEl.textContent = 'Maximum plays reached';
      if(playAudioBtn) playAudioBtn.disabled = true;
    }

    formEl.innerHTML = '';
    ['a','b','c','d'].forEach(letter => {
      const id = 'lq' + q.id + '_' + letter;
      const wrapper = document.createElement('label');
      wrapper.className = 'option';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'lq' + q.id;
      input.value = letter;
      input.id = id;
      if(state.answers[q.id] === letter) input.checked = true;
      const span = document.createElement('span');
      span.textContent = letter + ') ' + q.options[letter];
      wrapper.appendChild(input);
      wrapper.appendChild(span);
      formEl.appendChild(wrapper);
    });

    renderTimer();
  }

  function updateTimer(){
    totalSeconds++;
    const hours = Math.floor(totalSeconds/3600);
    const minutes = Math.floor((totalSeconds%3600)/60);
    const seconds = totalSeconds%60;
    const timerEl = document.getElementById('timer');
    if(timerEl){
      timerEl.textContent = 
        String(hours).padStart(2,'0') + ':' +
        String(minutes).padStart(2,'0') + ':' +
        String(seconds).padStart(2,'0');
    }
  }

  nextBtn.addEventListener('click', function(e){
    e.preventDefault();
    goNext(false);
  });

  playAudioBtn.addEventListener('click', function(e){
    e.preventDefault();
    const q = questions[state.index];
    if(q && q.speech){
      speak(q.speech, q.id);
    }
  });

  render();
  startTimer();
  setInterval(updateTimer, 1000);
})();
