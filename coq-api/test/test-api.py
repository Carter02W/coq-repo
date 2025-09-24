from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()  # take environment variables from .env.local

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

response = client.responses.create(
  model="gpt-5-nano",
  input="write a haiku about ai",
  store=True,
)

print(response.output_text);
