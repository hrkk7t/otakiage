// Gemini APIと通信するための関数
async function callGeminiAPI(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            maxOutputTokens: 150, // 返答の長さを制限
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// Netlify Functionのメイン処理
exports.handler = async function(event) {
    // POSTリクエスト以外は弾く
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { guchi, characterId, characterName } = JSON.parse(event.body);

        // キャラクターの性格設定
        let persona = "";
        if (characterId === 'shijima') {
            persona = "あなたは慈愛に満ちた尼僧です。常に穏やかで、相手の苦しみに深く寄り添い、全てを包み込むような、短く優しい言葉をかけてください。";
        } else if (characterId === 'raiden') {
            persona = "あなたは型破りで豪快な和尚です。悩みを吹き飛ばすような、力強く、時には厳しい言葉で相手を叱咤激励してください。「喝！」などを使っても構いません。簡潔に答えてください。";
        } else {
            persona = "あなたは何百年も生きた化け猫の古老です。人間社会を達観しており、少し皮肉屋で面倒くさがりな口調で、悩みを軽くあしらうように、簡潔な言葉を返してください。語尾に「ニャ」などを付けても構いません。";
        }
        
        // AIに渡す最終的な指示（プロンプト）
        const prompt = `${persona}\n\n相談者の悩みは「${guchi}」です。この悩みに対して、あなたらしい言葉を返してください。`;

        // Gemini APIを呼び出し
        const aiReply = await callGeminiAPI(prompt);

        // フロントエンドにAIの返事を返す
        return {
            statusCode: 200,
            body: JSON.stringify({ reply: aiReply.trim() })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'AIからの返答の取得に失敗しました。' })
        };
    }
};