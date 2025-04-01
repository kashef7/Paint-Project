import React, { useEffect, useRef, useState } from "react";
import "../Styles/Header.css";
import Menu from "./Menu";

export default function Header(){
    const [menuCheck,setMenuCheck] = useState(false);
    const useMenu = () => {
        setMenuCheck(!menuCheck);
    };

    return(
        <div id = "navBar">
            <div className="BarMenu">
                <button onClick={useMenu}>
                    <img src="menu-svgrepo-com.svg"></img>
                </button> 
            </div>
            <div className="Menu">
                {menuCheck && <Menu></Menu>}
            </div>
            
        </div>
    );
}