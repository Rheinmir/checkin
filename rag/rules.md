# RULES

Purpose: Explain "How to write code here".

## AI Agent Guidelines
1. **RAG Maintenance**: ANY modification to the codebase (logic, architecture, workflows) MUST be accompanied by an update to the corresponding file in the `rag/` directory. This ensures the context remains the single source of truth.
2. **Session Start**: At the beginning of every new chat or session, the AI MUST read `rag/rules.md` first to align with project standards.

## Coding Standards
- [x] **Language**: TypeScript (`.ts`, `.tsx`) is mandatory. No arbitrary JS.
- [x] **Styling**: TailwindCSS is the primary styling source.
  - Breakpoints: `xs: 380px`, `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- [x] **Linting**: Must pass ESLint (Recommended + React Hooks + TypeScript).
- [x] **Component Style**: Functional Components with Hooks.

## Architecture Rules
- [x] **Directory Structure**:
  - `src/features/`: Feature-sliced design (Logic + UI co-located for features).
  - `src/components/`: Shared/Generic UI components.
  - `src/hooks/`: Shared custom hooks.
  - `src/lib/`: Utilities and external library configurations.
- [ ] Special Rules:
- [ ] Git Flow:
