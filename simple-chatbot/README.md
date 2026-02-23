# Simple Chatbot Note

To trigger this specific skill in OpenClaw, the AI's default system prompt (`IDENTITY.md` and `SOUL.md`) controls its underlying personality ("Mac").

Skills are treated like "tools" the AI can use, not system prompt overwrites.
If you say "who are you?", the main AI will answer as Mac. 

If you want the bot to *act* like the Simple Chatbot, you have two choices:
1. Change the main `IDENTITY.md` and `SOUL.md` files to match the simple chatbot personality.
2. Tell Mac: "Use the simple-chatbot skill to answer: who are you?"
