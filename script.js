const textInput = document.getElementById('text-input');
const statsDiv = document.getElementById('stats');
const languageSelect = document.getElementById('language-select');
const clearBtn = document.getElementById('clear-btn');
const exportTextBtn = document.getElementById('export-text-btn');
const exportPdfBtn = document.getElementById('export-pdf-btn');
const pageTitle = document.getElementById('page-title');

const strings = {
    en: {
        title: 'Word Counter',
        placeholder: 'Type or paste text here...',
        clear: 'Clear',
        exportText: 'Export Text',
        exportPdf: 'Export PDF',
        words: 'Words',
        characters: 'Characters',
        paragraphs: 'Paragraphs',
        sentences: 'Sentences',
        unique: 'Unique Words',
        noSpaces: 'Characters without spaces',
        reading: 'Reading Time',
        speaking: 'Speaking Time',
    },
    zh: {
        title: '\u5b57\u6578\u7e3d\u8a08\u5668', // 字數統計器
        placeholder: '\u8acb\u8f38\u5165\u6216\u8cbc\u4e0a\u6587\u672c...', // 請輸入或貼上文本...
        clear: '\u6e05\u9664', // 清除
        exportText: '\u532f\u51fa\u6587\u5b57', // 匯出文字
        exportPdf: 'PDF\u532f\u51fa', // PDF匯出
        words: '\u8a5e\u6578', // 詞數
        characters: '\u5b57\u6578', // 字符數
        paragraphs: '\u6bb5\u843d\u6578', // 段落數
        sentences: '\u53e5\u6578', // 句數
        unique: '\u7368\u7279\u8a5e\u6578', // 獨特詞數
        noSpaces: '\u4e0d\u542b\u7a7a\u683c\u7684\u5b57\u6578', // 不含空格的字符數
        reading: '\u95b1\u8b80\u6642\u9593', // 閱讀時間
        speaking: '\u5c55\u8b1b\u6642\u9593', // 演講時間
    }
};

function updateStrings() {
    const lang = languageSelect.value;
    const s = strings[lang];
    pageTitle.textContent = s.title;
    textInput.placeholder = s.placeholder;
    clearBtn.textContent = s.clear;
    exportTextBtn.textContent = s.exportText;
    exportPdfBtn.textContent = s.exportPdf;
    updateStats();
}

function countWords(text, lang) {
    if (!text) return 0;
    if (lang === 'zh') {
        // Approximate: count Chinese characters excluding punctuation and spaces
        return (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    }
    // English or other: split by words
    return (text.trim().match(/\b\w+\b/g) || []).length;
}

function countUniqueWords(text, lang) {
    if (!text) return 0;
    if (lang === 'zh') {
        const words = (text.match(/[\u4e00-\u9fa5]/g) || []);
        return new Set(words).size;
    }
    const words = (text.trim().toLowerCase().match(/\b\w+\b/g) || []);
    return new Set(words).size;
}

function countCharacters(text) {
    return text.length;
}

function countCharactersNoSpaces(text) {
    return text.replace(/\s/g, '').length;
}

function countParagraphs(text) {
    if (!text.trim()) return 0;
    return text.split(/\n+/).length;
}

function countSentences(text) {
    if (!text.trim()) return 0;
    return (text.match(/[.!?\u3002\uff1f\uff01]+/g) || []).length;
}

function estimateReadingTime(words, lang) {
    const perMin = lang === 'zh' ? 250 : 220; // average reading speed
    const minutes = words / perMin;
    return formatTime(minutes);
}

function estimateSpeakingTime(words, lang) {
    const perMin = lang === 'zh' ? 200 : 140;
    const minutes = words / perMin;
    return formatTime(minutes);
}

function formatTime(minutes) {
    const totalSeconds = Math.round(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
}

function updateStats() {
    const text = textInput.value;
    const lang = languageSelect.value;
    const s = strings[lang];

    const words = countWords(text, lang);
    const characters = countCharacters(text);
    const paragraphs = countParagraphs(text);
    const sentences = countSentences(text);
    const unique = countUniqueWords(text, lang);
    const noSpaces = countCharactersNoSpaces(text);
    const reading = estimateReadingTime(lang === 'zh' ? characters : words, lang);
    const speaking = estimateSpeakingTime(lang === 'zh' ? characters : words, lang);

    statsDiv.innerHTML = `
        <div class="stat-grid">
            <div class="stat-item"><span class="stat-value">${words}</span><span class="stat-label">${s.words}</span></div>
            <div class="stat-item"><span class="stat-value">${characters}</span><span class="stat-label">${s.characters}</span></div>
            <div class="stat-item"><span class="stat-value">${paragraphs}</span><span class="stat-label">${s.paragraphs}</span></div>
            <div class="stat-item"><span class="stat-value">${sentences}</span><span class="stat-label">${s.sentences}</span></div>
            <div class="stat-item"><span class="stat-value">${unique}</span><span class="stat-label">${s.unique}</span></div>
            <div class="stat-item"><span class="stat-value">${noSpaces}</span><span class="stat-label">${s.noSpaces}</span></div>
            <div class="stat-item"><span class="stat-value">${reading}</span><span class="stat-label">${s.reading}</span></div>
            <div class="stat-item"><span class="stat-value">${speaking}</span><span class="stat-label">${s.speaking}</span></div>
        </div>
    `;
}

function exportText() {
    const lang = languageSelect.value;
    const text = statsDiv.innerText.replace(/\n/g, '\r\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'stats.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function exportPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const lines = statsDiv.innerText.split('\n');
    lines.forEach((line, idx) => {
        doc.text(line, 10, 10 + idx * 10);
    });
    doc.save('stats.pdf');
}

textInput.addEventListener('input', updateStats);
languageSelect.addEventListener('change', updateStrings);
clearBtn.addEventListener('click', () => {
    textInput.value = '';
    updateStats();
});
exportTextBtn.addEventListener('click', exportText);
exportPdfBtn.addEventListener('click', exportPdf);

updateStrings();
