# Plan: Shuffle Step 4 Knowledge Check Questions

## Task
Shuffle the order of the existing 10 Knowledge Check questions in Step 4 when the step is displayed.

## Steps
- [x] 1. Analyze the code structure
- [x] 2. Identify the step display logic that shows Step 4
- [x] 3. Add `shuffleQuestions();` call when Step 4 becomes active
- [x] 4. Verify the change works

## Details
- The `shuffleQuestions()` function exists at line 2328 but is never called
- Step 4 is displayed via the step navigation logic at line ~6066-6067
- The edit: Insert `shuffleQuestions();` right after Step 4's `active` class is added in the step display logic
