#!/bin/env bash

# this script will automatically install the javascript dependences and the python ones for each game, it's just really simple

red="\033[1;31m"
yellow="\033[1;33m"
green="\033[1;32m"
reset="\e[0m"

log() {
	printf "${yellow}[INFO] %s${reset}\n" "$@"
}

success() {
	printf "${green}[SUCCESS] %s${reset}\n\n" "$@"
}

die() {
	printf "\n${red}[FATAL] %s${reset}\n" "$@"
	exit 1
}

# check if we are on arch (used for python)
IS_ARCH_LINUX=false
if [[ -f /etc/arch-release ]] || 
   { [[ -f /etc/os-release ]] && 
     { grep -qP '^ID=(arch|"arch")' /etc/os-release || 
       grep -qP '^ID_LIKE=.*(arch|"arch").*' /etc/os-release; }; }; then
    IS_ARCH_LINUX=true
fi

main() {
	if command -v yarn &>/dev/null; then
		jsPm="yarn add"
	elif command -v npm &>/dev/null; then
		jsPm="npm install"
	else
		die "Neither yarn nor npm is installed. Please install one of them."
	fi

	scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
	for gameDir in "${scriptDir}"/*/; do
		# skip hidden directories
		[[ "$(basename "$gameDir")" = .* || "$(basename "$gameDir")" = _* ]] && continue

		cd $gameDir
		game="$(basename "$gameDir")"
		if [[ -f requirements.txt ]]; then
			if $IS_ARCH_LINUX; then
				python3 -m venv $gameDir/venv
				"$gameDir"/venv/bin/pip install -r requirements.txt
			else
				log "Installing python dependencies for ${game}..."
				pip install -r requirements.txt
			fi

			if [ $? -eq 0 ]; then
				success "${game} python dependencies installed correctly"
			else
				die "${game} python dependencies failed to install, please refer the problem log above"
			fi
		fi
		if [[ -f package.json ]]; then
			log "Installing javascript dependencies for ${game}..."
			$jsPm

			if [ $? -eq 0 ]; then
				success "${game} javascript dependencies installed correctly"
			else
				die "${game} javascript dependencies failed to install, please refer the problem log above"
			fi
		fi
	done
	success "Dependencies installed succesfully, have fun :)"
}

main "$@"
