# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]


## [3.0.0] - 2026-04-29

### Added

- CI now enforces file format checks (#552)

### Changed

- Migrated codebase to ESM modules (#545)
- Updated Node.js runtime to Node 24 (#546)
- Minor code improvements for more idiomatic TypeScript/JavaScript (#553)

### Security

- Improved dependencies security posture (#547)
- Bumped dependencies to address Dependabot security advisories (#551)
- Updated all dependencies to their latest available versions (#544)


## [2.0.5] - 2024-06-03

### Fixed

- launch run command as root

## [2.0.1] - 2023-12-21

### Fixed

- detect package manager from first step (in multisteps dockerfiles)

## [2.0.0] - 2023-12-05

### Changed

- support any image name: auto detect package manager
- upgrade node runtime to 20.x

## [1.0.1] - 2022-07-27

### Added

- Support for bulleye and buster

## [1.0.0] - 2022-02-24

Initial release
