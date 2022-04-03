load("@bazel_gazelle//:deps.bzl", "go_repository")

def go_deps():
    go_repository(
        name = "com_github_lib_pq",
        build_file_proto_mode = "disable_global",
        importpath = "github.com/lib/pq",
        sum = "h1:SO9z7FRPzA03QhHKJrH5BXA6HU1rS4V2nIVrrNC1iYk=",
        version = "v1.10.4",
    )
    go_repository(
        name = "com_github_matryer_way",
        importpath = "github.com/matryer/way",
        sum = "h1:KWiqy3hl8yCUPAq1frD0DKXKyn7d9h2nVhj2r5ISq2o=",
        version = "v0.0.0-20180416093233-9632d0c407b0",
    )
