supports_cabinets(hertta voitto voltti)

set(game_name lohikaarmekeno)

add_subdirectory(slotmachine)

set(PACKAGE_CACHEDBY package.json yarn.lock)
set(ASSETS_CACHEDBY package.json assets)
set(SOURCES_CACHEDBY package.json src script libs slotmachine)

# args: game_name release_dir bundle_filter include_checks
build_apila_game(${game_name} "release" "^veikkaus\.slot\." "")

