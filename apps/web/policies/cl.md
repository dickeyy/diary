# What's New?

Keep track of all the changes made to Diary.

---

## [v0.2.5-beta](https://github.com/dickeyy/diary/releases/tag/v0.2.5-beta) - June 5, 2024

### Added

-   Add [LogSnag](https://logsnag.com/) for easy insights.
    ([`ea15dde`](https://github.com/dickeyy/diary/commit/ea15dde))
-   Add a feedback dialog and form utilizing LogSnag.
    ([`fbf9e6f`](https://github.com/dickeyy/diary/commit/fbf9e6f))
    ([`46029e7`](https://github.com/dickeyy/diary/commit/46029e7))
-   Add a PostHog event for feedback submission.
    ([`f94793f`](https://github.com/dickeyy/diary/commit/f94793f))

### Fixed

-   Fix a token `null` error when saving content via WS.
    ([`20f5838`](https://github.com/dickeyy/diary/commit/20f5838))
-   Fix a warning about a `ref` being passed to `PlateContent`.
    ([`d204386`](https://github.com/dickeyy/diary/commit/d204386))

---

## [v0.2.4-beta](https://github.com/dickeyy/diary/releases/tag/v0.2.4-beta) - June 4, 2024

### Added

-   Add document font options. ([`2a6a7ad`](https://github.com/dickeyy/diary/commit/2a6a7ad))
-   Add `metadata` field to document schema.
    ([`2a6a7ad`](https://github.com/dickeyy/diary/commit/2a6a7ad))
-   Add UI to change document font and size.
    ([`2a6a7ad`](https://github.com/dickeyy/diary/commit/2a6a7ad))

---

## [v0.2.3-beta](https://github.com/dickeyy/diary/releases/tag/v0.2.3-beta) - June 3, 2024

### Changed

-   Change content renderer from a `textarea` to [Plate](https://platejs.org/).
    ([`572005c`](https://github.com/dickeyy/diary/commit/572005c))
-   Change the backend to handle the new content renderer.
    ([`572005c`](https://github.com/dickeyy/diary/commit/572005c))
-   Change content to be stored as a JSON string in the database to support block architecture.
    ([`572005c`](https://github.com/dickeyy/diary/commit/572005c))
-   The `updateDocumentByID` function now properly returns a single document rather than an array.
    ([`572005c`](https://github.com/dickeyy/diary/commit/572005c))
-   Change `content-input.tsx` to `editor.tsx`.
    ([`572005c`](https://github.com/dickeyy/diary/commit/572005c))

### Fixed

-   Fix a bug where the sidebar sheet wouldn't dismiss when you selected a new entry (mobile).
    ([`572005c`](https://github.com/dickeyy/diary/commit/572005c))
-   Fix a z-index bug causing the document navbar to overlap the sidebar.
    ([`d54d904`](https://github.com/dickeyy/diary/commit/d54d904))

---

## [v0.2.2-beta](https://github.com/dickeyy/diary/releases/tag/v0.2.2-beta) - June 2, 2024

### Fixed

-   Fix a bug preventing the saving of empty strings.
    ([`4772a07`](https://github.com/dickeyy/diary/commit/4772a07))

### Removed

-   Remove test file `websockets.tsx`.
    ([`4772a07`](https://github.com/dickeyy/diary/commit/4772a07))

---

## [v0.2.1-beta](https://github.com/dickeyy/diary/releases/tag/v0.2.1-beta) - June 2, 2024

### Added

-   Add WebSocket functionality to the `/documents/` API endpoint.
    ([`e802a34`](https://github.com/dickeyy/diary/commit/e802a34))

### Changed

-   Update frontend to use WebSockets for entry content updates.
    ([`e802a34`](https://github.com/dickeyy/diary/commit/e802a34))
-   Cleaner error messages. ([`e802a34`](https://github.com/dickeyy/diary/commit/e802a34))
-   Move the toast location from the bottom-right to the top-right.
    ([`e802a34`](https://github.com/dickeyy/diary/commit/e802a34))

### Fixed

-   Fix the mobile landing navbar blur.
    ([`b526571`](https://github.com/dickeyy/diary/commit/b526571))

### Removed

-   Remove success toasts for entry creation and deletion.
    ([`e802a34`](https://github.com/dickeyy/diary/commit/e802a34))

---

## [v0.2.0-beta](https://github.com/dickeyy/diary/releases/tag/v0.2.0-beta) - June 1, 2024

### Added

-   Stripe integration. ([`e7ab9a1`](https://github.com/dickeyy/diary/commit/e7ab9a1))
-   Mobile support for entry pages. ([`e7ab9a1`](https://github.com/dickeyy/diary/commit/e7ab9a1))
-   Add pricing page. ([`e7ab9a1`](https://github.com/dickeyy/diary/commit/e7ab9a1))
-   Add landing page navbar. ([`e7ab9a1`](https://github.com/dickeyy/diary/commit/e7ab9a1))

### Fixed

-   Fix entry page layout. ([`5f36503`](https://github.com/dickeyy/diary/commit/5f36503))
-   Fix sidebar sizing. ([`e7ab9a1`](https://github.com/dickeyy/diary/commit/e7ab9a1))
-   Fix layouts and general containers for landing pages.
    ([`e7ab9a1`](https://github.com/dickeyy/diary/commit/e7ab9a1))
-   General bug fixes. ([`e7ab9a1`](https://github.com/dickeyy/diary/commit/e7ab9a1))

---

## [v0.1.0-beta](https://github.com/dickeyy/diary/releases/tag/Beta) - May 31, 2024

_First release._ ([`55087c2`](https://github.com/dickeyy/diary/commit/55087c2))
