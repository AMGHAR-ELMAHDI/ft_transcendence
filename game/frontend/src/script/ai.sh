#!/bin/bash

dir_path="`pwd`/../../frontend/src/script/games"
index=0

echo $dir_path

if test -d "$dir_path"; then
	echo 'dir exists'
else
	mkdir "$dir_path"
fi

cd "$dir_path"

filename="game_$index"

while [ -f "$dir_path/$filename" ]; do
	index=$((index + 1))
	filename="game_$index"
done

touch "$dir_path/$filename"

echo $1 > $filename