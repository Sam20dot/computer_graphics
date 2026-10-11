//now we gonna start from to build the point on the screen 
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <cmath>
#include "./error_detection/includes/error.h"

using namespace std;

// we gonna create three function which will be used for diaplay and also for 
// intilizing the main things 

// adding shaders 
#define numVAOs 1
GLuint vao[numVAOs];
GLuint renderingProgram;



// shader function s

GLuint createShaderProgram () {
    GLint vertCompiled;
    GLint fraCompiled;
    GLint linked;


    const char * vShaderSource= 
        "#version 430\n"
        "void main () \n"
        "{gl_Position=vec4(0.5,0.5,0.0,1.0);};\n";
    const char * fShaderSource=
        "#version 430 \n"
        "out vec4 color;\n"
        "void main () \n"
        "{if(gl_FragCoord.x <295) color=vec4(0.5,0.5,0.5,1.0);\n"
        "else color=vec4(1.0,0.4,0.5,1.0);};";

    // creating or inilizing an empty variables for the shaders programms 
    GLuint vShader= glCreateShader(GL_VERTEX_SHADER);
    GLuint fShader=glCreateShader (GL_FRAGMENT_SHADER);

    // and then we gonna create 
    glShaderSource (vShader,1,&vShaderSource,NULL);
    glShaderSource (fShader,1,&fShaderSource,NULL);

    // and then we compiles them 
    glCompileShader (vShader);
    checkOpenGLError ();
    glGetShaderiv(vShader,GL_COMPILE_STATUS,&vertCompiled);
    
    if (vertCompiled!=1) {
        std::cout << "vertex compilation failed "<<std::endl;
        printShaderLog (vShader);


    }
    glCompileShader (fShader);
    checkOpenGLError ();
    glGetShaderiv (fShader,GL_COMPILE_STATUS,&fraCompiled);
    if (fraCompiled!=1) {

        std::cout <<"fragment compilation failed:"<<std::endl;
        printShaderLog (fShader);

    }


    // and then now we create the program 
    GLuint vfProgram= glCreateProgram ();

    // and then we attach the codes to the program 
    glAttachShader (vfProgram,vShader);
    glAttachShader (vfProgram,fShader);

    // link them 
    glLinkProgram (vfProgram);
    checkOpenGLError ();
    glGetProgramiv (vfProgram,GL_LINK_STATUS,&linked);
    if (linked!=1) {

        std::cout << "linking failed :"<<std::endl;
        printProgramLog (vfProgram);

    }

    return vfProgram;
    
}


void init (void) {


    // and now in this function we will intilize the shader 
    renderingProgram=createShaderProgram();
    glGenVertexArrays(numVAOs,vao);

    // we bind them 
    glBindVertexArray (vao[0]);


};
void display (GLFWwindow *window , float currentTime) {

   
 
    float backr=std::abs(std::sin(currentTime));
    float backg= std::abs(std::cos(currentTime));
    float backb=std::tan(currentTime);
    float point_size=std::abs(std::sin(currentTime)*100);



    glClearColor (backg,backg,backb,1.0);
    glClear (GL_COLOR_BUFFER_BIT);
      glPointSize (point_size);

      // changing the background 


    glUseProgram(renderingProgram);
    glDrawArrays (GL_POINTS,0,1);
    


}
// and no we gonna start the main function 

int main (void ) {

    if (!glfwInit ()) {

        exit (EXIT_FAILURE);
        

    }
    // set the specification or minimum for openGL 
    glfwWindowHint (GLFW_CONTEXT_VERSION_MAJOR,4);
    glfwWindowHint (GLFW_CONTEXT_VERSION_MINOR,3);
    glfwWindowHint (GLFW_OPENGL_PROFILE,GLFW_OPENGL_CORE_PROFILE);

    //window craetion 

    GLFWwindow *window = glfwCreateWindow (800,800,"SAM_WINDOW",NULL,NULL);
    if (!window ) {
      exit (EXIT_FAILURE);
    }
     glfwMakeContextCurrent(window );

    
    // then intilize the glew 
    if (glewInit ()==GLEW_OK) {

    }
    // and make the window context current 
   
    // for vertical synchronization 
    glfwSwapInterval (1);
    init ( );


    while (!glfwWindowShouldClose(window)) {
        display (window,glfwGetTime());
        glfwPollEvents ();

        // then swap the buffer for changing the interface 
        glfwSwapBuffers (window);



    }


glfwDestroyWindow (window);
glfwTerminate ();


}


