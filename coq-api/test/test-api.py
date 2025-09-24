from dotenv import load_dotenv
from openai import OpenAI
import os
from pathlib import Path

load_dotenv(dotenv_path=Path(".env.local"))  # take environment variables from .env.local

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

response = client.responses.create(
  model="gpt-5-nano",
  input="how many continents are there on earth?",
  store=True,
)

print(response.output_text);
