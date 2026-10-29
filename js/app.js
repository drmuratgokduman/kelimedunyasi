/**
 * Kelime Dünyası - Oyun ve Soru Motoru
 * Akıllı kategori çeldiricisi, aralıklı tekrar ve Hızlı Soru Modu içerir.
 */

// Kategori Görüntüleme Bilgileri (Emoji ve Başlık)
const CATEGORY_META = {
  renkler: { title: "Renkler", emoji: "🎨" },
  renkler_isik: { title: "Renk ve Işık", emoji: "💡" },
  okul_egitim: { title: "Okul ve Eğitim", emoji: "🏫" },
  insan_nitelik: { title: "İnsan Nitelikleri", emoji: "👤" },
  insan_birey: { title: "İnsan ve Birey", emoji: "👤" },
  insan_ahlak: { title: "İnsan ve Kişilik", emoji: "🌟" },
  zaman_mevsim: { title: "Zaman ve Mevsim", emoji: "⏳" },
  zaman_olcu: { title: "Zaman ve Ölçü", emoji: "⏳" },
  zaman_sira: { title: "Zaman ve Sıralama", emoji: "⏰" },
  zaman_konum: { title: "Zaman ve Konum", emoji: "⏰" },
  doga_dunya: { title: "Doğa ve Çevre", emoji: "🌿" },
  doga_mekan: { title: "Doğa ve Mekân", emoji: "🌿" },
  duygular: { title: "Duygular ve Sezgi", emoji: "❤️" },
  eylem_durum: { title: "Eylemler ve Durum", emoji: "🚀" },
  boyut_olcu: { title: "Boyut ve Ölçü", emoji: "📏" },
  fiziksel_nitelik: { title: "Fiziksel Özellikler", emoji: "🧱" },
  eylemler_yonler: { title: "Eylemler ve Yönler", emoji: "🧭" },
  eylemler_fiiller: { title: "Eylemler ve Fiiller", emoji: "🏃" }
};

// ==========================================
// SES EFEKTLERİ MOTORU (Web Audio API)
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playCorrect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playWrong() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(150, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

// ==========================================
// OYUN DURUMU & YÖNETİCİSİ (Game Controller)
// ==========================================
class WordGame {
  constructor() {
    this.currentMode = null; // 'synonyms' veya 'antonyms'
    this.mainQueue = []; // Ana soru havuzu
    this.reviewQueue = []; // Yanlış yapılıp aralarda tekrar sorulacaklar
    this.currentQuestion = null;
    this.hasMadeMistakeInCurrent = false;
    this.streak = 0;
    this.questionsAnswered = 0;
    this.isFastMode = false; // Hızlı Soru Modu (Panel açılmadan geçiş)

    this.sound = new SoundFX();

    this.bindDomElements();
    this.attachEventListeners();
  }

  bindDomElements() {
    // Görünümler
    this.viewHome = document.getElementById("view-home");
    this.viewGame = document.getElementById("view-game");

    // Üst Bar
    this.btnHome = document.getElementById("btn-home");
    this.headerModeDisplay = document.getElementById("header-mode-display");
    this.headerModeBadge = document.getElementById("header-mode-badge");
    this.streakNumber = document.getElementById("streak-number");
    this.btnFastToggle = document.getElementById("btn-fast-toggle");
    this.btnSoundToggle = document.getElementById("btn-sound-toggle");

    // Mod Kartları
    this.cardSynonym = document.getElementById("card-mode-synonym");
    this.cardAntonym = document.getElementById("card-mode-antonym");

    // Soru Alanı
    this.categoryBadge = document.getElementById("category-badge");
    this.questionPromptText = document.getElementById("question-prompt-text");
    this.questionWord = document.getElementById("question-word");
    this.optionsContainer = document.getElementById("options-container");

    // Modal
    this.infoModal = document.getElementById("info-modal");
    this.modalQWord = document.getElementById("modal-q-word");
    this.modalAWord = document.getElementById("modal-a-word");
    this.modalMeaningText = document.getElementById("modal-meaning-text");
    this.modalVariantsSection = document.getElementById("modal-variants-section");
    this.modalVariantsLabel = document.getElementById("modal-variants-label");
    this.modalVariantsText = document.getElementById("modal-variants-text");
    this.modalExampleText = document.getElementById("modal-example-text");
    this.btnModalRead = document.getElementById("btn-modal-read");
  }

  attachEventListeners() {
    // Mod Seçimi
    this.cardSynonym.addEventListener("click", () => this.startMode("synonyms"));
    this.cardAntonym.addEventListener("click", () => this.startMode("antonyms"));

    // Ana Sayfaya Dönüş
    this.btnHome.addEventListener("click", () => this.showHomeScreen());

    // Hızlı Soru Modu Toggle
    this.btnFastToggle.addEventListener("click", () => this.toggleFastMode());

    // Ses Aç/Kapat
    this.btnSoundToggle.addEventListener("click", () => {
      const isMuted = this.sound.toggleMute();
      this.btnSoundToggle.textContent = isMuted ? "🔇" : "🔊";
      this.btnSoundToggle.title = isMuted ? "Sesi Aç" : "Sesi Kapat";
    });

    // "Okudum" Butonu
    this.btnModalRead.addEventListener("click", () => {
      this.sound.playClick();
      this.closeModalAndNextQuestion();
    });
  }

  // Hızlı Soru Modunu Aç/Kapat
  toggleFastMode() {
    this.sound.playClick();
    this.isFastMode = !this.isFastMode;

    document.body.classList.toggle("fast-mode-active", this.isFastMode);

    if (this.isFastMode) {
      this.btnFastToggle.classList.add("active-fast");
      this.btnFastToggle.title = "Hızlı Soru Modu: AÇIK (Bilgi paneli açılmadan doğrudan geçer)";
    } else {
      this.btnFastToggle.classList.remove("active-fast");
      this.btnFastToggle.title = "Hızlı Soru Modu: Kapalı (Açmak için tıkla)";
    }
  }

  // Modu Başlatma
  startMode(modeKey) {
    this.sound.playClick();
    this.currentMode = modeKey;
    this.streak = 0;
    this.questionsAnswered = 0;
    this.reviewQueue = [];
    this.updateStreakDisplay();

    // Üst Bar Başlığı
    this.headerModeDisplay.style.display = "block";
    if (modeKey === "synonyms") {
      this.headerModeBadge.textContent = "Eş Anlamlılar";
      this.headerModeBadge.className = "header-mode-badge badge-synonym";
      this.questionPromptText.textContent = "kelimesinin eş anlamlısı hangisidir?";
    } else {
      this.headerModeBadge.textContent = "Zıt Anlamlılar";
      this.headerModeBadge.className = "header-mode-badge badge-antonym";
      this.questionPromptText.textContent = "kelimesinin zıt (karşıt) anlamlısı hangisidir?";
    }

    // Kelimeleri Sıklık/Öncelik Algoritmasına Göre Hazırla
    this.prepareQuestionQueue();

    // Görünümleri Değiştir
    this.viewHome.style.display = "none";
    this.viewGame.style.display = "flex";

    // İlk Soruyu Getir
    this.loadNextQuestion();
  }

  // Ana Sayfayı Göster
  showHomeScreen() {
    this.sound.playClick();
    this.infoModal.classList.remove("active");
    this.viewGame.style.display = "none";
    this.viewHome.style.display = "flex";
    this.headerModeDisplay.style.display = "none";
    this.currentMode = null;
  }

  // Kelime Havuzunu Hazırlama (Sık kullanılanlar öncelikli & her başlatıldığında karıştırılmış)
  prepareQuestionQueue() {
    const rawList = WORDS_DATABASE[this.currentMode] || [];
    
    // Kelimeleri önceliklerine (priority) göre grupla
    const groups = {};
    rawList.forEach(item => {
      const p = item.priority || 1;
      if (!groups[p]) groups[p] = [];
      groups[p].push(item);
    });

    // Her öncelik grubunu kendi içinde rastgele karıştır (Fisher-Yates)
    const sortedPriorities = Object.keys(groups).map(Number).sort((a, b) => a - b);
    let preparedQueue = [];

    sortedPriorities.forEach(priorityLevel => {
      const shuffledGroup = this.shuffleArray([...groups[priorityLevel]]);
      preparedQueue.push(...shuffledGroup);
    });

    this.mainQueue = preparedQueue;
  }

  // Sonraki Soruyu Seç ve Yükle
  loadNextQuestion() {
    this.hasMadeMistakeInCurrent = false;

    // Aralıklı Tekrar Algoritması (Spaced Repetition):
    // Yanlış cevap verilenler reviewQueue kuyruğuna alınır.
    // Her 3 soruda bir (veya ana havuz bittiğinde), tekrar havuzundaki kelimeler araya serpiştirilir.
    if (this.reviewQueue.length > 0 && (this.questionsAnswered % 3 === 0 || this.mainQueue.length === 0)) {
      this.currentQuestion = this.reviewQueue.shift();
    } else if (this.mainQueue.length > 0) {
      this.currentQuestion = this.mainQueue.shift();
    } else {
      // Tüm havuz bittiyse yeniden baştan harmanla
      this.prepareQuestionQueue();
      this.currentQuestion = this.mainQueue.shift();
    }

    this.renderQuestion(this.currentQuestion);
  }

  // Soruyu Ekrana Çizme
  renderQuestion(questionObj) {
    if (!questionObj) return;

    // Kategori Rozeti
    const catInfo = CATEGORY_META[questionObj.category] || { title: "Genel", emoji: "✨" };
    this.categoryBadge.innerHTML = `${catInfo.emoji} <span>${catInfo.title}</span>`;

    // Soru Kelimesi
    this.questionWord.textContent = questionObj.question;

    // Akıllı Seçenekleri Oluştur (Doğru cevapla aynı kategoriden çeldiriciler)
    const options = this.generateSmartOptions(questionObj);

    // Seçenek Butonlarını DOM'a Bas
    this.optionsContainer.innerHTML = "";
    options.forEach(optText => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = optText;
      btn.addEventListener("click", () => this.handleOptionClick(btn, optText, questionObj));
      this.optionsContainer.appendChild(btn);
    });
  }

  // Akıllı Çeldirici (Distractor) Oluşturma Algoritması:
  // Doğru cevapla kesinlikle aynı kategorideki diğer kelimelerden çeldiriciler seçilir!
  generateSmartOptions(questionObj) {
    const allWordsInMode = WORDS_DATABASE[this.currentMode] || [];
    const correctAnswer = questionObj.answer;

    // 1. Aynı kategorideki diğer kelimelerin cevaplarını filtrele
    let categoryDistractors = allWordsInMode
      .filter(w => w.category === questionObj.category && w.answer.toLowerCase() !== correctAnswer.toLowerCase())
      .map(w => w.answer);

    // Tekrarları kaldır
    categoryDistractors = [...new Set(categoryDistractors)];

    // Kategoride yeterli cevap yoksa aynı kategorideki soru kelimelerinden de yararlan
    if (categoryDistractors.length < 3) {
      const catQuestions = allWordsInMode
        .filter(w => w.category === questionObj.category && w.question.toLowerCase() !== questionObj.question.toLowerCase())
        .map(w => w.question);
      categoryDistractors = [...new Set([...categoryDistractors, ...catQuestions])];
    }

    // Hala 3 çeldiriciye ulaşamadıysa genel havuzdan tamamla
    if (categoryDistractors.length < 3) {
      const fallbackPool = allWordsInMode
        .filter(w => w.answer.toLowerCase() !== correctAnswer.toLowerCase())
        .map(w => w.answer);
      const shuffledFallback = this.shuffleArray(fallbackPool);
      for (const item of shuffledFallback) {
        if (!categoryDistractors.includes(item) && item !== correctAnswer) {
          categoryDistractors.push(item);
        }
        if (categoryDistractors.length >= 3) break;
      }
    }

    // Çeldiricileri karıştırıp tam 3 tanesini al
    const selectedDistractors = this.shuffleArray(categoryDistractors).slice(0, 3);

    // Doğru cevapla birleştir ve 4 seçeneği harmanla
    const finalOptions = this.shuffleArray([correctAnswer, ...selectedDistractors]);
    return finalOptions;
  }

  // Seçenek Tıklanması
  handleOptionClick(buttonEl, selectedText, questionObj) {
    const isCorrect = selectedText.trim().toLowerCase() === questionObj.answer.trim().toLowerCase();

    if (isCorrect) {
      // DOĞRU CEVAP!
      this.sound.playCorrect();
      buttonEl.classList.add("correct");

      // Tüm butonları dondur
      const allButtons = this.optionsContainer.querySelectorAll(".option-btn");
      allButtons.forEach(btn => (btn.disabled = true));

      // Bu soruda daha önce yanlış yapılmadıysa seriyi artır
      if (!this.hasMadeMistakeInCurrent) {
        this.streak++;
      }
      this.questionsAnswered++;
      this.updateStreakDisplay();

      // HIZLI SORU MODU KONTROLÜ:
      if (this.isFastMode) {
        // Hızlı mod açıkken bilgi paneli AÇILMAZ, doğrudan sonraki soruya geçer!
        setTimeout(() => {
          this.loadNextQuestion();
        }, 550);
      } else {
        // Normal modda bilgi paneli açılır ve "Okudum" butonu beklenir
        setTimeout(() => {
          this.openInfoModal(questionObj);
        }, 450);
      }

    } else {
      // YANLIŞ CEVAP!
      this.sound.playWrong();
      buttonEl.classList.add("wrong");
      buttonEl.disabled = true; // Sadece tıklanan yanlış şıkkı devre dışı bırak

      // Yanlış yapıldığı kaydedilir ve tekrar kuyruğuna alınır
      if (!this.hasMadeMistakeInCurrent) {
        this.hasMadeMistakeInCurrent = true;
        this.streak = 0; // Seri bozulur
        this.updateStreakDisplay();

        // Tekrar kuyruğunda yoksa ekle
        const alreadyInQueue = this.reviewQueue.some(q => q.id === questionObj.id);
        if (!alreadyInQueue) {
          this.reviewQueue.push(questionObj);
        }
      }
      // Kullanıcı doğruyu bulana kadar diğer şıklardan seçmeye devam eder!
    }
  }

  // Bilgi Panelini Açma ("Okudum" Butonlu Ekran)
  openInfoModal(questionObj) {
    this.modalQWord.textContent = questionObj.question;
    this.modalAWord.textContent = questionObj.answer;
    this.modalMeaningText.textContent = questionObj.meaning || "Bu sözcüğün anlamı pekiştirildi.";

    // Diğer Varyantlar (Varsa)
    if (questionObj.otherVariants && questionObj.otherVariants.length > 0) {
      this.modalVariantsLabel.textContent = this.currentMode === "synonyms" 
        ? "🔁 Diğer Eş Anlamlıları" 
        : "🔁 Diğer Zıt Anlamlıları";
      this.modalVariantsText.textContent = questionObj.otherVariants.join(", ");
      this.modalVariantsSection.style.display = "block";
    } else {
      this.modalVariantsSection.style.display = "none";
    }

    // Örnek Cümle
    this.modalExampleText.textContent = questionObj.example 
      ? `"${questionObj.example}"` 
      : `"${questionObj.question} sözcüğü cümle içinde anlam kazandı."`;

    // Modalı Göster
    this.infoModal.classList.add("active");
  }

  // Modalı Kapat ve Sıradaki Soruya Geç
  closeModalAndNextQuestion() {
    this.infoModal.classList.remove("active");
    this.loadNextQuestion();
  }

  // Seri Göstergesini Güncelle
  updateStreakDisplay() {
    this.streakNumber.textContent = this.streak;
  }

  // Dizi Karıştırma Yardımcısı (Fisher-Yates)
  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

// Uygulamayı Başlat
document.addEventListener("DOMContentLoaded", () => {
  window.gameApp = new WordGame();
});
