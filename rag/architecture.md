# ARCHITECTURE

Purpose: Explain "How it works" and "How it's organized".

## System Context
- [ ] High-Level Diagram: User -> Nginx Container -> React App
- [x] Directory Structure:
  - `src/`: Source code (components, logic)
  - `public/`: Static assets
  - `dist/`: Build output
  - `rag/`: Documentation and Context
  - `_legacy`: Legacy code
- [ ] Key Data Flows:
  - QR Scanning -> Decoding -> Data Processing
  - Excel Import -> Parsing -> QR Generation (inferred from dependencies)
