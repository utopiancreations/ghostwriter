import requests
import json

class LLMHandler:
    def __init__(self, model_name="llama3", ollama_url="http://localhost:11434/api/generate"):
        self.model_name = model_name
        self.ollama_url = ollama_url

    def get_completion(self, prompt):
        """
        Sends a prompt to the local LLM and gets a completion.
        """
        headers = {"Content-Type": "application/json"}
        data = {
            "model": self.model_name,
            "prompt": prompt,
            "stream": False
        }

        try:
            response = requests.post(self.ollama_url, headers=headers, data=json.dumps(data))
            response.raise_for_status()  # Raise an exception for bad status codes

            response_json = response.json()
            return response_json.get("response", "").strip()

        except requests.exceptions.RequestException as e:
            print(f"Error connecting to Ollama: {e}")
            print("Please ensure Ollama is running and the model is available.")
            return None
