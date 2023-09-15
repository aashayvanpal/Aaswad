import { getAllIngredients } from '../../../apis/ingredients'

export const getIngredients = async () => {
    const ingredients = await getAllIngredients()
    console.log("Ingredients fetched", ingredients.data)
    return ingredients.data
}
