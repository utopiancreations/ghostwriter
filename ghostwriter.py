import argparse
import os
import json
import sys
from llm_handler import LLMHandler
from project_manager import ProjectManager
from prompts import get_outline_prompt, get_interview_prompt, get_write_prompt

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

if __name__ == "__main__":
    main()
