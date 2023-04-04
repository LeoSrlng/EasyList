import {Fragment} from "react"
const DataList = ({list, value, onChange, name, placeholder}) => {
    
    return(
        <Fragment>
            {list &&
            <Fragment>
                <input list={`datalist-${name}`} onChange={onChange} value={value} placeholder={placeholder} className={`input-${placeholder}`} />
        
                <datalist id={`datalist-${name}`}>
                    {list.map((e,i) => {
                        return <option key={i} value={e.nom}>{e.nom}</option>
                    })}
                </datalist>
            </Fragment>
            }
        </Fragment>
    )
}

export default DataList