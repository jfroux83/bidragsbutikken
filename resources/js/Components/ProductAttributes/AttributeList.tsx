import {Attribute} from "@/Components/ProductAttributes/types";

interface Props {
    attributes: Attribute[];
}

const AttributeList = ({
    attributes
}: Props) => {

    return (
        <div className="space-y-4">
            {attributes.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-md">
                    <p className="text-gray-500">No attributes added yet.</p>
                </div>
            ) : (
                attributes.map(attribute => (
                    <div key={attribute.id} className="border rounded-md overflow-hidden">
                        <div className="flex items-center justify-between p-4 bg-gray-50">
                            <div className="flex items-center">
                                {/* TODO: button */}

                                <h3 className="font-medium">{attribute.name}</h3>
                                <span className="ml-2 text-sm text-gray-500">
                                    ({attribute.values.length} values)
                                </span>
                            </div>
                            <div>
                                {/* TODO: edit button */}
                                {/* TODO: delete button */}
                            </div>
                        </div>


                    </div>
                ))
            )}
        </div>
    );
};

export default AttributeList;
