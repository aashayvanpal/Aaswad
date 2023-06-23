import { useState } from "react"

const Language = ({ languages, setLanguages }) => {
    const [newLanguage, setNewLanguage] = useState('')
    const addLanguage = (e) => {
        e.preventDefault()
        if (newLanguage === '') {
            alert('cannot leave language blank!')
        } else {

            setLanguages([...languages, newLanguage])
            setNewLanguage('')
        }
    }

    const removeLanguage = (index) => {
        if (languages.length > 1) {
            console.log("clicked on index:", index)
            languages.splice(index, 1)
            setLanguages([...languages])
        } else {
            alert('you must have atleast 1 known language!')
        }
    }


    return <div style={{ display: 'block' }}>
        <input id="language" placeholder="Language" value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} />
        <button onClick={(e) => addLanguage(e)}>Add Language</button><br />
        {languages.map((language, index) => <div key={index}>
            {language}
            <button onClick={(e) => {
                e.preventDefault()
                removeLanguage(index)
            }}>Remove Language</button><br />

            <br /></div>)}
    </div>
}

export default Language