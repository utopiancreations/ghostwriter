import argparse
import os
import json
import sys
from llm_handler import LLMHandler
from project_manager import ProjectManager
from prompts import (
    get_outline_prompt,
    get_interview_prompt,
    get_write_prompt,
    get_chat_system_prompt,
    get_write_from_chat_prompt,
)

def main():
    parser = argparse.ArgumentParser(description="A multi-phase ghostwriting tool using local LLMs.")
    parser.add_argument("--model", default="dolphin-llama3:8b", help="LLM model name (default: dolphin-llama3:8b)")
    parser.add_argument("--check-model", action="store_true", help="Check if the model is available before running")
    
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Outline command
    parser_outline = subparsers.add_parser("outline", help="Generate an outline from raw text.")
    parser_outline.add_argument("project_path", help="The path to the project directory.")

    # Interview command
    parser_interview = subparsers.add_parser("interview", help="Conduct an interview based on the outline.")
    parser_interview.add_argument("project_path", help="The path to the project directory.")

    # Write command
    parser_write = subparsers.add_parser("write", help="Write the draft from the outline and interview data.")
    parser_write.add_argument("project_path", help="The path to the project directory.")

    # Chat command
    parser_chat = subparsers.add_parser(
        "chat",
        help="Start an interactive conversation to create a story from scratch (or continue a prior chat).",
    )
    parser_chat.add_argument("project_path", help="The path to the project directory.")
    parser_chat.add_argument("--pov", choices=["first", "third"], help="Set narration POV for drafting.")
    parser_chat.add_argument("--tense", choices=["past", "present"], help="Preferred tense hint.")

    args = parser.parse_args()

    # Initialize LLM handler with specified model
    llm_handler = LLMHandler(model_name=args.model)
    
    # Check model availability if requested or if using default model
    if args.check_model or args.model == "dolphin-llama3:8b":
        print(f"Checking availability of model: {args.model}")
        if not llm_handler.check_model_availability():
            print(f"\nModel {args.model} is not available. Exiting.")
            sys.exit(1)

    project_manager = ProjectManager(args.project_path)

    if args.command == "outline":
        create_outline(project_manager, llm_handler)
    elif args.command == "interview":
        conduct_interview(project_manager, llm_handler)
    elif args.command == "write":
        write_draft(project_manager, llm_handler)
    elif args.command == "chat":
        start_chat(project_manager, llm_handler, pov=args.pov, tense=args.tense)

def create_outline(project_manager, llm_handler):
    print("Phase 1: Creating Outline...")
    try:
        raw_text = project_manager.load_raw_text()
    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("Please ensure you have a '00_raw_text.txt' file in your project directory.")
        return
        
    prompt = get_outline_prompt(raw_text)

    outline = llm_handler.get_completion(prompt)

    if outline:
        project_manager.save_outline(outline)
        print(f"Outline saved to {project_manager.outline_file}")
    else:
        print("Failed to generate an outline. Please check the LLM handler.")

def conduct_interview(project_manager, llm_handler):
    print("Phase 2: Conducting Interview...")
    try:
        outline = project_manager.load_outline()
    except FileNotFoundError:
        print("Outline not found. Please run the 'outline' command first.")
        return

    interview_data = project_manager.load_interview_data()

    outline_points = [line.strip() for line in outline.split('\n') if line.strip().startswith(('-', '*'))]

    if not outline_points:
        print("No outline points found. The outline might not be properly formatted.")
        print("Looking for lines starting with '-' or '*'")
        return

    for point in outline_points:
        # Check if this point has already been interviewed
        if any(item['outline_point'] == point for item in interview_data):
            print(f"Skipping already interviewed point: {point}")
            continue

        print(f"\nInterviewing for outline point: {point}")
        prompt = get_interview_prompt(point)
        questions_json = llm_handler.get_completion(prompt)

        if not questions_json:
            print("Failed to get questions from LLM. Skipping this point.")
            continue

        try:
            questions = json.loads(questions_json)
        except (json.JSONDecodeError, TypeError) as e:
            print(f"Failed to parse questions from LLM: {e}")
            print(f"Raw response: {questions_json}")
            print("Skipping this point.")
            continue

        if not isinstance(questions, list):
            print("Questions response is not a list. Skipping this point.")
            continue

        answers = []
        for question in questions:
            answer = input(f"{question} ")
            answers.append({"question": question, "answer": answer})

        # 'tell me more' loop
        while True:
            more_input = input("Anything else to add? (Or type 'done' to continue) ")
            if more_input.lower() == 'done':
                break
            answers.append({"question": "Tell me more", "answer": more_input})

        interview_data.append({
            "outline_point": point,
            "q_and_a": answers
        })
        project_manager.save_interview_data(interview_data)
        print("Saved progress.")

    print("\nInterview complete.")

def write_draft(project_manager, llm_handler):
    print("Phase 3: Writing Draft...")
    try:
        interview_data = project_manager.load_interview_data()
    except FileNotFoundError:
        print("Interview data not found. Please run the 'interview' command first.")
        return

    if not interview_data:
        print("No interview data to write from.")
        return

    for item in interview_data:
        outline_point = item['outline_point']
        q_and_a = item['q_and_a']

        q_and_a_block = "\n".join([f"Q: {qa['question']}\nA: {qa['answer']}" for qa in q_and_a])

        prompt = get_write_prompt(outline_point, q_and_a_block)

        scene = llm_handler.get_completion(prompt)

        if scene:
            project_manager.save_draft(f"## {outline_point}\n\n{scene}")
            print(f"Drafted scene for: {outline_point}")
        else:
            print(f"Failed to generate scene for: {outline_point}")

    print("\nDraft writing complete.")

def start_chat(project_manager: ProjectManager, llm_handler: LLMHandler, pov: str | None = None, tense: str | None = None):
    print("Interactive Story Chat — type /help for commands, /exit to quit.")
    # Load settings
    settings = project_manager.load_chat_settings()
    if pov:
        settings["pov"] = pov
    if tense:
        settings["tense"] = tense
    project_manager.save_chat_settings(settings)

    # Build initial messages from history, or start fresh with a system prompt
    history = project_manager.load_chat_history()
    messages = []
    if history:
        messages = history
    else:
        persona = settings.get("persona", {})
        messages = [
            {"role": "system", "content": get_chat_system_prompt(
                persona_name=persona.get("name", "Josh"),
                persona_desc=persona.get("description", ""),
                pov=settings.get("pov", "first"),
                tense=settings.get("tense", "past"),
            )},
            {
                "role": "assistant",
                "content": (
                    "Hi Josh — want to start with a vibe check? We can explore themes, settings, and a couple of"
                    " character seeds, or jump straight into writing a sample opening. What are you in the mood for?"
                ),
            },
        ]
        project_manager.save_chat_history(messages)

    # Print last assistant message if present
    if messages and messages[-1]["role"] == "assistant":
        print(messages[-1]["content"])

    def show_help():
        print("Commands:\n"
              "  /help           Show this help\n"
              "  /outline        Generate an outline from the conversation so far\n"
              "  /write          Draft a scene from the last part of the chat\n"
              "  /persona NAME:DESC  Set narrator persona name and description\n"
              "  /1p            Switch to first-person narration (I/me)\n"
              "  /3p            Switch to third-person narration (he/him)\n"
              "  /save           Save chat history\n"
              "  /exit           Quit chat mode\n")

    show_tip_once = True
    while True:
        try:
            user_input = input("> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nExiting chat.")
            break

        if not user_input:
            if show_tip_once:
                print("Tip: describe a feeling, a moment, or a character — I’ll ask sharp questions and riff ideas.")
                show_tip_once = False
            continue

        # Commands
        lower = user_input.lower()
        if lower == "/help":
            show_help()
            continue
        if lower == "/exit":
            print("Saving and exiting chat.")
            project_manager.save_chat_history(messages)
            break
        if lower == "/save":
            project_manager.save_chat_history(messages)
            print(f"Saved chat to {project_manager.chat_history_file}")
            continue
        if lower == "/1p":
            settings["pov"] = "first"
            project_manager.save_chat_settings(settings)
            print("POV set to first-person (I/me). New writing will use first person.")
            continue
        if lower == "/3p":
            settings["pov"] = "third"
            project_manager.save_chat_settings(settings)
            print("POV set to third-person (he/him). New writing will use third person.")
            continue
        if lower.startswith("/persona"):
            # Format: /persona Name:Description
            try:
                rest = user_input[len("/persona"):].strip()
                if rest:
                    if ":" in rest:
                        name, desc = rest.split(":", 1)
                    else:
                        name, desc = rest, ""
                    name = name.strip()
                    desc = desc.strip()
                    persona = settings.get("persona", {})
                    persona.update({"name": name or persona.get("name", "Josh"), "description": desc})
                    settings["persona"] = persona
                    project_manager.save_chat_settings(settings)
                    print(f"Persona set to {persona['name']}: {persona.get('description','')}")
                else:
                    persona = settings.get("persona", {})
                    print(f"Current persona — {persona.get('name','Josh')}: {persona.get('description','')}")
            except Exception as e:
                print(f"Failed to parse persona: {e}")
            continue
        if lower == "/outline":
            # Turn chat into outline
            # Concatenate recent messages content (excluding system) as source
            text = "\n\n".join(m["content"] for m in messages if m["role"] != "system")
            outline = llm_handler.get_completion(get_outline_prompt(text))
            if outline:
                project_manager.save_outline(outline)
                print(f"Outline saved to {project_manager.outline_file}")
            else:
                print("Failed to generate outline.")
            continue
        if lower == "/write":
            # Use the last ~6 messages as context to write a scene
            recent = messages[-12:] if len(messages) > 12 else messages[:]
            excerpt = "\n\n".join(
                ("User: " + m["content"]) if m["role"] == "user" else ("Assistant: " + m["content"]) if m["role"] == "assistant" else ""
                for m in recent if m["role"] in ("user", "assistant")
            )
            prompt = get_write_from_chat_prompt(excerpt, pov=settings.get("pov", "first"), tense=settings.get("tense", "past"))
            scene = llm_handler.get_completion(prompt)
            if scene:
                project_manager.save_draft(scene)
                print(f"Draft appended to {project_manager.draft_file}")
            else:
                print("Failed to write from chat context.")
            continue

        # Regular conversational turn
        messages.append({"role": "user", "content": user_input})
        project_manager.append_chat_messages({"role": "user", "content": user_input})

        reply = llm_handler.chat(messages)
        if reply:
            messages.append({"role": "assistant", "content": reply})
            project_manager.append_chat_messages({"role": "assistant", "content": reply})
            print(reply)
        else:
            print("(No reply — try again or /save)")

if __name__ == "__main__":
    main()
