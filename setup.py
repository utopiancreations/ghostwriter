#!/usr/bin/env python3
"""
Setup script for Ghostwriter - helps ensure Ollama and Llama 3.1:8b are ready
"""

import subprocess
import sys
import os
import requests
import time

def run_command(command, description, check_output=False):
    """Run a shell command and handle errors."""
    print(f"\n{description}...")
    try:
        if check_output:
            result = subprocess.run(command, shell=True, capture_output=True, text=True)
            return result.stdout.strip()
        else:
            subprocess.run(command, shell=True, check=True)
        print("✓ Success")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed: {e}")
        return False

def check_ollama_running():
    """Check if Ollama is running."""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        return response.status_code == 200
    except:
        return False

def main():
    print("Ghostwriter Setup for Llama 3.1:8b")
    print("=" * 40)
    
    # Check if Ollama is installed
    print("\n1. Checking Ollama installation...")
    ollama_check = run_command("which ollama", "Checking if Ollama is installed", check_output=True)
    
    if not ollama_check:
        print("Ollama not found. Please install Ollama first:")
        print("Visit: https://ollama.ai/download")
        print("Or use: curl -fsSL https://ollama.ai/install.sh | sh")
        sys.exit(1)
    
    # Check if Ollama is running
    print("\n2. Checking if Ollama is running...")
    if not check_ollama_running():
        print("Ollama is not running. Starting Ollama server...")
        print("Starting 'ollama serve' in background...")
        
        # Start Ollama in background
        try:
            subprocess.Popen(["ollama", "serve"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print("Waiting for Ollama to start...")
            time.sleep(5)
            
            if check_ollama_running():
                print("✓ Ollama is now running")
            else:
                print("✗ Failed to start Ollama automatically")
                print("Please run 'ollama serve' in another terminal")
                sys.exit(1)
        except Exception as e:
            print(f"✗ Error starting Ollama: {e}")
            print("Please run 'ollama serve' in another terminal")
            sys.exit(1)
    else:
        print("✓ Ollama is running")
    
    # Pull Llama 3.1:8b model
    print("\n3. Checking Llama 3.1:8b model...")
    model_check = run_command("ollama list | grep llama3.1:8b", "Checking if model is available", check_output=True)
    
    if not model_check:
        print("Llama 3.1:8b not found. Pulling model...")
        print("This may take several minutes...")
        if not run_command("ollama pull llama3.1:8b", "Pulling Llama 3.1:8b model"):
            print("Failed to pull model. Please check your internet connection.")
            sys.exit(1)
    else:
        print("✓ Llama 3.1:8b is available")
    
    # Install Python dependencies
    print("\n4. Installing Python dependencies...")
    if not run_command("pip install -r requirements.txt", "Installing requirements"):
        print("Failed to install requirements. Please check pip installation.")
        sys.exit(1)
    
    # Test the connection
    print("\n5. Testing connection...")
    from llm_handler import LLMHandler
    
    llm = LLMHandler()
    if llm.check_model_availability():
        print("✓ All systems ready!")
        print("\nYou can now use Ghostwriter:")
        print("  python ghostwriter.py outline my_story")
        print("  python ghostwriter.py interview my_story") 
        print("  python ghostwriter.py write my_story")
    else:
        print("✗ Setup incomplete. Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()