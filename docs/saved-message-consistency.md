# Concurrent Save for Later actions

Channel messages and thread replies use the same Save for Later state. Saving or
removing one message updates only that message. A failed request restores its
previous state and shows an error without replacing another message's completed
or pending change. Repeated clicks on the same target share one pending operation
across message rows, preventing duplicate calls to the server's toggle endpoint.

Switching organisation clears the previous bookmarks and pending state. A late
response for the previous organisation is ignored. A saved-list request started
before a mutation cannot erase that newer mutation when its response arrives.

The implementation uses the existing Context/reducer store:

- [`useSavedMessages.ts`](../src/hooks/useSavedMessages.ts) performs requests and
  guards pending operations by organisation and message identity.
- [`saved-bookmarks.ts`](../src/utils/saved-bookmarks.ts) applies scoped mutations
  against current state and preserves changes newer than a list request.
- [`Reducers.ts`](../src/store/Reducers.ts) handles those actions and clears state
  on organisation changes. No backend or storage migration is required.

With dependencies installed, run the controlled hook regression suite:

```sh
node --test src/hooks/useSavedMessages.test.mjs
```

For manual verification, throttle/intercept saved-message requests, save A then B,
and return the responses in reverse order. Both must remain saved with server ids.
Repeat with a failed save/removal, a thread and reply, repeated clicks, and an
organisation switch while a request is pending. Refresh to verify persistence;
deletion must still use the saved item's id. The tests mock network/context and
do not by themselves establish that a live backend or deployment works.
