import os
import json
import urllib.request
import urllib.error

API_KEY = "AQ.Ab8RN6LJoILldndfpdK8X9fJ0dTBk4FFGckgPTLqTwm6itJIQ"
MCP_URL = "https://stitch.googleapis.com/mcp"

def call_mcp(method, params=None):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params or {}
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        MCP_URL,
        data=data,
        headers={
            "Content-Type": "application/json",
            "X-Goog-Api-Key": API_KEY,
            "User-Agent": "Mozilla/5.0"
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"HTTPError {e.code}: {body}")
        raise

if __name__ == "__main__":
    print("Listing tools...")
    tools = call_mcp("tools/list")
    print(json.dumps(tools, indent=2))
