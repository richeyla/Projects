import express, {Request, Response} from "express";

const app = express();
const port = 3000;

type Product = {
    id: number,
    description: string,
    price: number,
    stock: number
}

const inventario: Product[] = [
    {
        id: 1,
        description: "Papa",
        price: 20,
        stock: 1000
    },
    {
        id: 2,
        description: "Pan",
        price: 10,
        stock: 1000
    },
    {
        id: 3,
        description: "Agua",
        price: 20,
        stock: 1000
    }
];
app.get('/api/inventario',(req:Request, res:Response)=>{
    res.json({
        data:inventario,
        statusCode: 200,
        statusValue: 'Ok'

    })
})

app.listen(port,() => console.log(`This server is running at port ${port}`));