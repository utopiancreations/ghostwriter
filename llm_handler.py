import requests
import json
import os

class LLMHandler:
    def __init__(self, model_name="dolphin-llama3:8b", ollama_url="http://localhost:11434/api/generate"):
        self.model_name = model_name
        self.ollama_url = ollama_url
        self.timeout = 300  # 5 minutes timeout for larger models

    def get_completion(self, prompt, max_retries=3):
        """
        Sends a prompt to the local LLM and gets a completion.
        Includes retry logic and better error handling for Llama 3.1:8b.
        """
        headers = {"Content-Type": "application/json"}
        data = {
            "model": self.model_name,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "top_p": 0.9,
                "num_ctx": 4096,  # Increase context window for better responses
                "repeat_penalty": 1.1
            }
        }

        for attempt in range(max_retries):
            try:
                print(f"Querying {self.model_name}... (attempt {attempt + 1}/{max_retries})")
                response = requests.post(
                    self.ollama_url, 
                    headers=headers, 
                    data=json.dumps(data),
                    timeout=self.timeout
                )
                response.raise_for_status()

                response_json = response.json()
                result = response_json.get("response", "").strip()
                
                if result:
                    return result
                else:
                    print(f"Empty response from model on attempt {attempt + 1}")
                    
            except requests.exceptions.Timeout:
                print(f"Request timed out on attempt {attempt + 1}")
            except requests.exceptions.RequestException as e:
                print(f"Error connecting to Ollama on attempt {attempt + 1}: {e}")
            except json.JSONDecodeError as e:
                print(f"Failed to parse JSON response on attempt {attempt + 1}: {e}")
            
            if attempt < max_retries - 1:
                print("Retrying...")

        print("All retry attempts failed.")
        print("Please ensure:")
        print(f"1. Ollama is running: ollama serve")
        print(f"2. Model is available: ollama pull {self.model_name}")
        print(f"3. Model is running: ollama run {self.model_name}")
        return None

    def check_model_availability(self):
        """
        Check if the specified model is available in Ollama.
        """
        try:
            # Use Ollama's tags API to check available models
            tags_url = "http://localhost:11434/api/tags"
            response = requests.get(tags_url, timeout=10)
            response.raise_for_status()
            
            models = response.json().get("models", [])
            available_models = [model["name"] for model in models]
            
            if self.model_name in available_models:
                print(f"✓ Model {self.model_name} is available")
                return True
            else:
                print(f"✗ Model {self.model_name} not found")
                print(f"Available models: {', '.join(available_models)}")
                print(f"To install: ollama pull {self.model_name}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"Error checking model availability: {e}")
            print("Please ensure Ollama is running: ollama serve")
            return False
