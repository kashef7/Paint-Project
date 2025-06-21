import React, { useEffect, useRef, useState } from "react";
import '../Styles/main.css';

export default function Main() {
    const canvas = useRef(null);
    const isDraw = useRef(false);
    const prevPos = useRef({ x: 0, y: 0 });
    const ctx = useRef(null);
    const color = useRef('black');
    const index = useRef(0);
    const [isMobile, setIsMobile] = useState(false);
    const [rangeVal, setRangeVal] = useState(3);
    const [canvasHistory,setCanvasHistory] = useState([]); 

    useEffect(() => {
        const currentCanvas = canvas.current;
        ctx.current = currentCanvas.getContext("2d");
        currentCanvas.width = 900;
        currentCanvas.height = 500;
        ctx.current.stroke();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            resizeCanvas();
        };

        window.addEventListener("resize", handleResize);
        handleResize(); 
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const resizeCanvas = () => {
        const currentCanvas = canvas.current;
        if (!currentCanvas) return;

        if (isMobile) {
            currentCanvas.width = window.innerWidth * 0.95;
            currentCanvas.height = window.innerHeight * 0.6;
        } else {
            currentCanvas.width = 900;
            currentCanvas.height = 500;
        }
    };

    const newVal = (e) => {
        setRangeVal(parseInt(e.target.value));
    };

    const startDrawing = (e) => {
        isDraw.current = true;
        prevPos.current = getMousePos(canvas.current, e);
        const currentPos = getMousePos(canvas.current, e);
        ctx.current.beginPath();
        ctx.current.fillStyle = color.current;
        ctx.current.arc(currentPos.x, currentPos.y, rangeVal / 2, 0, Math.PI * 2);
        ctx.current.fill();
    };

    const draw = (e) => {
        if (!isDraw.current) return;
        const currentPos = getMousePos(canvas.current, e);
        ctx.current.beginPath();
        ctx.current.moveTo(prevPos.current.x, prevPos.current.y);
        ctx.current.lineTo(currentPos.x, currentPos.y);
        ctx.current.strokeStyle = color.current;
        ctx.current.lineWidth = rangeVal;
        ctx.current.lineCap = 'round';
        ctx.current.stroke();
        prevPos.current = currentPos;
    };

    const stopDrawing = () => {
        isDraw.current = false;
        setCanvasHistory(prevHistory => {
            const newHistory = prevHistory.slice(0, index.current + 1); // Keep only history up to current index
            const newImageData = ctx.current.getImageData(0, 0, canvas.current.width, canvas.current.height);
            return [...newHistory, newImageData];
        });
        index.current++;
    };

    const undo = () => {
        if (index.current > 0) {
            index.current--;
            ctx.current.putImageData(canvasHistory[index.current], 0, 0);
        }
    };

    const selectColor = () =>{
        color.current = document.getElementById("ColorInput").value;
        document.querySelector(".multiColor").style.backgroundColor = color.current;
    }

    const getMousePos = (ctx, evt) => {
        const rect = ctx.getBoundingClientRect();
        const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
        const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    return (
        <div id="MainPage">
            <div id="tools">
                <button className="redB" onClick={() => (color.current = "red")}></button>
                <button className="blueB" onClick={() => (color.current = "blue")}></button>
                <button className="blackB" onClick={() => (color.current = "black")}></button>
                <button className="yellowB" onClick={() => (color.current = "yellow")}></button>
                <button className="greenB" onClick={() => (color.current = "green")}></button>
                <button className="erase" onClick={() => (color.current = "white")}></button>
                <input id="ColorInput" type="color"></input>
                <button className="multiColor" onClick={selectColor}></button>
                <button className="clearCanvas" onClick={() => {
                    ctx.current.fillStyle = "white";
                    ctx.current.fillRect(0, 0, canvas.current.width, canvas.current.height);
                }}>
                    <img src="rubbish-bin-svgrepo-com.svg" width="40" height="40" alt="Clear" />
                </button>
                <input type="range" min="1" max="100" value={rangeVal} className="slider" id="myRange" onChange={newVal} />
                <button className="Undo" onClick={undo} ></button>
            </div>
            <canvas className="canvas" ref={canvas}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
        </div>
    );
}
