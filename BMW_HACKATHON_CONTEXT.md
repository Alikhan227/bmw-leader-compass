# 🏎 Project Mission: BMW Decision Intelligence (Hackathon 2026)

## 1. The Context & Goal
We are building a Decision Intelligence System for BMW leadership selection. The goal is to show how AI agents can augment (not replace) human decision-making by simulating business scenarios.

**Key Principle**: The "Best Candidate" doesn't exist in a vacuum; it depends on the business context (Stability vs. Crisis vs. Transformation).

## 2. Core Architecture (Multi-Agent Logic)
The system must act as a pipeline of specialized agents:
- **JD Agent**: Adapts job requirements based on the scenario.
- **CV Agent**: Scores candidates against these dynamic requirements.
- **Scenario Agent**: Adjusts priority weights (e.g., in "Crisis", resilience is weighted higher than process).
- **Decision Agent**: Synthesizes the final ranking and provides Explainable Reasoning.

## 3. Tasks

### 🛠 Task A: Clean up "Internal vs. External" (Status: Completed)
- REMOVE all logic, UI badges, and data fields related to "Internal/External" sourcing.
- FOCUS exclusively on Scenario-Based Ranking. The ranking should change only based on the business context and leadership traits.

### 📊 Task B: Scenario-Driven UI (The Dashboard)
- **Scenario Selector**: Implement 3 modes: Automotive Continuity (Stability), Transformation, and Supply-Chain Crisis.
- **Dynamic Ranking**: When a scenario changes, the CandidateList must re-sort with a smooth animation.
- **Fit Score & Radars**: Every candidate must have a Fit Score and a Radar Chart showing traits like Decisiveness, Strategic Thinking, and Resilience.

### 🧠 Task C: The "Reasoning" Block (Explainability)
- Create a prominent UI section for AI Insights.
- It must display a text justification for the #1 candidate, e.g.: "In a Crisis scenario, Candidate X moved to #1 because their 'Rapid Decisiveness' trait (9/10) outweighs the 'Process Stability' of others.".

## 🚨 Critical Engineering Requirements
- **Performance**: UI interactions must be sub-150ms.
- **Accessibility**: Must be WCAG 2.1 AA compliant (executive-level quality).
- **Code Quality**: Clean TypeScript, modular component architecture, and proper state management.
- **BMW Branding**: Use a premium dark theme with BMW Blue (#0066B1).

## 💬 Instructions for Antigravity (AI Assistant)
- Review the existing codebase. Identify where the Internal/External category is hardcoded and remove it.
- Enhance the `useScenario` logic. Ensure that changing the scenario correctly updates the weights used for candidate scoring.
- Polish the UI. Make sure the "Reasoning" block is the star of the show — it’s what gives us the 30 pts for "Business Relevance".
