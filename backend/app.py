from flask import Flask, request, jsonify
import threading
import asyncio
import discord
from discord.ext import commands
import io
from flask_cors import CORS
from settings import DISCORD_API_KEY, reddit
import praw
import tempfile  
import os        

app = Flask(__name__)
CORS(app, origins='http://localhost:5173')  

intents = discord.Intents.all()
bot = commands.Bot(command_prefix='!', intents=intents)
target_channel = 1306364882001596497
subreddit = reddit.subreddit('pitbulls')

def convert_image(image):
    image_data = image.read()
    formatted_image = io.BytesIO(image_data)
    return formatted_image

@app.route('/post', methods=['POST'])
def post():
    try:
        text = request.form.get('text')
        image = request.files.get('image')
        discord_post = request.form.get('discord') == 'true'
        reddit_post = request.form.get('reddit') == 'true'
        reddit_format = request.form.get('redditFormat', None)
        reddit_title = request.form.get('redditTitle', None)

        if image:
            image_data = image.read()
            discord_image = discord.File(io.BytesIO(image_data), filename=image.filename)
            reddit_image = io.BytesIO(image_data)
        else:
            discord_image = None
            reddit_image = None 

        if discord_post:    
            asyncio.run_coroutine_threadsafe(discord_send_message(text, discord_image), bot.loop)
        if reddit_post:
            reddit_send_message(reddit_title, reddit_format, text, reddit_image)

        return jsonify({'status': 'Success', 'message': 'Data received'}), 200
    except Exception as e:
        print(f'Error in /postdis endpoint: {e}')
        return jsonify({'status': 'Failure', 'message': str(e)}), 500

async def discord_send_message(text, discord_file):
    channel = bot.get_channel(target_channel)
    if channel:
        if discord_file:
            await channel.send(content=text, file=discord_file)
        else:
            await channel.send(content=text)
    else:
        print('Invalid Discord channel ID')

def reddit_send_message(reddit_title, reddit_format, text, image_file):
    try:
        if reddit_format == 'text':
            post = subreddit.submit(reddit_title, selftext=text)
            print('Text post submitted successfully!')
            print(f'Post URL: {post.url}')
        elif reddit_format == 'image' and image_file:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_file:
                temp_file.write(image_file.read())
                temp_file_path = temp_file.name
            try:
                post = subreddit.submit_image(reddit_title, image_path=temp_file_path)
                print('Image post submitted successfully!')
                print(f'Post URL: {post.url}')
            finally:
                os.remove(temp_file_path)
    except Exception as e:
        print(f'An error occurred while posting to Reddit: {e}')

@bot.event
async def on_ready():
    print(f'{bot.user} has connected to Discord!')  
    
def run_discord_bot():
    bot.run(DISCORD_API_KEY) 

def run_flask():
    app.run(port=8000)

if __name__ == '__main__':
    flask_thread = threading.Thread(target=run_flask)
    flask_thread.start()
    run_discord_bot()
