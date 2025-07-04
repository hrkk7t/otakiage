// --- DOM要素の取得 ---
const scenes = document.querySelectorAll('.scene');
const guchiTextarea = document.getElementById('guchi-textarea');
const inputTitle = document.getElementById('input-title');
const responseArea = document.getElementById('response-area');
const responseCharImage = document.getElementById('response-character-image');
const responseTextContainer = document.getElementById('response-text-container');
const carouselContainer = document.querySelector('.carousel-container');
const slides = document.querySelectorAll('.carousel-slide');

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
let activeSlide = slides.length > 0 ? slides[0] : null;

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

function updateActiveSlide() {
    const containerCenter = carouselContainer.getBoundingClientRect().left + carouselContainer.offsetWidth / 2;
    let minDistance = Infinity;
    let currentActiveSlide = null;

    slides.forEach(slide => {
        const slideRect = slide.getBoundingClientRect();
        const slideCenter = slideRect.left + slideRect.width / 2;
        const distance = Math.abs(containerCenter - slideCenter);

        if (distance < minDistance) {
            minDistance = distance;
            currentActiveSlide = slide;
        }
    });

    if (currentActiveSlide && currentActiveSlide !== activeSlide) {
        if(activeSlide) activeSlide.classList.remove('active');
        currentActiveSlide.classList.add('active');
        activeSlide = currentActiveSlide;
    }
}

// --- イベントリスナーの設定 ---

// ▼▼▼ この部分を修正しました ▼▼▼
startButton.addEventListener('click', () => {
    if (bgmPlayer.paused) { bgmPlayer.play(); }
    changeScene('character-select-scene');
    
    // カルーセルの状態をリセットする
    // 1. スクロール位置を一番左に戻す
    carouselContainer.scrollLeft = 0;
    
    // 2. 全てのスライドから 'active' クラスを一旦削除
    slides.forEach(slide => slide.classList.remove('active'));
    
    // 3. 最初のスライド（静寂さん）にだけ 'active' クラスを再設定
    if (slides.length > 0) {
        slides[0].classList.add('active');
        activeSlide = slides[0];
    }
});
// ▲▲▲ 修正ここまで ▲▲▲

carouselContainer.addEventListener('scroll', updateActiveSlide);

window.addEventListener('DOMContentLoaded', () => {
    if(slides.length > 0) {
        slides[0].classList.add('active');
        activeSlide = slides[0];
    }
});

selectCharacterButton.addEventListener('click', () => {
    if (activeSlide) {
        selectedCharacterId = activeSlide.dataset.character;
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
    changeScene('title-scene');
});