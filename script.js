// --- DOM要素の取得 ---
const scenes = document.querySelectorAll('.scene');
const guchiTextarea = document.getElementById('guchi-textarea');
const inputTitle = document.getElementById('input-title');
const responseArea = document.getElementById('response-area');
const responseCharImage = document.getElementById('response-character-image');
const responseTextContainer = document.getElementById('response-text-container');
const carouselTrack = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const bgmPlayer = document.getElementById('bgm-player');
const sePlayer = document.getElementById('se-player');
const startButton = document.getElementById('start-button');
const selectCharacterButton = document.getElementById('select-character-button');
const kuyoButton = document.getElementById('kuyo-button');
const endButton = document.getElementById('end-button');
const resetButton = document.getElementById('reset-button');

// --- グローバル変数 ---
let selectedCharacterId = null;
let currentIndex = 0;
let slideWidth = 0;

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

// ▼▼▼ この関数に、activeクラスを管理する処理を追加 ▼▼▼
function goToSlide(index) {
    if (slideWidth === 0 && slides.length > 0) {
        slideWidth = slides[0].offsetWidth;
    }
    // カルーセルを動かす
    carouselTrack.style.transform = 'translateX(' + (-slideWidth * index) + 'px)';

    // 全てのスライドからactiveクラスを削除
    slides.forEach(slide => slide.classList.remove('active'));
    // 中央のスライドにだけactiveクラスを追加
    slides[index].classList.add('active');
}

// --- イベントリスナーの設定 ---
startButton.addEventListener('click', () => {
    if (bgmPlayer.paused) { bgmPlayer.play(); }
    changeScene('character-select-scene');
    if (slideWidth === 0 && slides.length > 0) {
        slideWidth = slides[0].offsetWidth;
    }
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    goToSlide(currentIndex);
});

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
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

// ▼▼▼ ページ読み込み完了時に最初の状態を設定するリスナーを追加 ▼▼▼
window.addEventListener('DOMContentLoaded', () => {
    goToSlide(0);
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
    currentIndex = 0;
    goToSlide(currentIndex);
    changeScene('title-scene');
});