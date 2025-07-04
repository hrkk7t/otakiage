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

// --- イベントリスナーの設定 ---
startButton.addEventListener('click', () => {
    if (bgmPlayer.paused) { bgmPlayer.play(); }
    changeScene('character-select-scene');
});

// ▼▼▼ この部分にクリックでスライドする機能を追加しました ▼▼▼
slides.forEach(slide => {
    slide.addEventListener('click', (event) => {
        // クリックされたスライドを中央にスムーズにスクロールさせる
        event.currentTarget.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
        });
    });
});
// ▲▲▲ 追加ここまで ▲▲▲

selectCharacterButton.addEventListener('click', () => {
    const containerCenter = carouselContainer.getBoundingClientRect().left + carouselContainer.offsetWidth / 2;
    let minDistance = Infinity;
    let centerSlide = null;

    slides.forEach(slide => {
        const slideRect = slide.getBoundingClientRect();
        const slideCenter = slideRect.left + slideRect.width / 2;
        const distance = Math.abs(containerCenter - slideCenter);

        if (distance < minDistance) {
            minDistance = distance;
            centerSlide = slide;
        }
    });

    if (centerSlide) {
        selectedCharacterId = centerSlide.dataset.character;
        inputTitle.textContent = `${characters[selectedCharacterId].name}に話す`;
        changeScene('input-scene');
    } else {
        alert("エラー：キャラクターを選択できませんでした。");
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