"""
Claude CLI integration service for AI-powered prompt enhancement.
"""
import subprocess
from typing import Optional


class ClaudeService:
    """Service for interacting with Claude CLI."""

    DEFAULT_ENHANCEMENT_PROMPT = (
        "You are a prompt engineering expert. Your task is to take a user's prompt template "
        "and improve it to make it more effective. This is a META task - you are improving "
        "a prompt that will be used later, not executing the prompt yourself.\n\n"
        "CRITICAL RULES:\n"
        "1. Output ONLY the improved prompt text\n"
        "2. Do NOT execute or respond to the prompt\n"
        "3. Do NOT ask questions or provide explanations\n"
        "4. Do NOT add meta-commentary\n"
        "5. Keep the same general intent but make it clearer and more effective\n\n"
        "Make the prompt:\n"
        "- More specific and actionable\n"
        "- Better structured\n"
        "- Include relevant context\n"
        "- Professional and clear\n\n"
        "USER'S ORIGINAL PROMPT TO IMPROVE:\n"
    )

    def __init__(self):
        """Initialize Claude CLI service."""
        # Verify Claude CLI is available
        try:
            result = subprocess.run(
                ["claude", "--version"],
                capture_output=True,
                text=True,
                timeout=5,
                shell=True  # Use shell on Windows for .cmd files
            )
            if result.returncode != 0:
                raise Exception("Claude CLI command failed")
        except FileNotFoundError:
            raise Exception(
                "Claude CLI not found. Please ensure 'claude' command is available in PATH"
            )
        except subprocess.TimeoutExpired:
            raise Exception("Claude CLI version check timed out")

    def enhance_prompt(
        self,
        original_prompt: str,
        enhancement_instruction: Optional[str] = None
    ) -> str:
        """
        Enhance a prompt using Claude CLI.

        Args:
            original_prompt: The original prompt text to enhance
            enhancement_instruction: Optional custom enhancement instruction
                                   (defaults to DEFAULT_ENHANCEMENT_PROMPT)

        Returns:
            Enhanced prompt text

        Raises:
            Exception: If CLI call fails
        """
        # Use custom instruction or default
        instruction = enhancement_instruction or self.DEFAULT_ENHANCEMENT_PROMPT

        # Construct the full prompt
        full_prompt = f"{instruction}\n\n{original_prompt}"

        try:
            print(f"[ClaudeService] Running Claude CLI command...")
            print(f"[ClaudeService] Prompt length: {len(full_prompt)} characters")

            # Call Claude CLI using print mode for non-interactive output
            # Note: Using full path to .cmd file and removing shell=True to avoid hanging
            result = subprocess.run(
                [r"C:\Users\winnl\AppData\Roaming\npm\claude.cmd", "--print"],
                input=full_prompt,
                capture_output=True,
                text=True,
                timeout=60,
                encoding='utf-8',
                shell=False  # Don't use shell to avoid interactive prompts
            )

            print(f"[ClaudeService] Return code: {result.returncode}")
            print(f"[ClaudeService] Stdout length: {len(result.stdout)} characters")
            print(f"[ClaudeService] Stderr: {result.stderr[:200] if result.stderr else 'None'}")

            if result.returncode != 0:
                error_msg = result.stderr or "Unknown error"
                raise Exception(f"Claude CLI command failed: {error_msg}")

            enhanced_prompt = result.stdout.strip()

            if not enhanced_prompt:
                raise Exception("Claude CLI returned empty response")

            print(f"[ClaudeService] Success! Enhanced prompt length: {len(enhanced_prompt)}")
            return enhanced_prompt

        except subprocess.TimeoutExpired:
            raise Exception("Claude CLI request timed out after 60 seconds")
        except Exception as e:
            print(f"[ClaudeService ERROR] {type(e).__name__}: {str(e)}")
            raise Exception(f"Failed to enhance prompt: {str(e)}")
