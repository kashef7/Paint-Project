import React,{useEffect,useRef,useState} from "react";
import '../Styles/main.css';


export default function Main(){
const canvas = useRef(null);
const isDraw = useRef(false);
const prevPos = useRef({ x: 0, y: 0 });
const ctx = useRef(null);
const color = useRef('black');
const [isMobile, setIsMobile] = useState(false);
const [rangeVal, setRangeVal] = useState(3);
useEffect(()=>{
    const currentCanvas = canvas.current;
    ctx.current = currentCanvas.getContext("2d");
    
    currentCanvas.width = 900; 
    currentCanvas.height = 500;

    ctx.current.stroke();
    

},[])



    // Detect mobile screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            resizeCanvas();
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initialize
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Resize canvas based on screen width
    const resizeCanvas = () => {
        const currentCanvas = canvas.current;
        if (!currentCanvas) return;

        if (isMobile) {
            currentCanvas.width = window.innerWidth * 0.95; // 95% of screen width
            currentCanvas.height = window.innerHeight * 0.6; // 60% of screen height
        } else {
            currentCanvas.width = 900;
            currentCanvas.height = 500;
        }
    };

    const newVal = (e) =>{
        setRangeVal(parseInt(e.target.value));
    }

const startDrawing = (e) => {
    isDraw.current = true;
    prevPos.current = getMousePos(canvas.current , e);
}

const draw = (e) =>{ 
    
    if(!isDraw.current) return;


    const currentPos = getMousePos(canvas.current,e);

    ctx.current.beginPath();
    ctx.current.moveTo(prevPos.current.x, prevPos.current.y);
    ctx.current.lineTo(currentPos.x, currentPos.y);
    ctx.current.strokeStyle = color.current;
    ctx.current.lineWidth = rangeVal;
    ctx.current.lineCap = 'round';
    ctx.current.stroke();
    prevPos.current = currentPos;
}

const stopDrawing = (e) => {
    isDraw.current = false;
}

const getMousePos = (ctx, evt) => {
    const rect = ctx.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
};

    return (
        <div id="MainPage">
            <div id="tools">
                <button className="redB" onClick={(e) => {
                color.current = "red";
            }}></button>
            <button className="blueB" onClick={(e) => {
                color.current = "blue";
            }}></button>
            <button className="blackB" onClick={(e) => {
                color.current = "black";
            }}></button>
            <button className="yellowB" onClick={(e) => {
                color.current = "yellow";
            }}></button>
            <button className="greenB" onClick={(e) => {
                color.current = "green";
            }}></button>
            <button className="erase" onClick={(e) => {
                color.current = "white";
            }}></button>
            <button className="clearCanvas" onClick={(e) => {
                ctx.current.fillStyle = "white";
                ctx.current.fillRect(0,0,canvas.current.width,canvas.current.height);
            }}>
                <img src="rubbish-bin-svgrepo-com.svg" width="40" height="40" ></img>
            </button>
            <input type="range" min="1" max="100" value = {rangeVal} class="slider" id="myRange" onChange={newVal}></input>
            </div>
            <canvas className ="canvas" ref={canvas}

            
            onMouseDown={startDrawing} 
            onMouseUp={stopDrawing} 
            onMouseMove={draw} 
            onMouseLeave={stopDrawing}
            >

            </canvas>

        </div>
    )
}