# Security Specification for HireMatch AI

## Data Invariants
1. A user can only access their own profile.
2. A user can only manage their own saved jobs and job alerts.
3. Users cannot elevate their own privileges (though no admin role is defined yet, we'll block shadow fields).
4. Relational integrity: Saved jobs and alerts must exist under the correct userId.

## The Dirty Dozen Payloads

1. **Identity Spoof**: Try to create a profile with a `userId` different from the authenticated user.
2. **PII Leak**: Try to read another user's profile.
3. **Ghost Field**: Adding `isVerified: true` to a profile during update.
4. **State Shortcut**: Modifying `createdAt` after it's been set.
5. **Collection Bloom**: Flooding the `skills` array with 1MB of junk data.
6. **Orphaned Write**: Creating a saved job under a different user's path.
7. **Cross-User Delete**: Deleting someone else's job alert.
8. **Invalid ID**: Using a 2KB string as a `userId`.
9. **Email Spoof**: Authenticating with a fake email and trying to access sensitive paths (if any restricted to specific emails).
10. **Type Poisoning**: Sending a number where a string is expected for `name`.
11. **Negative Score**: Trying to set a `matchScore` to -100 or 1000.
12. **Future Timestamp**: Setting `updatedAt` to a time in the future.

## Test Runner
(Will be implemented if needed, but for now we focus on the rules)
