Fusion SyncStore Test CLI
=========================

Installation instructions

    git clone https://github.com/EdgeCaseZA/fusiontest.git
    cd fusiontest
    npm install
    npm link

Usage: `fusiontest [options]`

Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -c, --clientid <clientid>  The client id supplied by Fusion
    -p, --password <password>  The password supplied by Fusion
    -H, --host [host]          The Fusion SyncStore endpoint url [https://za-feedstore.fusionagency.net]
    -v, --version [ver]        The Fusion SyncStore version [1]
    --commit [token]           Optionally commit the commit token and get the next set of changes
