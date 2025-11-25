(function(){
  // Check if user is registered
  const studentData = sessionStorage.getItem('studentData');
  if(!studentData){
    alert('Please register before taking the test.');
    window.location.href = '/register';
    return;
  }

  const LS_LISTENING_KEY = 'conseilux_listening_state_v2';
  
  // Always start fresh - clear any saved state from listening AND reading
  localStorage.removeItem('conseilux_listening_state');
  localStorage.removeItem(LS_LISTENING_KEY);
  localStorage.removeItem('conseilux_test_state'); // Clear reading test state
  localStorage.removeItem('conseilux_test_start_ts'); // Clear reading test timer

  const progressEl = document.getElementById('progress');
  const perQTimerEl = document.getElementById('perq-timer');
  const progressFillEl = document.getElementById('progress-fill');
  const playAudioBtn = document.getElementById('play-audio');
  const speechStatusEl = document.getElementById('speech-status');
  const nextBtn = document.getElementById('next-btn');
  const sectionTitleEl = document.getElementById('section-title');
  const questionsGroupEl = document.getElementById('questions-group');
  const voiceSelect = document.getElementById('voice-select');
  const speedControl = document.getElementById('speed-control');
  const speedValue = document.getElementById('speed-value');
  
  // Voice and speed settings
  let voices = [];
  let selectedVoice = null;
  let speechRate = 0.85;

  // Grouped by audio script
  const sections = [
    {
      level: 'A1',
      title: 'Section 1 - A1 Level (Beginner)',
      speech: 'Hello, my name is Sarah. I live in London. I work in a small shop. I start work at 9 AM and finish at 5 PM. I like music and I play the guitar on weekends.',
      questions: [
        { id: 1, text: 'Where does Sarah live?', options: { a: 'Paris', b: 'London', c: 'New York', d: 'Berlin' } },
        { id: 2, text: 'Where does she work?', options: { a: 'In a supermarket', b: 'In an office', c: 'In a small shop', d: 'In a restaurant' } },
        { id: 3, text: 'What time does she start work?', options: { a: '8 AM', b: '9 AM', c: '10 AM', d: '11 AM' } },
        { id: 4, text: 'What does she like?', options: { a: 'Dancing', b: 'Music', c: 'Cooking', d: 'Reading' } },
        { id: 5, text: 'What instrument does she play?', options: { a: 'Piano', b: 'Guitar', c: 'Drums', d: 'Violin' } }
      ]
    },
    {
      level: 'A2',
      title: 'Section 2 - A2 Level (Elementary)',
      speech: 'Today is Monday. Tom is taking the train to work because his car is at the garage. The train is slow and crowded. He usually arrives at 8:30, but today he will be late.',
      questions: [
        { id: 6, text: 'What day is it today?', options: { a: 'Monday', b: 'Tuesday', c: 'Friday', d: 'Wednesday' } },
        { id: 7, text: 'Why is Tom taking the train?', options: { a: 'He doesn\'t like driving', b: 'His car is at the garage', c: 'The train is faster', d: 'He likes trains' } },
        { id: 8, text: 'How is the train?', options: { a: 'Fast and empty', b: 'Slow and crowded', c: 'Clean and expensive', d: 'Comfortable and quiet' } },
        { id: 9, text: 'What time does he usually arrive?', options: { a: '8:30', b: '9:00', c: '7:45', d: '8:00' } },
        { id: 10, text: 'Will he be late today?', options: { a: 'Yes', b: 'No', c: 'Maybe', d: 'Unknown' } }
      ]
    },
    {
      level: 'B1',
      title: 'Section 3 - B1 Level (Intermediate)',
      speech: 'Last weekend, my friends and I went hiking in the mountains. The weather was sunny, but suddenly it started raining heavily. We had to stop and wait under a big tree. After one hour, the sky cleared, and we continued our hike to the top.',
      questions: [
        { id: 11, text: 'What activity did they do?', options: { a: 'Camping', b: 'Hiking', c: 'Swimming', d: 'Cycling' } },
        { id: 12, text: 'What was the weather like at first?', options: { a: 'Rainy', b: 'Sunny', c: 'Windy', d: 'Cloudy' } },
        { id: 13, text: 'What happened suddenly?', options: { a: 'They got lost', b: 'It started raining', c: 'They met other people', d: 'They saw an animal' } },
        { id: 14, text: 'Where did they wait?', options: { a: 'In a car', b: 'Under a tree', c: 'At home', d: 'In a shelter' } },
        { id: 15, text: 'Did they reach the top?', options: { a: 'Yes', b: 'No', c: 'Maybe', d: 'Unknown' } },
        { id: 16, text: 'How long did they wait under the tree?', options: { a: '30 minutes', b: 'One hour', c: 'Two hours', d: '15 minutes' } }
      ]
    },
    {
      level: 'B2',
      title: 'Section 4 - B2 Level (Upper Intermediate)',
      speech: 'During the conference, the speaker discussed the impact of remote work on productivity. He explained that while some employees work more efficiently from home, others face challenges such as isolation and lack of structure. He suggested hybrid models as a balanced solution.',
      questions: [
        { id: 17, text: 'What was the main topic of the conference?', options: { a: 'Team-building', b: 'Remote work and productivity', c: 'Office design', d: 'Marketing strategies' } },
        { id: 18, text: 'What problem do some employees face when working from home?', options: { a: 'Too many meetings', b: 'Isolation', c: 'Long commutes', d: 'Slow internet' } },
        { id: 19, text: 'What solution did the speaker suggest?', options: { a: 'Full remote', b: 'Returning to office', c: 'Hybrid models', d: 'Flexible hours' } },
        { id: 20, text: 'Who works more efficiently from home?', options: { a: 'Everyone', b: 'Some employees', c: 'No one', d: 'Only managers' } },
        { id: 21, text: 'The tone of the speaker was mainly…', options: { a: 'Critical', b: 'Balanced', c: 'Negative', d: 'Humorous' } }
      ]
    },
    {
      level: 'C1',
      title: 'Section 5 - C1 Level (Advanced)',
      speech: 'Recent studies have shown a significant shift in consumer behavior towards sustainable products. This trend is driven by increasing environmental awareness, but also by stricter regulations across industries. Companies that fail to adapt risk losing market share, while those embracing sustainability often experience stronger brand loyalty and long-term growth.',
      questions: [
        { id: 22, text: 'What trend is mentioned?', options: { a: 'Cheaper products', b: 'Sustainable product consumption', c: 'Luxury product demand', d: 'Online shopping' } },
        { id: 23, text: 'What is driving this trend?', options: { a: 'Marketing', b: 'Environmental awareness and regulations', c: 'Price reductions', d: 'Social media' } },
        { id: 24, text: 'What happens to companies that don\'t adapt?', options: { a: 'They grow faster', b: 'They lose market share', c: 'Nothing changes', d: 'They get fined' } },
        { id: 25, text: 'What benefit is mentioned for companies adopting sustainability?', options: { a: 'Better supply chains', b: 'Stronger brand loyalty', c: 'Lower production costs', d: 'Higher employee retention' } },
        { id: 26, text: 'How would you describe the tone of the passage?', options: { a: 'Persuasive and analytical', b: 'Informal', c: 'Emotional', d: 'Humorous' } }
      ]
    }
  ];

  // Always start fresh - no saved state
  let state = { sectionIndex: 0, answers: {}, playCount: {}, startTime: Date.now() };
  const TOTAL_TIME_LIMIT = 600; // 10 minutes total for entire listening test
  let timeRemaining = TOTAL_TIME_LIMIT;
  let timerInterval = null;
  let totalSeconds = 0;

  function saveState(){ 
    // No longer saving state - test always starts fresh
  }

  function speak(text, sectionIndex){
    if(!('speechSynthesis' in window)){
      if(speechStatusEl) speechStatusEl.textContent = 'Speech not supported in this browser';
      return;
    }
    
    const MAX_PLAYS = 2;
    const currentPlayCount = state.playCount[sectionIndex] || 0;
    if(currentPlayCount >= MAX_PLAYS){
      if(speechStatusEl) speechStatusEl.textContent = `Maximum ${MAX_PLAYS} plays reached`;
      return;
    }
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = speechRate; // Use selected speed
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Use selected voice if available
    if(selectedVoice){
      utterance.voice = selectedVoice;
    }
    
    utterance.onstart = () => {
      if(speechStatusEl){
        speechStatusEl.textContent = '🎵 Speaking...';
        speechStatusEl.classList.add('active');
      }
      if(playAudioBtn){
        playAudioBtn.disabled = true;
        playAudioBtn.classList.add('playing');
        playAudioBtn.textContent = '🔊 Playing...';
      }
    };
    
    utterance.onend = () => {
      state.playCount[sectionIndex] = currentPlayCount + 1;
      saveState();
      
      const remaining = MAX_PLAYS - state.playCount[sectionIndex];
      if(remaining > 0){
        if(speechStatusEl){
          speechStatusEl.textContent = `✓ Finished. ${remaining} play(s) remaining`;
          speechStatusEl.classList.remove('active');
        }
        if(playAudioBtn){
          playAudioBtn.disabled = false;
          playAudioBtn.classList.remove('playing');
          playAudioBtn.textContent = '🔊 Play Audio';
        }
      } else {
        if(speechStatusEl){
          speechStatusEl.textContent = '⚠️ Maximum 2 plays reached';
          speechStatusEl.classList.remove('active');
        }
        if(playAudioBtn){
          playAudioBtn.disabled = true;
          playAudioBtn.classList.remove('playing');
          playAudioBtn.classList.add('disabled');
          playAudioBtn.textContent = '🔒 No Plays Left';
        }
      }
    };
    
    utterance.onerror = () => {
      if(speechStatusEl){
        speechStatusEl.textContent = '❌ Error. Try again.';
        speechStatusEl.classList.remove('active');
      }
      if(playAudioBtn){
        playAudioBtn.disabled = false;
        playAudioBtn.classList.remove('playing');
        playAudioBtn.textContent = '🔊 Play Audio';
      }
    };
    
    window.speechSynthesis.speak(utterance);
  }

  function startTimer(){
    if(timerInterval) return;
    timerInterval = setInterval(()=>{
      timeRemaining -= 1;
      if(timeRemaining <= 0){
        stopTimer();
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

  function updateTotalTimer(){
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

  function updateProgressBar(){
    const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
    const answeredQuestions = Object.keys(state.answers).length;
    const percent = (answeredQuestions / totalQuestions) * 100;
    if(progressFillEl){ progressFillEl.style.width = percent + '%'; }
  }

  function goNext(){
    const section = sections[state.sectionIndex];
    if(!section) return;
    
    // Check all questions are answered
    let allAnswered = true;
    let unansweredCount = 0;
    section.questions.forEach(q => {
      if(!state.answers[q.id]){
        allAnswered = false;
        unansweredCount++;
      }
    });
    
    if(!allAnswered){
      // Show confirmation modal
      const message = unansweredCount === 1 
        ? 'You have 1 unanswered question in this section. Do you want to continue to the next section anyway?'
        : `You have ${unansweredCount} unanswered questions in this section. Do you want to continue to the next section anyway?`;
      
      showConfirmationModal(
        message,
        function() {
          // User confirmed - proceed to next section
          proceedToNextSection();
        },
        function() {
          // User cancelled - stay on current section
          console.log('User chose to stay on current section');
        }
      );
      return;
    }
    
    proceedToNextSection();
  }
  
  function proceedToNextSection(){
    saveState();
    state.sectionIndex++;
    
    if(state.sectionIndex >= sections.length){
      stopTimer();
      window.location.href = '/resultats';
    } else {
      render();
    }
  }

  function render(){
    console.log('Rendering section:', state.sectionIndex);
    const section = sections[state.sectionIndex];
    if(!section){
      console.error('No section found for index:', state.sectionIndex);
      stopTimer();
      window.location.href = '/resultats';
      return;
    }

    if(!sectionTitleEl || !questionsGroupEl || !progressEl){
      console.error('Required elements not found:', {
        sectionTitleEl: !!sectionTitleEl,
        questionsGroupEl: !!questionsGroupEl,
        progressEl: !!progressEl
      });
      return;
    }
    
    console.log('Rendering section:', section.title, 'with', section.questions.length, 'questions');

    // Update section title
    sectionTitleEl.textContent = section.title;
    
    // Update progress - show section number instead of question count
    progressEl.textContent = `Listening - Section ${state.sectionIndex + 1} of ${sections.length}`;
    updateProgressBar();

    // Update play button status
    const currentPlayCount = state.playCount[state.sectionIndex] || 0;
    const MAX_PLAYS = 2;
    const remaining = MAX_PLAYS - currentPlayCount;
    
    if(remaining > 0){
      if(speechStatusEl){
        speechStatusEl.textContent = `🎧 Click Play to listen (${remaining} play(s) remaining)`;
        speechStatusEl.classList.remove('active');
      }
      if(playAudioBtn){
        playAudioBtn.disabled = false;
        playAudioBtn.classList.remove('disabled', 'playing');
        playAudioBtn.textContent = '🔊 Play Audio';
      }
    } else {
      if(speechStatusEl){
        speechStatusEl.textContent = '⚠️ Maximum 2 plays reached';
        speechStatusEl.classList.remove('active');
      }
      if(playAudioBtn){
        playAudioBtn.disabled = true;
        playAudioBtn.classList.add('disabled');
        playAudioBtn.classList.remove('playing');
        playAudioBtn.textContent = '🔒 No Plays Left';
      }
    }

    // Render all questions for this section
    questionsGroupEl.innerHTML = '';
    section.questions.forEach((q, idx) => {
      const questionDiv = document.createElement('div');
      questionDiv.className = 'question-item';
      
      const questionTitle = document.createElement('h4');
      questionTitle.className = 'question-title';
      questionTitle.textContent = `Question ${idx + 1}: ${q.text}`;
      questionDiv.appendChild(questionTitle);
      
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'options';
      
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
        
        input.addEventListener('change', function(){
          state.answers[q.id] = letter;
          saveState();
          updateProgressBar();
        });
        
        const span = document.createElement('span');
        span.textContent = letter + ') ' + q.options[letter];
        wrapper.appendChild(input);
        wrapper.appendChild(span);
        optionsDiv.appendChild(wrapper);
      });
      
      questionDiv.appendChild(optionsDiv);
      questionsGroupEl.appendChild(questionDiv);
    });

    renderTimer();
  }

  nextBtn.addEventListener('click', function(e){
    e.preventDefault();
    goNext();
  });

  playAudioBtn.addEventListener('click', function(e){
    e.preventDefault();
    const section = sections[state.sectionIndex];
    if(section && section.speech){
      speak(section.speech, state.sectionIndex);
    }
  });

  // Load available voices
  function loadVoices(){
    voices = window.speechSynthesis.getVoices();
    if(voices.length > 0 && voiceSelect){
      voiceSelect.innerHTML = '';
      
      // Filter English voices
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
      
      if(englishVoices.length > 0){
        englishVoices.forEach(voice => {
          const option = document.createElement('option');
          option.value = voices.indexOf(voice);
          option.textContent = `${voice.name} (${voice.lang})`;
          if(voice.default || voice.lang === 'en-US'){
            option.selected = true;
            selectedVoice = voice;
          }
          voiceSelect.appendChild(option);
        });
      } else {
        // If no English voices, show all
        voices.forEach((voice, index) => {
          const option = document.createElement('option');
          option.value = index;
          option.textContent = `${voice.name} (${voice.lang})`;
          if(voice.default){
            option.selected = true;
            selectedVoice = voice;
          }
          voiceSelect.appendChild(option);
        });
      }
    }
  }
  
  // Initialize voices
  loadVoices();
  if(window.speechSynthesis.onvoiceschanged !== undefined){
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
  
  // Voice selection handler
  if(voiceSelect){
    voiceSelect.addEventListener('change', function(){
      const selectedIndex = parseInt(this.value);
      selectedVoice = voices[selectedIndex];
      console.log('Voice changed to:', selectedVoice ? selectedVoice.name : 'default');
    });
  }
  
  // Speed control handler
  if(speedControl && speedValue){
    speedControl.addEventListener('input', function(){
      speechRate = parseFloat(this.value);
      speedValue.textContent = speechRate.toFixed(1) + 'x';
    });
  }

  // Initialize
  render();
  startTimer();
  setInterval(updateTotalTimer, 1000);
})();
