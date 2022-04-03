# logistics-app
1. Install bazel `brew install bazel`
2. Install gazelle (optional?) `go install github.com/bazelbuild/bazel-gazelle/cmd/gazelle@latest`
3. Prefix with gazelle (optional?) `gazelle -go_prefix github.com/grigoryevandrey/logistics-app`
4. Run bazel `bazel run //:gazelle`

## Makefile

Most of the commands can be runned with a makefile. Get list of available commands by running `make help`

## Updating files 
`gazelle update-repos --from_file=go.mod -to_macro=go_third_party.bzl%go_deps`

## Build
`bazel build //services/initial`

## Run 
`bazel run //services/initial`

## Build image
`docker system prune -a -f --volumes && sudo bazel run //services/initial:image`

[Troubleshooting](https://www.tweag.io/blog/2021-09-08-rules_go-gazelle/)

[Images troubleshooting](https://stackoverflow.com/questions/68273018/starting-container-process-caused-exec-bin-bash-stat-bin-bash-no-such-fi)

[Container image bazel config](https://github.com/bazelbuild/rules_docker/blob/master/docs/container.md#container_image)