import re

class PIIEngine:
    def __init__(self):
        # India (IN) Patterns
        self.in_patterns = [
            (re.compile(r"(?:\b|\+91|0)[6-9]\d{9}\b"), "[REDACTED_PHONE]"),
            (re.compile(r"\b(?:[2-9]\d{3}\s\d{4}\s\d{4}|[2-9]\d{11})\b"), "[REDACTED_AADHAAR]"),
            (re.compile(r"\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b"), "[REDACTED_PAN]"),
            (re.compile(r"\b[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}\b"), "[REDACTED_UPI]")
        ]
        
        # United States (US) Patterns
        self.us_patterns = [
            (re.compile(r"\b\d{3}-\d{2}-\d{4}\b"), "[REDACTED_US_SSN]"),
            (re.compile(r"\b(?:\d[ -]*?){13,16}\b"), "[REDACTED_CREDIT_CARD]"), # Basic CC/Luhn shape
            (re.compile(r"\b[A-Z0-9]{9}\b"), "[REDACTED_US_PASSPORT]"),
            (re.compile(r"\b[A-Z]{1}\d{7}\b"), "[REDACTED_US_DRIVER_LICENSE]"),
            (re.compile(r"\b(?:medical record|patient id|phi)[:-]?\s*\w+\b", re.IGNORECASE), "[REDACTED_PHI]")
        ]
        
        # European Union (EU) Patterns
        self.eu_patterns = [
            (re.compile(r"\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b"), "[REDACTED_IBAN]"),
            (re.compile(r"\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b"), "[REDACTED_IP_ADDRESS]"),
            (re.compile(r"\b[A-Z0-9]{9}\b"), "[REDACTED_EU_PASSPORT]")
        ]

    def _get_patterns_for_region(self, region: str):
        patterns = []
        if region in ["IN", "ALL"]:
            patterns.extend(self.in_patterns)
        if region in ["US", "ALL"]:
            patterns.extend(self.us_patterns)
        if region in ["EU", "ALL"]:
            patterns.extend(self.eu_patterns)
        
        if not patterns: # fallback to IN if unknown
            patterns.extend(self.in_patterns)
            
        return patterns

    def mask_text(self, text: str, region: str = "IN") -> str:
        patterns = self._get_patterns_for_region(region)
        for pattern, replacement in patterns:
            text = pattern.sub(replacement, text)
        return text

    def mask_json_payload(self, data, region: str = "IN"):
        if isinstance(data, dict):
            return {k: self.mask_json_payload(v, region) for k, v in data.items()}
        elif isinstance(data, list):
            return [self.mask_json_payload(i, region) for i in data]
        elif isinstance(data, str):
            return self.mask_text(data, region)
        else:
            return data

# Singleton instance
pii_engine = PIIEngine()
