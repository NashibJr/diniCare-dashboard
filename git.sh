echo "PUSHING UPDATES TO GITHUB"

OPERATION=$1
MESSAGE=$2
NEW_BRANCH_NAME=$3

if [ "$OPERATION" == "AMEND" ]; then
    git amend
    git p
    echo "-------- PUSHED WITH AMEND --------"

    exit 0
fi

if [ -z "$MESSAGE" ]; then
    echo "-------- COMMIT MESSAGE MISSING --------"

    exit 1
fi

git aa ':(exclude)src/app.module.ts'
git cm "$MESSAGE"

if [ -z "$NEW_BRANCH_NAME" ]; then
    git p
    echo "-------- PUSHED UPDATES WITH MESSAGE: $MESSAGE --------"

    exit 0
else
    git p -u origin "$NEW_BRANCH_NAME"
    echo "-------- PUSHED UPDATES WITH MESSAGE: $MESSAGE --------"

    exit 0
fi