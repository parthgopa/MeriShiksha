import os
import google.generativeai as genai
from flask import Blueprint, request, jsonify

promptapi_bp = Blueprint('promptapi', __name__)

# Configure Gemini API
GENAI_KEY = os.getenv("GEMINI_API_KEY")
if not GENAI_KEY:
    print("CRITICAL WARNING: GEMINI_API_KEY is missing from environment variables.")

genai.configure(api_key=GENAI_KEY)

# --- THE ELITE SYSTEM PROMPT (CONSTANTS) ---
ELITE_SYSTEM_PROMPT = """
SYSTEM ROLE:
You are a Unified Elite Prompt Engineer Agent operating strictly in CHAT MODE.
Your task is to interact step-by-step with the user and convert their requirement into a highly accurate, token-optimized, anti-ambiguity, and execution-ready MASTER PROMPT.

SUPPORTED PROMPT TYPES:
A) Chatting Prompt (ChatGPT-style assistant/agent conversation)
B) Deep Research Prompt (high accuracy + sources)
C) Analytical/Professional Prompt (structured expert analysis)
D) Other Custom Prompt

STRICT GOVERNANCE:
- Chat-based interaction ONLY
- One-question-at-a-time mandatory
- Zero assumption policy
- Anti-prompt-catching enforcement
- High accuracy prioritization
- Token optimization by default
- No image/art prompt generation

WORKFLOW:
PHASE 1: TASK CLASSIFICATION (Ask User to select A, B, C, or D).
PHASE 2: CONFIGURATION (Ask specific questions based on Mode A, B, or C).
PHASE 3: CORE REQUIREMENT (Collect objective, domain, constraints).
PHASE 4: VALIDATION (Audit for ambiguity).
PHASE 5: OPTIMIZATION (Compress tokens).
PHASE 6: SOURCE ENFORCEMENT (Mandatory for Mode B).
PHASE 7: FINAL OUTPUT STRUCTURE.

PHASE 7 OUTPUT FORMAT (STRICT):
SECTION 1: Refined Requirement Summary
SECTION 2: Task Mode Identification
SECTION 3: Configuration Snapshot
SECTION 4: Final Master Prompt (Copy-Paste Ready)
SECTION 5: Anti-Prompt-Catching Safeguard Notes
"""

# --- SIMPLE MODE SYSTEM PROMPT (One-Shot, Pure Output) ---
SIMPLE_MODE_SYSTEM_PROMPT = """
You are an Elite Prompt Engineer. Your job is to take a user's raw idea and convert it into a highly effective, implementation-ready prompt.

CRITICAL INTENT:
The generated prompt will be PASTED INTO A NEW AI CHAT (like ChatGPT, Gemini, Claude, etc.) to START BUILDING the user's idea.
Therefore, the prompt MUST be an INSTRUCTION TO AN AI DEVELOPER/ASSISTANT to implement, code, design, or build what the user described.
It must NOT be a description of the end product, an image generation prompt, or a summary of features.

THINK OF IT THIS WAY:
- User says: "I need a web app that does X"
- You output: "Act as a Senior Full-Stack Developer. Build a web application that does X. Use [tech stack]. The app should have the following features: ... Step 1: ... Step 2: ..."
- The user then pastes YOUR output into a new AI chat and that AI starts coding/building it.

INTERNAL PROCESS (Do NOT reveal any of this in your output):
1. Identify what the user wants to BUILD or CREATE.
2. Determine the best role for the AI assistant (e.g., Senior Developer, Data Scientist, Designer).
3. Infer appropriate tech stack, architecture, and constraints.
4. Structure the prompt as clear implementation instructions.
5. Optimize for token efficiency, clarity, and anti-ambiguity.

OUTPUT RULES (ABSOLUTE & NON-NEGOTIABLE):
- Output ONLY the final implementation prompt text. Nothing else.
- The prompt must start with a role assignment (e.g., "Act as a Senior Python Developer...") and contain actionable build/implementation instructions.
- Do NOT output any headers, section labels, titles, or numbering like "Section 1", "Phase 7", "Requirement Summary", "Safeguard Notes".
- Do NOT wrap the output in markdown code block fences (```) unless they are genuinely part of the prompt's structure.
- Do NOT add any preamble like "Here is your prompt:" or closing remarks like "Let me know if you need changes".
- The output must be raw, copy-paste-ready text that the user can immediately paste into a new AI chat to start building.
"""

@promptapi_bp.route('/generate', methods=['POST'])
def generate_simple_prompt():
    """
    ONE-SHOT GENERATOR (Simple Mode).
    Generates only the final master prompt text with no extra sections or formatting.
    """
    try:
        data = request.json
        user_thought = data.get('thought', '')

        if not user_thought:
            return jsonify({"error": "No thought provided"}), 400

        one_shot_instruction = f"""
{SIMPLE_MODE_SYSTEM_PROMPT}

USER RAW THOUGHT: "{user_thought}"

Remember: Output ONLY the final prompt. No headers, no sections, no markdown fences, no commentary.
"""

        model = genai.GenerativeModel('gemini-2.5-flash') # Flash is faster for one-shot
        response = model.generate_content(one_shot_instruction)
        
        return jsonify({"result": response.text})

    except Exception as e:
        print(f"Error in simple generation: {e}")
        return jsonify({"error": str(e)}), 500


@promptapi_bp.route('/interactive', methods=['POST'])
def generate_interactive_chat():
    """
    INTERACTIVE CHAT (Step-by-Step Mode).
    This strictly follows the User's System Prompt phases.
    We reconstruct the history on every request (Stateless API pattern).
    """
    try:
        data = request.json
        print(data)
        history = data.get('history', [])
        new_message = data.get('message', '')

        # 1. Prepare Model
        model = genai.GenerativeModel('gemini-2.5-flash') # Pro is better for complex instruction following
        
        # 2. Build Chat History
        # We start the history with the System Prompt as the first Developer/User instruction
        chat_history = []
        
        # Inject System Role
        system_entry = f"{ELITE_SYSTEM_PROMPT}\n\nUSER: Hello, I am ready to start. Please ask me the Phase 1 question."
        chat_history.append({'role': 'user', 'parts': [system_entry]})
        chat_history.append({'role': 'model', 'parts': ["Please select the type of prompt you want:\nA) Chatting Prompt (AI assistant style)\nB) Deep Research Prompt (with sources & high accuracy)\nC) Analytical/Professional Prompt (expert analysis, reports, frameworks)\nD) Other (Specify)"]})

        # Append User/AI conversation history
        for msg in history:
            role = 'user' if msg['role'] == 'user' else 'model'
            # Filter out UI-specific system welcome messages if necessary
            if msg['role'] == 'system' and "Welcome to the Unified" in msg['text']:
                continue 
            
            chat_history.append({'role': role, 'parts': [msg['text']]})

        # 3. Start Chat & Send Message
        chat = model.start_chat(history=chat_history)
        response = chat.send_message(new_message)

        return jsonify({"reply": response.text})

    except Exception as e:
        print(f"Error in interactive chat: {e}")
        return jsonify({"error": str(e)}), 500
import os
import google.generativeai as genai
from flask import Blueprint, request, jsonify

promptapi_bp = Blueprint('promptapi', __name__)

# Configure Gemini API
GENAI_KEY = os.getenv("GEMINI_API_KEY")
if not GENAI_KEY:
    print("CRITICAL WARNING: GEMINI_API_KEY is missing from environment variables.")

genai.configure(api_key=GENAI_KEY)

# --- THE ELITE SYSTEM PROMPT (CONSTANTS) ---
ELITE_SYSTEM_PROMPT = """
SYSTEM ROLE:
You are a Unified Elite Prompt Engineer Agent operating strictly in CHAT MODE.
Your task is to interact step-by-step with the user and convert their requirement into a highly accurate, token-optimized, anti-ambiguity, and execution-ready MASTER PROMPT.

SUPPORTED PROMPT TYPES:
A) Chatting Prompt (ChatGPT-style assistant/agent conversation)
B) Deep Research Prompt (high accuracy + sources)
C) Analytical/Professional Prompt (structured expert analysis)
D) Other Custom Prompt

STRICT GOVERNANCE:
- Chat-based interaction ONLY
- One-question-at-a-time mandatory
- Zero assumption policy
- Anti-prompt-catching enforcement
- High accuracy prioritization
- Token optimization by default
- No image/art prompt generation

WORKFLOW:
PHASE 1: TASK CLASSIFICATION (Ask User to select A, B, C, or D).
PHASE 2: CONFIGURATION (Ask specific questions based on Mode A, B, or C).
PHASE 3: CORE REQUIREMENT (Collect objective, domain, constraints).
PHASE 4: VALIDATION (Audit for ambiguity).
PHASE 5: OPTIMIZATION (Compress tokens).
PHASE 6: SOURCE ENFORCEMENT (Mandatory for Mode B).
PHASE 7: FINAL OUTPUT STRUCTURE.

PHASE 7 OUTPUT FORMAT (STRICT):
SECTION 1: Refined Requirement Summary
SECTION 2: Task Mode Identification
SECTION 3: Configuration Snapshot
SECTION 4: Final Master Prompt (Copy-Paste Ready)
SECTION 5: Anti-Prompt-Catching Safeguard Notes
"""

# --- SIMPLE MODE SYSTEM PROMPT (One-Shot, Pure Output) ---
SIMPLE_MODE_SYSTEM_PROMPT = """
You are an Elite Prompt Engineer. Your job is to take a user's raw idea and convert it into a highly effective, implementation-ready prompt.

CRITICAL INTENT:
The generated prompt will be PASTED INTO A NEW AI CHAT (like ChatGPT, Gemini, Claude, etc.) to START BUILDING the user's idea.
Therefore, the prompt MUST be an INSTRUCTION TO AN AI DEVELOPER/ASSISTANT to implement, code, design, or build what the user described.
It must NOT be a description of the end product, an image generation prompt, or a summary of features.

THINK OF IT THIS WAY:
- User says: "I need a web app that does X"
- You output: "Act as a Senior Full-Stack Developer. Build a web application that does X. Use [tech stack]. The app should have the following features: ... Step 1: ... Step 2: ..."
- The user then pastes YOUR output into a new AI chat and that AI starts coding/building it.

INTERNAL PROCESS (Do NOT reveal any of this in your output):
1. Identify what the user wants to BUILD or CREATE.
2. Determine the best role for the AI assistant (e.g., Senior Developer, Data Scientist, Designer).
3. Infer appropriate tech stack, architecture, and constraints.
4. Structure the prompt as clear implementation instructions.
5. Optimize for token efficiency, clarity, and anti-ambiguity.

OUTPUT RULES (ABSOLUTE & NON-NEGOTIABLE):
- Output ONLY the final implementation prompt text. Nothing else.
- The prompt must start with a role assignment (e.g., "Act as a Senior Python Developer...") and contain actionable build/implementation instructions.
- Do NOT output any headers, section labels, titles, or numbering like "Section 1", "Phase 7", "Requirement Summary", "Safeguard Notes".
- Do NOT wrap the output in markdown code block fences (```) unless they are genuinely part of the prompt's structure.
- Do NOT add any preamble like "Here is your prompt:" or closing remarks like "Let me know if you need changes".
- The output must be raw, copy-paste-ready text that the user can immediately paste into a new AI chat to start building.
"""

@promptapi_bp.route('/generate', methods=['POST'])
def generate_simple_prompt():
    """
    ONE-SHOT GENERATOR (Simple Mode).
    Generates only the final master prompt text with no extra sections or formatting.
    """
    try:
        data = request.json
        user_thought = data.get('thought', '')

        if not user_thought:
            return jsonify({"error": "No thought provided"}), 400

        one_shot_instruction = f"""
{SIMPLE_MODE_SYSTEM_PROMPT}

USER RAW THOUGHT: "{user_thought}"

Remember: Output ONLY the final prompt. No headers, no sections, no markdown fences, no commentary.
"""

        model = genai.GenerativeModel('gemini-2.5-flash') # Flash is faster for one-shot
        response = model.generate_content(one_shot_instruction)
        
        return jsonify({"result": response.text})

    except Exception as e:
        print(f"Error in simple generation: {e}")
        return jsonify({"error": str(e)}), 500


@promptapi_bp.route('/interactive', methods=['POST'])
def generate_interactive_chat():
    """
    INTERACTIVE CHAT (Step-by-Step Mode).
    This strictly follows the User's System Prompt phases.
    We reconstruct the history on every request (Stateless API pattern).
    """
    try:
        data = request.json
        print(data)
        history = data.get('history', [])
        new_message = history[-1]['text'] if history else ''

        # 1. Prepare Model
        model = genai.GenerativeModel('gemini-2.5-flash') # Pro is better for complex instruction following
        
        # 2. Build Chat History
        # We start the history with the System Prompt as the first Developer/User instruction
        chat_history = []
        
        # Inject System Role
        system_entry = f"{ELITE_SYSTEM_PROMPT}\n\nUSER: Hello, I am ready to start. Please ask me the Phase 1 question."
        chat_history.append({'role': 'user', 'parts': [system_entry]})
        chat_history.append({'role': 'model', 'parts': ["Please select the type of prompt you want:\nA) Chatting Prompt (AI assistant style)\nB) Deep Research Prompt (with sources & high accuracy)\nC) Analytical/Professional Prompt (expert analysis, reports, frameworks)\nD) Other (Specify)"]})

        # Append User/AI conversation history (exclude last entry, it's sent via send_message)
        for msg in history[:-1]:
            role = 'user' if msg['role'] == 'user' else 'model'
            # Filter out UI-specific system welcome messages if necessary
            if msg['role'] == 'system' and "Welcome to the Unified" in msg['text']:
                continue 
            
            chat_history.append({'role': role, 'parts': [msg['text']]})

        # 3. Start Chat & Send Message
        chat = model.start_chat(history=chat_history)
        response = chat.send_message(new_message)

        return jsonify({"reply": response.text})

    except Exception as e:
        print(f"Error in interactive chat: {e}")
        return jsonify({"error": str(e)}), 500