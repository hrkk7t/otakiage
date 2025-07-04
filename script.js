// --- DOM要素の取得 ---
const scenes = document.querySelectorAll('.scene');
const guchiTextarea = document.getElementById('guchi-textarea');
const responseArea = document.getElementById('response-area');
const inputTitle = document.getElementById('input-title');

// プレイヤー要素
const bgmPlayer = document.getElementById('bgm-player');
const sePlayer = document.getElementById('se-player');

// ボタン要素
const startButton = document.getElementById('start-button');
const characterButtons = document.querySelectorAll('.character-button');
const kuyoButton = document.getElementById('kuyo-button');
const endButton = document.getElementById('end-button');
const resetButton = document.getElementById('reset-button');

// --- グローバル変数 ---
let selectedCharacterId = null; // 選択されたキャラクターIDを保持

// --- セリフ集とキャラクター名 ---
const responses = {
    shijima: ["そうでしたか…あなたのその痛み、私がお預かりしますね。", "よく頑張りました。何も考えず、今はただ、心を休めなさい。", "大丈夫。あなたは一人ではありませんよ。"],
    raiden: ["喝！ そんな小言は燃してしまえ！ お前の道はそんなものに遮られん！", "うじうじするな！腹の底から声を出せ！悩みなんぞ吹き飛ぶわ！", "前だけを見ろ！下を向いている暇などないぞ！"],
    matabei: ["フン、人間とは難儀なものよのう。まあ、うまい飯でも食って忘れニャされ。", "そんなことより、明日のご飯のことでも考えな。ニャー。", "おぬしの悩み、この又兵衛が爪とぎにしてやろう。ガリガリ…。"]
};
const characterNames = {
    shijima: "慈愛の尼僧「静寂」",
    raiden: "破天荒な和尚「雷電」",
    matabei: "化け猫の古老「又兵衛」"
};

// --- 関数定義 ---
function changeScene(targetSceneId) {
    scenes.forEach(scene => scene.classList.toggle('active', scene.id === targetSceneId));
}

// --- イベントリスナーの設定 ---

// 0. タイトル画面 → キャラクター選択へ
startButton.addEventListener('click', () => {
    // BGMの再生はユーザーの初回アクション後に許可される
    if (bgmPlayer.paused) {
        bgmPlayer.play();
    }
    changeScene('character-select-scene');
});

// 1. キャラクター選択 → 愚痴の記入へ
characterButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        selectedCharacterId = event.target.dataset.character;
        inputTitle.textContent = `${characterNames[selectedCharacterId]}に話す`;
        changeScene('input-scene');
    });
});

// 2. 愚痴の記入 → お焚き上げへ
kuyoButton.addEventListener('click', () => {
    sePlayer.currentTime = 0;
    sePlayer.play();
    changeScene('fire-scene');
    
    // お焚き上げ中にAIからの言葉を準備
    const characterResponses = responses[selectedCharacterId];
    const randomIndex = Math.floor(Math.random() * characterResponses.length);
    const message = characterResponses[randomIndex];
    responseArea.innerHTML = `<p>「${message}」</p><p style="font-size:0.8em; text-align:right;">- ${characterNames[selectedCharacterId]} -</p>`;
    
    setTimeout(() => {
        sePlayer.pause();
        changeScene('response-scene');
    }, 4000); // GIFの長さに合わせて調整
});

// 4. AIからの言葉 → 終了画面へ
endButton.addEventListener('click', () => {
    changeScene('end-scene');
});

// 5. 終了画面 → タイトル画面へ（リセット）
resetButton.addEventListener('click', () => {
    guchiTextarea.value = '';
    selectedCharacterId = null;
    changeScene('title-scene');
});