import { useEffect, useState } from "react"
import ShowBtn from "../../assets/ShowBtn"
import NavigationBar from "../NavigationBar"
import { createIngredient, deleteIngredient, getAllIngredients } from "../../apis/ingredients"
const Ingredients = () => {
    const [ingredient, setIngredient] = useState('')
    const [ingredients, setIngredients] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (ingredient) {
            const ingredientObject = { name: ingredient }

            try {
                // post request 
                console.log("Entered Ingredient :", ingredientObject)
                const ingredientCreated = await createIngredient(ingredientObject)
                setIngredients([...ingredients, ingredientObject])
                setIngredient('')

            }
            catch (err) { alert("Error in creating ingredient!" + err) }

        } else { alert("Ingredient cannot be left blank!") }
    }

    const handleRemoveIngredient = async (e, ingredient, index) => {
        e.preventDefault()

        console.log("ingredient to delete:", ingredient, index)
        // delete request

        try {
            const tempIngredients = ingredients
            ingredients.splice(index, 1)
            setIngredients([...tempIngredients])
            const deletedIngredient = await deleteIngredient(ingredient._id)
            console.log("deletedIngredient", deletedIngredient)

        } catch (err) { alert("There was an error in deleting ingredient:" + err) }

    }


    const getIngredients = async () => {
        const ingredients = await getAllIngredients()
        console.log("useEffect got all ingredients:", ingredients)
        setIngredients(ingredients.data)
    }
    useEffect(() => {
        getIngredients()
    }, [])

    return <div style={{}}>
        <ShowBtn />
        <div style={{ display: 'flex', gap: '20px' }}>
            <NavigationBar />
            <div>
                U for Ingredients
                <br />
                Make another recorder ---- ingredients recorder==== this will contain previous records for number of ingredients required for a set number for people
                example : 500 people --- buy rice -60kg , coconut = 60 ,etc
                <br />

                Listing ingredients :{ingredients.length}
                <br />
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input placeholder="add Ingredient Name" value={ingredient} onChange={(e) => setIngredient(e.target.value)} />
                    <button>Add</button>
                </form>
                <div>
                    {ingredients.map((ingredient, index) => <div key={index}>{index + 1}. {ingredient.name} <button onClick={(e) => handleRemoveIngredient(e, ingredient, index)}>Remove</button></div>)}
                </div>
            </div>
        </div>
    </div>
}

export default Ingredients