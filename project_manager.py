import os
import json

class ProjectManager:
    def __init__(self, project_path):
        self.project_path = project_path
        self.raw_text_file = os.path.join(project_path, "00_raw_text.txt")
        # Conversational mode chat history (JSON array of messages)
        self.chat_history_file = os.path.join(project_path, "00_chat.json")
        self.outline_file = os.path.join(project_path, "01_outline.md")
        self.interview_data_file = os.path.join(project_path, "02_interview_data.json")
        self.draft_file = os.path.join(project_path, "03_draft.md")

    def _ensure_dir_exists(self):
        if not os.path.exists(self.project_path):
            os.makedirs(self.project_path)

    def load_raw_text(self):
        if not os.path.exists(self.raw_text_file):
            raise FileNotFoundError(f"Raw text file not found at: {self.raw_text_file}")
        with open(self.raw_text_file, 'r', encoding='utf-8') as f:
            return f.read()

    def save_outline(self, outline_content):
        self._ensure_dir_exists()
        with open(self.outline_file, 'w', encoding='utf-8') as f:
            f.write(outline_content)

    def load_outline(self):
        if not os.path.exists(self.outline_file):
            raise FileNotFoundError(f"Outline file not found at: {self.outline_file}")
        with open(self.outline_file, 'r', encoding='utf-8') as f:
            return f.read()

    def save_interview_data(self, data):
        self._ensure_dir_exists()
        with open(self.interview_data_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)

    def load_interview_data(self):
        if not os.path.exists(self.interview_data_file):
            return []
        with open(self.interview_data_file, 'r', encoding='utf-8') as f:
            return json.load(f)

    def save_draft(self, draft_content):
        self._ensure_dir_exists()
        with open(self.draft_file, 'a', encoding='utf-8') as f:
            f.write(draft_content + "\n\n")

    # --- Conversational mode helpers ---
    def load_chat_history(self):
        """Return chat history as a list of messages [{role, content}]."""
        if not os.path.exists(self.chat_history_file):
            return []
        with open(self.chat_history_file, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                if isinstance(data, list):
                    return data
                return []
            except json.JSONDecodeError:
                return []

    def save_chat_history(self, messages):
        """Persist full chat history list to disk."""
        self._ensure_dir_exists()
        with open(self.chat_history_file, 'w', encoding='utf-8') as f:
            json.dump(messages, f, ensure_ascii=False, indent=2)

    def append_chat_messages(self, new_messages):
        """Append one or more messages to chat history."""
        history = self.load_chat_history()
        if isinstance(new_messages, dict):
            history.append(new_messages)
        elif isinstance(new_messages, list):
            history.extend(new_messages)
        else:
            raise ValueError("new_messages must be dict or list")
        self.save_chat_history(history)
