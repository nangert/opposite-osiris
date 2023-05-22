import { Button, ButtonProps, Checkbox, CheckboxProps, Text } from "@mantine/core";

type Props = ButtonProps;

const CustomButton = ({ ...props }: Props) => {
    return (
        <div className="flex items-center">
            <Button
                {...props}
                className="bg-mantine-button dark:bg-mantine-button-dark dark:hover:bg-mantine-button-dark-hover text-mantine-button-text hover:bg-mantine-button-hover dark:text-mantine-button-text-dark"
            />
        </div>
    );
};

export default CustomButton;
