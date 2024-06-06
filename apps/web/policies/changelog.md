# What's New?

Keep track of all the changes made to Diary.

---

## June 5, 2024 - v0.2.5-beta

[View on GitHub](https://github.com/dickeyy/diary/releases/tag/v0.2.5-beta)

-   Added [LogSnag](https://logsnag.com/) for push notifications and easy insights about core events
    (e.g. `account_created`, `account_delted`, `plan_upgraded`, etc.).
-   Added a feedback dialog and form utilizing LogSnag.
-   Added a PostHog event for feedback submission.
-   Fixed a token `null` error when saving content via WS.
-   Fixed a warning about a `ref` being passed to `PlateContent`.

---

## June 4, 2024 - v0.2.4-beta

[View on GitHub](https://github.com/dickeyy/diary/releases/tag/v0.2.4-beta)

-   Added document font options.
-   Added `metadata` field to document schema.
-   Added UI to change document font and size.

---

## June 3, 2024 - v0.2.3-beta

[View on GitHub](https://github.com/dickeyy/diary/releases/tag/v0.2.3-beta)

-   Changed content renderer from a `textarea` to [Plate](https://platejs.org/).
-   Changed the backend to handle the new content renderer.
-   Contend stored in DB is now a JSON string, still entirely encrypted, frontend recieves the JSON
    string and parses it for rendering.
-   `updateDocumentByID` function now properly returns a single document rather than an array.
-   Fixed a bug where the sidebar sheet wouldn't dismiss when you selected a new entry (mobile).
-   Changed `content-input.tsx` to `editor.tsx`.
-   Fixed a z-index bug causing the document navbar to overlap the sidebar.

---

## June 2, 2024 - v0.2.2-beta

[View on GitHub](https://github.com/dickeyy/diary/releases/tag/v0.2.2-beta)

-   Fixed a bug preventing saving of empty strings.
-   Removed test file `websockets.tsx`.
-   Removed testing `console.log`'s.

---

## June 2, 2024 - v0.2.1-beta

[View on GitHub](https://github.com/dickeyy/diary/releases/tag/v0.2.1-beta)

-   Added WebSocket functionality to the `/documents/` API endpoint.
-   Updated frontend to use WebSockkets for entry content updates.
-   Fixed mobile landing navbar blur.
-   Cleaner error messages.
-   Moved the toast location from the bottom-right to the top-right.
-   Removed success toasts for entry creationa and deletion.

---

## June 1, 2024 - v0.2.0-beta

[View on GitHub](https://github.com/dickeyy/diary/releases/tag/v.0.2.0-beta)

-   Stripe integration.
-   Mobile support for entry pages.
-   Fixe entry page layout.
-   Fixed sidebar sizing.
-   Added pricing page.
-   Added landing page navbar.
-   Fixed layouts and general containers for landing pages.
-   General bug fixes.

---

## May 31, 2024 - v0.1.0-beta

[View on GitHub](https://github.com/dickeyy/diary/releases/tag/Beta)

-   Initial release
