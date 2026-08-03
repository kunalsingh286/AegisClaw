import re
from typing import Dict, Any, List

class PromptGuard:
    def __init__(self):
        # Deterministic regex for common jailbreaks/injections
        self.injection_patterns = [
            re.compile(r"ignore\s+(all\s+)?previous\s+instructions", re.IGNORECASE),
            re.compile(r"you\s+are\s+now\s+(a\s+)?(developer|admin|root|jailbroken)", re.IGNORECASE),
            re.compile(r"system\s+prompt", re.IGNORECASE),
            re.compile(r"forget\s+(all\s+)?previous", re.IGNORECASE),
            re.compile(r"bypass\s+restrictions", re.IGNORECASE),
            re.compile(r"as\s+an\s+ai\s+language\s+model", re.IGNORECASE), # Sometimes used to bait the model
            re.compile(r"(drop|delete|truncate|update|insert)\s+(table|database|from|into)", re.IGNORECASE), # Basic SQLi
            re.compile(r"exec\s*\(", re.IGNORECASE),
            re.compile(r"eval\s*\(", re.IGNORECASE)
        ]

    def scan_text(self, text: str) -> bool:
        """Returns True if malicious pattern detected, False otherwise."""
        if not text:
            return False
        for pattern in self.injection_patterns:
            if pattern.search(text):
                return True
        return False

    def scan_payload(self, payload: Dict[str, Any]) -> bool:
        """Scans the messages array of an LLM request for prompt injections."""
        messages = payload.get("messages", [])
        for msg in messages:
            content = msg.get("content", "")
            if isinstance(content, str):
                if self.scan_text(content):
                    return True
            elif isinstance(content, list):
                # For multimodal content arrays
                for part in content:
                    if part.get("type") == "text":
                        if self.scan_text(part.get("text", "")):
                            return True
        
        # Also check direct 'prompt' field for completions API
        prompt = payload.get("prompt", "")
        if isinstance(prompt, str) and self.scan_text(prompt):
            return True
            
        return False

prompt_guard = PromptGuard()
