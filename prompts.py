def get_outline_prompt(raw_text_content):
    return f"""You are a developmental editor and story structure expert. Your task is to analyze the following unstructured text and organize it into a coherent narrative outline. Identify the key themes, main characters, pivotal events, and potential story arcs. Output your response as a Markdown-formatted outline. Use headings for chapters or major sections, and bullet points for key scenes or plot points within each section. Do not write any prose; only provide the outline.

Raw Text:
{raw_text_content}
"""

def get_interview_prompt(outline_point):
    return f"""You are an insightful interviewer helping an author flesh out their story. Based on the following outline point, generate a list of 3-5 open-ended questions to elicit sensory details, emotional depth, and character motivations. Your output must be a JSON array of strings. Example format: ["What did the room smell like?", "What was the character's primary emotion at that moment?"]

Outline Point: {outline_point}
"""

def get_write_prompt(outline_point, q_and_a_block):
    return f"""You are a master ghostwriter. Your task is to write a compelling narrative scene. Use the following information to craft a rich and engaging piece of prose.

Main goal of this scene (from outline): {outline_point}
Author's detailed notes (from interview): {q_and_a_block}

Weave this information together into a seamless narrative. Focus on showing, not telling. Do not break character or add any commentary outside of the story itself.
"""
