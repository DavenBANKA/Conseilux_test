/**
 * Gestion du téléchargement du certificat PDF premium
 */

(function() {
  'use strict';

  // Éléments DOM
  const downloadBtn = document.getElementById('download-certificate-btn');
  const certLoading = document.getElementById('certificate-loading');
  const certError = document.getElementById('certificate-error');

  if (!downloadBtn) return;

  // Fonction pour obtenir les données de l'étudiant
  function getStudentData() {
    try {
      const studentDataStr = sessionStorage.getItem('studentData');
      if (studentDataStr) {
        const data = JSON.parse(studentDataStr);
        const firstName = data.firstName || '';
        const lastName = data.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();
        return fullName || data.email?.split('@')[0] || 'Student';
      }
    } catch (e) {
      console.error('Erreur lors de la lecture des données:', e);
    }
    return 'Student';
  }

  // Fonction pour calculer les scores
  function calculateScores() {
    const LS_READING = 'conseilux_test_state';
    const LS_LISTENING = 'conseilux_listening_state_v2';
    
    const LISTENING_KEY = {
      1:'b',2:'c',3:'b',4:'b',5:'b',
      6:'a',7:'b',8:'b',9:'a',10:'a',
      11:'b',12:'b',13:'b',14:'b',15:'a',16:'b',
      17:'b',18:'b',19:'c',20:'b',21:'b',
      22:'b',23:'b',24:'b',25:'b',26:'a'
    };

    // Calculer le score de lecture
    let readingScore = 0;
    try {
      const readingState = JSON.parse(localStorage.getItem(LS_READING) || '{}');
      const readingAnswers = readingState.answers || {};
      const READING_KEY = window.CONSEILUX?.ANSWER_KEY || [];
      
      for (let i = 1; i <= READING_KEY.length; i++) {
        if (readingAnswers[i] && READING_KEY[i-1] && readingAnswers[i] === READING_KEY[i-1]) {
          readingScore++;
        }
      }
    } catch (e) {
      console.error('Erreur calcul reading:', e);
    }

    // Calculer le score d'écoute
    let listeningScore = 0;
    try {
      const listeningState = JSON.parse(localStorage.getItem(LS_LISTENING) || '{}');
      const listeningAnswers = listeningState.answers || {};
      
      for (let i = 1; i <= 26; i++) {
        const right = LISTENING_KEY[i];
        if (listeningAnswers[i] && right && listeningAnswers[i] === right) {
          listeningScore++;
        }
      }
    } catch (e) {
      console.error('Erreur calcul listening:', e);
    }

    const totalScore = readingScore + listeningScore;

    // Déterminer le niveau CEFR
    let level = 'A1';
    if (totalScore >= 101) level = 'C2';
    else if (totalScore >= 81) level = 'C1';
    else if (totalScore >= 61) level = 'B2';
    else if (totalScore >= 41) level = 'B1';
    else if (totalScore >= 21) level = 'A2';

    return {
      reading_score: readingScore,
      listening_score: listeningScore,
      total_score: totalScore,
      level: level
    };
  }

  // Gestionnaire de clic sur le bouton
  downloadBtn.addEventListener('click', async function() {
    // Cacher les messages précédents
    if (certError) certError.style.display = 'none';
    if (certLoading) certLoading.style.display = 'block';
    downloadBtn.disabled = true;
    downloadBtn.classList.add('loading');

    try {
      // Récupérer les données
      const user_name = getStudentData();
      const scores = calculateScores();

      // Préparer les données pour l'API
      const certificateData = {
        user_name: user_name,
        level: scores.level,
        reading_score: scores.reading_score,
        listening_score: scores.listening_score,
        total_score: scores.total_score
      };

      console.log('Génération du certificat avec:', certificateData);

      // Envoyer la requête
      const response = await fetch('/download_certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(certificateData)
      });

      // Vérifier la réponse
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/pdf')) {
          // Télécharger le PDF
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Conseilux_Certificate_${user_name.replace(/\s+/g, '_')}.pdf`;
          document.body.appendChild(a);
          a.click();
          
          // Nettoyer
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }, 100);

          // Message de succès
          if (certLoading) {
            certLoading.innerHTML = '<span class="success-icon">✅</span> Certificat téléchargé avec succès !';
            setTimeout(() => {
              certLoading.style.display = 'none';
            }, 3000);
          }
        } else {
          // Erreur - réponse non PDF
          const errorText = await response.text();
          throw new Error('Réponse inattendue du serveur');
        }
      } else {
        // Erreur HTTP
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      
      if (certError) {
        certError.textContent = '❌ ' + (error.message || 'Une erreur est survenue. Veuillez réessayer.');
        certError.style.display = 'block';
      }

      if (certLoading) certLoading.style.display = 'none';
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.classList.remove('loading');
    }
  });

})();

