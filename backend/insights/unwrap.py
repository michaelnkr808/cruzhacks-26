import csv
import re
from dataclasses import dataclass
from typing import List


# -------------------------
# Data model
# -------------------------

@dataclass
class Post:
    subreddit: str
    title: str
    selftext: str
    score: int
    num_comments: int
    url: str


# -------------------------
# Text utilities
# -------------------------

def normalize(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    return text


# -------------------------
# Embedded programming keywords
# -------------------------

KEYWORDS = [
    "arduino",
    "esp32",
    "stm32",
    "microcontroller",
    "embedded",
    "gpio",
    "i2c",
    "spi",
    "uart",
    "serial",
    "firmware",
    "sensor",
    "adc",
    "pwm",
    "breadboard",
]


# -------------------------
# Core filter logic
# -------------------------

def matches_keywords(post: Post) -> bool:
    t = normalize(post.title + " " + post.selftext)

    # Remove showcase / announcement style posts
    BAD_PHRASES = [
        "i made",
        "huge update",
        "update to my",
        "project update",
        "showcase",
        "tutorial",
        "built this",
        "my journey",
    ]

    for phrase in BAD_PHRASES:
        if phrase in t:
            return False

    # Prefer help-seeking / beginner language
    HELP_SIGNALS = [
        "help",
        "not working",
        "doesn't work",
        "doesnt work",
        "cant",
        "can't",
        "error",
        "problem",
        "beginner",
        "newbie",
        "how do i",
        "why",
        "confused",
        "issue",
        "fail",
        "unable",
    ]

    has_help_signal = False
    for signal in HELP_SIGNALS:
        if signal in t:
            has_help_signal = True
            break

    if not has_help_signal:
        return False

    # Must match at least one embedded keyword
    for keyword in KEYWORDS:
        if keyword in t:
            return True

    return False


# -------------------------
# Theme assignment
# -------------------------

def assign_theme(post: Post) -> str:
    t = normalize(post.title + " " + post.selftext)

    if any(k in t for k in ["power", "voltage", "battery", "5v", "3.3v"]):
        return "Wiring & Power"

    if any(k in t for k in ["i2c", "spi", "uart", "serial", "can"]):
        return "Communication"

    if any(k in t for k in ["sensor", "adc", "analog", "voltage divider"]):
        return "Analog & Sensors"

    if any(k in t for k in ["error", "compile", "upload", "flash"]):
        return "Build / Compile Errors"

    return "General Beginner Help"


# -------------------------
# CSV loading example
# -------------------------

def load_posts_from_csv(path: str) -> List[Post]:
    posts = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            posts.append(
                Post(
                    subreddit=row.get("subreddit", ""),
                    title=row.get("title", ""),
                    selftext=row.get("selftext", ""),
                    score=int(row.get("score", 0)),
                    num_comments=int(row.get("num_comments", 0)),
                    url=row.get("url", ""),
                )
            )
    return posts


# -------------------------
# Main (safe to run)
# -------------------------

if __name__ == "__main__":
    print("unwrap.py loaded successfully")

    # Example usage (comment out if not needed)
    # posts = load_posts_from_csv("posts.csv")
    # filtered = [p for p in posts if matches_keywords(p)]
    # for p in filtered[:5]:
    #     print(assign_theme(p), "-", p.title)
