# Codex Context Frames

Selection captures from the in-browser Codex context inspector are saved here during local development.

## Files

- `latest-frame.json`: the most recent captured frame
- `frame-index.json`: recent saved frames and suggested paired markdown paths
- `frames/<timestamp>--<route>.json`: archived raw frame captures
- `frames/<timestamp>--<route>.md`: optional human summary written later by Codex on request

## Workflow

1. In local dev, press `Option+Shift+B`.
2. Click two corners to capture a frame.
3. The inspector auto-saves the JSON here.
4. Ask Codex: `I just recorded a new frame, please identify exactly what I am selecting.`

## Recommended Follow-Up Prompts

- `Please summarize the latest saved frame and tell me the primary selected components versus wrapper noise.`
- `Create the paired markdown summary for the latest saved frame.`
- `Compare the latest frame to the previous one and explain what changed.`

## Redundancy Notes

Raw captures often include structural wrappers such as `App`, `motion.main`, `PageScaffold`, and large full-screen containers. Those are useful as route context, but not usually the primary visual target. Codex should compress those into background context and focus on the most specific overlapping components.
