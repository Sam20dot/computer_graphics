#include "../includes/error.h"

void printShaderLog (GLuint Shader) {
    int len=0;
    int chWrttn=0;
    char *log ;

    glGetShaderiv (Shader,GL_INFO_LOG_LENGTH,&len);
    if (len>0) {

        log= (char *)malloc (len);
        glGetShaderInfoLog (Shader,len,&chWrttn,log);
        std::cout <<"Shader Info Log:"<<log;
        
        free (log);


    }



}

void printProgramLog(int prog) {
 
    int len=0;
    int chWrttn=0;
    char * log;

    glGetProgramiv (prog,GL_INFO_LOG_LENGTH,&len);
    if (len>0) {

        log= (char*)malloc (len);

        glGetProgramInfoLog (prog,len,&chWrttn,log);
        std::cout <<"Program Info Log :"<<log;
        
    }

    free (log);



}

bool checkOpenGLError(){
    bool foundError=false;
    int glErr=glGetError();
    while (glErr!=GL_NO_ERROR){

        std::cout << "gl Error :"<<glErr<<std::endl;
        foundError=true;
        glErr=glGetError();



    }
    return foundError;
  

}
