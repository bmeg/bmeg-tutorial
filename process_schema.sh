confirm() {
    # call with a prompt string or use a default
    read -r -p "${1:-Are you sure? [y/N]} " response
    case "$response" in
        [yY][eE][sS]|[yY])
            true
            ;;
        *)
            false
            ;;
    esac
}
if [ -f "${1}" ]; then
    echo "${1} is a file";
else
    echo "${1} is not valid. Please provide full path to bmeg schema json file";
    exit 1
fi
confirm "Move $1 to ./static/meta/schema.json?" && jq . $1 | grep -v ENST | grep -v ENSG | jq . > ./static/meta/schema.json
