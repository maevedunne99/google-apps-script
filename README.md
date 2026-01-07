# Google Apps Script (GAS) Practice & Automation Hub

This repository contains a collection of scripts designed to automate workflows within Google Workspace (Sheets, Docs, and Gmail). These tools focus on productivity, data integration, and document generation.

## 1. Apps Script: JSON Turn Transformer

A custom Google Sheets function that simplifies complex conversation JSON data into a clean, "fixed query" format for manual review.

### How to Use
1. Open your Google Sheet.
2. Go to **Extensions** > **Apps Script**.
3. Copy the code from `transform_turns.gs` in this repo and paste it into the editor.
4. Save the project.
5. In your sheet, use the formula:
   `=TRANSFORM_TURNS(A2)`

### Example
**Input:**
`[{"turn": 1, "query": "Hello", "model_response": "Hi there!"}]`

**Output:**
```json
[
  {
    "turn": 1,
    "fixed query": " "
  }
]
