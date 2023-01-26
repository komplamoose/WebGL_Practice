import React, {useEffect, useRef} from "react";
import styled from "styled-components";

const VERTEX_SHADER = `
  attribute vec4 a_position;
  
  void main() {
    gl_position = a_position;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  
  void main() {
    gl_FragColor = vec4(1, 0, 0.5, 1);
  }
`;

const App : React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);



  useEffect(()=> {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = initWebGL(canvas);
    if (!gl) return;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }, [canvasRef])

  const initWebGL = (canvas : HTMLCanvasElement)  => {
    const gl = canvas.getContext("webgl");
    if (!gl) alert("WebGL을 지원하지 않는 브라우저입니다.");
    return gl;
  }

  const createShader = (gl : WebGLRenderingContext, type : number, source : string) => {
    const shader = gl.createShader(type);
    if (!shader) return;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const isSuccess = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (isSuccess) return shader;

    gl.deleteShader(shader);
  }


  return (
    <>
      <CanvasWrapper>
        <canvas ref={canvasRef} width={640} height={480}/>
      </CanvasWrapper>
    </>
  );
}

const CanvasWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`





export default App
