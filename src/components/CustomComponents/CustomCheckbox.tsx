import { Checkbox, CheckboxProps, Text } from "@mantine/core";

type Props = CheckboxProps;

const CustomCheckbox = ({ label, ...props }: Props) => {
    return (
        <div className="flex items-center">
            <Checkbox {...props} className="text-mantine-text-input-label dark:text-mantine-text-input-label-dark" />
            <div className="ml-2">
                <Text {...props} className="text-mantine-text-input-label dark:text-mantine-text-input-label-dark">
                    {label}
                </Text>
            </div>
        </div>
    );
};

export default CustomCheckbox;
