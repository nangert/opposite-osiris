import React from "react";
import { Checkbox, Text } from "@mantine/core";

function CustomCheckbox({ className, label, ...props }) {
    return (
        <div className="flex items-center">
            {" "}
            {/* Add a wrapper div with 'flex' class */}
            <Checkbox
                {...props}
                labelProps={{
                    className: "text-mantine-text-input-label dark:text-mantine-text-input-label-dark",
                }}
            />
            <div className="ml-2">
                <Text
                    {...props}
                    labelProps={{
                        className: "text-mantine-text-input-label dark:text-mantine-text-input-label-dark",
                    }}
                >
                    {label}
                </Text>
            </div>
        </div>
    );
}

export default CustomCheckbox;
