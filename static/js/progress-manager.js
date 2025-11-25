/**
 * Progress Manager - Auto-save test progress
 * Handles saving and loading progress for Reading and Listening tests
 */

class ProgressManager {
  constructor(section) {
    this.section = section; // 'reading' or 'listening'
    this.saveDebounceTimer = null;
    this.saveInterval = 2000; // Save every 2 seconds
  }

  /**
   * Save progress to server
   */
  async saveProgress(currentQuestion, answers, options = {}) {
    const progressData = {
      current_section: this.section,
      current_question: currentQuestion,
      answers: answers,
      reading_completed: options.reading_completed || false,
      listening_completed: options.listening_completed || false,
      test_completed: options.test_completed || false
    };

    try {
      const response = await fetch('/api/save_progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(progressData)
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Progress saved:', data.progress);
        return true;
      } else {
        console.error('❌ Failed to save progress:', data.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Error saving progress:', error);
      return false;
    }
  }

  /**
   * Save progress with debounce (avoid too many requests)
   */
  saveProgressDebounced(currentQuestion, answers, options = {}) {
    clearTimeout(this.saveDebounceTimer);
    
    this.saveDebounceTimer = setTimeout(() => {
      this.saveProgress(currentQuestion, answers, options);
    }, this.saveInterval);
  }

  /**
   * Load progress from server
   */
  async loadProgress() {
    try {
      const response = await fetch('/api/load_progress');
      const data = await response.json();

      if (data.success && data.has_progress) {
        console.log('✅ Progress loaded:', data.progress);
        return data.progress;
      } else {
        console.log('ℹ️ No saved progress found');
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading progress:', error);
      return null;
    }
  }

  /**
   * Reset progress on server
   */
  async resetProgress() {
    try {
      const response = await fetch('/api/reset_progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Progress reset');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error resetting progress:', error);
      return false;
    }
  }

  /**
   * Auto-save on page unload
   */
  setupAutoSave(getCurrentQuestion, getAnswers) {
    window.addEventListener('beforeunload', () => {
      const currentQuestion = getCurrentQuestion();
      const answers = getAnswers();
      
      // Use synchronous request for beforeunload
      const progressData = {
        current_section: this.section,
        current_question: currentQuestion,
        answers: answers
      };

      navigator.sendBeacon('/api/save_progress', JSON.stringify(progressData));
    });
  }
}

// Export for use in other scripts
window.ProgressManager = ProgressManager;
