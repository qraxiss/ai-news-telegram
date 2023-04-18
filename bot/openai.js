require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI,
});
const openai = new OpenAIApi(configuration);




const base_messages = [
    { role: "user", content: "Merhaba, sana vereceğim kripto haberlerini değerlendirir misin?" },
    { role: "assistant", content: "Tabi nasıl bir yorumlama yapmamı istiyorsun?" },
    { role: "user", content: "Öncelikle, artık bu sohbetin formatı şöyle olacak" },
    {
        role: "user", content: `{
        "news": true or false,
        "ai": "<yorumum>" yazacağın ve senin fikrin olan her şeyi buraya yazacaksın.,
        "mark": <-10 ile 10 arasında haberin puanı> haberin puanını şöyle değerlendiriceksin eğer -10 ise haber negatif ve bu negatif etkisini şiddetli bir biçimde piyasaya yansıtıcak. 0'a yaklaştıkca negatifliğini koruyabilir ama piyasaya bir etkisi olmaz. eğer 10 ise çok şiddetli bir yükseliş bekleniyor, 5 ise olumlu haber piyasalarda yükselişe sebep olabilir, 3 piyasada aman aman bir etki yaratmaz ama ufak yükseliş hareketlerine neden olabilir.,
    }
    `},
    { role: "assistant", content: '{"news": false, "ai": "Tamam artık haber atsanda atmasanda konuşma bu formatta devam edecek.", "mark": 0}' },
    { role: "user", content: "Dediğim şeyi anlasanda anlamasanda her zaman yukarıdaki formatta göndermeni istiyorum. Eğer birşey diyeceksen yukarıdaki formatta de." },
    { role: "assistant", content: '{"news": false, "ai": "Tabi efendim, bundan sonra yazdığınız tüm mesajlara bu formatta dönüş yapacağım.", "mark": 0}' },
]

async function getOpinion(news) {
    messages = [...base_messages]
    messages.push({
        role: "user",
        content: news
    }
    );

    try {
        var completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
        })
        var msg = completion.data.choices[0].message.content
    } catch {
        var msg = "Bir hata oluştu. Lütfen tekrar deneyiniz."
    }

    try {
        var content = JSON.parse(msg);
    }
    catch {
        var content = { ai: msg, mark: 0, news: false }
    }

    result = {
        ...content,
    }

    return result
}

module.exports = {
    getOpinion
}
