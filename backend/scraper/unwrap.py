import re
from dataclasses import dataclass

@dataclass
class Post:
    subreddit: str
    title: str
    selftext: str
    score: int
    num_comments: int
    url: str

def normalize(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    return text

def matches_keywords(post: Post) -> bool:
    t = normalize(post.title + " " + post.selftext)

    # Filter out showcase/announcements
    BAD_PHRASES = ["i made", "huge update", "showcase", "tutorial", "built this"]
    if any(phrase in t for phrase in BAD_PHRASES):
        return False

    # Look for beginner/help signals
    HELP_SIGNALS = ["help", "not working", "error", "problem", "beginner", "issue"]
    has_help_signal = any(signal in t for signal in HELP_SIGNALS)
    if not has_help_signal:
        return False

    # Must contain an embedded keyword
    KEYWORDS = ["arduino", "esp32", "stm32", "microcontroller", "embedded", "uart", "i2c", "spi"]
    return any(keyword in t for keyword in KEYWORDS)

def assign_theme(post: Post) -> str:
    t = normalize(post.title + " " + post.selftext)

    if any(k in t for k in ["power", "voltage", "battery", "5v", "3.3v"]):
        return "Wiring & Power"
    if any(k in t for k in ["i2c", "spi", "uart", "serial", "can"]):
        return "Communication"
    if any(k in t for k in ["error", "compile", "upload", "flash"]):
        return "Build / Compile Errors"
    if any(k in t for k in ["sensor", "adc", "analog"]):
        return "Analog & Sensors"
        
    return "General Beginner Help"