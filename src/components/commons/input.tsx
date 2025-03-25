import React from "react";

type InputProps = {
    label: string;
    type?: string;
    name: string;
    register: any;
    error?: string;
};

const CustomInput: React.FC<InputProps> = ({
    label,
    type = "text",
    name,
    register,
    error,
}) => {
    return (
        <div>
            <label className="block font-medium">{label}</label>
            <input
                type={type}
                className="w-full p-2 border rounded"
                {...register(name)}
            />
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default CustomInput;
