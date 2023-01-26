import React, {useEffect, useRef} from "react";
import styled from "styled-components";

const VERTEX_SHADER = `
  attribute vec2 a_position;
  
  uniform vec2 u_resolution;
  
  void main() {
    vec2 zeroToOne = a_position / u_resolution;
    
    vec2 zeroToTwo = zeroToOne * 2.0;
    
    vec2 clipSpace = zeroToTwo - 1.0;
    
    gl_Position = vec4(clipSpace, 0, 1);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  
  void main() {
    gl_FragColor = vec4(1, 0, 0.5, 1);
  }
`;

const Basic2DRender : React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(()=> {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = initWebGL(canvas);
    if (!gl) return;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const vertexShader  = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER) as WebGLShader;
    const fragmentShader  = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER) as WebGLShader;
    const program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram;

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // 유니폼 변수의 위치 찾기
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

    // 포지션 정보를 담은 버퍼 생성
    const positionBuffer = gl.createBuffer();

    // 버퍼를 그래픽 카드 내부의 버퍼와 바인딩
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
      10, 20,
      80, 20,
      10, 30,
      10, 30,
      80, 20,
      80, 30,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // 캔버스 초기화
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 프로그램 사용
    gl.useProgram(program);

    // 버텍스 어트리뷰트 어레이를 사용하도록 허가
    gl.enableVertexAttribArray(positionAttributeLocation);

    // 포지션 버퍼에서 데이터 꺼내는 방법 알려주기
    const size = 2;          // 2개씩 꺼내라
    const type = gl.FLOAT;   // 데이터 타입이 실수다
    const normalize = false; // 데이터 노말라이징 안함
    const stride = 0;        // 보폭 0으로 설정 (다음 포지션 찾는 보폭)
    const offset = 0;        // 탐색할 버퍼의 탐색 시작 위치
    gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
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

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  const createProgram = (gl : WebGLRenderingContext, vertexShader : WebGLShader, fragmentShader : WebGLShader) => {
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const isSuccess = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (isSuccess) return program;

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }


  return (
    <>
      <CanvasWrapper>
        <Canvas ref={canvasRef} width={640} height={480}/>
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

const Canvas = styled.canvas`
  width: 90vw;
  height: 90vh;
  
  border: #1a1a1a 1px solid;
`



export default Basic2DRender;
