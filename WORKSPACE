workspace(name = "com_github_logistics_app")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "io_bazel_rules_go",
    sha256 = "d6b2513456fe2229811da7eb67a444be7785f5323c6708b38d851d2b51e54d83",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.30.0/rules_go-v0.30.0.zip",
        "https://github.com/bazelbuild/rules_go/releases/download/v0.30.0/rules_go-v0.30.0.zip",
    ],
)

http_archive(
    name = "bazel_gazelle",
    sha256 = "62ca106be173579c0a167deb23358fdfe71ffa1e4cfdddf5582af26520f1c66f",
    url = "https://github.com/bazelbuild/bazel-gazelle/releases/download/v0.23.0/bazel-gazelle-v0.23.0.tar.gz",
)

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")
load("@bazel_gazelle//:deps.bzl", "gazelle_dependencies")
load("//:go_third_party.bzl", "go_deps")

# gazelle:repository_macro go_third_party.bzl%go_deps
go_deps()

go_rules_dependencies()

go_register_toolchains(version = "1.16.5")

gazelle_dependencies()

http_archive(
    name = "io_bazel_rules_docker",
    sha256 = "85ffff62a4c22a74dbd98d05da6cf40f497344b3dbf1e1ab0a37ab2a1a6ca014",
    strip_prefix = "rules_docker-0.23.0",
    urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v0.23.0/rules_docker-v0.23.0.tar.gz"],
)
    
load("@io_bazel_rules_docker//repositories:repositories.bzl", container_repositories = "repositories")
container_repositories()
load("@io_bazel_rules_docker//repositories:deps.bzl", container_deps = "deps")
container_deps()
load("@io_bazel_rules_docker//go:image.bzl", _go_image_repos = "repositories")
_go_image_repos()
    
# load("@io_bazel_rules_docker//repositories:pip_repositories.bzl", "pip_deps")

# pip_deps()
    
load("@io_bazel_rules_docker//toolchains/docker:toolchain.bzl",
    docker_toolchain_configure="toolchain_configure"
)
docker_toolchain_configure(
    name = "docker_config",
    # OPTIONAL: Bazel target for the build_tar tool, must be compatible with build_tar.py
#   build_tar_target="<enter absolute path (i.e., must start with repo name @...//:...) to an executable build_tar target>",
    # OPTIONAL: Path to a directory which has a custom docker client config.json.
    # See https://docs.docker.com/engine/reference/commandline/cli/#configuration-files
    # for more details.
#   client_config="<enter absolute path to your docker config directory here>",
    # OPTIONAL: Path to the docker binary.
    # Should be set explicitly for remote execution.
#   docker_path="<enter absolute path to the docker binary (in the remote exec env) here>",
    # OPTIONAL: Path to the gzip binary.
#   gzip_path="<enter absolute path to the gzip binary (in the remote exec env) here>",
    # OPTIONAL: Bazel target for the gzip tool.
#   gzip_target="<enter absolute path (i.e., must start with repo name @...//:...) to an executable gzip target>",
    # OPTIONAL: Path to the xz binary.
    # Should be set explicitly for remote execution.
    xz_path="/opt/homebrew/bin/xz",
    # OPTIONAL: Bazel target for the xz tool.
    # Either xz_path or xz_target should be set explicitly for remote execution.
#   xz_target="<enter absolute path (i.e., must start with repo name @...//:...) to an executable xz target>",
    # OPTIONAL: List of additional flags to pass to the docker command.
#   docker_flags = [
#     "--tls",
#     "--log-level=info",
#   ],
)