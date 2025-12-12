# Clases

The following is a description of what this app has to achieve in the long term.
Some elements are still in construction
This apps allows a person to create a dojo (eg a yoga dojo) and publish
a timeline of classes for each week along who teaches each class.
In this sense, users will have different roles:
    - students who look at available classes and book a place in them
    - teachers that give classes
    - dojo admins who can administrate a dojo

# Stack

This app has a react web UI, an express web server and postgresql storage.

The web server starts at clases/src/server/api.ts.

The UI has independent React apps for each landing.
At clases/src/client/entrypoints/ we have the entrypoints of each landing. Each
app is served by our same web server.
Whenever a new landing has to be added this same style has to be replicated and
clases/vite.config.ts has to be updated to reflect this new react app.

clases/src/client/components/shared/ stores common react compoents to the whole
UI.

Code shared by UI and server is stored at clases/src/shared and imported with
`from "@shared"`.

# Style

Do NOT add comments when you add code.

# Testing

Client side tests (src/client/*) should:
- have the following prefix
```
/**
 * @vitest-environment jsdom
 */
 ```
 - Use the following import `import "@testing-library/jest-dom"`

