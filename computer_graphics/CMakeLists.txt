cmake_minimum_required(VERSION 3.10)
project(OpenGLBookWorkspace)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# CRITICAL: This generates the autocomplete bridge file for Neovim
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# 1. Look for system-installed core libraries
find_package(OpenGL REQUIRED)
find_package(glfw3 REQUIRED)
find_package(GLEW REQUIRED)

# 2. Add your execution target binary name
add_executable(GLApp main.cpp)

# 3. Explicitly map your local nested headers so '#include' statements work
target_include_directories(GLApp PRIVATE 
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdParty/glm        # Maps to <glm/glm.hpp>
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdParty/SOIL2/src  # Maps to <SOIL2/SOIL2.h>
)

# 4. Map the path where your freshly compiled .a static library files are
target_link_directories(GLApp PRIVATE 
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdParty/SOIL2/lib/linux
)

# 5. Link everything to the executable target
target_link_libraries(GLApp PRIVATE 
    GLEW::GLEW
    glfw
    OpenGL::GL
    soil2              # Links libsoil2.a / libsoil2-static-lib.a
)

