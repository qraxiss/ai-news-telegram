const { getOpinion } = require('.././openai.js')

var run = false

var wait = {
    start: async function (bot, old_message, message_id, chat_id) {
        run = true
        while (run){
            for(i=2;i<=10;i++){
                if (!run){
                    break;
                }
                loading_bar = `${"🟩".repeat(i)}${"⬜️".repeat(10 - i)}`
                await bot.editMessageText(`${old_message}\n\n${loading_bar}`, {
                    chat_id: chat_id,
                    message_id: message_id,
                    parse_mode: "markdown"
                });
            }
            for(i=9;i>=1;i--){
                if (!run){
                    break;
                }
                loading_bar = `${"🟩".repeat(i)}${"⬜️".repeat(10 - i)}`
                await bot.editMessageText(`${old_message}\n\n${loading_bar}`, {
                    chat_id: chat_id,
                    message_id: message_id,
                    parse_mode: "markdown"
                });
            }
        }
    },
    stop: function () {
        run = false
    },
}

function opinion(bot) {
    bot.onText(/\/yorumla (.+)/, async (msg, match) => {
        // 'match' is the result of executing the regexp above on the text content (/yorumla)
        // of the message

        const chatId = msg.chat.id;
        const news = match[1]; // the captured "whatever"

        var msg = `⚠️⚠️*Lütfen bu yorumun yapay zeka tarafından yapıldığını, güncel verilere erişemediğini yatırım kararlarınızı verirken göz önünde bulundurun.*⚠️⚠️\n\n_📰: ${news}_`

        var first_msg
        await bot.sendMessage(chatId, `${msg}\n\n${"🟩".repeat(1)}${"⬜️".repeat(9)}`, {
            parse_mode: 'MARKDOWN'
        }).then((msg) => {
            first_msg = msg
        });

        var res
        wait.start(bot, msg, first_msg.message_id, chatId)
        await getOpinion(news).then(async(res_)=>{
            res = res_
            wait.stop()
        })

        res.ai = `_🤖: ${res.ai}_`

        if (res.news == true) {
            if (res.mark > 0) {
                mark = `${"🟩".repeat(res.mark)}${"⬜️".repeat(10 - res.mark)}`
            } else {
                mark = `${"🟥".repeat(-res.mark)}${"⬜️".repeat(res.mark + 10)}`
            }

            edit = `${res.ai}\n\n${mark}`
        }
        else {
            edit = res.ai
        }

        // send back the matched "whatever" to the chat

        bot.editMessageText(`${msg}\n\n${edit}`, {
            chat_id: chatId,
            message_id: first_msg.message_id,
            parse_mode: "markdown"
        });
    });
}



module.exports = {
    opinion
}