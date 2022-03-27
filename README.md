# logistics-app
1. Install bazel `brew install bazel`
2. Install gazelle (optional?) `go install github.com/bazelbuild/bazel-gazelle/cmd/gazelle@latest`
3. Prefix with gazelle (optional?) `gazelle -go_prefix github.com/grigoryevandrey/logistics-app`
4. Run bazel `bazel run //:gazelle`

[Troubleshooting](https://www.tweag.io/blog/2021-09-08-rules_go-gazelle/)