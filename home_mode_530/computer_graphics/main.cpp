// now we gonna draw the just one window 
#include <GL/glew.h> // this help us to load the values 
#include <iostream>
#include <GLFW/glfw3.h>
#include <cmath>


using namespace std;


// now we gonna need two function right way 
void init (GLFWwindow *window ) {};

// the next one just for dusplaying the window 
void display (GLFWwindow*window,double currentTime) {

    // we gonna change how the color gonna change 
    float greenChannel= std::sin (currentTime)*0.5+0.5;
    // now we gonna change the red channel 
    float redChannel= std::tan (currentTime)*0.5+0.5;

    float blueChannel= std::cos (currentTime)*0.5+0.5;
    // now sam gonna change the background 
    float background=std::tan(currentTime)*0.5+0.5;




    glClearColor (redChannel,greenChannel,blueChannel,background);
    glClear (GL_COLOR_BUFFER_BIT);
    

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
init (window);

   // make this context current 
   glfwMakeContextCurrent (window);

   // and then we initliate the glew 
  if (glewInit()!=  GLEW_OK){


      exit(EXIT_FAILURE);


  } 
  // first i have to make shure the window will refresh with related to 
  // the screen 
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
