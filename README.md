# Ghostwriter - AI-Powered Story Development Tool

A multi-phase ghostwriting tool that uses Dolphin Llama3:8b (uncensored) to help authors develop their stories through structured outlining, interviewing, and drafting.

## Features

- **Phase 1: Outline Generation** - Converts raw text into structured story outlines
- **Phase 2: Interactive Interview** - Conducts guided interviews to flesh out story details
- **Phase 3: Draft Writing** - Generates narrative scenes from outline and interview data
- **Uncensored Model** - Uses Dolphin Llama3:8b for authentic creative writing without content restrictions
- **Resume Capability** - Can resume work from any phase
- **Local Processing** - All AI processing happens locally via Ollama

## Prerequisites

1. **Ollama** installed and running
2. **Dolphin Llama3:8b model** pulled
3. **Python 3.7+** with requests library

## Quick Setup

1. **Install Ollama** (if not already installed):
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Start Ollama**:
   ```bash
   ollama serve
   ```

3. **Pull Dolphin Llama3:8b** (uncensored model):
   ```bash
   ollama pull dolphin-llama3:8b
   ```

4. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Run setup script** (optional - automates above steps):
   ```bash
   python setup.py
   ```

## Usage

### Basic Workflow

1. **Create a project directory** with your raw text:
   ```bash
   mkdir my_story
   echo "Your raw story material here..." > my_story/00_raw_text.txt
   ```

2. **Generate an outline**:
   ```bash
   python ghostwriter.py outline my_story
   ```

3. **Conduct interviews**:
   ```bash
   python ghostwriter.py interview my_story
   ```

4. **Write the draft**:
   ```bash
   python ghostwriter.py write my_story
   ```

### Advanced Options

- **Use a different model**:
  ```bash
  python ghostwriter.py --model llama3.1:8b outline my_story
  ```

- **Check model availability**:
  ```bash
  python ghostwriter.py --check-model outline my_story
  ```

### Project Structure

Your project directory will contain:
```
my_story/
├── 00_raw_text.txt      # Your original material (you create this)
├── 01_outline.md        # Generated outline
├── 02_interview_data.json # Interview Q&A data
└── 03_draft.md          # Final draft
```

## How It Works

### Phase 1: Outline Generation
- Analyzes your raw text material
- Identifies key themes, characters, and events
- Creates a structured Markdown outline
- Uses Llama 3.1:8b's understanding to organize narrative flow

### Phase 2: Interactive Interview
- Generates thoughtful questions for each outline point
- Prompts you for sensory details, emotions, and motivations
- Saves all responses for use in drafting
- Allows for "tell me more" follow-ups

### Phase 3: Draft Writing
- Combines outline structure with interview details
- Generates compelling narrative scenes
- Focuses on "show, don't tell" storytelling
- Creates cohesive prose from your input

## Troubleshooting

### Common Issues

1. **"Model not found" error**:
   ```bash
   ollama pull llama3.1:8b
   ```

2. **Connection refused**:
   ```bash
   ollama serve
   ```

3. **Empty responses from model**:
   - Check if model is running: `ollama list`
   - Try running the model directly: `ollama run llama3.1:8b`

4. **JSON parsing errors in interview phase**:
   - The script will automatically retry
   - Check that Llama 3.1:8b is properly loaded

### Performance Tips

- **Memory**: Llama 3.1:8b requires ~8GB RAM
- **Speed**: First response may be slow as model loads
- **Context**: Larger context windows work better for longer texts

## Customization

### Prompt Engineering
Edit `prompts.py` to customize:
- Outline generation style
- Interview question types  
- Writing tone and style

### Model Parameters
Modify `llm_handler.py` to adjust:
- Temperature (creativity)
- Top-p (randomness)
- Context window size
- Repeat penalty

## Contributing

Feel free to submit issues and pull requests to improve the tool.

## License

Open source - feel free to modify and distribute.