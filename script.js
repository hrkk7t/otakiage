// --- DOM要素の取得 ---
const scenes = document.querySelectorAll('.scene');
const guchiTextarea = document.getElementById('guchi-textarea');
const inputTitle = document.getElementById('input-title');
const responseArea = document.getElementById('response-area');
const responseCharImage = document.getElementById('response-character-image');
const responseTextContainer = document.getElementById('response-text-container');

// カルーセル要素
const carouselTrack = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

// プレイヤー要素
const bgmPlayer = document.getElementById('bgm-player');
const sePlayer = document.getElementById('se-player');

// ボタン要素
const startButton = document.getElementById('start-button');
const selectCharacterButton = document.getElementById('select-character-button');
const kuyoButton = document.getElementById('kuyo-button');
const endButton = document.getElementById('end-button');
const resetButton = document.getElementById('reset-button');

// --- グローバル変数 ---
let selectedCharacterId = null;
let currentIndex = 0; // 現在中央にいるキャラクターの番号 (0, 1, 2)
const slideWidth = slides.length > 0 ? slides[0].offsetWidth : 0; // スライド1枚の幅

// --- キャラクター情報 ---
const characters = {
    shijima: { name: "慈愛の尼僧「静寂」", image: "shijima.png", responses: ["そうでしたか…あなたのその痛み、私がお預かりしますね。", "よく頑張りました。何も考えず、今はただ、心を休めなさい。", "大丈夫。あなたは一人ではありませんよ。"]},
    raiden: { name: "破天荒な和尚「雷電」", image: "raiden.png", responses: ["喝！ そんな小言は燃してしまえ！ お前の道はそんなものに遮られん！", "うじうじするな！腹の底から声を出せ！悩みなんぞ吹き飛ぶわ！", "前だけを見ろ！下を向いている暇などないぞ！"]},
    matabei: { name: "化け猫の古老「又兵衛」", image: "matabei.png", responses: ["フン、人間とは難儀なものよのう。まあ、うまい飯でも食って忘れニャされ。", "そんなことより、明日のご飯のことでも考えな。ニャー。", "おぬしの悩み、この又兵衛が爪とぎにしてやろう。ガリガリ…。"]}
};

// --- 関数定義 ---
function changeScene(targetSceneId) {
    scenes.forEach(scene => scene.classList.toggle('active', scene.id === targetSceneId));
}

// カルーセルを特定の位置に動かす関数
function goToSlide(index) {
    carouselTrack.style.transform = 'translateX(' + (-slideWidth * index) + 'px)';
}

// --- イベントリスナーの設定 ---
startButton.addEventListener('click', () => {
    if (bgmPlayer.paused) { bgmPlayer.play(); }
    changeScene('character-select-scene');
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length; // 次の番号へ (最後なら最初に戻る)
    goToSlide(currentIndex);
});

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length; // 前の番号へ (最初なら最後に戻る)
    goToSlide(currentIndex);
});

selectCharacterButton.addEventListener('click', () => {
    const currentSlide = slides[currentIndex];
    if (currentSlide) {
        selectedCharacterId = currentSlide.dataset.character;
        inputTitle.textContent = `${characters[selectedCharacterId].name}に話す`;
        changeScene('input-scene');
    }
});

kuyoButton.addEventListener('click', () => {
    sePlayer.currentTime = 0;
    sePlayer.play();
    changeScene('fire-scene');
    
    const character = characters[selectedCharacterId];
    const randomIndex = Math.floor(Math.random() * character.responses.length);
    const message = character.responses[randomIndex];
    
    responseCharImage.src = character.image;
    responseTextContainer.innerHTML = `<p>「${message}」</p><p style="font-size:0.8em; text-align:right;">- ${character.name} -</p>`;
    
    setTimeout(() => {
        sePlayer.pause();
        changeScene('response-scene');
    }, 4000);
});

endButton.addEventListener('click', () => {
    changeScene('end-scene');
});

resetButton.addEventListener('click', () => {
    guchiTextarea.value = '';
    selectedCharacterId = null;
    currentIndex = 0; // カルーセルの位置もリセット
    goToSlide(currentIndex);
    changeScene('title-scene');
});