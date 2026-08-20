# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
changes are grouped under `Unreleased` until a release version is assigned.

## [Unreleased]

### Added

- Added this changelog to track user-visible and technical project changes.
- Added `AI_LOG.md` to record AI-assisted work, decisions, verification, and known
  follow-up items.
- Added a branded Open Graph and X social preview image.

### Changed

- Replaced internal document anchors with Next.js navigation throughout public,
  admin, client, consultant, course, and shop interfaces.
- Replaced unmanaged content images with the Next.js image component.
- Improved asynchronous data loading to avoid cascading React renders and cancel
  abandoned consultant requests.
- Added consistent keyboard focus, reduced-motion, text-selection, and touch
  interaction defaults.
- Replaced starter documentation with project-specific setup, security, database,
  verification, and maintenance guidance.
- Replaced temporary preview metadata and its test with production brand metadata
  and rendered-output assertions.

### Security

- Production admin authentication now fails closed when its email, password, or
  sufficiently strong session secret is not configured.
- Reduced administrator session lifetime from 30 days to 8 hours.
- Restricted portal notification actions to safe internal paths.
- Replaced unchecked API and client `any` values with explicit data models.

### Fixed

- Resolved the existing ESLint baseline of 83 errors and 11 warnings; the project
  now passes with zero warnings.
- Removed an unused client API variable and an unused React import.
- Corrected admin sign-in copy so it accurately describes implemented controls.
