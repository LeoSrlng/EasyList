import React, {useContext, useEffect} from "react";

function Accessibilite() {

    const [theme, setTheme] = React.useState(localStorage.getItem("theme") || 'normalTheme');
    const [font, setFont] = React.useState(localStorage.getItem("font"));
    const [checkbox, setCheckbox] = React.useState(localStorage.getItem("checkTheme") || 'normalTheme');
    
    const toggleTheme = () => {
        
        if (theme === 'normalTheme') {
            setTheme('darkTheme');
            setCheckbox('darkTheme')
        } else if (theme === 'darkTheme') {
            setTheme('normalTheme');
            setCheckbox('normalTheme')
        }
    };
    
    const toggleFont = (e, value) => {
        e.preventDefault();
        
        setFont(value)
        localStorage.setItem('font', value)
    };
    
    useEffect(() => {
        
        localStorage.setItem('theme', theme)
        
        localStorage.setItem('checkTheme', checkbox)
        
        if (theme === 'darkTheme') {
            document.getElementById('checkTheme').checked = true
        }
        
        document.body.className = `${theme} ${font}`;
        
    }, [theme, font]);
    
    return (
        <div className='accessibilite-Wrapp'>
            <p className='label-accessibilite'>DarkMode:</p>
            <div className="wrapper">
                <label className="switch">
                    <input type="checkbox" id='checkTheme' onClick={toggleTheme}/>
                    <span className="slider"></span>
                    <span className="dark"> </span>
                </label>
            </div>
            <p className='label-accessibilite'>Police:</p>
            <div>
                <button aria-label="btn-verdana" className="btn_font-access" onClick={(e) => toggleFont(e, 'verdana')}>Verdana</button>
                <button aria-label="btn-roboto" className="btn_font-access" onClick={(e) => toggleFont(e, 'Roboto')}>Roboto</button>
                <button aria-label="btn-montserrat" className="btn_font-access" onClick={(e) => toggleFont(e, 'Montserrat')}>Montserrat</button>
            </div>
        </div>
    )
}

export default Accessibilite