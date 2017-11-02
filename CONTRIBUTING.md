# Contributing Guidelines

The Skills Api project welcomes contributions via GitLab merge requests.<br>
This document outlines the process to help get your contribution accepted.

### How to Contribute

1. If you haven't already done so, sign a Contributor License Agreement (see details above).
1. Fork this repository, develop and test your Chart.
1. Choose the correct folder for your chart based on the information in the [Repository Structure](README.md#repository-structure) section
1. Ensure your Chart follows the [technical](#technical-requirements) and [documentation](#documentation-requirements) guidelines, described below.
1. Submit a pull request.

***NOTE***: In order to make testing and merging of PRs easier, please submit changes to multiple charts in separate PRs.

#### Documentation requirements

#### Merge approval and release process

The client side git hooks and Concourse Pipeline will provide you with feedback about the ongoing validity of your merge request.<br>
The removal of the wip tag effectively acts as a signal that the MR is ready for review by a maintainer.<br>
We much welcome requests for feedback about work in progress.

Once the MR has been merged, Concourse will build and release to staging for final approval.
Final approval triggers a promotion of the release into the production environment.

### Support Channels

- GitLab issues: https://github.com/kubenetes/charts/issues
- Twitter Ozzy Ndiaye - http://twitter.com/@ornous
