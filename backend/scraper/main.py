import os
import praw
from dataclasses import asdict
from dotenv import load_dotenv
from supabase import create_client, Client
from unwrap import Post, matches_keywords, assign_theme  # Importing your logic

# Load credentials from .env
load_dotenv()

# 1. Initialize Supabase Client
# Use the SERVICE_ROLE_KEY to bypass RLS and write data
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"), 
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)

# 2. Initialize Reddit Client
reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent="script:embedded_helper_scraper:v1.0"
)

def run_scraper():
    target_subs = ["arduino", "esp32", "embedded", "stm32"]
    print(f"--- Starting scrape on {', '.join(target_subs)} ---")

    for sub_name in target_subs:
        subreddit = reddit.subreddit(sub_name)
        
        # Fetch the 50 newest posts from each subreddit
        for submission in subreddit.new(limit=50):
            # Map Reddit data to our Post dataclass
            post = Post(
                subreddit=sub_name,
                title=submission.title,
                selftext=submission.selftext or "",
                score=submission.score,
                num_comments=submission.num_comments,
                url=f"https://reddit.com{submission.permalink}"
            )

            # Check if the post meets our "help-seeking" criteria
            if matches_keywords(post):
                theme = assign_theme(post)
                
                # Prepare data for Supabase
                # .asdict() converts the Post class into a standard Python dictionary
                post_data = asdict(post)
                post_data["theme"] = theme

                try:
                    # Upsert handles duplicates based on the 'url' column
                    supabase.table("reddit_posts").upsert(
                        post_data, on_conflict="url"
                    ).execute()
                    print(f"Saved [{theme}]: {post.title[:50]}...")
                except Exception as e:
                    print(f"Database Error: {e}")

if __name__ == "__main__":
    run_scraper()
    print("--- Scrape Complete ---")