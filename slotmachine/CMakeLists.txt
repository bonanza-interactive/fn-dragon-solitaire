supports_cabinets(hertta voitto voltti)

res_module_dir(common "res/games/${game_name}")
res_module_dir("${PSI_CABINET_MODEL}" "res/games/${game_name}")
if("${PSI_TARGET_TYPE}" STREQUAL emulator)
  res_module_dir("${PSI_CABINET_MODEL}/${PSI_TARGET_TYPE}" "res/games/${game_name}")
endif()

install(FILES GameParameters.json DESTINATION "/psi/res/games/${game_name}/")