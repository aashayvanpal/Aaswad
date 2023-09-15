import { v4 as uuidv4 } from 'uuid';

const generateObjectID = () => {
    // this function generates ObjectId similar to mongodb ObjectId
    const uuid = uuidv4();
    const objectId = uuid.split('-').join('').slice(0, 24)
    return objectId
}
export default generateObjectID