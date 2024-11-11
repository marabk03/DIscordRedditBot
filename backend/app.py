from flask import Flask, request, jsonify
import requests
import threading
import asyncio
import discord
from discord.ext import commands
from discord import app_commands
from discord.ext.commands import MissingPermissions
import io
from flask_cors import CORS
from settings import DISCORD_API_KEY

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")

intents = discord.Intents.all()
bot = commands.Bot(command_prefix = "!", intents=intents)

@app.route('/postdis', methods=['POST'])
def post():
    text = request.form.get("text")
    image = request.files.get("image")
    print("Image received:", image)

    target_channel = 1215460261784191020

    if image:
        image_data = image.read()
        discord_file = discord.File(io.BytesIO(image_data), filename=image.filename)
    else:
        discord_file = None

    async def send_message():
        channel = bot.get_channel(target_channel)
        if channel:
            if discord_file:
                await channel.send(content=text, file=discord_file)
            else:
                await channel.send(content=text)
            print("Posted to Discord!")  
            return True
        else:
            print("Invalid Discord channel ID")
            return False
        
    asyncio.run_coroutine_threadsafe(send_message(), bot.loop)
    
    return jsonify({"status": "Success", "message": "Data received"}), 200


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