import {Telegraf , Markup}from 'telegraf'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()
const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
let counter =1, q='chatgpt',sources="",sortBy="publishedAt";

async function fetch_news(q,counter,sources,sortBy,ctx){
    try{const url = `https://newsapi.org/v2/everything?q=${q}&sources=${sources}&sortBy=${sortBy}from=2010-10-19&pageSize=4&page=${counter}&apiKey=ff6bb1cd70f24a40ba7c683e51e0a010`
    const response = await fetch(url)
    const data = await response.json();
    for (const element of data.articles){
        if(element.urlToImage)
        {
            await ctx.replyWithPhoto(`${element.urlToImage}`,
                                        {caption: `Source: ${element.source.name}\n`+
                                        `Author: ${element.author}\n`+
                                        `Title: ${element.title}\n`+
                                        `Read More: ${element.url}\n`})
        }
        else
        ctx.reply(`Source: ${element.source.name}\n`+
        `Author: ${element.author}\n`+
        `Title: ${element.title}\n`+
        `Read More: ${element.url}\n`)
    }
    ctx.reply(`This is page number: ${counter}\n`);
    if(counter!=1){ctx.reply("/next for next page\n");
                    ctx.reply("/prev for previous page\n")}
    else ctx.reply("/next for next page")
    }
    catch (error) {
        console.error('Error fetching news:', error.message);
        ctx.reply('An error occurred while fetching news. Please try again later.');
    }
    
}

//input command used when using for the first time
bot.start((ctx) => ctx.reply(`Welcome!\n\n`+
                            `Enter anything to search OR\n` +
                            `Use "/everything" for article discovery and analysis.\n\n`+
                            `"/next" for going to next page.\n\n`+
                            `"/prev" for going to previous page.\n\n`+
                            `The order to sort the articles in. Possible options:\n `+
                            `"/relevancy", "/popularity", "/publishedAt"`))


//Will have to give inputs as text
bot.command('everything',async (ctx) =>{
    counter = 1;
   await fetch_news(q,counter,sources,sortBy,ctx);
    });

//Next page
bot.command('next',async (ctx) =>{
    counter+=1;
    await fetch_news(q,counter,sources,sortBy,ctx);
    });

//Previous page
bot.command('prev',async (ctx) =>{
    if(counter>1)counter-=1 
    else counter=1;
    await fetch_news(q,counter,sources,sortBy,ctx);
    });
bot.command('relevancy',async (ctx)=>{
    sortBy="relevancy"
    await fetch_news(q,counter,sources,sortBy,ctx);
    ctx.reply("Articles sorted by: relevancy");
})
bot.command('popularity',async (ctx)=>{
    sortBy="popularity"
    await fetch_news(q,counter,sources,sortBy="popularity",ctx);
    ctx.reply("Articles sorted by: popularity");
})
bot.command('publishedAt',async (ctx)=>{
    sortBy="publishedAt"
    await fetch_news(q,counter,sources,sortBy="publishedAt",ctx);
    ctx.reply("Articles sorted by: publishedAt");
})
    bot.on('text',async (ctx) => {
        q = ctx.message.text;
        await fetch_news(q,counter,sources,sortBy,ctx);
        ctx.reply(`Your search is now based on: ${q}`);
    });
bot.on('sticker', (ctx)=>{ctx.reply("❤️❤️");})
bot.on('gif', (ctx)=>{ctx.reply("⛅️⛅️");})
bot.launch();