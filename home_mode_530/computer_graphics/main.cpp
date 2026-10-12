#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <cmath>
#include <iostream>

using namespace std;

#define numVAOs 1
GLuint vao[numVAOs];
GLuint renderingProgram;

GLuint createShaderProgram () {
    GLint vertCompiled;
    GLint fraCompiled;
    GLint linked;

    // --- Vertex Shader ---
    // Passes screen coordinates ranging from -1.0 to 1.0 across the window
    const char* vertShaderSrc = 
        "#version 430 core\n"
        "out vec2 uv;\n"
        "void main(void) {\n"
        "    // Define a full-screen triangle using vertex IDs\n"
        "    float x = -1.0 + float((gl_VertexID & 1) << 2);\n"
        "    float y = -1.0 + float((gl_VertexID & 2) << 1);\n"
        "    uv = vec2(x, y);\n"
        "    gl_Position = vec4(x, y, 0.0, 1.0);\n"
        "}\n";

    // --- Fragment Shader (Oblique Frequency -> Diagonal Stripes) ---
    // Replicates MATLAB: Ac(U == 1 & V == 1) = 1000000 and its symmetric pair
    const char* fragShaderSrc = 
        "#version 430 core\n"
        "in vec2 uv;\n"
        "out vec4 color;\n"
        "void main(void) {\n"
        "    float pi = 3.14159265359;\n"
        "    \n"
        "    // Adding uv.x and uv.y shifts the wave direction to a 45-degree oblique angle\n"
        "    float wave = sin(2.0 * pi * (uv.x + uv.y) * 2.0);\n"
        "    \n"
        "    // Normalize the wave result from [-1, 1] to [0.0, 1.0] for grayscale display\n"
        "    float gray = (wave + 1.0) * 0.5;\n"
        "    \n"
        "    color = vec4(vec3(gray), 1.0);\n"
        "}\n";

    GLuint vShader = glCreateShader(GL_VERTEX_SHADER);
    GLuint fShader = glCreateShader(GL_FRAGMENT_SHADER);

    glShaderSource(vShader, 1, &vertShaderSrc, NULL);
    glShaderSource(fShader, 1, &fragShaderSrc, NULL);

    glCompileShader(vShader);
    glGetShaderiv(vShader, GL_COMPILE_STATUS, &vertCompiled);
    if (vertCompiled != 1) { std::cout << "Vertex shader compilation failed" << std::endl; }

    glCompileShader(fShader);
    glGetShaderiv(fShader, GL_COMPILE_STATUS, &fraCompiled);
    if (fraCompiled != 1) { std::cout << "Fragment shader compilation failed" << std::endl; }

    GLuint vfProgram = glCreateProgram();
    glAttachShader(vfProgram, vShader);
    glAttachShader(vfProgram, fShader);

    glLinkProgram(vfProgram);
    glDeleteShader(vShader);
    glDeleteShader(fShader);

    return vfProgram;
}

void init(void) {
    renderingProgram = createShaderProgram();
    glGenVertexArrays(numVAOs, vao);
    glBindVertexArray(vao[0]);
}

void display(GLFWwindow *window, float currentTime) {
    glClear(GL_COLOR_BUFFER_BIT);
    glUseProgram(renderingProgram);
    
    // Draw 3 vertices to cover the entire viewport screen background
    glDrawArrays(GL_TRIANGLES, 0, 3);
}

int main(void) {
    if (!glfwInit()) { exit(EXIT_FAILURE); }
    
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    // Create a square window matching your intended signal matrix aspect ratio
    GLFWwindow *window = glfwCreateWindow(1700,1200, "MATLAB IFFT2 Equivalent - Oblique", NULL, NULL);
    if (!window) {
        glfwTerminate();
        exit(EXIT_FAILURE);
    }
    glfwMakeContextCurrent(window);

    if (glewInit() != GLEW_OK) {
        glfwTerminate();
        exit(EXIT_FAILURE);
    }
   
    glfwSwapInterval(1);
    init();

    while (!glfwWindowShouldClose(window)) {
        display(window, glfwGetTime());
        glfwPollEvents();
        glfwSwapBuffers(window);
    }

    glfwDestroyWindow(window);
    glfwTerminate();
    return 0;
}

