#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <iostream>

using namespace std;

void init(GLFWwindow *window){};

void display (GLFWwindow *window, double currentTime) {

    glClearColor (1.0,0.0,0.0,1.0);
    glClear (GL_COLOR_BUFFER_BIT);


}


int main () {
    if (!glfwInit()){

        exit (EXIT_FAILURE);


    }
    glfwWindowHint (GLFW_CONTEXT_VERSION_MAJOR,4);
    glfwWindowHint (GLFW_CONTEXT_VERSION_MINOR,3);
    glfwWindowHint (GLFW_OPENGL_PROFILE,GLFW_OPENGL_CORE_PROFILE);


    // AND THEN WE CREATE A WINDOW 
    GLFWwindow *window =glfwCreateWindow (600,600,"chapter2-program1",NULL,NULL);
    if (!window) {

        exit (EXIT_FAILURE);


    }

    // and now we make that context so that opengl can get it or sokol 
    glfwMakeContextCurrent(window);
    if (glewInit()!=GLEW_OK) {

        exit (EXIT_FAILURE);
        
    }
    glfwSwapInterval(1); // so this help us to sychronize the screen with the window refresh :wq


    while (!glfwWindowShouldClose (window)) {
        display (window,glfwGetTime());


        glfwSwapBuffers (window);
        glfwPollEvents();



    }

}

