
#!/bin/sh
docker run --rm -v$(pwd):/cogment -v/var/run/docker.sock:/var/run/docker.sock cogment/cli:1.0.0-alpha1 "$@"
