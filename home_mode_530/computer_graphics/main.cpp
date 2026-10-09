// now we gonna draw the just one window 
#include <GL/glew.h> // this help us to load the values 
#include <iostream>
#include <GLFW/glfw3.h>
#include <cmath>
#define numVAOs 3 //new 

using namespace std;

// today we gonna learn shaders 
// new declaration 

GLuint renderingProgram;
GLuint vao[numVAOs];

// shader function 
GLuint createShaderProgram (void) {

    const char *vShaderSource=
        "#version 430\n"
        "void main (void) {\n"
        "gl_Position=vec4(0.0,0.0,0.0,1.0); \n"
        "}";
    const char * fShaderSource=
        "#version 430 \n"
        "out vec4 color; \n"
        "void main(void) {\n"
        "color=vec4 (0.0,0.0,1.0,1.0);}";

    // then first create or initlize the program 
    GLuint vShader=glCreateShader (GL_VERTEX_SHADER);
    GLuint fShader=glCreateShader (GL_FRAGMENT_SHADER);

    // Then we get the shader sources 
    glShaderSource (vShader,1,&vShaderSource,NULL);
    glShaderSource (fShader,1,&fShaderSource,NULL);

    // then we compile them 
    glCompileShader (vShader);
    glCompileShader (fShader);

    // we create the program to attach them to it 
    GLuint vfProgram=glCreateProgram ();

    // and then we attach the shader to that program and we will return that program 
    glAttachShader (vfProgram,vShader);
    glAttachShader (vfProgram,fShader);

    // then links them 
    glLinkProgram (vfProgram);
    return vfProgram;


} 







// now we gonna need two function right way 
void init (GLFWwindow *window ) {

     renderingProgram=createShaderProgram();
    glGenVertexArrays (numVAOs,vao);
    glBindVertexArray (vao[0]);



};

// the next one just for dusplaying the window 
void display (GLFWwindow*window,double currentTime) {
    glUseProgram(renderingProgram);
    float pointSize=std::abs(std::log (currentTime)*1000);
    glPointSize (pointSize);

    glDrawArrays(GL_POINTS,0,1);
        

}


// now we came in main function 

int main  () {

    glfwWindowHint (GLFW_VERSION_MAJOR,4);
    glfwWindowHint (GLFW_VERSION_MINOR,3);
    glfwWindowHint (GLFW_OPENGL_PROFILE,GLFW_OPENGL_CORE_PROFILE);

    // THEN INITILATE THAT 
    if (!glfwInit()){

        exit (EXIT_FAILURE);


    }
    // now its time to create the window 
    GLFWwindow *window=glfwCreateWindow(1200,800,"home_mode",NULL,NULL);
    if(!window) {

        exit (EXIT_FAILURE);
        

    }


   // make this context current 
   glfwMakeContextCurrent (window);
  

   // and then we initliate the glew 
  if (glewInit()!=  GLEW_OK){


      exit(EXIT_FAILURE);


  } 
  // first i have to make shure the window will refresh with related to 
  // the screen
   init (window);
  glfwSwapInterval (1);

  // NOW WE CAN RUN IT AND SEE IF IT WORKS 
  while (!glfwWindowShouldClose (window)) {


      display(window,glfwGetTime ());
      glfwSwapBuffers (window);
      glfwPollEvents ();


      // now it time to see the magic on the screen;
      //





  }
glfwDestroyWindow  (window);
glfwTerminate ();


}
