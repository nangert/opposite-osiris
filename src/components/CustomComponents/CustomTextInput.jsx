import React from "react";
import { TextInput } from "@mantine/core";

function CustomTextInput({ className, ...props }) {
    return (
        <TextInput
            {...props}
            labelProps={{
                className: "text-mantine-checkbox-label dark:text-mantine-checkbox-label-dark",
            }}
        />
    );
}

export default CustomTextInput;
