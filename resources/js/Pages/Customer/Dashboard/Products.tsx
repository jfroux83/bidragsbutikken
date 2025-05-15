import {Product} from "@/Pages/Customer/types";
import Card from "@/Components/Card/Card";
import CardHeader from "@/Components/Card/CardHeader";
import CardTitle from "@/Components/Card/CardTitle";

interface Props {
    products: Product[];
}

const Products = ({ products }: Props) => {

    return (
        <div>
            {products.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>{product.name}</CardTitle>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
};

export default Products;
