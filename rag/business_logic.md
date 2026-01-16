# BUSINESS LOGIC

Purpose: Explain "What are the rules/formulas/algorithms".

## Domain Rules
- [x] **Guest Data Model**:
  - `id`: Unique identifier
  - `field1`, `field2`, `field3`: Display fields (ID, Name, Region)
  - `checkedIn`: Boolean status
  - `checkinTime`: Timestamp string (HH:mm:ss in 24h format)
- [x] **Check-in Process**:
  - Updates `checkedIn` status to `true`.
  - Records current server/client time.
  - Returns success status.
- [x] **State Machine**:
  - Guest: `Not Checked In` -> `Checked In` (One-way transition in current logic)
- [ ] Constraints:
  - Currently using MOCK_DATA (Simulated API delay 500ms).
